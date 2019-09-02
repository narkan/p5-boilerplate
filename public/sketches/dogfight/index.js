
// Globals
let img;
let socket;
let airplane;
let airplanes = [];
let missiles = [];

// Constants
const AIRPLANE_SIZE = 20;
const BASE_SPEED = 0.7;
const MISSLE_RADIUS = 5;
const MISSILE_RANGE = 100;
const BLAST_RADIUS = 40;
const BLAST_SPEED = 5;

function preload() {
    img = loadImage('./img/bg.jpg');
}

function setup() {

    // ṣocket = io.connect('http://localhost:3000');

    // On receiving a 'new connection' event from the server, execute newConnection to create a new plane
    // socket.on('connection', newPlane);

    // On receiving a 'mouse' event from the server, execute newDrawaing func
    // socket.on('mouse', newDrawing);

    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('p5-wrap');

    // drawingContext.shadowOffsetX = 5;
    // drawingContext.shadowOffsetY = -5;
    // drawingContext.shadowBlur = 10;
    // drawingContext.shadowColor = "gray";
    angleMode(DEGREES);

    airplane = new Airplane();
}

function draw() {
    background(200);

    airplane.render();
    airplane.next();

   for (let i = 0; i < missiles.length; i++) {
        missiles[i].render();
        missiles[i].next();
    }

    removeExpiredMissiles();

    text('missiles.length: ' + missiles.length, 400, 10);

}

function removeExpiredMissiles() {
    for (let i = missiles.length-1; i >= 0; i--) {
        if (missiles[i].expired) {
            missiles.splice(i, 1);
        }
    }
}


function mousePressed() {
    let missile = new Missile(
        airplane.x,
        airplane.y,
        airplane.angle,
        airplane.speed
    );

    missiles.push(missile);
    // console.log(missiles);
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


/**
 * Render other player on receiving broadcast message via socket
 * @param data
 */
function newDrawing(data) {
    fill(0,255,0);
    ellipse(data.x, data.y, 80, 80);
}

function mouseDragged(){
    // Broadcast location data
    var data = {
        x: mouseX,
        y: mouseY
    };
    socket.emit('mouse', data);
}
