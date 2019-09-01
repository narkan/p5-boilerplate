var express = require('express');
var app = express();

var PORT = 3000;

try {
    var server = app.listen(PORT);
    app.use(express.static('public'));

    console.log(`Server running on port ${PORT}`);
} catch(err) {
    console.error('Could not start the server: ' + err);
}


/**
 * Socket.io
 */

// Setup socket
var socket = require('socket.io');

// Pass the express server to socket.io
var io = socket(server);

// On the 'connection' event, call the newConnection callback
io.sockets.on('connection', newConnection);

// When this is executed at the 'connection' event, the 'socket' parameter will be passed into it
function newConnection(socket) {
    try {
        console.log('New connection - socket id: ' + socket.id);

        // Add event handler for when a 'mouse' broadcast is received
        socket.on('mouse', mouseMsg);
    } catch(err) {
        console.error('Could not start the server: ' + err);
    }

    // Handle the data received from the 'mouse' broadcast-received event
    function mouseMsg(data) {
        // Broadcast to the specific socket (doesn't include client that sent the message??)
        socket.broadcast.emit('mouse', data);

        // Broadcast to global io object (includes the client that sent the original??)
        // io.sockets.emit('mouse', data);

        // console.log(data);
    }
}
