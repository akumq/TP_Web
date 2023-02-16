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

	camera.position.set( -600, 659, -619 );
	cameraControls.target.set(4,301,92);

	fillScene();
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

    var loader = new OBJLoader();
    // Charger le fichier
    loader.load(
        'Room.obj',
        function ( object ) {
			object.scale.set(250,250,250);
			window.scene.add( object );
        }
    );

	var	sphereMaterial = new THREE.MeshLambertMaterial( { color: 0x0000D0 } );

	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(116/2,32,16),sphereMaterial);
	sphere.position.x = 0;
	sphere.position.y = 600;
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