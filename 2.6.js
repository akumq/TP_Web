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
	// CONTROLS
	cameraControls = new OrbitControls(camera, renderer.domElement);

	// camera.position.set( -600, 659, -619 );
    var focus = new THREE.Vector3( 0,1,0 );


	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	fillScene();
}

function drawSquare(x1, y1, x2, y2, z) {

	var square = new THREE.BufferGeometry();
	// Your code goes here

		// This code demonstrates how to draw a triangle

	const vertices = new Float32Array( [
		x1, y1,  z,
		x2, y1, z,
		x2, y2,  z,
		x2, y2,  z,
		x1, y2, z,
		x1, y1,  z,
	] );

	square.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	
    
	// don't forget to return the geometry!	The following line is required!
	return square;
}


function drawCube(x1,y1,z1,x2,y2,z2) {

    var square_material = new THREE.MeshBasicMaterial( { color: 0xF6831E, side: THREE.DoubleSide } );
	
    var geo = drawSquare(x1,y1,x2,y2,z1);
    var face1 = new THREE.Mesh(geo, square_material);
	window.scene.add(face1);

    var geo = drawSquare(x1,y1,x2,y2,z2);
    var face2 = new THREE.Mesh(geo, square_material);
	window.scene.add(face1);

	var position  = new THREE.Vector3(2,2,0)
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    
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

	var Material = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 1, wireframe: true})

    drawCube(0,0,0,100,100,100)
    // var loader = new OBJLoader();
    // // Charger le fichier
    // loader.load(
    //     'Room.obj',
    //     function ( object ) {
	// 		object.scale.set(250,250,250);
	// 		window.scene.add( object );
    //     }
    // );

	var	sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x0000D0 } );

	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(116/2,32,16),sphereMaterial);
	sphere.position.x = 0;
	sphere.position.y = 300;
	sphere.position.z = 0;
	
	window.scene.add(sphere);


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
}
//
function addToDOM() {
	var container = document.getElementById('webGL');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
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