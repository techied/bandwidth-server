import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {DataGrid} from "@mui/x-data-grid";
import ReactTimeAgo from "react-time-ago";
import {useState} from "react";
import AddClientDialog from "./AddClientDialog";
import LastIperf3Result from "./LastIperf3Result";
import LastWebtestResult from "./LastWebtestResult";
import {PlayCircle} from "@mui/icons-material";
import DataGridButton from "./DataGridButton";

const ClientList = ({clients}) => {


    const [selectionModel, setSelectionModel] = useState([]);


    const iperf3 = (client) => {
        const requestOptions = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify([client.mac])
        };
        console.log(requestOptions);
        fetch('/run/iperf3', requestOptions);
    };

    const webtest = (client) => {
        const requestOptions = {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify([client.mac])
        };
        console.log(requestOptions);
        fetch('/run/webtest', requestOptions);
    }

    const ClientsGridColumns = [{field: '_id', headerName: 'ID', flex: 1.5}, {
        field: 'name',
        headerName: 'Name',
        flex: 1
    }, {field: 'mac', headerName: 'MAC Address', flex: 1}, {
        field: 'lastIperf3', headerName: 'Last iPerf3', flex: 1, renderCell: (params) => {
            return <LastIperf3Result lastIperf3={params.row.lastIperf3}/>
        }
    }, {
        field: 'lastWebtest', headerName: 'Last WebTest', flex: 1, renderCell: (params) => {
            return <LastWebtestResult lastWebtest={params.row.lastWebtest}/>
        }
    }, {
        field: 'connected', headerName: 'Connected', flex: 1, renderCell: (params) => {
            return params.row.connected ? <CheckCircleIcon/> : '';
        }
    }, {
        field: 'lastSeen', headerName: 'Last Seen', flex: 1, renderCell: (params) => {
            const api = params.api;
            const thisRow = {};

            api
                .getAllColumns()
                .filter((c) => c.field !== "__check__" && !!c)
                .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));
            let val;
            if (params.row.connected) {
                val = 'Just now';
            } else if (thisRow['lastSeen'] === undefined) {
                val = 'Never';
            } else {
                val = <ReactTimeAgo date={thisRow['lastSeen']} locale="en-US"/>;
            }
            return val;
        }
    }, {
        field: "runIperf3", headerName: "Action", sortable: false, flex: 1, renderCell: (params) => {

            const onClick = () => {
                iperf3(params.row)
            };

            return (<DataGridButton onClick={onClick} icon={<PlayCircle/>} text='Run iPerf3'/>);
        }
    }, {
        field: "runWebtest", headerName: "Action", sortable: false, flex: 1, renderCell: (params) => {

            const onClick = () => {
                webtest(params.row)
            };

            return (<DataGridButton onClick={onClick} icon={<PlayCircle/>} text='Run WebTest'/>);
        }
    },]

    return (<>
        <DataGrid rows={clients}
                  columns={ClientsGridColumns} checkboxSelection
                  disableColumnSelector disableSelectionOnClick getRowId={(r) => r._id}
                  onSelectionModelChange={(ids) => {
                      setSelectionModel(ids);
                  }}
        />
        <AddClientDialog/>
    </>)
}

export default ClientList;