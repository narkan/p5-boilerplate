// Globals
let img;
let socket;
let airplane;
let airplanes = [];
let missiles = [];
let airplaneSize = 20;

// Constants
const BASE_SPEED = 2;
const MISSLE_SIZE = 5;
const MISSILE_RANGE = 100;
const BLAST_RADIUS = 60;

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
    airplane.move();

    if (missiles.length > 0) {
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].render();
            missiles[i].move();

        }
    }
}

class Airplane {
    constructor() {
        this.x = 100;
        this.y = window.innerHeight / 2;
        this.angle = 270;
        this.speed = BASE_SPEED;
        this.initialMouse = true;
        this.lastMouseX = 0;
    }

    move() {

        // To prevent an initial incorrect angle, because lastMouseX has not been set yet, because this is the first function call where mouseX has a value.
        // Therefore just set lastMouseX = mouseX on this call.
        if (this.initialMouse && mouseX !== 0) {
            this.lastMouseX = mouseX;
            this.initialMouse = false;

        } else {
            /**
             * Rotation calculation
             *
             * Change the rotation according to change in mouseX value
             * ie: fast change in mouseX -> fast change in rotation
             */
            var difference = parseInt(this.lastMouseX - mouseX);

            this.angle -= difference;

            this.lastMouseX = mouseX;
            text('Angle: ' + this.angle + '\nmouseX: ' + mouseX + '\nlastMouseX: ' + this.lastMouseX + '\nDiff: ' + difference, 10, 10);
            /**
             * Translation
             *
             * Move the airplane forward in the direction it is travelling
             */
            // this.x += sin(this.angle) * this.speed;
            // this.y += cos(this.angle) * this.speed;
        }
    }

    render() {
        push();
            translate(this.x, this.y);
            rotate(this.angle);
            fill(255);

            triangle(
                - (airplaneSize / 2), - (airplaneSize / 2),
                0, (airplaneSize / 2),
                (airplaneSize / 2), - (airplaneSize / 2)
            );
        pop();

        // console.log(this.x + ' ' + this.y + ' ' + this.angle + 'deg' );
    }
}

class Missile {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.distance = 0;  // Distance travelled
        this.detonation = false;  // False or radius
    }

    move() {
        /**
         * Translation
         *
         * Move the missile forward in the direction it is travelling
         */

        // If not yet detonated, move forward
        if ( !this.detonation ) {
            this.x -= sin(this.angle) * this.speed;
            this.y += cos(this.angle) * this.speed;
            this.distance++;
        } else {
            this.detonation++;
        }

        // If missile has reached its range and not yet detonated, start detonation
        if (this.distance >= MISSILE_RANGE ) {
            if (!this.detonation) {
                this.detonation = 1;
            } else { // Otherwise increase blast radius
                if( this.detonation < BLAST_RADIUS ) {
                    this.detonation++;
                }
            }

            if ( this.detonation >= BLAST_RADIUS ) {
                // Kill missile
            }
        }




    }

    render() {
        push();
        translate(this.x, this.y);
        rotate(-this.angle);
        if ( !this.detonation ) {
            fill(255);
            ellipse(0, 0, MISSLE_SIZE);
        } else {
            fill(255,0,0);
            ellipse(0, 0, this.detonation);
        }
        pop();
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
    console.log(missiles);
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
