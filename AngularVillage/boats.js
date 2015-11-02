function myrandint(high){
	return Math.floor((Math.random() * high) + 1)
}
	
function Boat(xinit,yinit,color,team) {

	this.x=xinit;
	this.y=yinit;
	this.kills = 0;
	this.damage = 10;
	this.weprange = 50;
	this.maxfireangle = 5;
	this.health = 100
	this.xdest = null;
	this.ydest = null;
	this.speed=20;
	this.thrust=3;
	this.mass=2;
	this.heading=90;
	this.turnrate = 1
	this.dt=0.01
	this.rgb = color || [myrandint(250),myrandint(250),myrandint(250)]
	this.team = team || 1
	this.target = null
	
	this.updatePos=function() {
		this.x = this.x + Math.cos(this.heading * Math.PI/180) * this.speed * this.dt;
		this.y = this.y - Math.sin(this.heading * Math.PI/180) * this.speed * this.dt;
	}
	
	this.updateTargetPos=function(){
		this.setdest(this.target.x,this.target.y)
	}
	
	this.setTarget=function(tar){
		this.target = tar
		this.updateTargetPos()
	}
	
	this.distToTarget=function(){
		return Math.sqrt(Math.pow(this.x - this.xdest,2)+ Math.pow(this.y - this.ydest,2))
	}
	
	this.setdest=function(x,y){
		this.xdest = x;
		this.ydest = y;
	}
	
	this.turn=function(ctx) {
		if (this.xdest == null){ 
			lol=1;
		} else {
			if (this.y < this.ydest){
				var myvar = 180;
			} else {
				var myvar = 0;
			}
			this.bearing = (Math.atan((this.x - this.xdest) / (this.y - this.ydest )) * 180 / Math.PI)+90 + myvar;
			if (this.bearing > this.heading){
				if (this.bearing > this.heading + 180){
					this.heading -= this.turnrate
				} else {
					this.heading += this.turnrate
				}
			} else {
				if (this.heading - 180 > this.bearing){
					this.heading += this.turnrate
				} else {
					this.heading -= this.turnrate
				}
			}
					
		this.heading = this.heading % 360;
		if (this.heading <= 0) {this.heading += 360}
		
	}
}
	

	
	this.updateVel=function() {
		this.speed = this.speed * .99;
	}
	
	this.acc=function() {
		this.speed += this.thrust/this.mass;
	}
	
	this.draw=function(canvas,ctx){
		ctx.fillStyle = "rgba("+this.rgb[0]+", "+this.rgb[1]+", "+this.rgb[2]+", 0.5)";
		ctx.fillRect (this.x, this.y, 10, 10);
	}

	this.oneStep=function(canvas,ctx){
		this.acc()
		this.updateVel();
		this.updateTargetPos()	
		this.turn(ctx);
		this.updatePos();
		this.draw(canvas,ctx);
	}
	
	this.fire=function(canvas,ctx){
		if (this.distToTarget() < this.weprange){
			if (Math.abs(this.bearing - this.heading) < this.maxfireangle){
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(this.xdest,this.ydest);
				ctx.stroke();
				this.target.health -= this.damage
				console.log("firing")
				if (this.target.health <= 0){
					this.target = null
					this.kills += 1
					console.log("kill:" + this.kills)
				}
			}
		}
	}
	
	this.oneStepFight=function(canvas,ctx){
		this.acc()
		this.updateVel();
		this.updateTargetPos()	
		this.turn(ctx);
		this.updatePos();
		this.fire(canvas,ctx);
		this.draw(canvas,ctx);
	}
}


function redraw(ctx,canvas){
	// Clear the entire canvas
	var p1 = ctx.transformedPoint(0,0);
	var p2 = ctx.transformedPoint(canvas.width,canvas.height);
	ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

	// Alternatively:
	// ctx.save();
	// ctx.setTransform(1,0,0,1,0,0);
	// ctx.clearRect(0,0,canvas.width,canvas.height);
	// ctx.restore();
}
		
function trackTransforms(ctx){
	var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
	var xform = svg.createSVGMatrix();
	ctx.getTransform = function(){ return xform; };
	
	var savedTransforms = [];
	var save = ctx.save;
	ctx.save = function(){
		savedTransforms.push(xform.translate(0,0));
		return save.call(ctx);
	};
	var restore = ctx.restore;
	ctx.restore = function(){
		xform = savedTransforms.pop();
		return restore.call(ctx);
	};

	var scale = ctx.scale;
	ctx.scale = function(sx,sy){
		xform = xform.scaleNonUniform(sx,sy);
		return scale.call(ctx,sx,sy);
	};
	var rotate = ctx.rotate;
	ctx.rotate = function(radians){
		xform = xform.rotate(radians*180/Math.PI);
		return rotate.call(ctx,radians);
	};
	var translate = ctx.translate;
	ctx.translate = function(dx,dy){
		xform = xform.translate(dx,dy);
		return translate.call(ctx,dx,dy);
	};
	var transform = ctx.transform;
	ctx.transform = function(a,b,c,d,e,f){
		var m2 = svg.createSVGMatrix();
		m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
		xform = xform.multiply(m2);
		return transform.call(ctx,a,b,c,d,e,f);
	};
	var setTransform = ctx.setTransform;
	ctx.setTransform = function(a,b,c,d,e,f){
		xform.a = a;
		xform.b = b;
		xform.c = c;
		xform.d = d;
		xform.e = e;
		xform.f = f;
		return setTransform.call(ctx,a,b,c,d,e,f);
	};
	var pt  = svg.createSVGPoint();
	ctx.transformedPoint = function(x,y){
		pt.x=x; pt.y=y;
		return pt.matrixTransform(xform.inverse());
	}
}

function fullScreenCanvasSetup(ctx,canvas){
	canvas.width = document.body.clientWidth; //document.width is obsolete
	canvas.height = document.body.clientHeight; //document.height is obsolete
	canvasW = canvas.width;
	canvasH = canvas.height;
	trackTransforms(ctx,canvas);
	redraw(ctx,canvas);
	var lastX=canvas.width/2, lastY=canvas.height/2;
	var dragStart,dragged;
	canvas.addEventListener('mousedown',function(evt){
		document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragStart = ctx.transformedPoint(lastX,lastY);
		dragged = false;
	},false);
	canvas.addEventListener('mousemove',function(evt){
		lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
		lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
		dragged = true;
		if (dragStart){
			var pt = ctx.transformedPoint(lastX,lastY);
			ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
			redraw(ctx,canvas);
		}
	},false);
	canvas.addEventListener('mouseup',function(evt){
		dragStart = null;
		if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
	},false);

	var scaleFactor = 1.1;
	var zoom = function(clicks){
		var pt = ctx.transformedPoint(lastX,lastY);
		ctx.translate(pt.x,pt.y);
		var factor = Math.pow(scaleFactor,clicks);
		ctx.scale(factor,factor);
		ctx.translate(-pt.x,-pt.y);
		redraw(ctx,canvas);
	}

	var handleScroll = function(evt){
		var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
		if (delta) zoom(delta);
		return evt.preventDefault() && false;
	};
	canvas.addEventListener('DOMMouseScroll',handleScroll,false);
	canvas.addEventListener('mousewheel',handleScroll,false);
}

function snakedemo(maxx,maxy,ctx,canvas){
	var boats = []
	var numboats = 1000
	//create boats
	for (var i = 0; i < numboats; i++) { 
		boats[i] = new Boat(myrandint(maxx),myrandint(maxy));
	}
	//give all boats a target to follow
	for (var j = 1; j < boats.length; j++) {
		boats[j].setTarget(boats[j-1])	
	} 
	boats[0].setTarget(boats[boats.length-1])	
	
	var count = 0;
	//move all the boats every 50ms
	var moveInterval = setInterval(function(){
		redraw(ctx,canvas)
		document.getElementById("p1").innerHTML = "&nbspNumber of Squares: " + boats.length;
		document.getElementById("p2").innerHTML = "&nbspIterations " + count;
		for (var i = 0; i < numboats; i++) {	
			boats[i].oneStep(canvas,ctx)
		} 
		count += 1
	}, 10);
}

function randomfollow(maxx,maxy,ctx,canvas){
	var boats = []
	var numboats = 1000
	//create boats
	for (var i = 0; i < numboats; i++) { 
		boats[i] = new Boat(myrandint(maxx),myrandint(maxy));
	}
	//give all boats a target to follow
	for (var j = 0; j < boats.length; j++) {
		boats[j].setTarget(boats[myrandint(boats.length-1)])	
	} 
	
	var count = 0;
	//move all the boats every 50ms
	var moveInterval = setInterval(function(){
		redraw(ctx,canvas)
		document.getElementById("p1").innerHTML = "&nbspNumber of Squares: " + boats.length;
		document.getElementById("p2").innerHTML = "&nbspIterations " + count;
		for (var i = 0; i < numboats; i++) {	
			boats[i].oneStep(canvas,ctx)
		} 
		count += 1
	}, 10);
}

function randomfight(maxx,maxy,ctx,canvas){
	var boats = []
	var numboats = 1000
	//create boats
	for (var i = 0; i < numboats; i++) { 
		boats[i] = new Boat(myrandint(maxx),myrandint(maxy));
	}
	//give all boats a target to follow
	for (var j = 0; j < boats.length; j++) {
		boats[j].setTarget(boats[myrandint(boats.length-1)])	
	} 
	
	var count = 0;
	//move all the boats every 50ms
	var moveInterval = setInterval(function(){
		redraw(ctx,canvas)
		document.getElementById("p1").innerHTML = "&nbspNumber of Squares: " + boats.length;
		document.getElementById("p2").innerHTML = "&nbspIterations " + count;
		for (var i = 0; i < boats.length; i++) {	
			boats[i].oneStepFight(canvas,ctx)
		} 
		for (var i = 0; i < boats.length; i++) {	
			if (boats[i].health <= 0){
				boats.splice(i,1)
			}
			if (boats[i].target == null){
				boats[i].setTarget(boats[myrandint(boats.length-1)])
			}
		} 
		count += 1
	}, 10);
}

function closestTarget(targetList,boat){
	closest = null
	closest_dist = Infinity 
	for (var i = 0; i < targetList.length; i++){
		var new_dist = Math.sqrt(Math.pow(boat.x - targetList[i].x,2)+ Math.pow(boat.y - targetList[i].y,2))
		if (new_dist < closest_dist){
			closest = targetList[i]
			closest_dist = new_dist
		}
	}
	boat.setTarget(closest)
}

function twoTeams(maxx,maxy,ctx,canvas){
	var redboats = 1000
	var blueboats = 1000
	var reds = []
	var blues = []
	//create redboats
	for (var i = 0; i < redboats; i++) { 
		reds[i] = new Boat(0,myrandint(maxy),[255,5,5],1);
	}
	//create blueboats
	for (var i = 0; i < blueboats; i++) { 
		blues[i] = new Boat(maxx,myrandint(maxy),[5,5,255],2);
	}
	//set initial targets
	for (var i = 0; i < blues.length; i++) {
			closestTarget(reds,blues[i])
	} 
	for (var i = 0; i < reds.length; i++) {
		closestTarget(blues,reds[i])
	} 
	var count = 0;
	//move all the boats every 50ms
	var moveInterval = setInterval(function(){
		redraw(ctx,canvas)
		document.getElementById("p1").innerHTML = "&nbspNumber of Blues: " + blues.length;
		document.getElementById("p2").innerHTML = "&nbspNumber of Reds: " + reds.length;
		document.getElementById("p3").innerHTML = "&nbspIterations " + count;
		for (var i = 0; i < blues.length; i++) {	
			blues[i].oneStepFight(canvas,ctx)
		}
		for (var i = 0; i < reds.length; i++) {	
			reds[i].oneStepFight(canvas,ctx)
		}  
		for (var i = 0; i < blues.length; i++) {	
			if (blues[i].health <= 0){
				blues.splice(i,1)
			}
		}
		for (var i = 0; i < reds.length; i++) {	
			if (reds[i].health <= 0){
				reds.splice(i,1)
			}
		}
		for (var i = 0; i < blues.length; i++) {
			closestTarget(reds,blues[i])
		} 
		for (var i = 0; i < reds.length; i++) {
			closestTarget(blues,reds[i])
		} 
		//for (var i = 0; i < blues.length; i++) {
			//if (blues[i].target == null){
				//blues[i].setTarget(reds[myrandint(reds.length-1)])
			//}
		//} 
		//for (var i = 0; i < reds.length; i++) {	
			//if (reds[i].target == null){
				//reds[i].setTarget(blues[myrandint(blues.length-1)])
			//}
		//} 
		count += 1
	}, 10);
} 


function Main(){
	//canvas
	var canvas = document.getElementById('tutorial');
	var ctx = canvas.getContext('2d');
	canvas.width = document.body.clientWidth; //document.width is obsolete
	canvas.height = document.body.clientHeight; //document.height is obsolete
	canvasW = canvas.width;
	canvasH = canvas.height;
	fullScreenCanvasSetup(ctx,canvas)
	//scenario
	var maxx=canvasW
	var maxy=canvasH
	
	//scenarios 
	//snakedemo(maxx,maxy,ctx,canvas)
	//randomfollow(maxx,maxy,ctx,canvas)
	//randomfight(maxx,maxy,ctx,canvas)
	twoTeams(maxx,maxy,ctx,canvas)
} 

