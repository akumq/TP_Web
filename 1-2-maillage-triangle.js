
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {dat} from './lib/date.gui.min.js';
var camera, renderer;
var windowScale;
window.scene = new THREE.Scene();
import {Coordinates} from './lib/Coordinates.js';


var camera, renderer;
var windowScale;
function exampleTriangle() {
	// This code demonstrates how to draw a triangle
	var triangle = new THREE.BufferGeometry();

	const vertices = new Float32Array( [
		1.0, 1.0,  0.0,
		3.0, 1.0, 0.0,
		3.0, 3.0,  0.0,
	] );

	triangle.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	return triangle;
}


function drawSquare(x1, y1, x2, y2) {

	var square = new THREE.BufferGeometry();
	// Your code goes here

		// This code demonstrates how to draw a triangle

	const vertices = new Float32Array( [
		x1, y1,  0.0,
		x2, y1, 0.0,
		x2, y2,  0.0,
		x2, y2,  0.0,
		x1, y2, 0.0,
		x1, y1,  0.0,
	] );

	square.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	
	// don't forget to return the geometry!	The following line is required!
	return square;
}

function init() {
	// Set up some parameters
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

	// Camera: Y up, X right, Z up
	windowScale = 12;
	var windowWidth = windowScale * canvasRatio;
	var windowHeight = windowScale;

	camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

	var focus = new THREE.Vector3( 5,5,0 );
	camera.position.x = focus.x;
	camera.position.y = focus.y;
	camera.position.z = 20;
	camera.lookAt(focus);

	renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor( 0xFFFFFF, 1.0 );
}

function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function render() {
	renderer.render( window.scene, camera );
}

function showGrids() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
	Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
	Coordinates.drawAxes({axisLength:11,axisOrientation:"y",axisRadius:0.04});
}

try {
	$('#container').append("toto");
	init();
	showGrids();
	// creating and adding the triangle to the scene
	var triangleMaterial = new THREE.MeshBasicMaterial( { color: 0x2685AA, side: THREE.DoubleSide } );
	var triangleGeometry = exampleTriangle();
	var triangleMesh = new THREE.Mesh( triangleGeometry, triangleMaterial );
	window.scene.add(triangleMesh);
	// creating and adding your square to the window.scene !
	var square_material = new THREE.MeshBasicMaterial( { color: 0xF6831E, side: THREE.DoubleSide } );
	var square_geometry = drawSquare(3,5,7,9);
	var square_mesh = new THREE.Mesh(square_geometry, square_material);
	window.scene.add(square_mesh);
	addToDOM();
	render();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}


var container = document.createElement( "div" );

document.body.appendChild( container );
container.appendChild( renderer.domElement );