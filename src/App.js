import './App.css';
import io from 'socket.io-client';
import {useState} from "react";
import ClientList from "./components/ClientList";
import Button from "./components/Button";

function App() {

    const [clients, setClients] = useState([{key: 1, name: 'hi', ip: '127.0.0.1', status: 'asdf'}]);


    function openWs() {
        const socket = io();
        socket.on('connect', function () {
            console.log('connected');
        });
    }

    function removeClient(client) {
        const newClients = {...clients};
        delete newClients[client];
        setClients(newClients);
    }

    return (
        <div className="App">
            <Button onClick={openWs} text='Open WebSocket'/>
            <div className='grid grid-cols-3'>
                <div/>
                <ClientList clients={clients} onRemove={removeClient}/>
            </div>
        </div>
    );
}

export default App;
