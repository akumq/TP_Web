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

	// FLOWER
	var petalMaterial = new THREE.MeshLambertMaterial( { color: 0xCC5920 } );
	var flowerHeight = 200;
	var petalLength = 120;
	var cylGeom = new THREE.CylinderGeometry( 15, 0, petalLength, 32 );
	var flower = new THREE.Object3D();

	/////////
	// YOUR CODE HERE
	// add code here to make 24 petals, radiating around the sphere
	// Scales, rotates, and positions on the cylinder and petals are needed.
	// The petals should be squished and be 1/4 as thick as wide
	// and they should be tilted 20 degrees up from the position in the previous exercise

    var petal = new THREE.Object3D();
    for (let index = 0; index < 24; index++) {
        var cylinder = new THREE.Mesh( cylGeom.translate(0,2,0), petalMaterial );
        

        cylinder.scale.x = 0.2
        cylinder.rotation.z = -0.2
        cylinder.rotation.x = Math.PI*(0.5) + index*2;
        
        petal.add( cylinder );
        
    }
    petal.position.y = flowerHeight
    petal.rotation.z = Math.PI * 0.5
	flower.add( petal );

	// Rest of the flower
	var stamenMaterial = new THREE.MeshLambertMaterial( { color: 0x333310 } );
	var stamen = new THREE.Mesh(
		new THREE.SphereGeometry( 20, 32, 16 ), stamenMaterial );
	stamen.position.y = flowerHeight;	// move to flower center
	flower.add( stamen );

	var stemMaterial = new THREE.MeshLambertMaterial( { color: 0x339424 } );
	var stem = new THREE.Mesh(
		new THREE.CylinderGeometry( 10, 10, flowerHeight, 32 ), stemMaterial );
	stem.position.y = flowerHeight/2;	// move from ground to stamen
	flower.add( stem );

	window.scene.add( flower );

}


function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 38, canvasRatio, 1, 10000 );
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);
	camera.position.set(-20, 300, 219);
	cameraControls.target.set(13, 152, -159);
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


// this is the main action sequence

	init();
	fillScene();
	drawHelpers();
	addToDOM();
	setupGui();
	animate();
