let img;
let socket;

function preload() {
    img = loadImage('./img/bg.jpg'); // bg.jpg courtesy rawpixel.com
}

function setup() {
    socket = io.connect('http://localhost:3000');

    // On receiving a 'mouse' event from the server, execute newDrawaing func
    socket.on('mouse', newDrawing);

    let myCanvas = createCanvas(600, 400);
    //myCanvas.parent('p5-wrap');

    drawingContext.shadowOffsetX = 5;
    drawingContext.shadowOffsetY = -5;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = "gray";
    background(200);
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
}

function newDrawing(data) {
    fill(0,255,0);
    ellipse(data.x, data.y, 80, 80);
}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY
    };

    socket.emit('mouse', data);
}
