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

	camera.position.set( -480, 659, -619 );
	cameraControls.target.set(4,301,92);

	fillScene();
}

// Supporting frame for the bird - base + legs + feet
function createSupport() {

	var footMaterial = new THREE.MeshPhongMaterial( { shininess : 30, color: 0xF07020 } );
	footMaterial.specular.setRGB(0.5,0.5,0.5)

	var legMaterial = new THREE.MeshPhongMaterial( { shininess : 4, color: 0xF07020 } );
	legMaterial.specular.setRGB(0.5,0.5,0.5)
	// base
	var cube;
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 4, 2*77 ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 4/2;	// half of height
	cube.position.z = 0;	// centered at origin
	window.scene.add( cube );

	// left foot
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 52, 6 ), footMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	window.scene.add( cube );

	// right foot
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 64, 334+52, 6 ), legMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = (334+52)/2;
	cube.position.z = -(77 + 6/2);	// offset 77 + half of depth 6/2
	window.scene.add( cube );

	// left leg
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 64, 334+52, 6 ), legMaterial );
	cube.position.x = 0;	// centered on origin along X
	cube.position.y = (334+52)/2;
	cube.position.z = 77 + 6/2;	// offset 77 + half of depth 6/2
	window.scene.add( cube );

	// right leg
	cube = new THREE.Mesh(
		new THREE.BoxGeometry( 20+64+110, 52, 6 ), legMaterial );
	cube.position.x = -45;	// (20+32) - half of width (20+64+110)/2
	cube.position.y = 52/2;	// half of height
	cube.position.z = -(77 + 6/2);	// offset 77 + half of depth 6/2
	window.scene.add( cube );

}

// Body of the bird - body and the connector of body and head
function createBody() {



    const glassMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.5,
        roughness: 1,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        transmission: .95,
        opacity: 0.3,
        reflectivity: 1,
    })

    var sphereMaterial = new THREE.MeshPhongMaterial( { shininess : 100, color: 0xA00000 } );
	sphereMaterial.specular.setRGB(0.5,0.5,0.5)

	var cylinderMaterial =  new THREE.MeshPhongMaterial( { shininess : 100, color: 0x0000D0 } );
	cylinderMaterial.specular.setRGB(0.5,0.5,0.5)

    var spherefill = new THREE.Mesh(
        new THREE.SphereGeometry( 104/2, 32, 16, 0, Math.PI * 2, Math.PI/2, Math.PI ),
        cylinderMaterial );
	spherefill.position.x = 0;
	spherefill.position.y = 160;
	spherefill.position.z = 0;
    window.scene.add(spherefill);

    var cylindrefill = new THREE.Mesh(
        new THREE.CylinderGeometry( 8,8,200,32, Math.PI * 2, Math.PI/2, Math.PI ),
        cylinderMaterial );
	cylindrefill.position.x = 0;
	cylindrefill.position.y = 250;
	cylindrefill.position.z = 0;
    window.scene.add(cylindrefill);

	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(116/2,32,16),glassMaterial);
	sphere.position.x = 0;
	sphere.position.y = 160;
	sphere.position.z = 0;
	window.scene.add(sphere);

	var cylindre = new THREE.Mesh(
		new THREE.CylinderGeometry(12,12,390,32),glassMaterial);
	cylindre.position.x = 0;
	cylindre.position.y = 390;
	cylindre.position.z = 0;
	window.scene.add(cylindre);

}

// Head of the bird - head + hat
function createHead() {

	var cylinderMaterial = new THREE.MeshPhongMaterial( { shininess : 100 ,color: 0x0000D0 } );
	cylinderMaterial.specular.setRGB(0.5,0.5,0.5)

	var sphereMaterial = new THREE.MeshPhongMaterial( { shininess : 100 ,  color: 0xA00000})
	sphereMaterial.specular.setRGB(0.5,0.5,0.5)


	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(104/2,32,16),sphereMaterial);
	sphere.position.x = 0;
	sphere.position.y = 160+390;
	sphere.position.z = 0;
	window.scene.add(sphere);

	var cylindre = new THREE.Mesh(
		new THREE.CylinderGeometry(142/2,142/2,10,32),cylinderMaterial);
	cylindre.position.x = 0;
	cylindre.position.y = 390+160+40;
	cylindre.position.z = 0;
	window.scene.add(cylindre);

	var cylindre = new THREE.Mesh(
		new THREE.CylinderGeometry(40,40,70,32),cylinderMaterial);
	cylindre.position.x = 0;
	cylindre.position.y = 390+160+40+10;
	cylindre.position.z = 0;
	window.scene.add(cylindre);

	var cylindre = new THREE.Mesh(
		new THREE.CylinderGeometry(10,1,51,32),cylinderMaterial);
	cylindre.position.x = -70;
	cylindre.position.y = 390+150+10;
	cylindre.position.z = 0;

	cylindre.rotation.x = Math.PI / 2
	cylindre.rotation.z = - Math.PI / 2
	window.scene.add(cylindre);

}

function createDrinkingBird() {

	// MODELS
	// base + legs + feet
	createSupport();

	// body + body/head connector
	createBody();

	// head + hat
	createHead();
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
	createDrinkingBird();
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


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

	document.querySelector('#')

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

var container = document.createElement( "div" );

document.body.appendChild( container );
container.appendChild( renderer.domElement );