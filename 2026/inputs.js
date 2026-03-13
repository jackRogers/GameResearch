
document.addEventListener("mousewheel", mouseWheelHandler, false);
document.addEventListener('DOMMouseScroll',mouseWheelHandler,false);

var SCALE_MIN = 0
var SCALE_MAX = 10

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

 var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
      space = keyboard(32)
 
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
  space.press = function() {
	  world.position.x = 100
	  world.position.y = 100
	  world.scale = new PIXI.Point(1,1)
	  

	  }
	  
