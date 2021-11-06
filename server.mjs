import express from 'express';
import {Server} from 'socket.io';
import bodyParser from "body-parser";
import {MongoClient, ObjectId} from 'mongodb';
import dotenv from 'dotenv';
import compression from "compression";
import * as path from "path";

dotenv.config();

const app = express();

app.use(compression());

// Serve static files from the React app
app.use(express.static('./build'));

const jsonParser = bodyParser.json();

// get mongoUri from env
const uri = process.env.MONGODB_URI;

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const mongoClient = new MongoClient(uri, mongoOptions);


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
    res.json(clients);
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
    const id = req.body.id;
    clients = clients.filter(client => client.id !== id);
    io.emit('client remove', id);
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
    let site = req.body;
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
    console.log(req.body);
    clients.push(client);
    io.emit('client add', client);
    res.sendStatus(200);
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(path.resolve(), '/build/index.html'))
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