// Code goes here
var stage = new PIXI.Container();
stage.scale.x = 10;
stage.scale.y = 10;
var canvas = document.getElementById('canvas');
var renderer = PIXI.autoDetectRenderer(1920, 1080, {view:canvas});
var g = new PIXI.Graphics();


requestAnimationFrame(animate);


function animate() {
  requestAnimationFrame(
    animate);
  renderer.render(stage);
}

function zoom(s,x,y){
 
  s = s > 0 ? 2 : 0.5;
  var worldPos = {x: (x - stage.x) / stage.scale.x, y: (y - stage.y)/stage.scale.y};
  var newScale = {x: stage.scale.x * s, y: stage.scale.y * s};
  
  var newScreenPos = {x: (worldPos.x ) * newScale.x + stage.x, y: (worldPos.y) * newScale.y + stage.y};

  stage.x -= (newScreenPos.x-x) ;
  stage.y -= (newScreenPos.y-y) ;
  stage.scale.x = newScale.x;
  stage.scale.y = newScale.y;
  
};

var lastPos = null
$(canvas)
  .mousewheel(function(e){
  zoom(e.deltaY, e.offsetX, e.offsetY)
}).mousedown(function(e) {
  lastPos = {x:e.offsetX,y:e.offsetY};
}).mouseup(function(event) {
  lastPos = null;
}).mousemove(function(e){
  if(lastPos) {
    
    stage.x += (e.offsetX-lastPos.x);
    stage.y += (e.offsetY-lastPos.y);  
    lastPos = {x:e.offsetX,y:e.offsetY};
  }
  
});



var texture = PIXI.Texture.fromImage('bunny.png');

for (var i = 0; i < 10; i++)
{
    createBunny(Math.floor(Math.random() * 800) , Math.floor(Math.random() * 600));
}

function createBunny(x, y)
{
    // create our little bunny friend..
    var bunny = new PIXI.Sprite(texture);

    // enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    bunny.interactive = true;

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    // center the bunny's anchor point
    bunny.anchor.set(0.5);

    // make it a bit bigger, so it's easier to grab
    bunny.scale.set(3);

    // setup events
    bunny
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);

    // move the sprite to its designated position
    bunny.position.x = x;
    bunny.position.y = y;

    // add it to the stage
    stage.addChild(bunny);
}

requestAnimationFrame( animate );

function animate() {

    requestAnimationFrame(animate);

    // render the stage
    renderer.render(stage);
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = Math.ceil(newPosition.x);
        this.position.y = Math.ceil(newPosition.y);
    }
}
