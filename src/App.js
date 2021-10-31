import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import ClientList from "./components/ClientList";

const socket = io();
socket.on('connect', function () {
    console.log('connected');
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
            console.log('client add');
            console.log(clients);
            setClients([...clients, data]);
            console.log(clients);
        });

        socket.on('client remove', function (key) {
            console.log('client remove ' + key);
            setClients(clients.filter(client => {
                return client.key !== key
            }));
        });
    }, []);


    const removeClient = (client) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: client.key})
        };
        fetch('/api/clients/remove', requestOptions);
    };

    return (
        <div className="App">
            <div className='grid grid-cols-3'>
                <div/>
                <ClientList clients={clients} onRemove={removeClient}/>
            </div>
        </div>
    );
};

export default App;
