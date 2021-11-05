import express from 'express';
import {Server} from 'socket.io';
import bodyParser from "body-parser";

const app = express();
// Serve static files from the React app
app.use(express.static('./build'));

const jsonParser = bodyParser.json();

let clients = [{
    id: 1,
    name: 'John Doe',
    ip: '127.0.0.1',
    status: 'online'
}, {
    id: 2,
    name: 'Jane Doe',
    ip: '129.0.0.6',
    status: 'online'
}, {
    id: 3,
    name: 'Jimmy John',
    ip: '129.0.0.7',
    status: 'offline'
}];

let sites = [{
    id: 1,
    name: 'YouTube',
    url: 'https://youtube.com',
    weight: 100
}, {
    id: 2,
    name: 'Amazon',
    url: 'https://amazon.com',
    weight: 100
}, {
    id: 3,
    name: 'Google',
    url: 'https://google.com',
    weight: 100
}]

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/clients', (req, res) => {
    res.json(clients);
});

app.get('/api/sites', (req, res) => {
    res.json(sites);
});

app.delete('/api/clients/remove', jsonParser, (req, res) => {
    const id = req.body.id;
    clients = clients.filter(client => client.id !== id);
    io.emit('client remove', id);
    res.sendStatus(200);
});

app.delete('/api/sites/remove', jsonParser, (req, res) => {
    const id = req.body.id;
    sites = sites.filter(site => site.id !== id);
    io.emit('site remove', id);
    res.sendStatus(200);
});

app.put('/api/sites/add', jsonParser, (req, res) => {
    const site = req.body;
    // set id to random number
    site.id = Math.floor(Math.random() * 100);
    sites.push(site);
    io.emit('site add', site);
    res.sendStatus(200);
});

app.put('/api/clients/add', jsonParser, (req, res) => {
    const client = req.body;
    console.log(req.body);
    clients.push(client);
    io.emit('client add', client);
    res.sendStatus(200);
});

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