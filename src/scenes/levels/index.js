import scene from "../../utils/scene.js";
import Camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import Plane from "../../components/shapes/plane.js";
import Terrain from '../../components/shapes/terrain.js'
import { Vector3, Raycaster } from 'three';
import terrainPreload from '../../tools/terrainPreload.js'
import terrainPreload2 from '../../tools/terrainPreload2.js'
import * as CANNON from 'cannon-es';
import Device from "../../tools/Device.js";
import Debugger from "../../tools/debbuger.js";
import PlaneColitions from "../../components/shapes/colitions/planeColition.js";
import PlayerColitions from "../../components/shapes/colitions/playerColitions.js";
import thread from "../../essentials/gameLoop/thread.js";
import { onWindowResize } from "../../tools/resizeWindow.js";
import { onKeyDown, onKeyUp, getItemSelect, mouseLeaved, mousePressed } from "../../essentials/controlls/controlls.js";
import { generateTerrain } from "../../tools/generateTerrain.js";
import Music from '../../components/music/music.js'

function init() {

    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 500).getCamera();
    camera.position.set(40, 3, 30);
    Music(camera);

    const raycaster = new Raycaster();
    const world = new CANNON.World();
    
    const cannonDebugger = Debugger(scene, world);
    const controls = Device(camera, renderer);
    const direction = new Vector3();

    PlaneColitions(world);
    world.gravity.set(0, -9.82, 0);

    let itemSelect;
    let keys = {};
    let canJump = true;
    let jumpSpeed = 6;
    let isJumping = false;

    const playerMesh = new Cube([40, 2, 30], "../../../public/textures/wood.jpg", 1).getMesh();
    scene.add(playerMesh);

    const minimap = new Camera(90, 1, 0.01, 500).getCamera();
    minimap.position.set(playerMesh.position.x, 50, playerMesh.position.z);
    minimap.lookAt(playerMesh.position);

    const playerBody = PlayerColitions(world);

    const planeFloor = new Plane([150, 0.5, 150], .5, "../../../public/textures/dirt.png").getMesh();
    scene.add(planeFloor);

    const elements = [planeFloor];

    //const randomMap = generateTerrain(300, 300)
    //console.log(JSON.stringify(randomMap, null, "\t"));

    const terrain = new Terrain(terrainPreload2, "../../../public/textures/g_5.png", world, playerBody, 2);
    scene.add(terrain.getMesh());
   
    scene.add(ambientLigth);
    scene.add(directionalLight);

    directionalLight.position.set(-10, 10, 10);

    document.getElementById("container3D").appendChild(renderer.domElement);

    thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain);

    document.addEventListener('keydown', (event) => {
        onKeyDown(event, keys, playerBody, controls, jumpSpeed);
        itemSelect = getItemSelect();
    }, false);

    document.addEventListener('keyup',
        (event) => { onKeyUp(event, keys) }, false
    );

    document.addEventListener('mousedown',
        (event) => { mousePressed(event, world, scene, elements, raycaster, itemSelect) }, false
    );

    document.addEventListener('mouseup',
        (event) => { mouseLeaved(event) }, false
    );

    window.addEventListener('resize',
        () => { onWindowResize(renderer, camera); }, false
    );
}

document.addEventListener("DOMContentLoaded", () => {
    init();
})



