import './App.css';
import io from 'socket.io-client';
import {useState} from "react";
import ClientList from "./components/ClientList";
import Button from "./components/Button";

function App() {

  const [clients, setClients] = useState([{}]);


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
        <ClientList clients={clients} onRemove={removeClient}/>
      </div>
  );
}

export default App;
