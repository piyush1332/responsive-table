import React, { createRef, useEffect, useRef, useState } from 'react';
import './TableFilter.css';
import ReactDragListView from "react-drag-listview";

function TableFilter({ tableData , setFilterData , setTableData , filterData , settingPanelStatus }) {
    
    const tableHead = useRef([]);
    const [ activeHeader , setActiveHeader ] = useState([]);

    useEffect(()=>{
        tableHead.current = tableData.header.map(( value , i) => tableHead.current[i] !== null && createRef());
        setActiveHeader(tableData.header);
    },[tableData]);

    const enableDisableColumn = (filter_index) => {
        const temp = [];
        if(activeHeader.includes(tableData.header[filter_index])) {
            activeHeader.map((value) => {
                value !== tableData.header[filter_index] && temp.push(value);
            });
        } else {
            tableData.header.map((value , index) => {
                activeHeader.includes(value) && temp.push(value);
                filter_index === index && temp.push(value);
            });
        }
        console.log(temp);
        prepareFilterTableData(temp);
        setActiveHeader(temp);
    }

    const arrangeDataForwardOperation = (row , from , to) => {
        let from_hold = row[from];
        let temp_arr = [];
        for(let i = 0; i < row.length; i++) {
            if(i === to) {
                temp_arr.push(row[i]);
                temp_arr.push(from_hold);
            } else {
                if(i !== from) {
                    temp_arr.push(row[i]);
                }
            }
        }
        return temp_arr;
    }

    const arrangeDataBackwardOperation = (row , from , to) => {
        let from_hold = row[from];
        let temp_arr = [];
        let reverse = [];
        for(let i = row.length-1; i >= 0; i--) {
            if(i === to) {
                temp_arr.push(row[i]);
                temp_arr.push(from_hold);
            } else {
                if(i !== from) {
                    temp_arr.push(row[i]);
                }
            }
        }
        for(let i = temp_arr.length-1; i >= 0; i--) {
            reverse.push(temp_arr[i]);
        }
        return reverse;
    }

    const rearrangeTableData = (from , to) => {
        const temp_parent = [];
        tableData.data.map((row , index) => {
            let temp_arr = [];
            if(from < to) {
                temp_arr = arrangeDataForwardOperation(row , from , to);
            } else {
                temp_arr = arrangeDataBackwardOperation(row , from , to);
            }
            temp_parent.push(temp_arr);
        });
        return temp_parent;
    }

    const prepareFilterTableData = (active) => {
        if(active.length !== tableData.header.length) {
            const activeIndexArray = [];
            tableData.header.map((value , header_index) => {
                if(active.includes(value)) activeIndexArray.push(header_index);
            });
            const temp = [];
            tableData.data.map((value , row_index) => {
                const child_temp = [];
                tableData.data[row_index].map(( col_value , col_index ) => {
                    if(activeIndexArray.includes(col_index)) child_temp.push(col_value);
                });
                temp.push(child_temp);
            });
            setFilterData({ header: active, data: temp });
        } else {
            setFilterData({ header: [], data: [] });
        }
    }

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            let tempHeader = [];
            tempHeader = [...tableData.header]; 
            const item = tempHeader.splice(fromIndex, 1)[0];
            tempHeader.splice(toIndex, 0, item);
            let table_data = rearrangeTableData(fromIndex , toIndex)
            setTableData({  header: tempHeader, data: table_data , keys: tableData.keys });
        },
        nodeSelector: "li"
    };

    return (
        <>
            <div className="table-filter-parent" style={{ display: settingPanelStatus }}>
                <ReactDragListView.DragColumn {...dragProps}>
                    <ol>
                    {tableData.header.map((value , index) => {
                        return (
                            <li ref={tableHead.current[index]} className="filter-header-batch" filter-index={index} key={"filter-batch-"+value} onClick={ () => enableDisableColumn(index) } style={{ opacity: activeHeader.includes(value) ? 1 : 0.1 }}> 
                                {value} 
                            </li>
                        )
                    })}
                    </ol>
                </ReactDragListView.DragColumn>
            </div>
        </>
    )
}

export default TableFilter;