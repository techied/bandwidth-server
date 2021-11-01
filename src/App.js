import './App.css';
import io from 'socket.io-client';
import {useEffect, useState} from "react";
import ClientList from "./components/ClientList";

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


    const removeClient = (client) => {

        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({key: client.key})
        };
        fetch('/api/clients/remove', requestOptions);
    };

    return (
        <div className="App flex justify-center">
            <ClientList clients={clients} onRemove={removeClient}/>
        </div>
    );
};

export default App;
