import AddBlock from "../../essentials/mecanics/addBlocks.js";
import RemoveBlock from "../../essentials/mecanics/removeBlocks.js";
import { Vector3 } from 'three';
import { detectDeviceType } from "../../tools/Device.js";
import { saveData, getCollectables, createLog } from "../../scenes/levels/index.js";

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
const controllerCenter = document.getElementById('controller-center');

const cameraDown = document.getElementById("camera-down");
const cameraUp = document.getElementById("camera-up");
const cameraLeft = document.getElementById("camera-left");
const cameraRigth = document.getElementById("camera-right");

const buttons = document.getElementsByClassName('button');
const itemsBar = document.getElementsByClassName('block');
const elementList = document.getElementById('itemList');
const menuModal = document.getElementById('menuModal');
const menuBtn = document.getElementById('menuBtn');
const saveBtn = document.getElementById('saveBtn');
const menuModalBtn = document.getElementById('menuModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

const isPortrait = window.matchMedia("(orientation: portrait)").matches;
const itemList = document.getElementsByClassName('block');
const list = [...itemList]

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

let mobileSprint = false;

export function moveDirection(keys, playerBody, direction, camera) {

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    cameraRef = camera;

    let speedPositive = 0.06;
    if (keys['ShiftLeft'] || mobileSprint) {
        speedPositive = 0.11;
    }
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

export function onKeyDown(event, keys, playerBody, controls, jumpSpeed, raycasterColitions, elements) {
    keys[event.code] = true;

    if (event.code === 'Space') {
        const intersects = raycasterColitions.intersectObjects(elements);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            const vector3Raycast = new Vector3(intersect.point.x, intersect.point.y, intersect.point.z)
            const distance = vector3Raycast.distanceTo(playerBody.position);

            if (distance > 1.2 || intersect.point.y - playerBody.position.y > 0) {
                return;
            }
            playerBody.velocity.y = jumpSpeed;
        }
    }

    if (event.code === 'Enter') {
        controls.lock();
    }
    if (diccionario.has(event.code)) {
        let index = findMapIndex(diccionario.get(event.code));

        list.forEach((element, index) => {
            element.style.border = '4px solid rgba(212, 212, 212, 0.637)';
            if (getCollectables()[index] === false) {
                element.style.opacity = '.3';
            }
        });
        if (getCollectables()[index] === true) {
            item = diccionario.get(event.code)
            list[index].style.border = '5px solid rgba(0, 0, 0, 0.659)';
            list[index].style.opacity = '1';
        }
    }
}

export function updateItemsStyle() {
    list.forEach((element, index) => {
        element.style.border = '4px solid rgba(212, 212, 212, 0.637)';
        if (getCollectables()[index] === true) {
            element.style.opacity = '1';
        }
    });
}

export function setStyle() {
    list.forEach((element, index) => {
        if (getCollectables()[index] === false || getCollectables()[index] === undefined) {
            element.style.opacity = '.3';
        }
    });
}

function findMapIndex(keyFind) {
    const array = Array.from(diccionario.values());
    return array.indexOf(keyFind);
}

export function onKeyUp(event, keys) {
    keys[event.code] = false;
}

export function getItemSelect() {
    return item;
}

export function mousePressed(event, world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray) {
    if (detectDeviceType() !== 'Desktop') return;

    if (event.button === 0) {
        AddBlock(world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray);
        if (!pressIzq) {
            pressIzq = true;
            intervalIzq = setInterval(() => AddBlock(world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray), 150);
        }
    }
    if (event.button === 2) {
        RemoveBlock(scene, elements, raycaster, world, playerBody, newBlocksArray);
        if (!pressDr) {
            pressDr = true;
            intervalDr = setInterval(() => RemoveBlock(scene, elements, raycaster, world, playerBody, newBlocksArray), 150);
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

export function screenPressed(world, scene, elements, raycaster, itemSelect, playerBody, remove, newBlocksArray) {
    if (!remove) {
        AddBlock(world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray);
    }
    if (remove) {
        RemoveBlock(scene, elements, raycaster, world, playerBody, newBlocksArray);
    }
}

function ajustMobile() {
    for (let index = 0; index < buttons.length; index++) {
        const element = buttons[index];
        if (isPortrait) {
            elementList.style.marginTop = '70vh'
            element.style.width = '5vh';
            element.style.height = '5vh';

            for (let items of itemsBar) {
                items.style.width = '40px'
                items.style.height = '40px'
            }
        } else {
            element.style.width = '10vh';
            element.style.height = '10vh';
            if (detectDeviceType() === 'Mobile') {
                elementList.style.marginTop = '25%'

                for (let items of itemsBar) {
                    items.style.width = '3rem'
                    items.style.height = '3rem'
                }
            }
        }
    }
}

ajustMobile();

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

for (let index = 0; index < itemsBar.length; index++) {
    const element = itemsBar[index];

    element.addEventListener('touchstart', () => {
        list.forEach((itemBar, index) => {
            if (getCollectables()[index] === true) {
                element.style.opacity = '1';
                if (element.getAttribute('src') === itemBar.getAttribute('src')) {
                    item = '../../../' + itemBar.getAttribute('src');
                    element.style.border = '5px solid rgba(0, 0, 0, 0.659)';
                    element.style.opacity = '1';
                } else {
                    itemBar.style.border = '4px solid rgba(212, 212, 212, 0.637)';
                    element.style.opacity = '.3';
                }
            } else {
                itemBar.style.border = '4px solid rgba(212, 212, 212, 0.637)';
                itemBar.style.opacity = '.3';
            }
        })
    })
}

export function setMobileJump(jumpSpeed, playerBody) {
    playerBody.velocity.y = jumpSpeed;
}

function setMobileSprint() {
    if (mobileSprint) {
        mobileSprint = false;
    } else {
        mobileSprint = true;
    }
}

//mobile controller
controllerUp.addEventListener('touchstart', () => { directionUp = true; }, { passive: true });
controllerUp.addEventListener('touchend', () => { directionUp = false; }, { passive: true });

controllerDown.addEventListener('touchstart', () => { directionDawn = true; }, { passive: true });
controllerDown.addEventListener('touchend', () => { directionDawn = false; }, { passive: true });

controllerLeft.addEventListener('touchstart', () => { directionLeft = true; }, { passive: true });
controllerLeft.addEventListener('touchend', () => { directionLeft = false; }, { passive: true });

controllerRigth.addEventListener('touchstart', () => { directionRigth = true; }, { passive: true });
controllerRigth.addEventListener('touchend', () => { directionRigth = false; }, { passive: true });

controllerCenter.addEventListener('touchstart', () => {
    setMobileSprint()
}, { passive: true });

//Mobile camera
cameraUp.addEventListener('touchstart', () => { cameraDirection('up', cameraRef, true) }, { passive: true });
cameraUp.addEventListener('touchend', () => { cameraDirection('up', cameraRef, false) }, { passive: true });

cameraDown.addEventListener('touchstart', () => { cameraDirection('down', cameraRef, true) }, { passive: true });
cameraDown.addEventListener('touchend', () => { cameraDirection('down', cameraRef, false) }, { passive: true });

cameraLeft.addEventListener('touchstart', () => { cameraDirection('left', cameraRef, true) }, { passive: true });
cameraLeft.addEventListener('touchend', () => { cameraDirection('left', cameraRef, false) }, { passive: true });

cameraRigth.addEventListener('touchstart', () => { cameraDirection('right', cameraRef, true) }, { passive: true });
cameraRigth.addEventListener('touchend', () => { cameraDirection('right', cameraRef, false) }, { passive: true });

menuModalBtn.addEventListener('touchstart', () => { menuModal.showModal(); });

//Menu actions 
menuBtn.addEventListener('click', async () => {
    await saveData();
    await createLog(1).then(()=>{
        setTimeout(()=>{
            location.href = '../../../index.html';
        },1500)
     
    })
});

saveBtn.addEventListener('click', async () => { saveData(); createLog(0); menuModal.close(); });
closeModalBtn.addEventListener('click', () => { menuModal.close(); })

document.addEventListener('keydown', async (e) => {
    if (e.code === 'KeyG') {
        saveData();
        createLog(0);
    }
    if (e.code === 'Tab' || e.code === 'KeyE') {
        menuModal.showModal();
    }
})