import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {DataGrid} from "@mui/x-data-grid";
import ReactTimeAgo from "react-time-ago";
import {useState} from "react";
import AddClientDialog from "./AddClientDialog";
import LastTestResult from "./LastTestResult";

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
        flex: 2
    }, {field: 'mac', headerName: 'MAC Address', flex: 2}, {
        field: 'lastTest', headerName: 'Last Test Result', flex: 2, renderCell: (params) => {
            return <LastTestResult lastTest={params.row.lastTest}/>
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
        field: "action", headerName: "Action", sortable: false, flex: 1, renderCell: (params) => {
            const onClick = (e) => {
                e.stopPropagation(); // don't select this row after clicking
                webtest(params.row);
            };

            const buttonStyle = {
                borderRadius: 4
            }

            return (<div className='list center'>
                <Button variant='contained' size='medium' style={buttonStyle} startIcon={<DeleteIcon/>}
                        color='error'
                        onClick={onClick} className='remove-btn'>Run Test</Button>
            </div>);
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