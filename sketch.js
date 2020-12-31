// module aliases
var Engine = Matter.Engine,
   // Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;


// create an engine
var engine;
var world;
var boxes = [];

function setup() {
    createCanvas(400, 400);
    engine = Engine.create();
    world = engine.world;
    box1 = new Box(200, 100, 50, 50);
    Engine.run(engine);
    

}

function mousePressed() {
    boxes.push(new Box(mouseX, mouseY, 20, 20));
}

function draw() {
    // background(51);
    for ( var i = 0; i < boxes.length; i++) {
    boxes[i].show();
    }
}
