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
import { getData, getStats } from "../../essentials/BackendMethods/Php/fetchMethods.js";
import { generateTrees, getTrees, getTronco } from "../../tools/generateTrees.js";
import { buildLevel1 } from "./level1.js";
import { buildLevel2 } from "./level2.js";
import { updateStats } from "../../essentials/BackendMethods/Php/fetchMethods.js";
import { secondsToTime, getMinutes, timeToMilliseconds } from "../../tools/parseTime.js";
import UserBuild from "../../components/shapes/userBuilds.js";
import { setStyle } from "../../essentials/controlls/controlls.js";
import { createStatsLog } from "../../essentials/BackendMethods/Php/fetchMethods.js";
/*
TASKS
7. hacer una tabla de loggs de usuarios con la DURACION DE LAS SESSIONES DE JUEGO;
13. DOCUMENTAR TODO ////////////////////////////////

//opcional
10. agregar mas soporte a los comandos de voz  | menu | guardarPartida | estadisticas | etc.

*/
let globalLevel = Number(0);
let terrainPhp = [];
let buildsAdminPhp = [];
let tree_trunk = [];
let tree_leaves = [];
let newBlocksArray = [];
let collectables = [];

let timePlayed = Number(0);
let score = Number(0);
let blocksCollected = Number(1);
let falls = Number(0);
let totalTimePlayed = Number(0);
let levels_completed = Number(0);

function init() {
    timePlayed += Date.now();
    setStyle();
    //main camera and initialize music with him
    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 500).getCamera();
    camera.position.set(40, 3, 30);
    camera.lookAt(0, 0, 0)
    Music(camera);

    //raycast
    const raycaster = new Raycaster();
    const raycasterCollitions = new Raycaster();

    //world physics
    const world = new CANNON.World();

    //Debuger controls depends device
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

    //return Portal 2 camera
    const portalCamera2Return = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera2Return.position.set(24.5, -35, -455);
    portalLevel2Return.add(portalCamera2Return);

    //suelo 
    const planeFloor = new Floor([150, 0.5, 150], .5, "../../../public/textures/dirt.png", 0, [300, 300], world).getMesh();
    scene.add(planeFloor);

    //genera arboles y troncos para construir sus mallas
    //generateTrees(terrainPhp);
    const arboles = new Terrain(tree_leaves, "../../../public/textures/leaves.png", world, playerBody, 2);
    scene.add(arboles.getMesh());
    const troncoMesh = new Terrain(tree_trunk, "../../../public/textures/log.png", world, playerBody, 2);
    scene.add(troncoMesh.getMesh());

    //Generar malla de terreno
    const terrain = new Terrain(terrainPhp, "../../../public/textures/g_5.png", world, playerBody, 2);
    scene.add(terrain.getMesh());

    //Construcciones por defecto
    const buildAdmin = new Terrain(buildsAdminPhp, "../../../public/textures/brick_black.png", world, playerBody, 2);
    scene.add(buildAdmin.getMesh());

    //colisiones iniciales del raycast de la malla del terreno y suelo
    let elements = [planeFloor, terrain.getMesh(), buildAdmin.getMesh(), arboles.getMesh(), troncoMesh.getMesh()];

    if (newBlocksArray.length !== 0) {
        const userBuilds = new UserBuild(newBlocksArray, 1, world, 40, 0, scene).getMeshes();
        userBuilds.forEach(block => {
            elements.push(block);
        })
    }

    //nivel 1
    const blockToPush = new CubeMesh([360, 60, 165], "../../../public/textures/brick_black.png", 3, world, 100, 1);
    const collectableWood = new Cube([341, 41, 165], "../../../public/textures/g_5.png", .6, .6);
    buildLevel1(world, scene, elements, blockToPush, collectableWood);
    collectableWood.getMesh().visible = collectables[0] === false ? true : false;

    //nivel 2
    const wall = new PlaneConstructor([-47.8, 51.8, 193], "../../../public/textures/wood.jpg", [0.5, 0, 0.5], [7, 5], world);
    const wall2 = new PlaneConstructor([-47.8, 51.8, 206], "../../../public/textures/wood.jpg", [0.5, 0, 0.5], [7, 5], world);
    wall.coords = [-47.8, 51.8, 193];
    wall2.coords = [-47.8, 51.8, 206];
    const cubeGravity = new CubeMesh([-49, 48, 222], "../../../public/textures/sand.png", 2, world, 100);
    const cubeGravity2 = new CubeMesh([-49, 46, 232], "../../../public/textures/sand.png", 2, world, 100);
    cubeGravity.coords = [-49, 48, 222];
    cubeGravity2.coords = [-49, 46, 232];
    const collectableStone = new Cube([-49, 46.3, 243], "../../../public/textures/wood.jpg", .6, .6);
    buildLevel2(world, scene, elements, wall.getMesh(), wall2.getMesh(), cubeGravity.getMesh(), cubeGravity2.getMesh(), collectableStone.getMesh());
    collectableStone.getMesh().visible = collectables[1] === false ? true : false;
    //
    //Ligths
    scene.add(ambientLigth);
    scene.add(directionalLight);
    directionalLight.position.set(10, 10, 10);
    //
    document.getElementById("container3D").appendChild(renderer.domElement);

    thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, portalCamera1, portalCamera2, portalRenderTarget1, portalRenderTarget2, buildAdmin, portalLevel1, portalLevel2, raycasterCollitions, blockToPush, arboles, wall, wall2, cubeGravity, cubeGravity2, portalRenderTarget2Return, portalLevel2Return, portalCamera2Return, portalRenderTarget1Return, portalLevel1Return, portalCamera1Return, collectableWood.getMesh(), collectableStone.getMesh());

    const cameraCenter = document.getElementById('camera-center');
    const deleteMobile = document.getElementById('delete-btn')
    const buildMobile = document.getElementById('build-btn')

    buildMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, true, newBlocksArray)
    })

    deleteMobile.addEventListener('touchstart', () => {
        itemSelect = getItemSelect();
        screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, false, newBlocksArray)
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
        mousePressed(event, world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray);
    }, false);

    document.addEventListener('mouseup', (event) => { mouseLeaved(event) }, false
    );

    window.addEventListener('resize',
        () => { onWindowResize(renderer, camera); }, false
    );
}
//initialice game after bring all game info data and initialize variables 
document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("token")) {
        window.location.href = '../../../index.html';
    } else {
        getData().then(terrain => {
            try {
                terrainPhp = JSON.parse(terrain.terrain_base);
                buildsAdminPhp = JSON.parse(terrain.build_admin);
                tree_trunk = JSON.parse(terrain.tree_trunk);
                tree_leaves = JSON.parse(terrain.tree_leaves);
            } catch (error) {
                console.error('Error to parse el string a array:', error);
            }
            getStats({ "token": localStorage.getItem('token') })
                .then(stats => {
                    try {
                        console.log(stats);
                        console.log(localStorage.getItem('token'))
                        score = stats.score | 0;
                        totalTimePlayed = timeToMilliseconds(stats.time_played) | 0;
                        blocksCollected = stats.blocks_collected | 0;
                        falls = stats.falls | 0;
                        levels_completed = stats.levels_completed | 0;
                        console.log(score, blocksCollected, falls, levels_completed) | 0;
                        newBlocksArray = stats.builds_user ? JSON.parse(stats.builds_user) : [];
                        collectables = stats.collectables ? JSON.parse(stats.collectables) : [false, false, false, false, false, false, false];
                    } catch (error) {
                        console.error('Error to string a array:', error);
                        newBlocksArray = [];
                        collectables = [false, false, false, false, false, false, false];
                    }
                })
                .then(() => {
                    init();
                })
        });
    }
})

export function setLevel(level) {
    globalLevel = Number(level);
}

export function getLevel() {
    return globalLevel;
}
// function tu save data with plater stats
export async function saveData() {
    let result = await updateStats({
        "score": getScore(),
        "time_played": secondsToTime((((Date.now() + totalTimePlayed) - timePlayed)) / 1000),
        "blocks_collected": blocksCollected,
        "falls": falls,
        "token": localStorage.getItem('token'),
        "levels_completed": levels_completed,
        "builds_user": JSON.stringify(newBlocksArray),
        "collectables": JSON.stringify(collectables),
    });
    console.log(result.status === 201 ? 'save succesfully' : 'error on save');
}

export function increasefalls() {
    falls++;
}

export function levelsCompleted() {
    levels_completed++;
}

function getScore() {
    return (getMinutes(((Date.now() + totalTimePlayed) - timePlayed) / 1000) * 1) + score;
}

export function setScore(points) {
    score += points;
}

//function to update array of collectables 
export function updateCollectables(dirt = [0, false], wood = [0, false], stone = [0, 0], snow = [], sand = [], log = [], leaves = []) {
    if (dirt[0]) {
        collectables[0] = dirt[1];
        blocksCollected++;
    }
    if (wood[0]) {
        collectables[1] = wood[1];
        blocksCollected++;
    }
    if (stone[0]) {
        collectables[2] = stone[1];
        blocksCollected++;
    }
}

export function getCollectables() {
    return collectables;
}
//create user log 
export async function createLog(state) {
    createStatsLog({
        "length": (Date.now() - timePlayed) / 1000,
        "browser": navigator.userAgent,
        "screen": screen.width + "x" + screen.height,
        "level": globalLevel,
        "has_closed_browser": state
    });
}
