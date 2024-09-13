import scene from "../../utils/scene.js";
import camera from "../../utils/camera.js";  
import renderer from "../../utils/renderer.js"; 
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import plane from "../../components/shapes/plane.js";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Vector3 } from 'three';

const controls = new PointerLockControls(camera, renderer.domElement);
const direction = new Vector3();
let keys = {};


const cube1 = new Cube(1, 0xf00f0f0).getMesh();
const cube2 = new Cube(2, 0xffff00).getMesh();

const cube3 = new Cube(1.5, 0xf00f0f0, 2, 2).getMesh();
const cube4 = new Cube(0.5, 0xf00f0f0, 3, 3).getMesh();
scene.add(cube3, cube4)

scene.add(cube1);
scene.add(cube2);
scene.add(ambientLigth);
scene.add(directionalLight);
scene.add(plane);
camera.position.set(0, 1, 0);

directionalLight.position.set(-10, 10, 10);

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

document.addEventListener('click', function () {
    controls.lock();
}, false);

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function onKeyDown(event) {
    keys[event.code] = true;
}

function onKeyUp(event) {
    keys[event.code] = false;
}

const detectDeviceType = () =>
    /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

if (detectDeviceType() === 'Desktop') {
    controls.lock();
};

const animate = () => {
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    const speedPositive = keys['ShiftLeft'] ? 0.1 : 0.04;
    if (keys['KeyW']) {
        cube1.position.addScaledVector(direction, speedPositive);
        camera.position.addScaledVector(direction, speedPositive);
    }
    if (keys['KeyS']) {
        cube1.position.addScaledVector(direction, -0.04);
        camera.position.addScaledVector(direction, -0.04);
    }
    if (keys['KeyA']) {
        const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        cube1.position.addScaledVector(right, -0.04);
        camera.position.addScaledVector(right, -0.04);
    }
    if (keys['KeyD']) {
        const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
        cube1.position.addScaledVector(right, 0.04);
        camera.position.addScaledVector(right, 0.04);
    }


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

