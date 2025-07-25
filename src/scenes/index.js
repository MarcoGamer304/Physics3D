import scene from "../utils/scene.js";
import Camera from "../utils/camera.js";
import renderer from "../utils/renderer.js";
import ambientLigth from "../components/ligths/ambientLigth.js";
import directionalLight from "../components/ligths/directionalLight.js";
import { Raycaster } from "three";
import * as CANNON from "cannon-es";
import { DeviceController } from "../tools/Device.js";
import Debugger from "../tools/debbuger.js";
import thread from "../essentials/gameLoop/thread.js";
import { onWindowResize } from "../tools/resizeWindow.js";
import {
  onKeyDown,
  onKeyUp,
  getItemSelect,
  mouseLeaved,
  mousePressed,
  setMobileJump,
  screenPressed,
} from "../essentials/controlls/controlls.js";
import Music from "../components/music/music.js";
import { generateTrees, getTrees, getTronco } from "../tools/generateTrees.js";
import { buildLevel1 } from "./levels/level1.js";
import { buildLevel2 } from "./levels/level2.js";
import { setStyle } from "../essentials/controlls/controlls.js";
import { generatePortals } from "./portals/portals.js";
import { portalArray } from "./portals/portalArray.js";
import { basicsObjects } from "./basics/basicsObjects.js";

let globalLevel = Number(0);

let newBlocksArray = [];
let collectables = [];

export function init(
  terrainPhp,
  buildsAdminPhp,
  tree_trunk,
  tree_leaves,
  newBlocksArrayParam,
  collectablesParam
) {
  newBlocksArray = newBlocksArrayParam;
  collectables = collectablesParam;
  setStyle();

  const camera = new Camera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    500
  ).getCamera();
  camera.position.set(40, 3, 30);
  camera.lookAt(0, 0, 0);
  Music(camera);
  const raycaster = new Raycaster();
  const raycasterCollitions = new Raycaster();
  const world = new CANNON.World();
  const cannonDebugger = Debugger(scene, world);
  const controls = DeviceController(camera, renderer);

  world.gravity.set(0, -9.82, 0);

  let itemSelect;
  let keys = {};
  let canJump = true;
  let jumpSpeed = 6;

  const { playerMesh, playerBody, minimap, elements, terrain, arboles, buildAdmin } = basicsObjects(
    world,
    scene,
    terrainPhp,
    tree_leaves,
    tree_trunk,
    buildsAdminPhp,
    newBlocksArray
  );

  const portalObjects = generatePortals(scene, portalArray);

  const { blockToPush, collectableWood } = buildLevel1(world, scene, elements);
  collectableWood.getMesh().visible = collectables[0] === false ? true : false;

  const { wall, wall2, cubeGravity, cubeGravity2, collectableStone } =
    buildLevel2(world, scene, elements);
  collectableStone.getMesh().visible = collectables[1] === false ? true : false;
  
  scene.add(ambientLigth);
  scene.add(directionalLight);
  directionalLight.position.set(10, 10, 10);
  
  document.getElementById("container3D").appendChild(renderer.domElement);

  thread(
    camera,
    raycaster,
    playerBody,
    keys,
    world,
    playerMesh,
    minimap,
    cannonDebugger,
    renderer,
    canJump,
    scene,
    terrain,
    buildAdmin,
    raycasterCollitions,
    blockToPush,
    arboles,
    wall,
    wall2,
    cubeGravity,
    cubeGravity2,
    collectableWood.getMesh(),
    collectableStone.getMesh(),
    portalObjects
  );

  const cameraCenter = document.getElementById("camera-center");
  const deleteMobile = document.getElementById("delete-btn");
  const buildMobile = document.getElementById("build-btn");

  buildMobile.addEventListener("touchstart", () => {
    itemSelect = getItemSelect();
    screenPressed(
      world,
      scene,
      elements,
      raycaster,
      itemSelect,
      playerBody,
      true,
      newBlocksArray
    );
  });

  deleteMobile.addEventListener("touchstart", () => {
    itemSelect = getItemSelect();
    screenPressed(
      world,
      scene,
      elements,
      raycaster,
      itemSelect,
      playerBody,
      false,
      newBlocksArray
    );
  });

  cameraCenter.addEventListener("touchstart", (event) => {
    setMobileJump(jumpSpeed, playerBody);
  });

  document.addEventListener(
    "keydown",
    (event) => {
      onKeyDown(
        event,
        keys,
        playerBody,
        controls,
        jumpSpeed,
        raycasterCollitions,
        elements
      );
      itemSelect = getItemSelect();
    },
    false
  );

  document.addEventListener(
    "keyup",
    (event) => {
      onKeyUp(event, keys);
    },
    false
  );

  document.addEventListener(
    "mousedown",
    (event) => {
      itemSelect = getItemSelect();
      mousePressed(
        event,
        world,
        scene,
        elements,
        raycaster,
        itemSelect,
        playerBody,
        newBlocksArray
      );
    },
    false
  );

  document.addEventListener(
    "mouseup",
    (event) => {
      mouseLeaved(event);
    },
    false
  );

  window.addEventListener(
    "resize",
    () => {
      onWindowResize(renderer, camera);
    },
    false
  );
}

export function setLevel(level) {
  globalLevel = Number(level);
}

export function getLevel() {
  return globalLevel;
}
