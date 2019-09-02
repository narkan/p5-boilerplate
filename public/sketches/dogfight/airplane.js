class Airplane {
    constructor() {
        this.x = 100;
        this.y = window.innerHeight / 2;
        this.angle = 270;
        this.speed = BASE_SPEED;
        this.initialMouse = true;
        this.lastMouseX = 0;
    }

    next() {
        this.move();
        this.rotate();
    }

    /**
     * Move the airplane forward in the direction it is travelling
     */
    move() {
        this.x -= sin(this.angle) * this.speed;
        this.y += cos(this.angle) * this.speed;
    }

    /**
     * Rotate the airplane
     */
    rotate() {
        // To prevent an initial incorrect angle, because lastMouseX has not been set yet, because this is the first function call where mouseX has a value.
        // Therefore just set lastMouseX = mouseX on this call.
        if (this.initialMouse && mouseX !== 0) {
            this.lastMouseX = mouseX;
            this.initialMouse = false;

        } else {

            text('Angle: ' + this.angle + '\nmouseX: ' + mouseX + '\nlastMouseX: ' + this.lastMouseX + '\nDiff: ' + difference, 10, 10);
            /**
             * Rotation calculation
             *
             * Change the rotation according to change in mouseX value
             * ie: fast change in mouseX -> fast change in rotation
             */
            var difference = parseInt(this.lastMouseX - mouseX);

            this.angle -= difference;

            this.lastMouseX = mouseX;
        }
    }

    render() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);
        fill(255);

        triangle(
                -(AIRPLANE_SIZE / 2), -(AIRPLANE_SIZE / 2),
                0, (AIRPLANE_SIZE / 2),
                (AIRPLANE_SIZE / 2), -(AIRPLANE_SIZE / 2)
        );
        pop();

        // console.log(this.x + ' ' + this.y + ' ' + this.angle + 'deg' );
    }
}
