
var texture = PIXI.Texture.fromImage('gray-circle.png');
var btexture = PIXI.Texture.fromImage('dot_blue.png');
var rtexture = PIXI.Texture.fromImage('red_dot.png');

//same as above but experimental version for grid tiling
function onDragStart3(event) {
	event.stopPropagation();
	this.myclone = new PIXI.Sprite(this.texture)
	this.myclone.position.x = this.position.x
	this.myclone.position.y = this.position.y
	world.addChild(this.myclone)
    this.data = event.data;
    this.myclick = this.data.getLocalPosition(this)
    this.myx = this.myclick.x
    this.myy = this.myclick.y
    var newPosition = this.data.getLocalPosition(world)
    this.dragging = true;
}

//same as above but experimental version for grid tiling
function onDragEnd3() { 
	this.alpha = 1;
    this.dragging = false;
    this.data = null;
    this.myclone = null
}

//same as above but experimental version for grid tiling
function onDragMove3(){
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(world);
        this.myclone.position.x = Math.ceil(newPosition.x - this.myx);
        this.myclone.position.y = Math.ceil(newPosition.y - this.myy)
    }
}


//initialize a container to throw all our ui shit
var interface = new PIXI.Container();

//throw a title on there
var mytitle = new PIXI.Text('Pixi.js Game Engine Test', { font: '35px', fill: 'white', align: 'left' });
mytitle.position.set(20);
interface.addChild(mytitle)

//let people know what they can do
var instructions = new PIXI.Text('Arrows keys to Pan (or click and drag)\nMousewheel to Zoom\nSpacebar to reset position', { font: '35px', fill: 'white', align: 'left' });
instructions.position.set(20,50);
interface.addChild(instructions)
stage.addChild(interface)

//add a rectangle that we can throw buttons on
var toolbar = new PIXI.Container();

var toolbarbg = new PIXI.Graphics();
toolbarbg.lineStyle(0);
toolbarbg.beginFill(0xFFFFFF, 0.5);
toolbarbg.drawRect(20 ,100 ,50,200);
toolbarbg.endFill();

var block1 = new PIXI.Sprite(btexture)
block1.position.x = 30
block1.position.y = 110
block1.interactive = true
block1.buttonmode = true

var block2 = new PIXI.Sprite(rtexture)
block2.position.x = 30
block2.position.y = 140
block2.interactive = true
block2.buttonmode = true

var block3 = new PIXI.Sprite(texture)
block3.position.x = 30
block3.position.y = 170
block3.interactive = true
block3.buttonmode = true
toolbar.addChild(toolbarbg)

toolbar.addChild(block1)
toolbar.addChild(block2)
toolbar.addChild(block3)

for (var i = 0; i < toolbar.children.length; i++){
	block = toolbar.getChildAt(i)
	block
	.on('mousedown', onDragStart3)
	.on('touchstart', onDragStart3)
	
	// events for releasing the mouse after dragging the world container
	.on('mouseup', onDragEnd3)
	.on('mouseupoutside', onDragEnd3)
	.on('touchend', onDragEnd3)
	.on('touchendoutside', onDragEnd3)
	// events for updating as we drag the world container
	.on('mousemove', onDragMove3)
	.on('touchmove', onDragMove3);
}	

//block2
	//// events for clicking and holding on the world container
	//.on('mousedown', onDragStart3)
	//.on('touchstart', onDragStart3)
	
	//// events for releasing the mouse after dragging the world container
	//.on('mouseup', onDragEnd3)
	//.on('mouseupoutside', onDragEnd3)
	//.on('touchend', onDragEnd3)
	//.on('touchendoutside', onDragEnd3)
	
	//// events for updating as we drag the world container
	//.on('mousemove', onDragMove3)
	//.on('touchmove', onDragMove3);
	
//block3
	//// events for clicking and holding on the world container
	//.on('mousedown', onDragStart3)
	//.on('touchstart', onDragStart3)
	
	//// events for releasing the mouse after dragging the world container
	//.on('mouseup', onDragEnd3)
	//.on('mouseupoutside', onDragEnd3)
	//.on('touchend', onDragEnd3)
	//.on('touchendoutside', onDragEnd3)
	
	//// events for updating as we drag the world container
	//.on('mousemove', onDragMove3)
	//.on('touchmove', onDragMove3);
stage.addChild(toolbar)




