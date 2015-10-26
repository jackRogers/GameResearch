
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
	this.graphics = new PIXI.Graphics();
	world.addChild(this.graphics)
	this.graphics.lineStyle(0)
	this.graphics.beginFill(0xAAFF0B)
	this.graphics.drawCircle(this.x,this.y,this.mass)
	this.graphics.endFill()
		
	this.updatePos=function() {
		this.x = this.x + Math.cos(this.heading * Math.PI/180) * this.speed * this.dt;
		this.y = this.y - Math.sin(this.heading * Math.PI/180) * this.speed * this.dt;
	}
	
	this.updateTargetPos=function(){
		if (this.target != null){
		this.setdest(this.target.x,this.target.y)
	}
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
	
	this.draw=function(){
		this.graphics.moveTo(this.x,this.y)
		this.graphics.clear()
		this.graphics.lineStyle(0)
		this.graphics.beginFill(0xFFFF0B)
		this.graphics.drawCircle(this.x,this.y,this.mass)
		this.graphics.endFill()
		
	}

	this.oneStep=function(){
		this.acc()
		this.updateVel();
		this.updateTargetPos()	
		this.turn(ctx);
		this.updatePos();
		this.draw();
	}
	
	this.fire=function(){
		if (this.distToTarget() < this.weprange){
			if (Math.abs(this.bearing - this.heading) < this.maxfireangle){
				if (this.target != null){
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
	}
	
	this.oneStepFight=function(){
		this.acc()
		this.updateVel();
		this.updateTargetPos()	
		this.turn();
		this.updatePos();
		this.fire();
		this.draw();
	}
}


function myrandint(high){
	return Math.floor((Math.random() * high) + 1)
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

function twoTeams(){
	var redboats = 1000
	var blueboats = 1000
	var reds = []
	var blues = []
	//create redboats
	for (var i = 0; i < redboats; i++) { 
		reds[i] = new Boat(0,myrandint(600),[255,5,5],1);
	}
	//create blueboats
	for (var i = 0; i < blueboats; i++) { 
		blues[i] = new Boat(800,myrandint(600),[5,5,255],2);
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
		for (var i = 0; i < blues.length; i++) {	
			blues[i].oneStepFight()
		}
		for (var i = 0; i < reds.length; i++) {	
			reds[i].oneStepFight()
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

		count += 1
	}, 10);
	
	var searchInterval = setInterval(function(){
	for (var i = 0; i < blues.length; i++) {
			closestTarget(reds,blues[i])
		} 
		for (var i = 0; i < reds.length; i++) {
			closestTarget(blues,reds[i])
		} 
	}, 1000)
} 


function Main(){
	twoTeams()
}
Main()

