import AddBlock from "../../essentials/mecanics/addBlocks.js";
import RemoveBlock from "../../essentials/mecanics/removeBlocks.js";
import { Vector3 } from 'three';

let item;
let pressIzq = false;
let intervalIzq = null;
let pressDr = false;
let intervalDr = null;
let cameraRef;

const controllerDown = document.getElementById("controller-down");
const controllerUp = document.getElementById("controller-up");
const controllerLeft = document.getElementById("controller-left");
const controllerRigth = document.getElementById("controller-rigth");

const cameraDown = document.getElementById("camera-down");
const cameraUp = document.getElementById("camera-up");
const cameraLeft = document.getElementById("camera-left");
const cameraRigth = document.getElementById("camera-right");

const buttons = document.getElementsByClassName('button');
const isPortrait = window.matchMedia("(orientation: portrait)").matches;

const diccionario = new Map([
    ['Digit1', "../../../public/textures/g_5.png"],
    ['Digit2', "../../../public/textures/wood.jpg"],
    ['Digit3', "../../../public/textures/stone.png"],
    ['Digit4', "../../../public/textures/snow.png"],
    ['Digit5', "../../../public/textures/sand.png"],
    ['Digit6', "../../../public/textures/log.png"],
    ['Digit7', "../../../public/textures/leaves.png"]
]);

let directionUp = false;
let directionDawn = false;
let directionLeft = false;
let directionRigth = false;

let directionCameraUp = false;
let directionCameraDawn = false;
let directionCameraLeft = false;
let directionCameraRigth = false;

export function moveDirection(keys, playerBody, direction, camera) {

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    cameraRef = camera;

    const speedPositive = keys['ShiftLeft'] ? 0.4 : 0.08;
    if (keys['KeyW'] || directionUp) {
        playerBody.position.vadd(direction.multiplyScalar(speedPositive), playerBody.position);
    }
    if (keys['KeyS'] || directionDawn) {
        playerBody.position.vsub(direction.multiplyScalar(0.04), playerBody.position);
    }
    if (keys['KeyA'] || directionLeft) {
        const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        playerBody.position.vsub(right.multiplyScalar(0.04), playerBody.position);
    }
    if (keys['KeyD'] || directionRigth) {
        const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        playerBody.position.vadd(right.multiplyScalar(0.04), playerBody.position);
    }
}

export function onKeyDown(event, keys, playerBody, controls, jumpSpeed) {
    keys[event.code] = true;
    if (event.code === 'Space') {
        playerBody.velocity.y = jumpSpeed;
    }
    if (event.code === 'Enter') {
        controls.lock();
    }
    if (diccionario.has(event.code)) {
        item = diccionario.get(event.code)
    }
}

export function onKeyUp(event, keys) {
    keys[event.code] = false;
}

export function getItemSelect() {
    return item;
}

export function mousePressed(event, world, scene, elements, raycaster, itemSelect) {
    if (event.button === 0) {
        AddBlock(world, scene, elements, raycaster, itemSelect);
        if (!pressIzq) {
            pressIzq = true;
            intervalIzq = setInterval(() => AddBlock(world, scene, elements, raycaster, itemSelect), 150);
        }
    }
    if (event.button === 2) {
        RemoveBlock(scene, elements, raycaster, world);
        if (!pressDr) {
            pressDr = true;
            intervalDr = setInterval(() => RemoveBlock(scene, elements, raycaster, world), 150);
        }
    }
}

export function mouseLeaved(event) {
    if (event.button === 0) {
        pressIzq = false;
        clearInterval(intervalIzq);
    }
    if (event.button === 2) {
        pressDr = false;
        clearInterval(intervalDr);
    }
}

function ajustMobile(){
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        if (isPortrait) {
            element.style.width = '5vh';
            element.style.height = '5vh';
        } else {
            element.style.width = '10vh';
            element.style.height = '10vh';
        }
    }
}

export function cameraDirection(direccion, camera, estado = false) {
    if (!camera) return;
    if (direccion === 'up' && estado === true) {
        directionCameraUp = setInterval(() => {
            camera.rotateX(0.03)
        }, 20);
    } else if (direccion === 'up' && estado === false) {
        clearInterval(directionCameraUp);
    }
    if (direccion === 'down' && estado === true) {
        directionCameraDawn = setInterval(() => {
            camera.rotateX(-0.03)
        }, 20);
    } else if (direccion === 'down' && estado === false) {
        clearInterval(directionCameraDawn);
    }
    if (direccion === 'left' && estado === true) {
        directionCameraLeft = setInterval(() => {
            camera.rotateY(0.03)
        }, 20);
    } else if (direccion === 'left' && estado === false) {
        clearInterval(directionCameraLeft);
    }
    if (direccion === 'right' && estado === true) {
        console.log('pressed')
        directionCameraRigth = setInterval(() => {
            camera.rotateY(-0.03)
        }, 20);
    } else if (direccion === 'right' && estado === false) {
        clearInterval(directionCameraRigth);
    }
}

ajustMobile()
//mobile controller
controllerUp.addEventListener('touchstart', () => { directionUp = true; }, { passive: true });
controllerUp.addEventListener('touchend', () => { directionUp = false; }, { passive: true });

controllerDown.addEventListener('touchstart', () => { directionDawn = true; }, { passive: true });
controllerDown.addEventListener('touchend', () => { directionDawn = false; }, { passive: true });

controllerLeft.addEventListener('touchstart', () => { directionLeft = true; }, { passive: true });
controllerLeft.addEventListener('touchend', () => { directionLeft = false; }, { passive: true });

controllerRigth.addEventListener('touchstart', () => { directionRigth = true; }, { passive: true });
controllerRigth.addEventListener('touchend', () => { directionRigth = false; }, { passive: true });

//Mobile camera
cameraUp.addEventListener('touchstart', () => { cameraDirection('up', cameraRef, true) }, { passive: true });
cameraUp.addEventListener('touchend', () => { cameraDirection('up', cameraRef, false) }, { passive: true });

cameraDown.addEventListener('touchstart', () => { cameraDirection('down', cameraRef, true) }, { passive: true });
cameraDown.addEventListener('touchend', () => { cameraDirection('down', cameraRef, false) }, { passive: true });

cameraLeft.addEventListener('touchstart', () => { cameraDirection('left', cameraRef, true) }, { passive: true });
cameraLeft.addEventListener('touchend', () => { cameraDirection('left', cameraRef, false) }, { passive: true });

cameraRigth.addEventListener('touchstart', () => { cameraDirection('right', cameraRef, true) }, { passive: true });
cameraRigth.addEventListener('touchend', () => { cameraDirection('right', cameraRef, false) }, { passive: true });

