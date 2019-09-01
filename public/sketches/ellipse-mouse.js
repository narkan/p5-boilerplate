let img;

function preload() {
    img = loadImage('./img/bg.jpg'); // bg.jpg courtesy rawpixel.com
}

function setup() {
    socket = io.connect('http://localhost:3000');

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
