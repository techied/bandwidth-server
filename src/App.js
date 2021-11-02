import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import ClientList from "./components/ClientList";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sites from "./components/Sites";

const socket = io();
socket.on('connect', function () {
    console.log('socket connected');
});

const App = () => {

    const [clients, setClients] = useState([]);
    useEffect(() => {
        fetch('/api/clients').then(res => res.json()).then(data => {
            if (clients !== data) {
                setClients(data);
            }
        });
        socket.on('client add', function (data) {
            console.log('client add' + data);
            setClients(clients => [...clients, data]);
        });

        socket.on('client remove', function (key) {
            console.log('client remove ' + key);
            setClients(clients => clients.filter(client => client.key !== key));
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
                        <Route path="/sites" exact component={() => <Sites/>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
};

export default App;
