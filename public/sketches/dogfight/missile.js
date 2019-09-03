class Missile {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = MISSILE_SPEED;     //  + (0.5 * MISSILE_SPEED * Math.random());
        this.distance = 0;  // Distance travelled

        this.detonated = false;
        this.blastRadius = 0;
        this.maxBlastRadius = BLAST_RADIUS + (BLAST_RADIUS * Math.random());
        this.blastChange = BLAST_SPEED + (0.5 * BLAST_SPEED * Math.random()); // Growth or shrink amount
        this.expired = false;
    }

    next() {

     //   text('maxBlastRadius: ' + this.maxBlastRadius + '\nblastRadius: ' + this.blastRadius + '\nblastChange: ' + this.blastChange + '\nexpired: ' + this.expired, 200, 10);


        if (this.expired === false) {
            this.move();

            if (this.detonated === false) {
                this.checkRange();
            }
            else {
                this.blast();
            }
        }
    }

    // Move the missile
    move() {
        this.x -= sin(this.angle) * this.speed;
        this.y += cos(this.angle) * this.speed;
        this.distance++;
    }


    checkRange () {
        // If distance travelled >= missile's range, detonate
        if (this.distance >= MISSILE_RANGE) {
            this.detonated = true;

            // Reduce moving speed post-detonation
            this.speed *= SPEED_AFTER_DETONATION;
        }
    }

    // Progress blast of detonated missile
    blast() {
        // Increase / decrease blast radius
        this.blastRadius += this.blastChange;

        // If the blast is growing and it has reached max blast radius size, start shrinking
        if (this.blastChange >= 0 && this.blastRadius >= this.maxBlastRadius) {
            this.blastChange = - BLAST_SPEED / 5;
        }

        // If the blast is shrinking and has reached zero radius, expire it
        if (this.blastChange <= 0 && this.blastRadius <= 0) {
            this.expired = true;
        }
    }

    render() {
        push();
            translate(this.x, this.y);
            rotate(-this.angle);
            if (this.detonated === false) {
                fill(255);
                ellipse(0, 0, MISSLE_RADIUS);
            } else {
                fill(255- this.blastRadius * 3, this.blastRadius * 3, this.blastRadius * 3);
                ellipse(0, 0, this.blastRadius);
            }
        pop();
    }
}
