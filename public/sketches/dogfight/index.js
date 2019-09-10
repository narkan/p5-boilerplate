
// Globals
let img;
let socket;
let airplane;
let airplanes = [];
let missiles = [];

// Constants
const AIRPLANE_SIZE = 20;
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

    socket = io.connect('http://localhost:4000');
    // ṣocket = io();

    socket.on('currentPlayers', displayPlayers);

    socket.on('mouse', newDrawing);


    // On receiving a 'new connection' event fr
    // om the server, execute newConnection to create a new plane
    // socket.on('connection', newPlane);
    // socket.on('connection', () => '' );

    // On receiving a 'mouse' event from the server, execute newDrawaing func
    // socket.on('mouse', newDrawing);

    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('p5-wrap');

    // drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = -5;
    // drawingContext.shadowBlur = 10;
    // drawingContext.shadowColor = "gray";
    angleMode(DEGREES);

    airplane0 = new Airplane(0, 100, window.innerHeight / 2);
    airplane1 = new Airplane(1, 300, window.innerHeight / 2);

    airplanes.push(airplane0);
    airplanes.push(airplane1);

    console.log(airplanes);
}

function draw() {

   // background(200);

    for (let i = 0; i < airplanes.length; i++) {
        airplanes[i].render();
        airplanes[i].next();
    }

    for (let i = 0; i < missiles.length; i++) {
        missiles[i].render();
        missiles[i].next();
    }

    removeExpiredMissiles();

    checkKeys();

    // text('missiles.length: ' + missiles.length, 400, 10);

}


function displayPlayers(players) {
    console.log(players);
}

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
