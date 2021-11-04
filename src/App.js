import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import SiteList from "./components/SiteList";
import {Button} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid} from "@mui/x-data-grid";

const socket = io();
socket.on('connect', function () {
    console.log('socket connected');
});

const App = () => {

    const [clients, setClients] = useState([]);

    const [sites, setSites] = useState([]);

    useEffect(() => {
        fetch('/api/clients').then(res => res.json()).then(data => {
            if (clients !== data) {
                setClients(data);
            }
        });
        fetch('/api/sites').then(res => res.json()).then(data => {
            if (sites !== data) {
                setSites(data);
            }
        });
        socket.on('client add', function (data) {
            console.log('client add ' + data);
            setClients(clients => [...clients, data]);
        });

        socket.on('client remove', function (key) {
            console.log('client remove ' + key);
            setClients(clients => clients.filter(client => client.key !== key));
        });

        socket.on('site add', function (data) {
            console.log('site add ' + data);
            setSites(sites => [...sites, data]);
        });

        socket.on('site remove', function (key) {
            console.log('site remove ' + key);
            setSites(sites => sites.filter(site => site.key !== key));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ClientsGridColumns = [{field: 'id', headerName: 'ID', flex: 1},
        {field: 'name', headerName: 'Name', flex: 2},
        {field: 'ip', headerName: 'IP', flex: 2},
        {field: 'status', headerName: 'Status', flex: 1},
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 1,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api = params.api;
                    const thisRow = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    const removeClient = (client) => {
                        const requestOptions = {
                            method: 'DELETE',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({id: client.id})
                        };
                        fetch('/api/clients/remove', requestOptions);
                    };

                    removeClient(thisRow);

                    // return alert(JSON.stringify(thisRow, null, 4));
                };

                return (
                    <div className='h-full w-full flex justify-center items-center'>
                        <Button variant='contained' size='medium' startIcon={<DeleteIcon/>} color='error'
                                onClick={onClick} className='h-3/4 w-3/4 -translate-y-0.5'>Remove</Button>
                    </div>
                );
            }
        },
    ]
//TODO: use DataGrid for clients instead of ClientList (Or impl DataGrid in ClientList? Yea probably do that)
    return (
        <div className="App">
            <BrowserRouter>
                <div className='flex justify-center'>
                    <Navbar/>
                </div>
                <div className='flex justify-center h-screen'>
                    <Switch>
                        <Route path="/" exact
                               component={() => <DataGrid rows={clients}
                                                          columns={ClientsGridColumns} checkboxSelection
                                                          disableColumnSelector disableSelectionOnClick/>}/>
                        <Route path="/sites" exact component={() => <SiteList sites={sites}/>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    )

};

export default App;
