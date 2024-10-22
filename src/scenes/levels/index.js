import scene from "../../utils/scene.js";
import Camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import CubeMesh from "../../components/shapes/cubeMesh.js";
import Plane from "../../components/shapes/plane.js";
import Terrain from '../../components/shapes/terrain.js'
import { Vector3, Raycaster, WebGLRenderTarget } from 'three';
import terrainPreload2 from '../../tools/terrainPreload2.js'
import * as CANNON from 'cannon-es';
import { DeviceController } from "../../tools/Device.js";
import Debugger from "../../tools/debbuger.js";
import PlaneColitions from "../../components/shapes/colitions/planeColition.js";
import PlayerColitions from "../../components/shapes/colitions/playerColitions.js";
import thread from "../../essentials/gameLoop/thread.js";
import { onWindowResize } from "../../tools/resizeWindow.js";
import { onKeyDown, onKeyUp, getItemSelect, mouseLeaved, mousePressed, setMobileJump,screenPressed } from "../../essentials/controlls/controlls.js";
import { generateTerrain } from "../../tools/generateTerrain.js";
import Music from '../../components/music/music.js'
import PortalCircle from "../../components/shapes/portalCircle.js";
/*
TASKS
1. Implementar portales (triggers de tp)
2. Construir los niveles
3. Decorar el lobby
4. Crear la api de laravel
5. Poteger las rutas
7. Implementar inventario
8. Crear casas  
9.Agregar enemigos

FIXES
1. Refactorizar removeBlocks 
2. Ocultar y mostar el chat cuando se desea.
*/
function init() {

    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 500).getCamera();
    camera.position.set(40, 3, 30);
    Music(camera);

    const raycaster = new Raycaster();
    const world = new CANNON.World();

    const cannonDebugger = Debugger(scene, world);
    const controls = DeviceController(camera, renderer);
    const direction = new Vector3();

    PlaneColitions(world);
    world.gravity.set(0, -9.82, 0);

    let itemSelect;
    let keys = {};
    let canJump = true;
    let jumpSpeed = 6;
    let isJumping = false;

    //Player Mesh and colitions
    const playerMesh = new Cube([40, 2, 30], "../../../public/textures/wood.jpg", 1).getMesh();
    scene.add(playerMesh);
    const playerBody = PlayerColitions(world);
    //

    //Minimp
    const minimap = new Camera(90, 1, 0.01, 500).getCamera();
    minimap.position.set(playerMesh.position.x, 50, playerMesh.position.z);
    minimap.lookAt(playerMesh.position);
    //

    //Portal1
    const portalRenderTarget1 = new WebGLRenderTarget(512, 512);
    scene.add(new CubeMesh([93, 1.5, 153], "../../../public/textures/wood.jpg", 2, world).getMesh());
    const portalLevel1 = new PortalCircle([93.51, 1.5, 153], portalRenderTarget1).getMesh();
    portalLevel1.rotateY(-29.84)
    scene.add(portalLevel1)

    const portalCamera1 = new Camera(90, 0.5, 0.01, 500).getCamera();
    portalCamera1.position.set(150, 5, 150);
    portalLevel1.add(portalCamera1);
    //

    //Portal2
    const portalRenderTarget2 = new WebGLRenderTarget(512, 512);
    scene.add(new CubeMesh([93, 1.5, 155], "../../../public/textures/wood.jpg", 2, world).getMesh());
    const portalLevel2 = new PortalCircle([93.51, 1.5, 155], portalRenderTarget2).getMesh();
    portalLevel2.rotateY(-29.84)
    scene.add(portalLevel2)

    const portalCamera2 = new Camera(90, 0.5, 0.01, 500).getCamera();
    portalCamera2.position.set(150, 10, 90);
    portalLevel2.add(portalCamera2);
    //

    const planeFloor = new Plane([150, 0.5, 150], .5, "../../../public/textures/dirt.png").getMesh();
    scene.add(planeFloor);

    //const randomMap = generateTerrain(300, 300)
    //console.log(JSON.stringify(randomMap, null, "\t"));

    const terrain = new Terrain(terrainPreload2, "../../../public/textures/g_5.png", world, playerBody, 2);
    scene.add(terrain.getMesh());

    //colisiones iniciales del raycast de la malla del terreno y suelo
    const elements = [planeFloor, terrain.getMesh()];
    //

    //Ligths
    scene.add(ambientLigth);
    scene.add(directionalLight);
    directionalLight.position.set(10, 10, 10);
    //

    document.getElementById("container3D").appendChild(renderer.domElement);

    thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, portalCamera1, portalCamera2, portalRenderTarget1, portalRenderTarget2);

    const cameraCenter = document.getElementById('camera-center');
    const deleteMobile = document.getElementById('delete-btn')
    const buildMobile = document.getElementById('build-btn')

    buildMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, true)  
    })

    deleteMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed( world, scene, elements, raycaster, itemSelect, playerBody, false)
    })

    cameraCenter.addEventListener('touchstart', (event) => {
        onKeyDown(event, keys, playerBody, controls, jumpSpeed);
        setMobileJump();
    }, { passive: true })

    document.addEventListener('keydown', (event) => {
        onKeyDown(event, keys, playerBody, controls, jumpSpeed);
        itemSelect = getItemSelect();
    }, false);

    document.addEventListener('keyup',
        (event) => { onKeyUp(event, keys) }, false
    );

    document.addEventListener('mousedown', (event) => {
        itemSelect = getItemSelect();
        mousePressed(event, world, scene, elements, raycaster, itemSelect, playerBody)
    }, false);

    document.addEventListener('mouseup', (event) => { mouseLeaved(event) }, false
    );

    window.addEventListener('resize',
        () => { onWindowResize(renderer, camera); }, false
    );
}

document.addEventListener("DOMContentLoaded", () => {
    init();
})



