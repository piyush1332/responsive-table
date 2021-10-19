import React, { createRef, useEffect, useRef, useState } from 'react';
import './CustomTable.css';

function CustomTable({ tableData , filterData }) {
    const tableHead = useRef([]);
    const [ tableHeadWidth , setTableHeadWidth ] = useState([]);
    const [ currentLocation , setCurrentLocation ] = useState(0);
    const [ currentElementIndex , setCurrentElementIndex ] = useState(-1);

    useEffect(() => {
        tableHead.current = tableData.header.map(( value , i) => tableHead.current[i] !== null && createRef());
        const temp = [];
        tableHead.current.map((value) => {
            if(value.current !== null) {
                temp.push(value.current.offsetWidth);
            }
        });
        setTableHeadWidth(temp);
    },[tableData]);

    const setActiveResizable = (e , index) => {
        setCurrentLocation(e.clientX);
        setCurrentElementIndex(index);
        if(tableHeadWidth.length === 0) {
            const temp = [];
            tableHead.current.map((value) => {
                if(value.current !== null) {
                    temp.push(value.current.offsetWidth);
                }
            });
            console.log(temp);

            setTableHeadWidth(temp);
        }
    }

    const resetResizable = () => {
        setCurrentLocation(0);
        setCurrentElementIndex(-1);
    }

    const resizeTableColumn = (e) => {
        if(currentLocation !== 0) {
            const width_value = e.clientX - currentLocation;
            console.log(width_value);
            setCurrentLocation(currentLocation + width_value);
            const divisible = tableHeadWidth.length - currentElementIndex;
            const dummy = [ ...tableHeadWidth ];
            // console.log(tableHeadWidth);
            if(dummy[currentElementIndex] === NaN) dummy[currentElementIndex] = dummy[0]; 
            dummy[currentElementIndex] = dummy[currentElementIndex] + width_value;
            console.log(dummy[currentElementIndex]);
            tableHeadWidth.map((value , index) => {
                if(index > currentElementIndex) {
                    dummy[index] = value - (width_value / divisible);
                }
            });
            setTableHeadWidth(dummy);
        }
    }

    return (
        <>
            <table className="app-table" width="100%" onMouseMove={resizeTableColumn} onMouseUp={resetResizable} border="0">
                <thead className="custom-table-header">
                    <tr>
                        {(filterData.header.length === 0 ? tableData : filterData).header.map((value , index) => {
                            return (
                                <th key={`table-head-${index}`} className="custom-table-head" ref={tableHead.current[index]} style={{ width: tableHeadWidth[index]+'px' }} > 
                                    <div className="custom-table-header-parent"> 
                                        <div> { value } </div> 
                                        {(filterData.header.length !== 0 ? filterData.header.length-1 !== index : tableData.header.length-1 !== index) && <div className="custom-table-dragable" onMouseDown={ (e) => setActiveResizable(e , index) } draggable={`table-dragable-${index}`}></div> }
                                    </div>
                                </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {(filterData.data.length === 0 ? tableData : filterData).data.map((value , row_index) => {
                        return (
                            <tr key={`row-${row_index}`}>
                                {value.map((col , col_index) => {
                                    return <td key={`row-${row_index}-col-${col_index}`}> { col } </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default CustomTable;