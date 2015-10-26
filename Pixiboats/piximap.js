
var canvas = document.getElementById('canvas');
var renderer = PIXI.autoDetectRenderer(document.body.clientWidth-25, document.body.clientHeight-25, {view:canvas});
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

stage.width = document.body.clientWidth;
stage.height = document.body.clientHeight;

var interface = new PIXI.Container();
var mytitle = new PIXI.Text('Pixi.js Game Engine Test', { font: '35px', fill: 'white', align: 'left' });
mytitle.position.set(20);
interface.addChild(mytitle)
var instructions = new PIXI.Text('Arrows keys to Pan (or click and drag)\nMousewheel to Zoom\nSpacebar to reset position', { font: '35px', fill: 'white', align: 'left' });
instructions.position.set(20,50);
interface.addChild(instructions)
stage.addChild(interface)


var world = new PIXI.Container();
world.visible = true;
world.buttonMode = true;
world.render = true;
world.interactive = true;
world.position.x = 100;
world.position.y = 100;
world.width = 800;
world.height = 600;
world.scale = new PIXI.Point(1,1)
	world
        .on('mousedown', onDragStart2)
        .on('touchstart', onDragStart2)
        // events for drag end
        .on('mouseup', onDragEnd2)
        .on('mouseupoutside', onDragEnd2)
        .on('touchend', onDragEnd2)
        .on('touchendoutside', onDragEnd2)
        // events for drag move
        .on('mousemove', onDragMove2)
        .on('touchmove', onDragMove2);


var graphics = new PIXI.Graphics();

for (var x = -100000; x < 200000; x+=5000){
	for (var y = -100000; y < 200000; y +=5000){
		graphics.lineStyle(0);
		graphics.beginFill(0xFFFFFF, 0.5);
		graphics.drawRect(x-0.5 ,y-0.5 ,5000,5000);
		graphics.endFill();
	}
}

world.addChild(graphics)

function keyturn() {
	if (left.isDown){
		left.press()}
	if (right.isDown){
		right.press()}
	if (up.isDown){
		up.press()}
	if (down.isDown){
		down.press()}	
}

stage.addChild(world);

requestAnimationFrame( animate );

function animate() {
    requestAnimationFrame(animate);
	keyturn()
    renderer.render(stage);
}

function onDragStart(event) {
	event.stopPropagation();
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    var newPosition = this.data.getLocalPosition(this.parent)
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragStart2(event) {
	event.stopPropagation();
    this.data = event.data;
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    var newPosition = this.data.getLocalPosition(this.parent)
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragEnd2() { 
	this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent)
        this.position.x = Math.ceil(newPosition.x - this.myx);
        this.position.y = Math.ceil(newPosition.y - this.myy)
    }
}

function onDragMove2(){
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = Math.ceil(newPosition.x - this.myx * this.scale.x);
        this.position.y = Math.ceil(newPosition.y - this.myy * this.scale.y)
    }
}
