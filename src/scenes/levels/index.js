import scene from "../../utils/scene.js";
import Camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import CubeMesh from "../../components/shapes/cubeMesh.js";
import Floor from "../../components/shapes/Floor.js";
import Terrain from '../../components/shapes/terrain.js'
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
import { buildLevel1 } from "./level1.js";
/*
TASKS
5. sesiones
7. Implementar inventario | menus  
9.Agregar enemigos

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
    portalLevel1.rotateY(-29.84)
    scene.add(portalLevel1)

    const portalCamera1 = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera1.position.set(150, 5, 150);
    portalLevel1.add(portalCamera1);
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
    const planeFloor = new Floor([150, 0.5, 150], .5, "../../../public/textures/dirt.png", 0, [300, 300], world).getMesh();
    scene.add(planeFloor);

    const tree = [
        [130, 2, 166], [130, 3, 166], [130, 4, 166], [131, 4, 166], [130, 4, 167], [131, 4, 167],
        [130, 4, 165], [130, 4, 165], [131, 4, 165], [129, 4, 166], [129, 4, 167], [129, 4, 165],
        [130, 5, 166], [129, 5, 165], [130, 5, 165], [131, 5, 165], [131, 5, 166], [131, 5, 167],
        [130, 5, 167], [129, 5, 167], [129, 5, 166], [130, 6, 166], [132, 5, 167], [132, 5, 166],
        [132, 5, 165], [131, 5, 168], [130, 5, 168], [129, 5, 168], [128, 5, 166], [128, 5, 167],
        [128, 5, 165], [128, 5, 164], [131, 5, 164], [130, 5, 164], [129, 5, 164], [131, 6, 165],
        [131, 6, 166], [131, 6, 167], [130, 6, 167], [129, 6, 167], [129, 6, 166], [130, 6, 165],
        [129, 6, 165], [130, 7, 166]
    ];

    let trees = [];
    let tronco = [];

    for (let index = 0; index < terrainPhp.length; index++) {
        const terr = terrainPhp[index];
        if (terr[1] > 1) {
            let random = Math.random();
            if (random < 0.008) {
                for (let index = 0; index < tree.length; index++) {
                    const element = tree[index];

                    let diferenciaX = element[0] - tree[0][0];
                    let diferenciaY = element[1] - tree[0][1];
                    let diferenciaZ = element[2] - tree[0][2];

                    if (index <= 1) {
                        tronco.push([terr[0] + diferenciaX, terr[1] + diferenciaY + 1, terr[2] + diferenciaZ]);
                    }
                    trees.push([terr[0] + diferenciaX, terr[1] + diferenciaY + 1, terr[2] + diferenciaZ]);
                }
            }
        }
    }
    const arboles = new Terrain(trees, "../../../public/textures/leaves.png", world, playerBody, 2);
    scene.add(arboles.getMesh());

    const troncoMesh = new Terrain(tronco, "../../../public/textures/log.png", world, playerBody, 2);
    scene.add(troncoMesh.getMesh());
    /*
    console.log("hojas");
    console.log(JSON.stringify(trees, null, ""));

    console.info("troncos");
    console.info(JSON.stringify(tronco, null, ""));
    */
    const terrain = new Terrain(terrainPhp, "../../../public/textures/g_5.png", world, playerBody, 2);
    scene.add(terrain.getMesh());
    //build
    const buildAdmin = new Terrain(buildsAdminPhp, "../../../public/textures/brick_black.png", world, playerBody, 2);
    scene.add(buildAdmin.getMesh());

    //colisiones iniciales del raycast de la malla del terreno y suelo
    let elements = [planeFloor, terrain.getMesh(), buildAdmin.getMesh(), arboles.getMesh(), troncoMesh.getMesh()];

    //nivel 1
    const blockToPush = new CubeMesh([360, 60, 165], "../../../public/textures/brick_black.png", 3, world, 100, 2);
    buildLevel1(world, scene, elements, blockToPush);
    //
    //Ligths
    scene.add(ambientLigth);
    scene.add(directionalLight);
    directionalLight.position.set(10, 10, 10);
    //
    document.getElementById("container3D").appendChild(renderer.domElement);

    thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, portalCamera1, portalCamera2, portalRenderTarget1, portalRenderTarget2, buildAdmin, portalLevel1, portalLevel2, raycasterCollitions, blockToPush, arboles);

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
    globalLevel = level;
}

export function getLevel() {
    return globalLevel;
}



