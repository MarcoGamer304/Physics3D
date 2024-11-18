import scene from "../../utils/scene.js";
import Camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import CubeMesh from "../../components/shapes/cubeMesh.js";
import Floor from "../../components/shapes/Floor.js";
import Terrain from '../../components/shapes/terrain.js'
import PlaneConstructor from "../../components/shapes/PlaneColitions.js";
import { Vector3, Raycaster, WebGLRenderTarget } from 'three';
import * as CANNON from 'cannon-es';
import { DeviceController } from "../../tools/Device.js";
import Debugger from "../../tools/debbuger.js";
import PlayerColitions from "../../components/shapes/colitions/playerColitions.js";
import thread from "../../essentials/gameLoop/thread.js";
import { onWindowResize } from "../../tools/resizeWindow.js";
import { onKeyDown, onKeyUp, getItemSelect, mouseLeaved, mousePressed, setMobileJump, screenPressed } from "../../essentials/controlls/controlls.js";
import Music from '../../components/music/music.js'
import PortalCircle from "../../components/shapes/portalCircle.js";
import { getData } from "../../essentials/BackendMethods/Php/fetchMethods.js";
import { generateTrees, getTrees, getTronco } from "../../tools/generateTrees.js";
import { buildLevel1 } from "./level1.js";
import { buildLevel2 } from "./level2.js";

/*
TASKS
5. sesiones
7. Implementar inventario | menus  
9. Agregar enemigos

FIXES
1. Refactorizar removeBlocks 
2. Ocultar y mostar el chat cuando se desea.
*/

let terrainPhp = [];
let buildsAdminPhp = [];
let timePlayed = Number();
let globalLevel = Number(0);

function init() {
    timePlayed += Date.now();

    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 500).getCamera();
    camera.position.set(40, 3, 30);
    camera.lookAt(0, 0, 0)
    Music(camera);

    const raycaster = new Raycaster();
    const raycasterCollitions = new Raycaster();
    const world = new CANNON.World();

    const cannonDebugger = Debugger(scene, world);
    const controls = DeviceController(camera, renderer);
    const direction = new Vector3();

    world.gravity.set(0, -9.82, 0);

    let itemSelect;
    let keys = {};
    let canJump = true;
    let jumpSpeed = 6;

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
    scene.add(new Cube([93, 2.5, 153], "../../../public/textures/wood.jpg", 2).getMesh());
    const portalLevel1 = new PortalCircle([93.51, 2.5, 153], portalRenderTarget1).getMesh();
    portalLevel1.index = 0;
    portalLevel1.rotateY(-29.84);
    scene.add(portalLevel1);
    //
    //Portal 1 camera
    const portalCamera1 = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera1.position.set(-160, 75, -315);
    portalCamera1.lookAt(0, 0, 0)
    portalLevel1.add(portalCamera1);
    //
    //return portal 1
    const portalRenderTarget1Return = new WebGLRenderTarget(512, 512);
    scene.add(new Cube([-51, 46.3, 243], "../../../public/textures/wood.jpg", 2).getMesh());
    const portalLevel1Return = new PortalCircle([-50.49, 46.3, 243], portalRenderTarget1Return).getMesh();
    portalLevel1Return.index = 0.1;
    portalLevel1Return.rotateY(-29.84)
    scene.add(portalLevel1Return);
    //
    //return Portal 1 camera
    const portalCamera1Return = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera1Return.position.set(176.3, -41, 320);
   
    portalLevel1Return.add(portalCamera1Return);
    //
    //Portal2
    const portalRenderTarget2 = new WebGLRenderTarget(512, 512);
    scene.add(new Cube([93, 2.5, 155], "../../../public/textures/wood.jpg", 2).getMesh());
    const portalLevel2 = new PortalCircle([93.51, 2.5, 155], portalRenderTarget2).getMesh();
    portalLevel2.index = 1;
    portalLevel2.rotateY(-29.84);
    scene.add(portalLevel2)

    const portalCamera2 = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera2.position.set(-60, 80, 650);
    portalCamera2.lookAt(400, 0, 0);
    portalLevel2.add(portalCamera2);
    //
    //return portal 2
    const portalRenderTarget2Return = new WebGLRenderTarget(512, 512);
    scene.add(new Cube([338, 41.3, 165], "../../../public/textures/wood.jpg", 2).getMesh());
    const portalLevel2Return = new PortalCircle([338.51, 41.3, 165], portalRenderTarget2Return).getMesh();
    portalLevel2Return.index = 1.1;
    portalLevel2Return.rotateY(-29.84)
    scene.add(portalLevel2Return);
    //
    //return Portal 2 camera
    const portalCamera2Return = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera2Return.position.set(24.5, -35, -455);
    portalLevel2Return.add(portalCamera2Return);
    //
    const planeFloor = new Floor([150, 0.5, 150], .5, "../../../public/textures/dirt.png", 0, [300, 300], world).getMesh();
    scene.add(planeFloor);

    //genera arboles y troncos para construir sus mallas
    generateTrees(terrainPhp);
    const arboles = new Terrain(getTrees(), "../../../public/textures/leaves.png", world, playerBody, 2);
    scene.add(arboles.getMesh());
    const troncoMesh = new Terrain(getTronco(), "../../../public/textures/log.png", world, playerBody, 2);
    scene.add(troncoMesh.getMesh());
    //
    //Generar malla de terreno
    const terrain = new Terrain(terrainPhp, "../../../public/textures/g_5.png", world, playerBody, 2);
    scene.add(terrain.getMesh());
    //Construcciones por defecto
    const buildAdmin = new Terrain(buildsAdminPhp, "../../../public/textures/brick_black.png", world, playerBody, 2);
    scene.add(buildAdmin.getMesh());

    //colisiones iniciales del raycast de la malla del terreno y suelo
    let elements = [planeFloor, terrain.getMesh(), buildAdmin.getMesh(), arboles.getMesh(), troncoMesh.getMesh()];

    //nivel 1
    const blockToPush = new CubeMesh([360, 60, 165], "../../../public/textures/brick_black.png", 3, world, 100, 1);
    buildLevel1(world, scene, elements, blockToPush);

    //nivel 2
    const wall = new PlaneConstructor([-47.8, 51.8, 193], "../../../public/textures/wood.jpg", [0.5, 0, 0.5], [7, 5], world);
    const wall2 = new PlaneConstructor([-47.8, 51.8, 206], "../../../public/textures/wood.jpg", [0.5, 0, 0.5], [7, 5], world);
    wall.coords = [-47.8, 51.8, 193];
    wall2.coords = [-47.8, 51.8, 206];
    const cubeGravity = new CubeMesh([-49, 48, 222], "../../../public/textures/sand.png", 2, world, 100);
    const cubeGravity2 = new CubeMesh([-49, 46, 232], "../../../public/textures/sand.png", 2, world, 100);
    cubeGravity.coords = [-49, 48, 222];
    cubeGravity2.coords = [-49, 46, 232];
    buildLevel2(world, scene, elements, wall.getMesh(), wall2.getMesh(), cubeGravity.getMesh(), cubeGravity2.getMesh());
    //
    //Ligths
    scene.add(ambientLigth);
    scene.add(directionalLight);
    directionalLight.position.set(10, 10, 10);
    //
    document.getElementById("container3D").appendChild(renderer.domElement);

    thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, portalCamera1, portalCamera2, portalRenderTarget1, portalRenderTarget2, buildAdmin, portalLevel1, portalLevel2, raycasterCollitions, blockToPush, arboles, wall, wall2, cubeGravity, cubeGravity2, portalRenderTarget2Return, portalLevel2Return, portalCamera2Return, portalRenderTarget1Return, portalLevel1Return, portalCamera1Return);

    const cameraCenter = document.getElementById('camera-center');
    const deleteMobile = document.getElementById('delete-btn')
    const buildMobile = document.getElementById('build-btn')

    buildMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, true)
    })

    deleteMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, false)
    })

    cameraCenter.addEventListener('touchstart', (event) => {
        setMobileJump(jumpSpeed, playerBody);
    })

    document.addEventListener('keydown', (event) => {
        onKeyDown(event, keys, playerBody, controls, jumpSpeed, raycasterCollitions, elements);
        itemSelect = getItemSelect();
    }, false);

    document.addEventListener('keyup',
        (event) => { onKeyUp(event, keys) }, false
    );

    document.addEventListener('mousedown', (event) => {
        itemSelect = getItemSelect();
        mousePressed(event, world, scene, elements, raycaster, itemSelect, playerBody);
        console.log(Date.now() - timePlayed);
    }, false);

    document.addEventListener('mouseup', (event) => { mouseLeaved(event) }, false
    );

    window.addEventListener('resize',
        () => { onWindowResize(renderer, camera); }, false
    );
}

document.addEventListener("DOMContentLoaded", () => {
    getData().then(terrain => {
        try {
            terrainPhp = JSON.parse(terrain.terrain_base);
            buildsAdminPhp = JSON.parse(terrain.build_admin);
        } catch (error) {
            console.error('Error al convertir el string a array:', error);
        }
        init();
    });
})

export function setLevel(level) {
    globalLevel = Number(level);
}

export function getLevel() {
    return globalLevel;
}