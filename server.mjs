import express from 'express';
import {Server} from 'socket.io';
import bodyParser from "body-parser";
import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv';
import compression from "compression";
import * as path from "path";

dotenv.config();

const app = express();

// noinspection JSCheckFunctionSignatures
app.use(compression());

// Serve static files from the React app
app.use(express.static('./build'));

const jsonParser = bodyParser.json();

// get mongoUri from env
const uri = process.env.MONGODB_URI;

const socketClients = new Map();

// noinspection JSCheckFunctionSignatures
const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoClient.connect(err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/clients', (req, res) => {
    mongoClient.db('main').collection('clients').find().toArray((err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let clients = result;
        clients.forEach(client => {
            client.connected = socketClients.has(client.mac);
        });
        res.json(clients);
        console.log('Clients loaded', clients);
    });
});

app.get('/run/iperf3', (req, res) => {
    io.emit('iperf3', req);
    res.sendStatus(200);
});

app.get('/api/sites', (req, res) => {
    mongoClient.db('main').collection('sites').find().toArray((err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const sites = result;
        res.json(sites);
        console.log('Sites loaded', sites);
    });
});

app.delete('/api/clients/remove', jsonParser, (req, res) => {
    const id = req.body._id;
    mongoClient.db('main').collection('clients').deleteOne({_id: new ObjectId(id)}, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Client removed from db', result);
        io.emit('client remove', id);
    });
    res.sendStatus(200);
});

app.delete('/api/sites/remove', jsonParser, (req, res) => {
    const id = req.body._id;
    mongoClient.db('main').collection('sites').deleteOne({_id: new ObjectId(id)}, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Site removed from db', result);
        io.emit('site remove', id);
    });
    res.sendStatus(200);
});

app.put('/api/sites/add', jsonParser, (req, res) => {
    const site = req.body;
    mongoClient.db('main').collection('sites').insertOne(site, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        site._id = result.insertedId;
        io.emit('site add', site);
        res.sendStatus(200);
    });
});

app.put('/api/clients/add', jsonParser, (req, res) => {
    const client = req.body;
    mongoClient.db('main').collection('clients').insertOne(client, (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        client._id = result.insertedId;
        io.emit('client add', client);
        res.sendStatus(200);
    });
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(path.resolve(), '/build/index.html'))
});

const server = app.listen(3001, () => {
    console.log('Listening on http://localhost:3001');
});

const io = new Server(server);
io.on('connection', Socket => {
    Socket.on('disconnect', () => {
        socketClients.forEach((mac, socketId) => {
            if (socketId === Socket.id) {
                socketClients.delete(mac);
                console.log('Client disconnected', mac);
                mongoClient.db('main').collection('clients').updateOne({mac: mac}, {$set: {lastSeen: Date()}}, (err, result) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                    console.log('Client disconnected from db', result);
                });
            }
        });
        console.log('Client disconnected');
    });
    Socket.on('chat message', msg => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });
    Socket.on('client mac', mac => {
        mongoClient.db('main').collection('clients').findOne({mac: mac}).then(result => {
            if (result) {
                socketClients.set(mac, Socket.id);
                console.log('Client connected', mac, Socket.id);
            } else {
                console.log('Client invalid');
                Socket.disconnect();
            }
        });
    });
});