
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

function PolygonGeometry(sides,position,radius) {
	var geo = new THREE.BufferGeometry();

	// generate vertices
	var vertices=[];	
	for ( var pt = 0 ; pt < sides; pt++ )
	{
		// Add 90 degrees so we start at +Y axis, rotate counterclockwise around
		var angle = (Math.PI/2) + (pt / sides) * 2 * Math.PI;

		var x = Math.cos( angle );
		var y = Math.sin( angle );

		// YOUR CODE HERE
		//Save the vertex location - fill in the code
		vertices.push(new THREE.Vector3((x*radius)+position.x,(y*radius)+position.y,(0*radius)+position.z))
		// Use something like vertices.push( new THREE.Vector3( something  ) ); to add a vertex
	}
	// YOUR CODE HERE
	// Write the code to generate minimum number of faces for the polygon.
	var faces=[];
	for (let i = 0; i < sides-2; i++) {
		console.log(i);
		faces.push(vertices[0].x);
		faces.push(vertices[0].y);
		faces.push(vertices[0].z);

		faces.push(vertices[i+1].x);
		faces.push(vertices[i+1].y);
		faces.push(vertices[i+1].z);
		
		faces.push(vertices[i+2].x);
		faces.push(vertices[i+2].y);
		faces.push(vertices[i+2].z);
	}

	faces.push(vertices[0].x);
	faces.push(vertices[0].y);
	faces.push(vertices[0].z);
	const fv=new Float32Array(faces);
	console.log(fv)
	geo.setAttribute( 'position', new THREE.BufferAttribute( fv, 3 ) );
	geo.setAttribute( 'position', new THREE.BufferAttribute(fv,3))
	// Return the geometry object
	return geo;
}

function init() {
	// Setting up some parameters
	var canvasWidth = 846;
	var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	//var canvasWidth = window.innerWidth;
	//var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;
	// scene
	// scene = new THREE.Scene();

	// Camera: Y up, X right, Z up
	windowScale = 4;
	var windowWidth = windowScale * canvasRatio;
	var windowHeight = windowScale;

	camera = new THREE.OrthographicCamera( windowWidth / - 2, windowWidth / 2, windowHeight / 2, windowHeight / - 2, 0, 40 );

	var focus = new THREE.Vector3( 0,1,0 );
	camera.position.x = focus.x;
	camera.position.y = focus.y;
	camera.position.z = 10;
	camera.lookAt(focus);

	renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize( canvasWidth, canvasHeight );
	renderer.setClearColor( 0xFFFFFF, 1.0 );

}

function showGrids() {
	// Background grid and axes. Grid step size is 1, axes cross at 0, 0
	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
	Coordinates.drawAxes({axisLength:4,axisOrientation:"x",axisRadius:0.02});
	Coordinates.drawAxes({axisLength:3,axisOrientation:"y",axisRadius:0.02});
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

// Main body of the script



	init();
	showGrids();
	var position  = new THREE.Vector3(2,2,0)
	var geo = PolygonGeometry(8,position,0.2);
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
	var mesh = new THREE.Mesh( geo, material );
	window.scene.add( mesh );
	addToDOM();
	render();
// } catch(e) {
// 	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
// 	$('#container').append(errorReport+e);
// }

var container = document.createElement( "div" );

document.body.appendChild( container );
container.appendChild( renderer.domElement );