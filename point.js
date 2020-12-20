export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fixedY = y;
        this.speed = 0.1;
    }

    update() {
        this.cur += this.speed;
        this.y= this.fixedY + (Math.sin(this.cur) * this.max);
    }
}