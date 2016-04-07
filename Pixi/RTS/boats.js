//load our sprites 
var texture = PIXI.Texture.fromImage('gray-circle.png');
var btexture = PIXI.Texture.fromImage('dot_blue.png');
var rtexture = PIXI.Texture.fromImage('red_dot.png');

//create a boat object
function Boat(xinit,yinit,color,team) {
	this.color = color
	this.x=xinit;
	this.y=yinit;
	
	//keep track of number of kills the boat has
	this.kills = 0;
	
	//how much damage the boat does
	this.damage = 10;
	
	//range of boat's weapon
	this.weprange = 50;
	
	//max angle the boat can fire its weapons(+/- 5 degrees in front)
	this.maxfireangle = 5;
	
	//boat health
	this.health = 100
	
	//coordinates of target 
	this.xdest = null;
	this.ydest = null;
	
	//max speed
	this.speed=20;
	
	//thrust
	this.thrust=3;
	this.mass=2;
	
	//starts facing upwards
	this.heading=90;
	
	//maximum turn rate
	this.turnrate = 1
	
	//rate of updates
	this.dt=0.01
	
	//old color var
	this.rgb = color || [myrandint(250),myrandint(250),myrandint(250)]
	
	//which team the boat is of incase of multiple factions
	this.team = team || 1
	
	//initialize target variable
	this.target = null
	
	//sets sprite based on team
	if (team == 1){
			this.graphics = new PIXI.Sprite(btexture);
	} else {
			this.graphics = new PIXI.Sprite(rtexture);		
	}
	//set position of boat's sprite to its position
	this.graphics.position.x = this.x
	this.graphics.position.y = this.y
	
	//add boats sprite to world
	world.addChild(this.graphics)
		
	//update position after one frame of movement
	this.updatePos=function() {
		this.x = this.x + Math.cos(this.heading * Math.PI/180) * this.speed * this.dt;
		this.y = this.y - Math.sin(this.heading * Math.PI/180) * this.speed * this.dt;
	}
	
	//update our knowledge of our targets position
	this.updateTargetPos=function(){
		if (this.target != null){
			this.setdest(this.target.x,this.target.y)
		} else {
			this.setdest(0,0)
		}
	}
	
	//function to set/change the target of our boat
	this.setTarget=function(tar){
		this.target = tar
		this.updateTargetPos()
	}
	
	//get distance from boat to target
	this.distToTarget=function(){
		return Math.sqrt(Math.pow(this.x - this.xdest,2)+ Math.pow(this.y - this.ydest,2))
	}
	
	//set destination of boat
	this.setdest=function(x,y){
		this.xdest = x;
		this.ydest = y;
	}
	
	//turn the boat
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
	

	//slowly lose speed if not thrusting
	this.updateVel=function() {
		this.speed = this.speed * .99;
	}
	
	//speed up
	this.acc=function() {
		this.speed += this.thrust/this.mass;
	}
	
	//update sprite position
	this.draw=function(){
		//this.graphics.moveTo(this.x,this.y)
		this.graphics.position.x = this.x
		this.graphics.position.y = this.y
	}
	
	
	//main function to run every frame
	this.oneStep=function(){
		this.acc()
		this.updateVel();
		this.updateTargetPos()	
		this.turn(ctx);
		this.updatePos();
		this.draw();
	}
	
	//fire at target if in range and in field of fire
	this.fire=function(){
		if (this.distToTarget() < this.weprange){
			var diff = (this.bearing - this.heading);
			if (diff > 180) {
				diff = Math.abs(diff-360);
			}
			else if (diff < -180) {
				diff +=360;
			}
			
			if (diff < this.maxfireangle){
				if (this.target != null){
					this.target.health -= this.damage
					console.log("firing")
					if (this.target.health <= 0){
						this.target.graphics.texture = texture
						this.kills += 1
						console.log("kill:" + this.kills)
					}
				}
				
			}
		}
	}
	
	//main function to run every frame - why do i have two of these? lol
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

//random int used in lots of stuff for boats
function myrandint(high){
	return Math.floor((Math.random() * high) + 1)
}

//get closest enemy to boat - this is bad and i shouldnt do this
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

//main function to demo two factions with 100 fighters each duking it out.  really shitty implementation
function twoTeams(){

	var redboats = 100
	var blueboats = 100
	var reds = []
	var blues = []
	var bluecounter = new PIXI.Text(blues.length, { font: '35px', fill: 'lightblue', align: 'left' });
	bluecounter.position.set(20,30);
	var redcounter = new PIXI.Text(reds.length, { font: '35px', fill: 'red', align: 'left' });
	redcounter.position.set(20,40);
	interface.addChild(bluecounter)
	interface.addChild(redcounter)
	//create redboats
	for (var i = 0; i < redboats; i++) { 
		reds[i] = new Boat(myrandint(600),100, 0xFF0000,1);
	}
	//create blueboats
	for (var i = 0; i < blueboats; i++) { 
		blues[i] = new Boat(myrandint(600),600,0x0000FF,2);
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
	var moveInterval = function(){
		bluecounter.text = blues.length
		redcounter.text = reds.length

		for (var i = 0; i < reds.length; i++) {	
			reds[i].oneStepFight()
		}  
		for (var i = 0; i < blues.length; i++) {	
			blues[i].oneStepFight()
		}
		
		
		for (var i = 0; i < blues.length; i++) {	
			if (blues[i].health <= 0){
				//blues[i].graphics.destroy()
				blues.splice(i,1)
			}
		}
		console.log(blues.length,reds.length)
		for (var i = 0; i < reds.length; i++) {	
			if (reds[i].health <= 0){
				//reds[i].graphics.destroy()
				reds.splice(i,1)
			}
		}
		
		for (var i = 0; i < blues.length; i++) {
				closestTarget(reds,blues[i])
		} 
		for (var i = 0; i < reds.length; i++) {
				closestTarget(blues,reds[i])
		} 
		
		count += 1
		setTimeout(moveInterval,10);
	};
	moveInterval()
	
	//var searchInterval = function(){
		//for (var i = 0; i < blues.length; i++) {
			//if (blues[i].target == null){
				//closestTarget(reds,blues[i])
			//}
		//} 
		//for (var i = 0; i < reds.length; i++) {
			//if (reds[i].target == null){
				//closestTarget(blues,reds[i])
			//}
		//} 
		//setTimeout(searchInterval,1000)
	//}
	//searchInterval()
} 



function Main(){
	twoTeams()
}
Main()

