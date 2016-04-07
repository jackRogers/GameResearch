//Load in eventhandlers for mousewheel and keyboard

//look for chrome mousewheel events
document.addEventListener("mousewheel", mouseWheelHandler, false);

//look for firefox mousewheel events
document.addEventListener('DOMMouseScroll',mouseWheelHandler,false);

//set minimum and maximum allowable zoom - not currently used
var SCALE_MIN = 0
var SCALE_MAX = 10

//when we get a mousewheel event, try to zoom in relative to the position of the mouse.  Needs to be updated to handle firefox mousewheel events too, possibly need a function just for that
function mouseWheelHandler(e) {
	console.log(e)
	// cross-browser wheel delta
	var e = window.event || e;
	var delta = e.wheelDelta > 0 ? 1.1 : 0.9;
	var worldPos = {x: (e.pageX - world.x) / world.scale.x, y: (e.pageY - world.y)/world.scale.y}
	var newScale = {x: world.scale.x * delta, y: world.scale.y * delta}
	var newScreenPos = {x: (worldPos.x ) * newScale.x + world.x, y: (worldPos.y) * newScale.y + world.y}
	world.x -= (newScreenPos.x-e.pageX ) 
	world.y -= (newScreenPos.y-e.pageY ) 
	world.scale.x = newScale.x;
	world.scale.y = newScale.y;
	}

//this function lets us easily associate a keyboard event with a function or code
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false; 
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

//using the above function, we map arrow keys and space bars to variables. When pressed, it will execute the contents of our <keyname>.press functions defined below
 var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      space = keyboard(32),
      shift = keyboard(16)
 
 //move the camera in the direction of the pressed arrow key
  left.press = function() {
	  world.position.x += 10
  }
  right.press = function() {
	  world.position.x -= 10
  }
	up.press = function() {
	  world.position.y += 10
  }
  down.press = function() {
	  world.position.y -= 10
  }
  
  //if we get lost, we can press space to reinitialize the camera position and scale of the world objects
  space.press = function() {
	  world.position.x = 100
	  world.position.y = 100
	  world.scale = new PIXI.Point(1,1)
	  }
	  
