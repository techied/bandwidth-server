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
    useNewUrlParser: true, useUnifiedTopology: true,
});

mongoClient.connect(err => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');
});


const db = mongoClient.db('main');

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/clients', async (req, res) => {
    db.collection('clients').find().toArray(async (err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        let clients = result;
        for (const client of clients) {
            client.connected = socketClients.has(client.mac);
            client.lastIperf3 = await db.collection('iperf3').findOne({mac: client.mac}, {sort: {timestamp: -1}}).then(result => {
                return result;
            });
            client.lastWebtest = await db.collection('webtest').findOne({mac: client.mac}, {sort: {timestamp: -1}}).then(result => {
                return result;
            });
        }
        res.json(clients);
        console.log('Clients loaded', clients);
    });
});

const getClient = async (mac) => {
    return await db.collection('clients').findOne({mac: mac}).then(async client => {
        client.lastIperf3 = await db.collection('iperf3').findOne({mac: mac}, {sort: {timestamp: -1}}).then(result => {
            return result;
        });
        client.lastWebtest = await db.collection('webtest').findOne({mac: mac}, {sort: {timestamp: -1}}).then(result => {
            return result;
        });
        client.connected = socketClients.has(client.mac);
        return client;
    });
}

app.post('/run/iperf3', jsonParser, (req, res) => {
    io.emit('iperf3', req.body);
    res.sendStatus(200);
});

app.post('/run/webtest', jsonParser, async (req, res) => {
    db.collection('sites').find().toArray((err, result) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        const sites = result;
        const data = {
            macs: req.body,
            sites: sites,
        }
        io.emit('webtest', data);
        console.log('Sites loaded', sites);
    });
    res.sendStatus(200);
})

app.get('/api/sites', (req, res) => {
    db.collection('sites').find().toArray((err, result) => {
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
    db.collection('clients').deleteOne({_id: new ObjectId(id)}, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        io.emit('client remove', id);
    });
    res.sendStatus(200);
});

app.delete('/api/sites/remove', jsonParser, (req, res) => {
    const id = req.body._id;
    db.collection('sites').deleteOne({_id: new ObjectId(id)}, (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        io.emit('site remove', id);
    });
    res.sendStatus(200);
});

app.put('/api/sites/add', jsonParser, (req, res) => {
    const site = req.body;
    db.collection('sites').insertOne(site, (err, result) => {
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
    db.collection('clients').insertOne(client, (err, result) => {
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
        socketClients.forEach(async (socketId, mac) => {
            if (socketId === Socket.id) {
                socketClients.delete(mac);
                console.log('Client disconnected', mac);
                io.emit('client update', await getClient(mac))
                db.collection('clients').findOneAndUpdate({mac: mac}, {$set: {lastSeen: new Date(new Date().toISOString())}}, (err) => {
                    if (err) {
                        console.error(err);
                        process.exit(1);
                    }
                });
            }
        });
        console.log('Client disconnected');
    });
    Socket.on('client mac', mac => {
        db.collection('clients').findOne({mac: mac}).then(async result => {
            if (result) {
                socketClients.set(mac, Socket.id);
                console.log('Client connected', mac, Socket.id);
                io.emit('client update', await getClient(mac))
            } else {
                console.log('Client invalid');
                Socket.disconnect();
            }
        });
    });
    Socket.on('iperf3 results', async results => {
        results.timestamp = new Date(new Date().toISOString());
        db.collection('iperf3').insertOne(results, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });

        io.emit('client update', await getClient(results.mac));
    });
    Socket.on('webtest results', async results => { //sio.emit('webtest results', {"mac": mac, "results": results})
        results.timestamp = new Date(new Date().toISOString());
        db.collection('webtest').insertOne(results, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
        io.emit('client update', await getClient(results.mac));
    });
});