import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import ClientList from "./components/ClientList";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import SiteList from "./components/SiteList";

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

    return (
        <div className="App">
            <BrowserRouter>
                <div className='flex justify-center'>
                    <Navbar/>
                </div>
                <div className='flex justify-center'>
                    <Switch>
                        <Route path="/" exact
                               component={() => <ClientList clients={clients}/>}/>
                        <Route path="/sites" exact component={() => <SiteList sites={sites}/>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
