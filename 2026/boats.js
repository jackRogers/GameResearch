var battleTimer = null;
var scheduledTimeouts = [];
var activeBattle = null;
var battleIdCounter = 0;

var menuRoot = null;
var lastSetup = { red: 100, blue: 100 };

var hudElements = {};

function addTimedVisual(displayObject, lifetime, vx, vy, fadePerStep) {
	if (!activeBattle) {
		return;
	}
	activeBattle.visuals.push({
		display: displayObject,
		life: lifetime,
		vx: vx || 0,
		vy: vy || 0,
		fade: fadePerStep || 0
	});
}

function updateTimedVisuals(battle) {
	for (var i = battle.visuals.length - 1; i >= 0; i--) {
		var fx = battle.visuals[i];
		fx.life -= 1;
		if (fx.display) {
			fx.display.position.x += fx.vx;
			fx.display.position.y += fx.vy;
			fx.display.alpha = Math.max(0, fx.display.alpha - fx.fade);
		}

		if (fx.life <= 0 || !fx.display || !fx.display.parent) {
			if (fx.display && fx.display.parent) {
				fx.display.parent.removeChild(fx.display);
			}
			battle.visuals.splice(i, 1);
		}
	}
}

function spawnShotEffect(shooter, target, sourceX, sourceY, colorOverride) {
	if (!activeBattle) {
		return;
	}

	var shot = new PIXI.Graphics();
	var shotColor = colorOverride || teamColorFor(shooter.team);
	var fromX = typeof sourceX === 'number' ? sourceX : shooter.x;
	var fromY = typeof sourceY === 'number' ? sourceY : shooter.y;
	shot.lineStyle(2, shotColor, 0.95);
	shot.moveTo(fromX, fromY);
	shot.lineTo(target.x, target.y);
	shot.alpha = 0.9;
	world.addChild(shot);
	addTimedVisual(shot, 4, 0, 0, 0.22);

	var muzzle = new PIXI.Graphics();
	muzzle.beginFill(0xFFE8A3, 0.95);
	muzzle.drawCircle(0, 0, 3);
	muzzle.endFill();
	muzzle.position.set(fromX, fromY);
	world.addChild(muzzle);
	addTimedVisual(muzzle, 5, 0, 0, 0.18);
}

function spawnSmokeTrail(fighter) {
	if (!activeBattle) {
		return;
	}

	var smoke = new PIXI.Graphics();
	smoke.beginFill(0x3E434A, 0.55);
	smoke.drawCircle(0, 0, 2 + Math.random() * 2);
	smoke.endFill();

	var backAngle = (fighter.heading + 180) * Math.PI / 180;
	smoke.position.set(
		fighter.x + Math.cos(backAngle) * 6,
		fighter.y - Math.sin(backAngle) * 6
	);
	smoke.alpha = 0.55;
	world.addChild(smoke);
	addTimedVisual(smoke, 45, (Math.random() - 0.5) * 0.2, -0.2 - Math.random() * 0.2, 0.01);
}

function teamColorFor(team) {
	return team === 1 ? 0x1E5BFF : 0xFF3B30;
}

function defaultHeadingForTeam(team) {
	return team === 1 ? 90 : 270;
}

function normalizeAngle(deg) {
	var normalized = deg % 360;
	if (normalized < 0) {
		normalized += 360;
	}
	return normalized;
}

function shortestAngleDiff(targetDeg, currentDeg) {
	return ((targetDeg - currentDeg + 540) % 360) - 180;
}

function clearScheduledTimeouts() {
	if (battleTimer !== null) {
		clearTimeout(battleTimer);
		battleTimer = null;
	}

	for (var i = 0; i < scheduledTimeouts.length; i++) {
		clearTimeout(scheduledTimeouts[i]);
	}
	scheduledTimeouts = [];
}

function scheduleTimeout(fn, delayMs) {
	var timeoutId = setTimeout(function () {
		for (var i = 0; i < scheduledTimeouts.length; i++) {
			if (scheduledTimeouts[i] === timeoutId) {
				scheduledTimeouts.splice(i, 1);
				break;
			}
		}
		fn();
	}, delayMs);

	scheduledTimeouts.push(timeoutId);
	return timeoutId;
}

function createWreck(x, y, team, heading) {
	var wreck = new PIXI.Graphics();
	var teamColor = teamColorFor(team);

	wreck.beginFill(teamColor, 0.8);
	wreck.drawPolygon([4, -1, -6, -6, -3, 2]);
	wreck.endFill();

	wreck.beginFill(teamColor, 0.55);
	wreck.drawPolygon([-2, 6, 7, 2, 1, 10]);
	wreck.endFill();

	wreck.beginFill(0x151515, 0.9);
	wreck.drawCircle(0, 0, 2);
	wreck.endFill();

	wreck.position.x = x;
	wreck.position.y = y;
	wreck.rotation = -heading * Math.PI / 180;

	world.addChild(wreck);
}

function createCarrierWreck(x, y, team) {
	var wreck = new PIXI.Graphics();
	var teamColor = teamColorFor(team);

	wreck.beginFill(teamColor, 0.85);
	wreck.drawPolygon([-22, -10, 26, -4, 5, 8]);
	wreck.endFill();

	wreck.beginFill(teamColor, 0.6);
	wreck.drawPolygon([-16, 12, 18, 14, -2, 28]);
	wreck.endFill();

	wreck.beginFill(0x111111, 0.95);
	wreck.drawCircle(0, 0, 7);
	wreck.endFill();

	wreck.position.set(x, y);
	world.addChild(wreck);
}

function clearHud() {
	for (var key in hudElements) {
		if (hudElements.hasOwnProperty(key) && hudElements[key] && hudElements[key].parent) {
			hudElements[key].parent.removeChild(hudElements[key]);
		}
	}
	hudElements = {};
}

function createHud(modeName, showCarrierHealth) {
	clearHud();

	var hudX = Math.max(16, renderer.width - 280);
	var hudY = 10;

	hudElements.background = new PIXI.Graphics();
	hudElements.background.beginFill(0x10161F, 0.55);
	hudElements.background.drawRoundedRect(hudX, hudY, 264, showCarrierHealth ? 196 : 118, 8);
	hudElements.background.endFill();
	interface.addChild(hudElements.background);

	hudElements.mode = new PIXI.Text('Mode: ' + modeName, { font: '18px Verdana', fill: '#f2f7ff', align: 'left' });
	hudElements.mode.position.set(hudX + 10, hudY + 8);
	interface.addChild(hudElements.mode);

	hudElements.blue = new PIXI.Text('Blue fighters: 0', { font: '18px Verdana', fill: '#78B5FF', align: 'left' });
	hudElements.blue.position.set(hudX + 10, hudY + 40);
	interface.addChild(hudElements.blue);

	hudElements.red = new PIXI.Text('Red fighters: 0', { font: '18px Verdana', fill: '#FF8A80', align: 'left' });
	hudElements.red.position.set(hudX + 10, hudY + 66);
	interface.addChild(hudElements.red);

	if (showCarrierHealth) {
		hudElements.blueCarrier = new PIXI.Text('Blue carrier HP: 0', { font: '17px Verdana', fill: '#9BC7FF', align: 'left' });
		hudElements.blueCarrier.position.set(hudX + 10, hudY + 102);
		interface.addChild(hudElements.blueCarrier);

		hudElements.redCarrier = new PIXI.Text('Red carrier HP: 0', { font: '17px Verdana', fill: '#FFAEA8', align: 'left' });
		hudElements.redCarrier.position.set(hudX + 10, hudY + 128);
		interface.addChild(hudElements.redCarrier);

		hudElements.blueBombers = new PIXI.Text('Blue bombers: 0', { font: '17px Verdana', fill: '#9BC7FF', align: 'left' });
		hudElements.blueBombers.position.set(hudX + 10, hudY + 154);
		interface.addChild(hudElements.blueBombers);

		hudElements.redBombers = new PIXI.Text('Red bombers: 0', { font: '17px Verdana', fill: '#FFAEA8', align: 'left' });
		hudElements.redBombers.position.set(hudX + 10, hudY + 176);
		interface.addChild(hudElements.redBombers);
	}
}

function updateHud(battle) {
	if (!hudElements.blue || !hudElements.red) {
		return;
	}

	hudElements.blue.text = 'Blue fighters: ' + battle.blueTeam.fighters.length;
	hudElements.red.text = 'Red fighters: ' + battle.redTeam.fighters.length;

	if (battle.mode === 'carriers' && hudElements.blueCarrier && hudElements.redCarrier) {
		hudElements.blueCarrier.text = 'Blue carrier HP: ' + Math.max(0, Math.ceil(battle.blueTeam.carrier.health));
		hudElements.redCarrier.text = 'Red carrier HP: ' + Math.max(0, Math.ceil(battle.redTeam.carrier.health));
		if (hudElements.blueBombers && hudElements.redBombers) {
			hudElements.blueBombers.text = 'Blue bombers: ' + (battle.blueTeam.bombers ? battle.blueTeam.bombers.length : 0);
			hudElements.redBombers.text = 'Red bombers: ' + (battle.redTeam.bombers ? battle.redTeam.bombers.length : 0);
		}
	}
}

function clearBattlefield() {
	clearScheduledTimeouts();
	if (activeBattle && activeBattle.visuals) {
		for (var i = activeBattle.visuals.length - 1; i >= 0; i--) {
			if (activeBattle.visuals[i].display && activeBattle.visuals[i].display.parent) {
				activeBattle.visuals[i].display.parent.removeChild(activeBattle.visuals[i].display);
			}
		}
	}
	activeBattle = null;

	for (var i = world.children.length - 1; i >= 0; i--) {
		if (world.children[i] !== graphics) {
			world.removeChild(world.children[i]);
		}
	}

	clearHud();
}

function ensureMenuRoot() {
	if (menuRoot) {
		return;
	}

	menuRoot = document.createElement('div');
	menuRoot.style.position = 'fixed';
	menuRoot.style.top = '0';
	menuRoot.style.left = '0';
	menuRoot.style.right = '0';
	menuRoot.style.bottom = '0';
	menuRoot.style.display = 'flex';
	menuRoot.style.alignItems = 'center';
	menuRoot.style.justifyContent = 'center';
	menuRoot.style.background = 'rgba(8, 10, 14, 0.72)';
	menuRoot.style.zIndex = '999';
	document.body.appendChild(menuRoot);
}

function showStartMenu() {
	clearBattlefield();
	ensureMenuRoot();
	menuRoot.style.display = 'flex';

	menuRoot.innerHTML = '' +
		'<div style="width:420px;max-width:92vw;padding:22px 24px;border-radius:10px;' +
		'background:#12161d;color:#e9eef7;font-family:Verdana,sans-serif;box-shadow:0 18px 46px rgba(0,0,0,0.45);">' +
		'<h2 style="margin:0 0 12px;font-size:28px;">Pixi Boats</h2>' +
		'<div style="margin:0 0 14px;opacity:0.9;">Choose a game mode:</div>' +
		'<div style="padding:12px;border:1px solid #2f3f57;border-radius:8px;margin-bottom:12px;">' +
		'<div style="font-size:17px;margin-bottom:10px;"><strong>Standard Battle</strong></div>' +
		'<label style="display:block;margin-bottom:9px;">Blue team ships' +
		'<input id="blue-count" type="number" min="1" max="1000" value="' + lastSetup.blue + '" ' +
		'style="display:block;margin-top:6px;width:100%;padding:7px;border:1px solid #2f3f57;border-radius:6px;background:#0c1118;color:#eef4ff;">' +
		'</label>' +
		'<label style="display:block;margin-bottom:10px;">Red team ships' +
		'<input id="red-count" type="number" min="1" max="1000" value="' + lastSetup.red + '" ' +
		'style="display:block;margin-top:6px;width:100%;padding:7px;border:1px solid #2f3f57;border-radius:6px;background:#0c1118;color:#eef4ff;">' +
		'</label>' +
		'<button id="start-standard" style="width:100%;padding:10px 12px;border:0;border-radius:7px;' +
		'background:#2f74ff;color:#ffffff;font-size:15px;cursor:pointer;">Start Standard Battle</button>' +
		'</div>' +
		'<div style="padding:12px;border:1px solid #2f3f57;border-radius:8px;">' +
		'<div style="font-size:17px;margin-bottom:10px;"><strong>Carriers</strong></div>' +
		'<div style="font-size:14px;opacity:0.85;line-height:1.4;margin-bottom:10px;">Each side has one carrier that launches up to 10 fighters, one per second.</div>' +
		'<button id="start-carriers" style="width:100%;padding:10px 12px;border:0;border-radius:7px;' +
		'background:#E4572E;color:#ffffff;font-size:15px;cursor:pointer;">Start Carriers</button>' +
		'</div>' +
		'</div>';

	document.getElementById('start-standard').onclick = function () {
		var blueValue = parseInt(document.getElementById('blue-count').value, 10);
		var redValue = parseInt(document.getElementById('red-count').value, 10);

		if (!isFinite(blueValue) || blueValue < 1) {
			blueValue = 100;
		}
		if (!isFinite(redValue) || redValue < 1) {
			redValue = 100;
		}

		lastSetup.blue = blueValue;
		lastSetup.red = redValue;
		startStandardBattle(redValue, blueValue);
	};

	document.getElementById('start-carriers').onclick = function () {
		startCarriersBattle();
	};
}

function showResults(result) {
	ensureMenuRoot();
	menuRoot.style.display = 'flex';

	menuRoot.innerHTML = '' +
		'<div style="width:420px;max-width:92vw;padding:22px 24px;border-radius:10px;' +
		'background:#12161d;color:#e9eef7;font-family:Verdana,sans-serif;box-shadow:0 18px 46px rgba(0,0,0,0.45);">' +
		'<h2 style="margin:0 0 6px;font-size:28px;">Battle Results</h2>' +
		'<div style="margin-bottom:14px;opacity:0.9;">Mode: <strong>' + result.modeLabel + '</strong></div>' +
		'<div style="margin-bottom:8px;">Winner: <strong>' + result.winner + '</strong></div>' +
		'<div style="margin-bottom:6px;">Blue fighters remaining: <strong>' + result.survivingBlue + '</strong> / ' + result.initialBlue + '</div>' +
		'<div style="margin-bottom:12px;">Red fighters remaining: <strong>' + result.survivingRed + '</strong> / ' + result.initialRed + '</div>' +
		(result.extraLine ? '<div style="margin-bottom:14px;opacity:0.9;">' + result.extraLine + '</div>' : '') +
		'<button id="back-menu" style="width:100%;padding:10px 12px;border:0;border-radius:7px;' +
		'background:#3a485f;color:#ffffff;font-size:16px;cursor:pointer;">Return to Start Menu</button>' +
		'</div>';

	document.getElementById('back-menu').onclick = function () {
		showStartMenu();
	};
}

function Fighter(xinit, yinit, team, onDestroyed) {
	this.x = xinit;
	this.y = yinit;
	this.team = team;
	this.onDestroyed = onDestroyed;

	this.health = 100;
	this.damage = 10;
	this.weprange = 50;
	this.maxfireangle = 5;
	this.speed = 20;
	this.thrust = 3;
	this.mass = 2;
	this.heading = defaultHeadingForTeam(team);
	this.turnrate = 1;
	this.dt = 0.01;

	this.target = null;
	this.xdest = null;
	this.ydest = null;
	this.bearing = this.heading;
	this.isDestroyed = false;
	this.smokeCooldown = 0;

	this.graphics = new PIXI.Graphics();
	this.graphics.beginFill(teamColorFor(team), 1);
	this.graphics.drawPolygon([10, 0, -8, -6, -8, 6]);
	this.graphics.endFill();
	this.graphics.position.x = this.x;
	this.graphics.position.y = this.y;
	world.addChild(this.graphics);
}

Fighter.prototype.setTarget = function (tar) {
	this.target = tar;
	if (this.target && !this.target.isDestroyed) {
		this.xdest = this.target.x;
		this.ydest = this.target.y;
	} else {
		this.xdest = null;
		this.ydest = null;
	}
};

Fighter.prototype.updateTargetPos = function () {
	if (this.target && !this.target.isDestroyed) {
		this.xdest = this.target.x;
		this.ydest = this.target.y;
	} else {
		this.xdest = null;
		this.ydest = null;
	}
};

Fighter.prototype.distToTarget = function () {
	if (this.xdest === null || this.ydest === null) {
		return Infinity;
	}
	return Math.sqrt(Math.pow(this.x - this.xdest, 2) + Math.pow(this.y - this.ydest, 2));
};

Fighter.prototype.turn = function () {
	if (this.xdest === null || this.ydest === null) {
		return;
	}

	var dx = this.xdest - this.x;
	var dy = this.y - this.ydest;
	var desiredHeading = Math.atan2(dy, dx) * 180 / Math.PI;
	if (desiredHeading < 0) {
		desiredHeading += 360;
	}

	var delta = ((desiredHeading - this.heading + 540) % 360) - 180;
	if (delta > this.turnrate) {
		delta = this.turnrate;
	} else if (delta < -this.turnrate) {
		delta = -this.turnrate;
	}

	this.heading = (this.heading + delta + 360) % 360;
	this.bearing = desiredHeading;
};

Fighter.prototype.updatePos = function () {
	this.x = this.x + Math.cos(this.heading * Math.PI / 180) * this.speed * this.dt;
	this.y = this.y - Math.sin(this.heading * Math.PI / 180) * this.speed * this.dt;
};

Fighter.prototype.updateVel = function () {
	this.speed = this.speed * 0.99;
};

Fighter.prototype.acc = function () {
	this.speed += this.thrust / this.mass;
};

Fighter.prototype.draw = function () {
	this.graphics.position.x = this.x;
	this.graphics.position.y = this.y;
	this.graphics.rotation = -this.heading * Math.PI / 180;
};

Fighter.prototype.takeDamage = function (amount) {
	if (this.isDestroyed) {
		return;
	}
	this.health -= amount;
	if (this.health <= 0) {
		this.destroyShip();
	}
};

Fighter.prototype.destroyShip = function () {
	if (this.isDestroyed) {
		return;
	}
	this.isDestroyed = true;
	createWreck(this.x, this.y, this.team, this.heading);
	if (this.graphics && this.graphics.parent) {
		this.graphics.parent.removeChild(this.graphics);
	}
	if (this.onDestroyed) {
		this.onDestroyed(this);
	}
};

Fighter.prototype.fire = function () {
	if (!this.target || this.target.isDestroyed) {
		return;
	}
	if (this.distToTarget() >= this.weprange) {
		return;
	}

	var diff = this.bearing - this.heading;
	if (diff > 180) {
		diff -= 360;
	}
	if (diff < -180) {
		diff += 360;
	}

	if (Math.abs(diff) <= this.maxfireangle && this.target.takeDamage) {
		spawnShotEffect(this, this.target);
		this.target.takeDamage(this.damage);
	}
};

Fighter.prototype.oneStepFight = function () {
	if (this.isDestroyed) {
		return;
	}
	this.acc();
	this.updateVel();
	this.updateTargetPos();
	this.turn();
	this.updatePos();
	this.fire();
	if (this.health <= 40) {
		if (this.smokeCooldown <= 0) {
			spawnSmokeTrail(this);
			this.smokeCooldown = 8;
		} else {
			this.smokeCooldown -= 1;
		}
	}
	this.draw();
};

function Bomber(xinit, yinit, team, onDestroyed) {
	this.x = xinit;
	this.y = yinit;
	this.team = team;
	this.onDestroyed = onDestroyed;

	this.health = 220;
	this.forwardDamage = 24;
	this.forwardRange = 85;
	this.forwardArc = 10;
	this.turretDamage = 6;
	this.turretRange = 125;
	this.turretTurnRate = 0.6;
	this.turretFireArc = 10;

	this.speed = 10;
	this.thrust = 1.4;
	this.mass = 2;
	this.heading = defaultHeadingForTeam(team);
	this.turnrate = 0.8;
	this.dt = 0.01;

	this.target = null;
	this.turretTarget = null;
	this.xdest = null;
	this.ydest = null;
	this.bearing = this.heading;
	this.turretHeading = this.heading;
	this.isDestroyed = false;
	this.smokeCooldown = 0;

	this.graphics = new PIXI.Container();
	this.body = new PIXI.Graphics();
	this.body.beginFill(teamColorFor(team), 0.95);
	this.body.drawRect(-9, -9, 18, 18);
	this.body.endFill();
	this.body.beginFill(0x0E141E, 0.95);
	this.body.drawPolygon([8, 0, 3, -4, 3, 4]);
	this.body.endFill();
	this.graphics.addChild(this.body);

	this.turret = new PIXI.Graphics();
	this.turret.beginFill(0xE9EDF4, 0.95);
	this.turret.drawRect(-2, -2, 12, 4);
	this.turret.endFill();
	this.graphics.addChild(this.turret);

	this.graphics.position.set(this.x, this.y);
	world.addChild(this.graphics);
}

Bomber.prototype.setTarget = function (tar) {
	this.target = tar;
	if (this.target && !this.target.isDestroyed) {
		this.xdest = this.target.x;
		this.ydest = this.target.y;
	} else {
		this.xdest = null;
		this.ydest = null;
	}
};

Bomber.prototype.setTurretTarget = function (tar) {
	this.turretTarget = tar;
};

Bomber.prototype.updateTargets = function () {
	if (this.target && !this.target.isDestroyed) {
		this.xdest = this.target.x;
		this.ydest = this.target.y;
	} else {
		this.xdest = null;
		this.ydest = null;
	}
	if (this.turretTarget && this.turretTarget.isDestroyed) {
		this.turretTarget = null;
	}
};

Bomber.prototype.turn = function () {
	if (this.xdest === null || this.ydest === null) {
		return;
	}

	var dx = this.xdest - this.x;
	var dy = this.y - this.ydest;
	var desiredHeading = normalizeAngle(Math.atan2(dy, dx) * 180 / Math.PI);
	var delta = shortestAngleDiff(desiredHeading, this.heading);
	if (delta > this.turnrate) {
		delta = this.turnrate;
	} else if (delta < -this.turnrate) {
		delta = -this.turnrate;
	}

	this.heading = normalizeAngle(this.heading + delta);
	this.bearing = desiredHeading;
};

Bomber.prototype.updateTurret = function () {
	if (!this.turretTarget || this.turretTarget.isDestroyed) {
		return;
	}

	var dx = this.turretTarget.x - this.x;
	var dy = this.y - this.turretTarget.y;
	var desiredHeading = normalizeAngle(Math.atan2(dy, dx) * 180 / Math.PI);
	var delta = shortestAngleDiff(desiredHeading, this.turretHeading);
	if (delta > this.turretTurnRate) {
		delta = this.turretTurnRate;
	} else if (delta < -this.turretTurnRate) {
		delta = -this.turretTurnRate;
	}

	this.turretHeading = normalizeAngle(this.turretHeading + delta);
	this.turret.rotation = (this.heading - this.turretHeading) * Math.PI / 180;
};

Bomber.prototype.updatePos = function () {
	this.x = this.x + Math.cos(this.heading * Math.PI / 180) * this.speed * this.dt;
	this.y = this.y - Math.sin(this.heading * Math.PI / 180) * this.speed * this.dt;
};

Bomber.prototype.updateVel = function () {
	this.speed = this.speed * 0.995;
};

Bomber.prototype.acc = function () {
	this.speed += this.thrust / this.mass;
};

Bomber.prototype.draw = function () {
	this.graphics.position.set(this.x, this.y);
	this.graphics.rotation = -this.heading * Math.PI / 180;
};

Bomber.prototype.takeDamage = function (amount) {
	if (this.isDestroyed) {
		return;
	}
	this.health -= amount;
	if (this.health <= 0) {
		this.destroyBomber();
	}
};

Bomber.prototype.destroyBomber = function () {
	if (this.isDestroyed) {
		return;
	}
	this.isDestroyed = true;
	createWreck(this.x, this.y, this.team, this.heading);
	if (this.graphics && this.graphics.parent) {
		this.graphics.parent.removeChild(this.graphics);
	}
	if (this.onDestroyed) {
		this.onDestroyed(this);
	}
};

Bomber.prototype.fireForward = function () {
	if (!this.target || this.target.isDestroyed) {
		return;
	}

	var dx = this.target.x - this.x;
	var dy = this.target.y - this.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist > this.forwardRange) {
		return;
	}

	var desiredHeading = normalizeAngle(Math.atan2(this.y - this.target.y, this.target.x - this.x) * 180 / Math.PI);
	var diff = shortestAngleDiff(desiredHeading, this.heading);
	if (Math.abs(diff) <= this.forwardArc && this.target.takeDamage) {
		spawnShotEffect(this, this.target, this.x, this.y, 0xFFD47C);
		this.target.takeDamage(this.forwardDamage);
	}
};

Bomber.prototype.fireTurret = function () {
	if (!this.turretTarget || this.turretTarget.isDestroyed) {
		return;
	}

	var dx = this.turretTarget.x - this.x;
	var dy = this.turretTarget.y - this.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist > this.turretRange) {
		return;
	}

	var desiredHeading = normalizeAngle(Math.atan2(this.y - this.turretTarget.y, this.turretTarget.x - this.x) * 180 / Math.PI);
	var diff = shortestAngleDiff(desiredHeading, this.turretHeading);
	if (Math.abs(diff) <= this.turretFireArc && this.turretTarget.takeDamage) {
		var turretWorldX = this.x + Math.cos(this.turretHeading * Math.PI / 180) * 8;
		var turretWorldY = this.y - Math.sin(this.turretHeading * Math.PI / 180) * 8;
		spawnShotEffect(this, this.turretTarget, turretWorldX, turretWorldY, 0xF2F5FA);
		this.turretTarget.takeDamage(this.turretDamage);
	}
};

Bomber.prototype.oneStepFight = function () {
	if (this.isDestroyed) {
		return;
	}
	this.acc();
	this.updateVel();
	this.updateTargets();
	this.turn();
	this.updateTurret();
	this.updatePos();
	this.fireForward();
	this.fireTurret();
	if (this.health <= 120) {
		if (this.smokeCooldown <= 0) {
			spawnSmokeTrail(this);
			this.smokeCooldown = 6;
		} else {
			this.smokeCooldown -= 1;
		}
	}
	this.draw();
};

function Carrier(x, y, team) {
	this.x = x;
	this.y = y;
	this.team = team;
	this.health = 12000;
	this.isDestroyed = false;
	this.turretHeading = team === 1 ? 90 : 270;
	this.turretTurnRate = 0.35;
	this.turretRange = 170;
	this.turretDamage = 7;
	this.turretFireArc = 9;
	this.turretTarget = null;

	this.graphics = new PIXI.Container();

	this.body = new PIXI.Graphics();
	this.body.beginFill(teamColorFor(team), 0.95);
	this.body.drawPolygon([0, -26, 42, 0, 0, 26, -42, 0]);
	this.body.endFill();
	this.body.beginFill(0x0E131A, 0.9);
	this.body.drawPolygon([0, -12, 18, 0, 0, 12, -18, 0]);
	this.body.endFill();
	this.graphics.addChild(this.body);

	this.turret = new PIXI.Graphics();
	this.turret.beginFill(0xECEFF6, 0.95);
	this.turret.drawRect(-3, -3, 20, 6);
	this.turret.endFill();
	this.graphics.addChild(this.turret);

	this.graphics.position.set(x, y);
	this.graphics.rotation = team === 1 ? -Math.PI / 2 : Math.PI / 2;
	this.hullHeading = defaultHeadingForTeam(team);

	world.addChild(this.graphics);
}

Carrier.prototype.setTurretTarget = function (target) {
	this.turretTarget = target;
};

Carrier.prototype.updateTurret = function () {
	if (this.isDestroyed) {
		return;
	}
	if (!this.turretTarget || this.turretTarget.isDestroyed) {
		return;
	}

	var dx = this.turretTarget.x - this.x;
	var dy = this.y - this.turretTarget.y;
	var desiredHeading = normalizeAngle(Math.atan2(dy, dx) * 180 / Math.PI);
	var delta = shortestAngleDiff(desiredHeading, this.turretHeading);
	if (delta > this.turretTurnRate) {
		delta = this.turretTurnRate;
	} else if (delta < -this.turretTurnRate) {
		delta = -this.turretTurnRate;
	}

	this.turretHeading = normalizeAngle(this.turretHeading + delta);
	this.turret.rotation = (this.hullHeading - this.turretHeading) * Math.PI / 180;
};

Carrier.prototype.fireTurret = function () {
	if (this.isDestroyed || !this.turretTarget || this.turretTarget.isDestroyed) {
		return;
	}

	var dx = this.turretTarget.x - this.x;
	var dy = this.turretTarget.y - this.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist > this.turretRange) {
		return;
	}

	var desiredHeading = normalizeAngle(Math.atan2(this.y - this.turretTarget.y, this.turretTarget.x - this.x) * 180 / Math.PI);
	var diff = shortestAngleDiff(desiredHeading, this.turretHeading);
	if (Math.abs(diff) <= this.turretFireArc && this.turretTarget.takeDamage) {
		var muzzleX = this.x + Math.cos(this.turretHeading * Math.PI / 180) * 16;
		var muzzleY = this.y - Math.sin(this.turretHeading * Math.PI / 180) * 16;
		spawnShotEffect(this, this.turretTarget, muzzleX, muzzleY, 0xE6EEF8);
		this.turretTarget.takeDamage(this.turretDamage);
	}
};

Carrier.prototype.takeDamage = function (amount) {
	if (this.isDestroyed) {
		return;
	}
	this.health -= amount;
	if (this.health <= 0) {
		this.destroyCarrier();
	}
};

Carrier.prototype.destroyCarrier = function () {
	if (this.isDestroyed) {
		return;
	}
	this.isDestroyed = true;
	createCarrierWreck(this.x, this.y, this.team);
	if (this.graphics && this.graphics.parent) {
		this.graphics.parent.removeChild(this.graphics);
	}
};

function removeFighterFromTeam(teamObj, fighter) {
	for (var i = teamObj.fighters.length - 1; i >= 0; i--) {
		if (teamObj.fighters[i] === fighter) {
			teamObj.fighters.splice(i, 1);
			return;
		}
	}
}

function removeBomberFromTeam(teamObj, bomber) {
	if (!teamObj.bombers) {
		return;
	}
	for (var i = teamObj.bombers.length - 1; i >= 0; i--) {
		if (teamObj.bombers[i] === bomber) {
			teamObj.bombers.splice(i, 1);
			return;
		}
	}
}

function processReplacementQueue(battleId, teamObj) {
	if (teamObj.replacementTimerActive) {
		return;
	}
	if (teamObj.replacementQueue <= 0) {
		return;
	}

	teamObj.replacementTimerActive = true;
	scheduleTimeout(function () {
		teamObj.replacementTimerActive = false;

		if (!activeBattle || activeBattle.id !== battleId) {
			return;
		}
		if (!teamObj.carrier || teamObj.carrier.isDestroyed) {
			return;
		}
		if (teamObj.fighters.length < teamObj.fighterCap) {
			launchFighterFromCarrier(battleId, teamObj);
		}

		if (teamObj.replacementQueue > 0) {
			teamObj.replacementQueue -= 1;
		}

		processReplacementQueue(battleId, teamObj);
	}, 10000);
}

function queueReplacementFighter(battleId, teamObj) {
	if (!teamObj || !teamObj.carrier) {
		return;
	}
	teamObj.replacementQueue += 1;
	processReplacementQueue(battleId, teamObj);
}

function makeFighterForTeam(battleId, teamObj, x, y) {
	var fighter = new Fighter(x, y, teamObj.id, function (destroyedFighter) {
		removeFighterFromTeam(teamObj, destroyedFighter);
		if (!activeBattle || activeBattle.id !== battleId) {
			return;
		}

		if (activeBattle.mode === 'carriers') {
			queueReplacementFighter(battleId, teamObj);
		}
	});

	teamObj.fighters.push(fighter);
	return fighter;
}

function makeBomberForTeam(battleId, teamObj, x, y) {
	if (!teamObj.bombers) {
		teamObj.bombers = [];
	}

	var bomber = new Bomber(x, y, teamObj.id, function (destroyedBomber) {
		removeBomberFromTeam(teamObj, destroyedBomber);
	});

	teamObj.bombers.push(bomber);
	return bomber;
}

function launchFighterFromCarrier(battleId, teamObj) {
	if (!activeBattle || activeBattle.id !== battleId) {
		return;
	}
	if (!teamObj.carrier || teamObj.carrier.isDestroyed) {
		return;
	}
	if (teamObj.fighters.length >= teamObj.fighterCap) {
		return;
	}

	var spreadX = Math.floor(Math.random() * 30) - 15;
	var spreadY = Math.floor(Math.random() * 20) - 10;
	var spawnY = teamObj.id === 1 ? teamObj.carrier.y - 26 : teamObj.carrier.y + 26;
	makeFighterForTeam(battleId, teamObj, teamObj.carrier.x + spreadX, spawnY + spreadY);
}

function launchBomberFromCarrier(battleId, teamObj) {
	if (!activeBattle || activeBattle.id !== battleId) {
		return;
	}
	if (!teamObj.carrier || teamObj.carrier.isDestroyed) {
		return;
	}
	if (!teamObj.bombers) {
		teamObj.bombers = [];
	}
	if (teamObj.bombers.length >= teamObj.bomberCap) {
		return;
	}

	var spreadX = Math.floor(Math.random() * 36) - 18;
	var spreadY = Math.floor(Math.random() * 24) - 12;
	var spawnY = teamObj.id === 1 ? teamObj.carrier.y - 34 : teamObj.carrier.y + 34;
	makeBomberForTeam(battleId, teamObj, teamObj.carrier.x + spreadX, spawnY + spreadY);
}

function nearestEntity(sourceEntity, entityList) {
	var closest = null;
	var closestDist = Infinity;

	for (var i = 0; i < entityList.length; i++) {
		if (entityList[i].isDestroyed) {
			continue;
		}
		var dx = sourceEntity.x - entityList[i].x;
		var dy = sourceEntity.y - entityList[i].y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < closestDist) {
			closest = entityList[i];
			closestDist = dist;
		}
	}

	return closest;
}

function assignTargetsForBattle(battle) {
	for (var i = 0; i < battle.blueTeam.fighters.length; i++) {
		assignTargetToFighter(battle, battle.blueTeam.fighters[i], battle.redTeam);
	}
	for (var j = 0; j < battle.redTeam.fighters.length; j++) {
		assignTargetToFighter(battle, battle.redTeam.fighters[j], battle.blueTeam);
	}

	if (battle.mode === 'carriers') {
		for (var b = 0; b < battle.blueTeam.bombers.length; b++) {
			assignTargetsToBomber(battle.blueTeam.bombers[b], battle.redTeam);
		}
		for (var r = 0; r < battle.redTeam.bombers.length; r++) {
			assignTargetsToBomber(battle.redTeam.bombers[r], battle.blueTeam);
		}

		assignCarrierTurretTarget(battle.blueTeam.carrier, battle.redTeam.fighters);
		assignCarrierTurretTarget(battle.redTeam.carrier, battle.blueTeam.fighters);
	}
}

function assignTargetsToBomber(bomber, enemyTeam) {
	if (bomber.isDestroyed) {
		bomber.setTarget(null);
		bomber.setTurretTarget(null);
		return;
	}

	if (enemyTeam.carrier && !enemyTeam.carrier.isDestroyed) {
		bomber.setTarget(enemyTeam.carrier);
	} else {
		bomber.setTarget(null);
	}

	var turretTarget = nearestEntity(bomber, enemyTeam.fighters);
	bomber.setTurretTarget(turretTarget);
}

function assignCarrierTurretTarget(carrier, enemyFighters) {
	if (!carrier || carrier.isDestroyed) {
		return;
	}
	carrier.setTurretTarget(nearestEntity(carrier, enemyFighters));
}

function assignTargetToFighter(battle, fighter, enemyTeam) {
	if (fighter.isDestroyed) {
		fighter.setTarget(null);
		return;
	}

	var priorityTarget = null;
	if (battle.mode === 'carriers' && enemyTeam.bombers && enemyTeam.bombers.length > 0) {
		priorityTarget = nearestEntity(fighter, enemyTeam.bombers);
	}

	if (priorityTarget) {
		fighter.setTarget(priorityTarget);
		return;
	}

	var fighterTarget = nearestEntity(fighter, enemyTeam.fighters);
	if (fighterTarget) {
		fighter.setTarget(fighterTarget);
		return;
	}

	if (battle.mode === 'carriers' && enemyTeam.carrier && !enemyTeam.carrier.isDestroyed) {
		fighter.setTarget(enemyTeam.carrier);
		return;
	}

	fighter.setTarget(null);
}

function runBattleLoop(battleId) {
	if (!activeBattle || activeBattle.id !== battleId) {
		return;
	}

	var battle = activeBattle;

	for (var i = 0; i < battle.blueTeam.fighters.length; i++) {
		battle.blueTeam.fighters[i].oneStepFight();
	}
	for (var j = 0; j < battle.redTeam.fighters.length; j++) {
		battle.redTeam.fighters[j].oneStepFight();
	}

	if (battle.mode === 'carriers') {
		for (var b = 0; b < battle.blueTeam.bombers.length; b++) {
			battle.blueTeam.bombers[b].oneStepFight();
		}
		for (var r = 0; r < battle.redTeam.bombers.length; r++) {
			battle.redTeam.bombers[r].oneStepFight();
		}

		battle.blueTeam.carrier.updateTurret();
		battle.redTeam.carrier.updateTurret();
		battle.blueTeam.carrier.fireTurret();
		battle.redTeam.carrier.fireTurret();
	}

	assignTargetsForBattle(battle);
	updateTimedVisuals(battle);
	updateHud(battle);

	if (battle.mode === 'standard') {
		if (battle.blueTeam.fighters.length === 0 || battle.redTeam.fighters.length === 0) {
			finishBattle({
				modeLabel: 'Standard Battle',
				initialBlue: battle.initialBlue,
				initialRed: battle.initialRed,
				survivingBlue: battle.blueTeam.fighters.length,
				survivingRed: battle.redTeam.fighters.length,
				winner: battle.blueTeam.fighters.length > battle.redTeam.fighters.length ? 'Blue team' : (battle.redTeam.fighters.length > battle.blueTeam.fighters.length ? 'Red team' : 'Draw'),
				extraLine: ''
			});
			return;
		}
	}

	if (battle.mode === 'carriers') {
		var blueDestroyed = battle.blueTeam.carrier.isDestroyed;
		var redDestroyed = battle.redTeam.carrier.isDestroyed;

		if (blueDestroyed || redDestroyed) {
			var winner = 'Draw';
			if (redDestroyed && !blueDestroyed) {
				winner = 'Blue team';
			} else if (blueDestroyed && !redDestroyed) {
				winner = 'Red team';
			}

			finishBattle({
				modeLabel: 'Carriers',
				initialBlue: battle.initialBlue,
				initialRed: battle.initialRed,
				survivingBlue: battle.blueTeam.fighters.length,
				survivingRed: battle.redTeam.fighters.length,
				winner: winner,
				extraLine: 'Blue carrier HP: ' + Math.max(0, Math.ceil(battle.blueTeam.carrier.health)) + ' | Red carrier HP: ' + Math.max(0, Math.ceil(battle.redTeam.carrier.health))
			});
			return;
		}
	}

	battleTimer = scheduleTimeout(function () {
		runBattleLoop(battleId);
	}, 10);
}

function finishBattle(result) {
	clearScheduledTimeouts();
	activeBattle = null;
	showResults(result);
}

function startStandardBattle(redCount, blueCount) {
	clearBattlefield();
	ensureMenuRoot();
	menuRoot.style.display = 'none';

	var battleId = ++battleIdCounter;
	var blueTeam = { id: 1, name: 'Blue', fighters: [], carrier: null, fighterCap: 0, replacementQueue: 0, replacementTimerActive: false };
	var redTeam = { id: 2, name: 'Red', fighters: [], carrier: null, fighterCap: 0, replacementQueue: 0, replacementTimerActive: false };

	activeBattle = {
		id: battleId,
		mode: 'standard',
		visuals: [],
		initialBlue: blueCount,
		initialRed: redCount,
		blueTeam: blueTeam,
		redTeam: redTeam
	};

	for (var i = 0; i < blueCount; i++) {
		makeFighterForTeam(battleId, blueTeam, Math.floor(Math.random() * 620) + 80, 610 + (Math.floor(Math.random() * 22) - 11));
	}
	for (var j = 0; j < redCount; j++) {
		makeFighterForTeam(battleId, redTeam, Math.floor(Math.random() * 620) + 80, 90 + (Math.floor(Math.random() * 22) - 11));
	}

	createHud('Standard Battle', false);
	assignTargetsForBattle(activeBattle);
	updateHud(activeBattle);
	runBattleLoop(battleId);
}

function startCarriersBattle() {
	clearBattlefield();
	ensureMenuRoot();
	menuRoot.style.display = 'none';

	var battleId = ++battleIdCounter;
	var blueTeam = { id: 1, name: 'Blue', fighters: [], bombers: [], carrier: null, fighterCap: 10, bomberCap: 2, replacementQueue: 0, replacementTimerActive: false };
	var redTeam = { id: 2, name: 'Red', fighters: [], bombers: [], carrier: null, fighterCap: 10, bomberCap: 2, replacementQueue: 0, replacementTimerActive: false };

	var carrierCenterY = 350;
	var carrierHalfGap = 720;
	blueTeam.carrier = new Carrier(400, carrierCenterY + carrierHalfGap, 1);
	redTeam.carrier = new Carrier(400, carrierCenterY - carrierHalfGap, 2);

	activeBattle = {
		id: battleId,
		mode: 'carriers',
		visuals: [],
		initialBlue: 10,
		initialRed: 10,
		blueTeam: blueTeam,
		redTeam: redTeam
	};

	for (var i = 0; i < 10; i++) {
		(function (launchIndex) {
			scheduleTimeout(function () {
				launchFighterFromCarrier(battleId, blueTeam);
				launchFighterFromCarrier(battleId, redTeam);
			}, launchIndex * 1000);
		}(i));
	}

	for (var b = 0; b < 2; b++) {
		(function (bomberIndex) {
			scheduleTimeout(function () {
				launchBomberFromCarrier(battleId, blueTeam);
				launchBomberFromCarrier(battleId, redTeam);
			}, 1500 + bomberIndex * 2500);
		}(b));
	}

	createHud('Carriers', true);
	assignTargetsForBattle(activeBattle);
	updateHud(activeBattle);
	runBattleLoop(battleId);
}

function Main() {
	showStartMenu();
}

Main();
