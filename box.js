function Box(x, y, w, h){
    this.body = Bodies.rectangle(x, y, w, h);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
    
     this.show = function() {
         var pos = this.body.position;
         var angle = this.body.angle;
         
        push();
        translate(pos.x, pos.y);
        rect(0, 0, w, h);
        
        pop();
        }
}