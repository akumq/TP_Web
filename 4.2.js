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
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;

/**
* Returns a THREE.Mesh cone (CylinderGeometry) going from top to bottom positions
* @param material - THREE.Material
* @param radius - the radius of the capsule's cylinder
* @param top, bottom - THREE.Vector3, top and bottom positions of cone
* @param segmentsWidth - tessellation around equator, like radiusSegments in CylinderGeometry
* @param openEnded - whether the ends of the cone are generated; true means they are not
*/
function createCylinderFromEnds( material, radiusTop, radiusBottom, top, bottom, segmentsWidth, openEnded)
{
	// defaults
	segmentsWidth = (segmentsWidth === undefined) ? 32 : segmentsWidth;
	openEnded = (openEnded === undefined) ? false : openEnded;

	// Dummy settings, replace with proper code:
	var length = bottom.distanceTo(top);
	var cylAxis = new THREE.Vector3(top.x-bottom.x,top.y-bottom.y,top.z-bottom.z);

	var center = new THREE.Vector3(bottom.x+(top.x*0.5),bottom.y+(top.y*0.5),bottom.z+(top.z*0.5));
	////////////////////

	var cylGeom = new THREE.CylinderGeometry( radiusTop, radiusBottom, length, segmentsWidth, 1, openEnded );

	var cyl = new THREE.Mesh( cylGeom, material );

	// pass in the cylinder itself, its desired axis, and the place to move the center.
	makeLengthAngleAxisTransform( cyl, cylAxis, center );
	return cyl;
}

// Transform cylinder to align with given axis and then move to center
function makeLengthAngleAxisTransform( cyl, cylAxis, center )
{
	cyl.matrixAutoUpdate = false;

	// From left to right using frames: translate, then rotate; TR.
	// So translate is first.
	cyl.matrix.makeTranslation( center.x, center.y, center.z );

	// take cross product of cylAxis and up vector to get axis of rotation
	var yAxis = new THREE.Vector3(0,1,0);
	// Needed later for dot product, just do it now;
	// a little lazy, should really copy it to a local Vector3.
	cylAxis.normalize();
	var rotationAxis = new THREE.Vector3();
	rotationAxis.crossVectors( cylAxis, yAxis );
	if ( rotationAxis.length() < 0.000001 )
	{
		// Special case: if rotationAxis is just about zero, set to X axis,
		// so that the angle can be given as 0 or PI. This works ONLY
		// because we know one of the two axes is +Y.
		rotationAxis.set( 1, 0, 0 );
	}
	rotationAxis.normalize();

	// take dot product of cylAxis and up vector to get cosine of angle of rotation
	var theta = -Math.acos( cylAxis.dot( yAxis ) );
	//cyl.matrix.makeRotationAxis( rotationAxis, theta );
	var rotMatrix = new THREE.Matrix4();
	rotMatrix.makeRotationAxis( rotationAxis, theta );
	cyl.matrix.multiply( rotMatrix );
}

function fillScene() {
	window.scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );

	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light.position.set( 200, 400, 500 );

	var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
	light2.position.set( -500, 250, -200 );

	window.scene.add(ambientLight);
	window.scene.add(light);
	window.scene.add(light2);

	// TEST MATERIALS AND OBJECTS
	var redMaterial = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
	var greenMaterial = new THREE.MeshLambertMaterial( { color: 0x00FF00 } );
	var blueMaterial = new THREE.MeshLambertMaterial( { color: 0x0000FF } );
	var grayMaterial = new THREE.MeshLambertMaterial( { color: 0x808080 } );

	var yellowMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFF00 } );
	var cyanMaterial = new THREE.MeshLambertMaterial( { color: 0x00FFFF } );
	var magentaMaterial = new THREE.MeshLambertMaterial( { color: 0xFF00FF } );

	var radiusTop = 50;
	var radiusBottom = 0;
	var segmentsWidth = 32;
	var openEnded = false;
	var cylinder;

	// along Y axis
	cylinder = new createCylinderFromEnds( greenMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 0, 300, 0 ),
		new THREE.Vector3( 0, 0, 0 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// along X axis
	cylinder = new createCylinderFromEnds( redMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 300, 0, 0 ),
		new THREE.Vector3( 0, 0, 0 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// along Z axis
	cylinder = new createCylinderFromEnds( blueMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 0, 0, 300 ),
		new THREE.Vector3( 0, 0, 0 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// along XYZ axis
	cylinder = new createCylinderFromEnds( grayMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 200, 200, 200 ),
		new THREE.Vector3( 0, 0, 0 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// along -Y axis, translated in XYZ
	cylinder = new createCylinderFromEnds( yellowMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 50, 100, -200 ),
		new THREE.Vector3( 50, 300, -200 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// along X axis, from top of previous cylinder
	cylinder = new createCylinderFromEnds( cyanMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 50, 300, -200 ),
		new THREE.Vector3( 250, 300, -200 ),
		segmentsWidth, openEnded );
	window.scene.add( cylinder );

	// continue from bottom of previous cylinder
	cylinder = new createCylinderFromEnds( magentaMaterial,
		radiusTop, radiusBottom,
		new THREE.Vector3( 250, 300, -200 ),
		new THREE.Vector3( -150, 100, 0 ),
		segmentsWidth );	// try openEnded default to false
	window.scene.add( cylinder );
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
	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 10000 );
	camera.position.set( -528, 513, 92 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,200,0);

}

function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function drawHelpers() {
	if (ground) {
		Coordinates.drawGround({size:10000});
	}
	if (gridX) {
		Coordinates.drawGrid({size:10000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"});
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
	}
}

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
		drawHelpers();
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
	var h = gui.addFolder("Grid display");
	h.add( effectController, "newGridX").name("Show XZ grid");
	h.add( effectController, "newGridY" ).name("Show YZ grid");
	h.add( effectController, "newGridZ" ).name("Show XY grid");
	h.add( effectController, "newGround" ).name("Show ground");
	h.add( effectController, "newAxes" ).name("Show axes");
}

try {
	init();
	fillScene();
	drawHelpers();
	setupGui();
	addToDOM();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
