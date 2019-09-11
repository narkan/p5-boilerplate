var express = require('express');
var app = express();

var PORT = 4000;

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

var players = {};

// console.log(io);
// When this is executed at the 'connection' event, the 'socket' parameter will be passed into it
function newConnection(socket) {
    try {
        // console.log('Num sockets: ' + socket.length);
        console.log('New connection - socket id: ' + socket.id);

        // create a new player and add it to our players object
        players[socket.id] = {
            rotation: 0,
            x: Math.floor(Math.random() * 700) + 50,
            y: Math.floor(Math.random() * 500) + 50,
            playerId: socket.id,
            team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
        };
        // send the players object to the new player
        socket.emit('currentPlayers', players);
        // update all other players about the new player
        socket.broadcast.emit('newPlayer', players[socket.id]);



        // Add event handler for when a 'mouse' broadcast is received
        socket.on('mouse', mouseMsg);
        // socket.on('chat message', () => console.log('received'));
    } catch(err) {
        console.error('Could not start the server: ' + err);
    }

    // Handle the data received from the 'mouse' broadcast-received event
    // See EMIT cheatsheet: https://socket.io/docs/emit-cheatsheet/
    function mouseMsg(data) {
        // Broadcasting means sending a message to everyone else except for the socket that starts it.
        socket.broadcast.emit('mouse', data);

        // Emit to global io object (includes the client that sent the original??)
        // io.sockets.emit('mouse', data);

        // console.log(data);
    }

    socket.on('disconnect', function () {

        // Create a new array without the disconnected socket.id object
        let newPlayers = {};

        console.log('Starts. Num conns = ' + players.length);
        console.log(players);

        for(let i = 0; i < players.length; i++) {
            console.log('newPlayers' + newPlayers.i);
            console.log('players' + players.i);
            if(players[socket.id] !== socket.id) {
                newPlayers[socket.id] = players[socket.id];
            }
        }

        players = newPlayers;

        console.log('Old players');
        console.log(players);
        console.log('New players');
        console.log(players);
    });
}
