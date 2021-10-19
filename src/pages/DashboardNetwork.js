const tableAppList = async () => {
    try {
        let response = fetch('http://go-dev.greedygame.com/v3/dummy/apps');
        return (await response).json();
    } catch (err) {
        console.error('Error In App List Api');
    }
}

const tableDataList = async (startDate , endDate) => {
    try {
        let response = fetch('http://go-dev.greedygame.com/v3/dummy/report?startDate='+startDate+'&endDate='+endDate);
        return (await response).json();
    } catch (err) {
        console.error('Error In Table List Api');
    }
}

export { tableAppList , tableDataList };