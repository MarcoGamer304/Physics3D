import AddBlock from "../../essentials/mecanics/addBlocks.js";
import RemoveBlock from "../../essentials/mecanics/removeBlocks.js";
import { Vector3 } from 'three';

let item;
let pressIzq = false;
let intervalIzq = null;
let pressDr = false;
let intervalDr = null;

const diccionario = new Map([
    ['Digit1', "../../../public/textures/g_5.png"],
    ['Digit2', "../../../public/textures/wood.jpg"],
    ['Digit3', "../../../public/textures/stone.png"],
    ['Digit4', "../../../public/textures/snow.png"],
    ['Digit5', "../../../public/textures/sand.png"],
    ['Digit6', "../../../public/textures/log.png"],
    ['Digit7', "../../../public/textures/leaves.png"]
]);

export function moveDirection(keys, playerBody, direction, camera){

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const speedPositive = keys['ShiftLeft'] ? 0.2 : 0.08;
    if (keys['KeyW']) {
        playerBody.position.vadd(direction.multiplyScalar(speedPositive), playerBody.position);
    }
    if (keys['KeyS']) {
        playerBody.position.vsub(direction.multiplyScalar(0.04), playerBody.position);
    }
    if (keys['KeyA']) {
        const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        playerBody.position.vsub(right.multiplyScalar(0.04), playerBody.position);
    }
    if (keys['KeyD']) {
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
        RemoveBlock(scene, elements, raycaster);
        if (!pressDr) {
            pressDr = true;
            intervalDr = setInterval(() => RemoveBlock(scene, elements, raycaster), 150);
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

