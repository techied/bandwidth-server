import io from "socket.io-client";

const socket = io();
socket.on('connect', function () {
    console.log('socket connected');
});

export default socket;