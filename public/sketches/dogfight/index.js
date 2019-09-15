/**
 * Globals
 */

// socket.io
let socket;

// p5
let img;
let myAirplane;
let otherAirplanes = [];
let missiles = [];

// Constants
const AIRPLANE_SIZE = 100;
const AIRPLANE_SPEED = 0.7;
const AIRPLANE_MAX_SPEED = 5;
const ACCELERATION = 0.1;

const MISSILE_SPEED = 5;
const MISSLE_RADIUS = 5;
const MISSILE_RANGE = 45;
const BLAST_RADIUS = 30;
const BLAST_SPEED = 5;
const SPEED_AFTER_DETONATION = 0.1;  // Percentage of original speed

function preload() {
    //img = loadImage('./img/bg.jpg');
}

function setup() {
    angleMode(DEGREES);

    let myCanvas = createCanvas(900, 700);
    myCanvas.parent('p5-wrap');


    /**
     * Sockets
     */

    // The client should find the current io connection automatically. Else it can be specified explicitly
    socket = io();
    // socket = io.connect('http://localhost:4000');



    // Create function to handle the event where we receive the object containing all the players from the server
    // Loop through all the other players and add to otherAirplanes array

    socket.on('currentPlayers', function (players) {

        for (let i = 0; i < players.length; i++) {
            console.log("i = " + i + " ... " + JSON.stringify(players[i].playerId));
                         // let thisOtherPlayer = new Airplane(players[i].playerId, players[i].x, players[i].y)

            if (players[i].playerId === socket.id) {
                // This is my plane - add to myAirplane
                addThisPlayerAirplane(players[i]);
            } else {
                // This is one of the other players' airplanes - add to otherAirplanes
                addOtherPlayersAirplanes(players[i]);
            }
        }

        // Object.keys(players).forEach(function (id) {
        //     if (players[id].playerId === socket.id) {
        //         addThisPlayerAirplane(players[id]);
        //     } else {
        //         addOtherPlayersAirplanes(players[id]);
        //     }
        // });
    });

    socket.on('newPlayer', function (playerInfo) {
        addOtherPlayersAirplanes(playerInfo);

        console.log("All OTHER airplanes: " + JSON.stringify(otherAirplanes));

    });

    socket.on('disconnect', function (playerId) {

        console.log("  ");
        console.log("Disconnecting player: " + playerId);
        console.log("All other airplanes: " + JSON.stringify(otherAirplanes));

        for (let i = otherAirplanes.length-1; i >= 0; i--) {
            console.log("i = " + i + " ... " + JSON.stringify(otherAirplanes[i].playerId));
            if (playerId === otherAirplanes[i].playerId) {
                otherAirplanes.splice(i, 1);
                console.log("... Removed");
            }
        }
        console.log("Other players, after loop...");
        console.log(JSON.stringify(otherAirplanes));
    });

    socket.on('mouse', newDrawing);

    // On receiving a 'new connection' event fr
    // om the server, execute newConnection to create a new plane
    // socket.on('connection', newPlane);
    // socket.on('connection', () => '' );

    // On receiving a 'mouse' event from the server, execute newDrawaing func
    // socket.on('mouse', newDrawing);


    // drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = -5;
    // drawingContext.shadowBlur = 10;
    // drawingContext.shadowColor = "gray";


    // airplane0 = new Airplane(0, 100, window.innerHeight / 2);
    // airplane1 = new Airplane(1, 300, window.innerHeight / 2);

    // airplanes.push(airplane0);
    // airplanes.push(airplane1);

    // console.log(airplanes);
}

function draw() {

   // background(200);

    // Move my airplane
    if (myAirplane) {
        myAirplane.render();
        myAirplane.next();
    }

    // Move other players' airplanes
    for (let i = 0; i < otherAirplanes.length; i++) {
        otherAirplanes[i].render();
        otherAirplanes[i].next();
    }

    for (let i = 0; i < missiles.length; i++) {
        missiles[i].render();
        missiles[i].next();
    }

    removeExpiredMissiles();

    checkKeys();

    // text('missiles.length: ' + missiles.length, 400, 10);

}

// Add the airplane for this player
function addThisPlayerAirplane(playerInfo) {
    myAirplane = new Airplane(playerInfo.playerId, playerInfo.x, playerInfo.y);
    console.log("myAirplane: " + myAirplane.playerId + " " + myAirplane.x);
}


// Add airplanes for the other players
function addOtherPlayersAirplanes(playerInfo) {
    otherAirplanes.push(new Airplane(playerInfo.playerId, playerInfo.x, playerInfo.y));
}


// Add new players
function addNewPlayersAirplanes(playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'otherPlayer').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
        otherPlayer.setTint(0x0000ff);
    } else {
        otherPlayer.setTint(0xff0000);
    }
    otherPlayer.playerId = playerInfo.playerId;
    self.otherPlayers.add(otherPlayer);
}

//
// function currentPlayers(players) {
//     players = players;
//     console.log(players);
// }

// function displayPlayers(players) {
//     console.log(players);
// }

function checkKeys() {
    // Airplane 1
    if (keyIsDown(87)) {
        airplanes[0].velocity(ACCELERATION);
    }

    if (keyIsDown(83)) {
        airplanes[0].velocity(-ACCELERATION);
    }

    // Airplane 2
    if (keyIsDown(UP_ARROW)) {
        airplanes[1].velocity(ACCELERATION);
    }

    if (keyIsDown(DOWN_ARROW)) {
        airplanes[1].velocity(-ACCELERATION);
    }
}

function removeExpiredMissiles() {
    for (let i = missiles.length-1; i >= 0; i--) {
        if (missiles[i].expired) {
            missiles.splice(i, 1);
        }
    }
}


function mousePressed() {

    console.log("Num other players" + otherAirplanes.length);

    // let missile = new Missile(
    //     airplane.x,
    //     airplane.y,
    //     airplane.angle,
    //     airplane.speed
    // );
    //
    // missiles.push(missile);
    // // console.log(missiles);
}

function mouseMoved() {

    // Correct the error when the mouse is first moved, and the difference between airplane.lastMouseX and mouseX is huge.
    // Just set the lastMouseX to the current mouseX before the the airplane instance calculates the difference.
//    console.log(airplane.initialMouse ? 'true' : 'false');

    // if (airplane.initialMouse) {
    //     airplane.lastMouseX = mouseX;
    //     airplane.initialMouse = false;
    // }
}

function keyPressed() {
    console.log(keyCode);



    // return true;
}

/**
 * Render other player on receiving broadcast message via socket
 * @param data
 */
function newDrawing(data) {
    push();
        translate(data.x, data.y);
        ellipse(0,0, 80, 80);
        fill(0);
        console.log(data.x + " " + data.y);
    pop();
}

function mouseDragged(){
    // Broadcast location data
    var data = {
        x: mouseX,
        y: mouseY
    };
    socket.emit('mouse', data);
    // socket.emit("chat message", "Hello");

}
