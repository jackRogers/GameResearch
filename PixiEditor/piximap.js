//find our canvas object on the page - maybe we can override the size here and keep it updated as the window size changes?
var canvas = document.getElementById('canvas');

//initialize our renderer and tell it to display on our canvas object - probably dont need to define width and height anymore as this was from before we set the size of the canvas in index.html
var renderer = PIXI.autoDetectRenderer(document.body.clientWidth-25, document.body.clientHeight-25, {view:canvas});

//once again, not sure if we need this after telling the renderer to put the view on the canvas
document.body.appendChild(renderer.view);

//initialize a container for EVERYTHING thats goign to be displayed
var stage = new PIXI.Container();

//this is probably unnessecary since stage doesn't rely on any coordinate system
stage.width = document.body.clientWidth;
stage.height = document.body.clientHeight;

//initialize a container for our playable space.  Since this has a position relative to the stage, which is static, changing its position will make it seem like we are panning a camera
var world = new PIXI.Container();

//yeah display it - really only displaying the children of the container
world.visible = true;

//make the cursor into the little hand thing 
world.buttonMode = true;

//not sure what this one does
world.render = true;

//make our world clickable - we need this so we can click and drag on the stage.  Unfortunately we only seem to be able to click on graphics objects we add as children to the world object
world.interactive = true;

//want to be able to see the top left corner of the map
world.position.x = 100;
world.position.y = 100;

//world dimensions are pretty arbitrary as 
world.width = 800;
world.height = 600;

//initial zoom - means x axis is not scaled and y axis is not scaled - god help anyone who only scales one or the other
world.scale = new PIXI.Point(1,1)

//associate functions with differnt mouse events relative to the world container - touch stuff not currently functional
world
	// events for clicking and holding on the world container
	.on('mousedown', onDragStart2)
	.on('touchstart', onDragStart2)
	
	// events for releasing the mouse after dragging the world container
	.on('mouseup', onDragEnd2)
	.on('mouseupoutside', onDragEnd2)
	.on('touchend', onDragEnd2)
	.on('touchendoutside', onDragEnd2)
	
	// events for updating as we drag the world container
	.on('mousemove', onDragMove2)
	.on('touchmove', onDragMove2);

//we cant click or drag the world container for some reason, so we draw a bunch of giant rectangles with no border so it looks like its just the background
//may eventually use this as large scale a coordinate grid so we can check for entities in the same square or adjacent squares to save processing time
var graphics = new PIXI.Graphics();

for (var x = -100000; x < 200000; x+=5000){
	for (var y = -100000; y < 200000; y +=5000){
		//no borders or outlines - 0 width
		graphics.lineStyle(0);
		
		//set color and opacity
		graphics.beginFill(0xFFFFFF, 0.5);
		
		//set position of top-left corner, then width and height
		graphics.drawRect(x-0.5 ,y-0.5 ,5000,5000);
		
		//finish the rectangle - now ready to define a new one
		graphics.endFill();
	}
}

//adding our squares to the world
world.addChild(graphics)

//this funtion checks if any of our arrow keys are held down and runs their functions each frame if they are
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

//throw our world in our main stage container
stage.addChild(world);

//not exactly sure the pixi 'requestAnimationFrame' stuff works, but all the examples i've seen follow this format
requestAnimationFrame( animate );

//this is what we do each frame
function animate() {
    requestAnimationFrame(animate);
    //check for arrow keys being held down since it doesnt generate additional events
	keyturn()
	//rending the stage renders its children, so this will update our world and everythign on it
    renderer.render(stage);
}

//if we click and hold on a sprite
function onDragStart(event) {
	//dont click the shit under it
	event.stopPropagation();
	
	//remeber everythign about the click so we can refer to it later
    this.data = event.data;
    
    //figure out where on the sprite we clicked relative to its center
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    
    //figure out where we clicked relative to the world the sprite is on
    var newPosition = this.data.getLocalPosition(this.parent)
    
    //half transparent so we know were dragging it
    this.alpha = 0.5;
    
    //dont forget you are being dragged
    this.dragging = true;
}

//same function as above but used for our world object which we dont want to make transparent
function onDragStart2(event) {
	event.stopPropagation();
    this.data = event.data;
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    var newPosition = this.data.getLocalPosition(this.parent)
    this.dragging = true;
}

//same as above but experimental version for grid tiling
function onDragStart3(event) {
	event.stopPropagation();
    this.data = event.data;
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    var newPosition = this.data.getLocalPosition(this.parent)
    this.dragging = true;
}

//if were dont dragging our sprite, make it fully opaque, forget our original mouseclick, and remember that were not dragging any more
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

//same as above function but for our world object
function onDragEnd2() { 
	this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

//same as above but experimental version for grid tiling
function onDragEnd3() { 
	this.alpha = 1;
    this.dragging = false;
    this.data = null;
}

//if our mouse is moving and our sprite thinks its being dragged, update its position relative to the world based on where on the sprite you clicked
function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent)
        this.position.x = Math.ceil(newPosition.x - this.myx);
        this.position.y = Math.ceil(newPosition.y - this.myy)
    }
}

//same as above except for the world object.  since the parent is our stage which has no position or scale, we need to multiply by our world scale 
//this can probably be done better, or we could just scale the stage instead of the world or something
function onDragMove2(){
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = Math.ceil(newPosition.x - this.myx * this.scale.x);
        this.position.y = Math.ceil(newPosition.y - this.myy * this.scale.y)
    }
}

//same as above but experimental version for grid tiling
function onDragMove3(){
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = Math.ceil(newPosition.x - this.myx);
        this.position.y = Math.ceil(newPosition.y - this.myy)
    }
}
