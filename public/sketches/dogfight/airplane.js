class Airplane {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.angle = 180;
        this.speed = AIRPLANE_SPEED;
        this.initialMouse = true;
        this.lastMouseX = 0;
    }

    next() {
        this.move();
        this.rotate();
       // this.velocity();
          text('speed: ' + this.speed, 200, 10);

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

            /**
             * Rotation calculation
             *
             * Change the rotation according to change in mouseX value
             * ie: fast change in mouseX -> fast change in rotation
             */
            var difference = parseInt(this.lastMouseX - mouseX);

            this.angle -= difference;

            // Keep the angle between 0 and 360 degrees
            if (this.angle > 360) this.angle -= 360;
            if (this.angle < 0) this.angle += 360;

            this.lastMouseX = mouseX;

            text('Angle: ' + this.angle + '\nmouseX: ' + mouseX + '\nlastMouseX: ' + this.lastMouseX + '\nDiff: ' + difference, 10, 10);
        }
    }

    velocity(delta) {
        // Deceleration
        if (delta < 0 && this.speed >= 0) {
            this.speed += delta;
        }

        // Acceleration
        if (delta > 0 && this.speed <= AIRPLANE_MAX_SPEED) {
            this.speed += delta;
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
