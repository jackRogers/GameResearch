function Circle(x,y,r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

function distance(x1,y1,x2,y2) {
	return Math.sqrt( Math.pow( x2 - x1,2) + Math.pow( y2 - y1,2));
}

function areaOfIntersection(circ1,circ2) {
	var r1 = circ1.r;
	var r2 = circ2.r;
	var d = distance(circ1.x,circ1.y,circ2.x,circ2.y);
	if ( r2 < r1 ) {
		r2 = circ1.r;
		r1 = circ2.r;
	}
	var part1 = r1*r1*Math.acos((d*d + r1*r1 - r2*r2)/(2*d*r1));
	var part2 = r2*r2*Math.acos((d*d + r2*r2 - r1*r1)/(2*d*r2));
	var part3 = 0.5*Math.sqrt((-d+r1+r2)*(d+r1-r2)*(d-r1+r2)*(d+r1+r2));
	var area = part1 + part2 - part3;
	if area = "NaN
	return part1 + part2 - part3;
}


