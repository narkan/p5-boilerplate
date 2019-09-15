var express = require('express');
var app = express();

var PORT = 4000;

try {
    var server = app.listen(PORT);
    app.use(express.static('public'));

    console.log(`Server running on port ${PORT}`);
} catch(err) {
    console.error('Could not start the server: ' + err + " " + err);
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

// All players
var players = [];

// console.log(io);
// When this is executed at the 'connection' event, the new 'socket' parameter will be passed into it
function newConnection(socket) {
    try {
        // console.log('Num sockets: ' + socket.length);
        console.log('New connection - socket id: ' + socket.id);

        newPlayer = {
            playerId: socket.id,
            angle: 180,
            x: Math.floor(Math.random() * 700),
            y: Math.floor(Math.random() * 500)
            // team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
        };

        // Add the new player to our players object
        players.push(newPlayer);

        // Send the players' object to the new player
        socket.emit('currentPlayers', players);

        // Update all OTHER players about the new player
        socket.broadcast.emit('newPlayer', newPlayer);


        conlog_title("PLAYERS");
        console.log(players);
        conlog_end();
/**
        console.log('   ');
        console.log('***********');
        console.log('* LOOPING *');
        console.log('***********');
        console.log("socket.id: " + socket.id);

        for (let i = 0; i < players.length - 1; i++) {
            console.log("i = " + i + " ... " + JSON.stringify(players[i]));
            if (socket.id === players[i].playerId) {
                console.log("matched & broadcast new player to other players");
            }
        }
*/

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

        conlog_title("Disconnect");
        console.log("Disconnect id = " + socket.id);

        for (let i = players.length-1; i >= 0; i--) {
            console.log("This player: " + JSON.stringify(players[i].playerId));
            if (socket.id === players[i].playerId) {
                players.splice(i, 1);
                console.log("... Player removed");
            }
        }
        conlog_end();

        conlog_title("Updated players list");
        console.log(JSON.stringify(players));
        conlog_end();

        // emit a message to all players to remove this player
        io.emit('disconnect', socket.id);

    });
}

function conlog_title(title) {
    console.log('   ');
    console.log('***********');
    console.log('* ' + title + ' *');
    console.log('***********');
}

function conlog_end() {
    console.log('   ');
    console.log('   ');
}