
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {dat} from './lib/date.gui.min.js';
var camera, renderer;
var windowScale;
window.scene = new THREE.Scene();
import {Coordinates} from './lib/Coordinates.js';

var camera, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function createStairs(amount) {

	// MATERIALS
	var stepMaterialVertical = new THREE.MeshLambertMaterial( {
		color: 0xA85F35
	} );
	var stepMaterialHorizontal = new THREE.MeshLambertMaterial( {
		color: 0xBC7349
	} );

	var stepWidth = 500;
	var stepSize = 200;
	var stepThickness = 50;
	// height from top of one step to bottom of next step up
	var verticalStepHeight = stepSize;
	var horizontalStepDepth = stepSize*2;

	var stepHalfThickness = stepThickness/2;

	// +Y direction is up
	// Define the two pieces of the step, vertical and horizontal
	// THREE.CubeGeometry takes (width, height, depth)
	var step = [];

	for (let i = 0; i < amount; i++) {

		
		var stepVertical = new THREE.BoxGeometry(stepWidth, verticalStepHeight, stepThickness);
		var stepHorizontal = new THREE.BoxGeometry(stepWidth, stepThickness, horizontalStepDepth);
		var stepMesh;

		/* Vertical */
		// Make and position the vertical part of the step
		stepMesh = new THREE.Mesh( stepVertical, stepMaterialVertical );
		// The position is where the center of the block will be put.
		// You can define position as THREE.Vector3(x, y, z) or in the following way:
		stepMesh.position.x = 0;			// centered at origin
		stepMesh.position.y = verticalStepHeight/2+(verticalStepHeight+stepThickness)*i;	// half of height: put it above ground plane
		stepMesh.position.z = (horizontalStepDepth- stepThickness)*i;			// centered at origin
		window.scene.add( stepMesh );

		/* Horizontal */
		// Make and position the horizontal part
		stepMesh = new THREE.Mesh( stepHorizontal, stepMaterialHorizontal );
		stepMesh.position.x = 0;
		// Push up by half of horizontal step's height, plus vertical step's height
		stepMesh.position.y = stepThickness/2 + verticalStepHeight + i *(verticalStepHeight+stepThickness);
		// Push step forward by half the depth, minus half the vertical step's thickness
		stepMesh.position.z = horizontalStepDepth/2 - stepHalfThickness + (horizontalStepDepth- stepThickness)*i ;
		scene.add( stepMesh );

		// verticalStepHeight += stepSize;
		// horizontalStepDepth += stepWidth;
	}
}

function createCup() {
	var cupMaterial = new THREE.MeshLambertMaterial( { color: 0xcd7f32});
	// THREE.CylinderGeometry takes (radiusTop, radiusBottom, height, segmentsRadius)
	var cupGeo = new THREE.CylinderGeometry( 200, 50, 400, 32 );
	var cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1725;
	cup.position.z = 1925;
	window.scene.add( cup );
	cupGeo = new THREE.CylinderGeometry( 100, 100, 50, 32 );
	cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1525;
	cup.position.z = 1925;
	window.scene.add( cup );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	camera.position.set( -700, 500, -1600 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,600,0);

	// Camera(2) for testing has following values:
	// camera.position.set( 1225, 2113, 1814 );
	// cameraControls.target.set(-1800,180,630);

	fillScene();
}
function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}
function fillScene() {
	// SCENE
	window.scene = new THREE.Scene();
	window.scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -400, 200, -300 );

	window.scene.add(ambientLight);
	window.scene.add(light);
	window.scene.add(light2);

	if (ground) {
		Coordinates.drawGround({size:1000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:1000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:300,axisRadius:2,axisTess:50});
	}
	createCup();
	var stairs = createStairs(6);
	window.scene.add(stairs);
}
//

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
	}
	renderer.render(window.scene, camera);
}

function setupGui() {

	effectController = {

		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes
	};

	var gui = new dat.GUI();
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}



init();
setupGui();
addToDOM();
animate();


var container = document.createElement( "div" );

document.body.appendChild( container );
container.appendChild( renderer.domElement );