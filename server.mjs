import express from 'express';
import {Server} from 'socket.io';

const app = express();
// Serve static files from the React app
app.use(express.static('./build'));

app.get('/', (req, res) => {
    res.send('Hello World!');
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