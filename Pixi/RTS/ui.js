
var interface = new PIXI.Container();
var mytitle = new PIXI.Text('Pixi.js Game Engine Test', { font: '35px', fill: 'white', align: 'left' });
mytitle.position.set(20);
interface.addChild(mytitle)
var instructions = new PIXI.Text('Arrows keys to Pan (or click and drag)\nMousewheel to Zoom\nSpacebar to reset position', { font: '35px', fill: 'white', align: 'left' });
instructions.position.set(20,50);
interface.addChild(instructions)
stage.addChild(interface)
