import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import SiteList from "./components/SiteList";
import ClientList from "./components/ClientList";

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

        socket.on('client remove', function (id) {
            console.log('client remove ' + id);
            setClients(clients => clients.filter(client => client.id !== id));
        });

        socket.on('site add', function (data) {
            console.log('site add ' + data);
            setSites(sites => [...sites, data]);
        });

        socket.on('site remove', function (id) {
            console.log('site remove ' + id);
            setSites(sites => sites.filter(site => site.id !== id));
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //TODO: Remove TailwindCSS since it doesn't play nice with MUI
    return (
        <div className="App">
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
        </div>
    )

};

export default App;
