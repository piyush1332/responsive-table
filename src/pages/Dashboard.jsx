import React , { useEffect, useState } from 'react';
import CustomTable from '../components/CustomTable';
import TableFilter from '../components/TableFilter';
import './Dashboard.css';
import { tableAppList , tableDataList } from './DashboardNetwork';

function Dashboard() {
    
    const [ sampleDataRange , setSampleDataRange ] = useState({
        start_date: '2021-05-01',
        end_date: '2021-05-30'
    });
    const [ tableData , setTableData ] = useState({
        header: [],
        data: [],
        keys: []
    });
    const [ settingPanelStatus , setSettingPanelStatus ] = useState('none');
    const [ appList , setAppList ] = useState({});
    const [ filterData , setFilterData ] = useState({
        header: [],
        data: [],
        keys: []
    });

    const prepareTableData = (appData , tableData) => {
        const temp = {};
        const header = [];
        const data = [];
        const key_array = [];
        appData.data.map((value) => {
            temp[value.app_id] = value.app_name;
        });
        for(const key in tableData.data[0]) {
            if(key === 'app_id') {
                header.push('App');
                key_array.push('app_name');
            } else {
                header.push(key.toUpperCase());
                key_array.push(key);
            }
        }
        tableData.data.map((row) => {
            const temp_array = [];
            for(const index in row ) {
                console.log(key_array);
                if(index === 'app_id') temp_array.push(temp[row[index]]);
                else temp_array.push(row[index]);
            }
            data.push(temp_array);
        });
        setTableData({ header: header, data: data , keys: key_array });
    }
    
    const generateTable = async () => {
        const app_list_response = await tableAppList();
        const table_data_response = await tableDataList(sampleDataRange.start_date , sampleDataRange.end_date);
        const table_data = prepareTableData(app_list_response , table_data_response);   
    }

    useEffect(() => {
        generateTable();
    },[]);

    const handleSettingPanel = () => {
        if(settingPanelStatus === 'none') {
            setSettingPanelStatus('block');
        } else {
            setSettingPanelStatus('none');
        }
    }

    return (
        <>
            <div className="dashboard-container dashboard-margin-top">
                <div className="dashboard-heading"> Analytics </div>
                <div className="dashboard-header dashboard-margin-top">
                    <div className="dashboard-setting-button">
                        <input type="button" value="Settings" onClick={handleSettingPanel} />
                    </div>
                </div>
                <div className="dashboard-filter-holder dashboard-margin-top">
                    <TableFilter tableData={tableData} filterData={filterData} setFilterData={setFilterData} setTableData={setTableData} settingPanelStatus={settingPanelStatus} />
                </div>
                <div className="dashboard-table-holder dashboar-margin-top">
                    <CustomTable tableData={tableData} filterData={filterData} />
                </div>
            </div>
        </>
    )
}

export default Dashboard;