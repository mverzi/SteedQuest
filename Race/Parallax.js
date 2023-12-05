class Parallax {
    constructor(canvas, race) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;

        this.x = 0;
        this.x2 = this.width;
        this.image = new Image();
        this.image.src = '/images/maps/Race2.png';
        this.speedModifier = 2; // Adjust the speed as needed
        this.y = 0;

        this.race = race;
        

        this.animate();
    }

    draw() {
        this.ctx.drawImage(this.image, this.x, this.y);
        this.ctx.drawImage(this.image, this.x2, this.y);
    }

    update() {
        this.x -= this.speedModifier * this.race.parallax; // Use race.parallax
        this.x2 -= this.speedModifier * this.race.parallax; // Use race.parallax
    
        // When the first image moves off the canvas, reset its position to the right of the second image
        if (this.x < -this.width) {
            this.x = this.x2 + this.width;
        }

        // When the second image moves off the canvas, reset its position to the right of the first image
        if (this.x2 < -this.width) {
            this.x2 = this.x + this.width;
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

