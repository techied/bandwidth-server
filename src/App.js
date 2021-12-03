import './App.css';
import {useEffect, useState} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import SiteList from "./components/SiteList";
import ClientList from "./components/ClientList";
import socket from "./SocketConfig";


const App = () => {

    const [clients, setClients] = useState([]);
    const [clientUpdate, setClientUpdate] = useState([]);
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
            console.log('client add ', data);
            setClients(clients => [...clients, data]);
        });

        socket.on('client update', function (data) {
            console.log('client update', data);
            setClientUpdate(data)
        });

        socket.on('client remove', function (id) {
            console.log('client remove ', id);
            setClients(clients => clients.filter(client => client.id !== id));
        });

        socket.on('site add', function (data) {
            console.log('site add ', data);
            setSites(sites => [...sites, data]);
        });

        socket.on('site remove', function (id) {
            console.log('site remove ', id);
            setSites(sites => sites.filter(site => site._id !== id));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(clients)
        setClients(clients.map(client => {
            if (clientUpdate._id === client._id) {
                return clientUpdate
            }
            return client
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientUpdate]);

    useEffect(() => {
        console.log(clients)
    }, [clients])

    return (<div className="App">
        <BrowserRouter>
            <div className='nav center'>
                <Navbar/>
            </div>
            <div className='main center'>
                <Switch>
                    <Route path="/" exact
                           component={() => <ClientList clients={clients}/>}/>
                    <Route path="/sites" exact component={() => <SiteList sites={sites}/>}/>
                </Switch>
            </div>
        </BrowserRouter>
    </div>)

};

export default App;
