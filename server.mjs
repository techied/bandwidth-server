import express from 'express';
import {Server} from 'socket.io';
import bodyParser from "body-parser";

const app = express();
// Serve static files from the React app
app.use(express.static('./build'));

const jsonParser = bodyParser.json();

let clients = [{
    key: 1,
    name: 'John Doe',
    ip: '127.0.0.1',
    status: 'online'
}, {
    key: 2,
    name: 'Jane Doe',
    ip: '129.0.0.6',
    status: 'online'
}];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/clients', (req, res) => {
    res.json(clients);
});

app.delete('/api/clients/remove', jsonParser, (req, res) => {
    const key = req.body.key;
    clients = clients.filter(client => client.key !== key);
    io.emit('client remove', key);
    res.sendStatus(200);
});

// app.use(bodyParser.json());

const server = app.listen(3001, () => {
    console.log('Listening on http://localhost:3001');
});

const io = new Server(server);
io.on('connection', Socket => {
    console.log('New client connected');
    Socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    Socket.on('chat message', msg => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });
});