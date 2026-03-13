
var interface = new PIXI.Container();

var mytitle = new PIXI.Text('Pixi Boats', { font: '26px Verdana', fill: 'white', align: 'left' });
mytitle.position.set(16, 10);
interface.addChild(mytitle);

var instructions = new PIXI.Text(
	'Arrow keys: pan\nDrag: pan view\nMousewheel: zoom\nSpacebar: reset camera',
	{ font: '16px Verdana', fill: '#d9e2f0', align: 'left', lineHeight: 22 }
);
instructions.position.set(16, 46);
interface.addChild(instructions);

stage.addChild(interface);
