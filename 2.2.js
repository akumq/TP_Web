
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {dat} from './lib/date.gui.min.js';

var camera, renderer;
var cameraControls;
var clock = new THREE.Clock();
var ambientLight, light;

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// CAMERA

	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 80000 );
	camera.position.set( -300, 300, -1000 );
	camera.lookAt(0,0,0);
	// LIGHTS

	ambientLight = new THREE.AmbientLight( 0xFFFFFF );

	light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
	light.position.set( -800, 900, 300 );

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor( 0xAAAAAA, 1.0 );

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// CONTROLS
	cameraControls = new OrbitControls( camera, renderer.domElement );
	cameraControls.target.set(0, 0, 0);

}

function createBall() {
	// Do not change the color itself, change the material and use the ambient and diffuse components.
    var material = new THREE.MeshPhongMaterial(
        { color: 0x80fc66, flatShading: true } );
	var sphere = new THREE.Mesh( new THREE.SphereGeometry( 400, 64, 32 ), material );
	return sphere;
}

function fillScene() {
	window.scene = new THREE.Scene();
	window.scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

	// LIGHTS
	window.scene.add( ambientLight );
	window.scene.add( light );

	var ball = createBall();
	window.scene.add( ball );

	//Coordinates.drawGround({size:1000});
	//Coordinates.drawGrid({size:1000,scale:0.01});
	//Coordinates.drawAllAxes({axisLength:500,axisRadius:1,axisTess:4});
}

function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function animate() {
	window.requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);

	renderer.render( scene, camera );

}


init();
fillScene();
addToDOM();
animate();

var container = document.createElement( "div" );

document.body.appendChild( container );
container.appendChild( renderer.domElement );