import scene from "../../utils/scene.js";
import Camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import CubeMesh from "../../components/shapes/cubeMesh.js";
import Plane from "../../components/shapes/plane.js";
import Terrain from '../../components/shapes/terrain.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Vector3, Raycaster, Mesh } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import terrainPreload from '../../tools/terrainPreload.js'
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

function init() {

    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.01, 500).getCamera();
    camera.position.set(0, 2, 5);

    const raycaster = new Raycaster();

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const itemList = ["../../../public/textures/g_5.png", "../../../public/textures/wood.jpg", "../../../public/textures/stone.png", "../../../public/textures/snow.png", "../../../public/textures/sand.png", "../../../public/textures/log.png", "../../../public/textures/leaves.png"];
    let itemSelect = itemList[0];

    let controls;
    const isMobile = document.querySelector("#controller")

    const detectDeviceType = () =>
        /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
            ? 'Mobile'
            : 'Desktop';

    if (detectDeviceType() === 'Desktop') {
        controls = new PointerLockControls(camera, renderer.domElement);
        controls.lock();
    } else if (detectDeviceType() === 'Mobile') {
        controls = new OrbitControls(camera, renderer.domElement);
        isMobile.style.zIndex = "2";
    };

    const direction = new Vector3();
    let keys = {};
    let canJump = true;
    let jumpSpeed = 6;
    let isJumping = false;

    const playerMesh = new Cube([40, 1, 30], "../../../public/textures/wood.jpg", 1).getMesh();
    scene.add(playerMesh);

    const minimap = new Camera(90, 1, 0.01, 500).getCamera();
    minimap.position.set(playerMesh.position.x, 50, playerMesh.position.z);
    minimap.lookAt(playerMesh.position);

    const playerBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(40, 1, 30),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    });
    world.addBody(playerBody);

    const planeFloor = new Plane([49.5, 0.5, 51], .5, "../../../public/textures/dirt.png").getMesh();
    scene.add(planeFloor);

    const terrainMesh = new Terrain(terrainPreload, "../../../public/textures/g_5.png", world).getMesh();
    scene.add(terrainMesh);

    const terrainShape = new CANNON.Box(new CANNON.Vec3(50, 0.5, 48.5)); //size
    const terrainBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(50, 0, 51), // Position
        shape: terrainShape,
    });
    world.addBody(terrainBody);

    const cannonDebugger = new CannonDebugger(scene, world, {
        color: 0xffff00,
    });

    scene.add(ambientLigth);
    scene.add(directionalLight);
    camera.position.set(40, 3, 30);

    directionalLight.position.set(-10, 10, 10);

    window.addEventListener('resize', onWindowResize, false);
    document.getElementById("container3D").appendChild(renderer.domElement);

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

    const elements = [planeFloor];
    const newBlocksArray = [];

    function addBlock() {
        const intersects = raycaster.intersectObjects(elements);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            const y = Math.floor(intersect.point.y) == 0 ? 1 : Math.round(intersect.point.y);
            const newCube = new CubeMesh([Math.round(intersect.point.x), y, Math.round(intersect.point.z)], itemSelect, 1, world).getMesh();
            const positionToCheck = [Math.round(intersect.point.x), y, Math.round(intersect.point.z)];

            const alreadyExists = newBlocksArray.some(block =>
                block[0] === positionToCheck[0] &&
                block[1] === positionToCheck[1] &&
                block[2] === positionToCheck[2]
            );

            if (alreadyExists) {
                const newCubeFix = new CubeMesh([Math.floor(intersect.point.x), y, Math.floor(intersect.point.z)], itemSelect, 1, world).getMesh();
                scene.add(newCubeFix);
                elements.push(newCubeFix);
                newBlocksArray.push([newCubeFix.position.x, newCubeFix.position.y, newCubeFix.position.z]);
            } else {
                scene.add(newCube);
                elements.push(newCube);
                newBlocksArray.push([newCube.position.x, newCube.position.y, newCube.position.z]);
            }
        }
    }

    function removeBlock() {
        const intersects = raycaster.intersectObjects(elements);

        if (intersects.length > 0) {
            const intersect = intersects[0];

            for (let index = 0; index < scene.children.length; index++) {
                const element = scene.children[index];
                if (element.position.x === Math.round(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.round(intersect.point.z)) {
                    scene.remove(element);
                }
                if (element.position.x === Math.floor(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.floor(intersect.point.z)) {
                    scene.remove(element);
                }
            }
        }
    }

    //controls pc
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    function onKeyDown(event) {
        keys[event.code] = true;
        if (event.code === 'Space') {
            playerBody.velocity.y = jumpSpeed;
        }
        if (event.code === 'Enter') {
            if (detectDeviceType() === "Desktop") {
                controls.lock();
            }
        }

        switch (event.code) {
            case 'Digit1':
                itemSelect = itemList[0];
                break;
            case 'Digit2':
                itemSelect = itemList[1];
                break;
            case 'Digit3':
                itemSelect = itemList[2];
                break;
            case 'Digit4':
                itemSelect = itemList[3];
                break;
            case 'Digit5':
                itemSelect = itemList[4];
                break;
            case 'Digit6':
                itemSelect = itemList[5];
                break;
            case 'Digit7':
                itemSelect = itemList[6];
                break;
        }
    }

    function onKeyUp(event) {
        keys[event.code] = false;
    }

    let press = false;
    let intervalId = null;

    document.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            addBlock();
            if (!press) {
                press = true;
                intervalId = setInterval(addBlock, 100);
            }
        }
        if (event.button === 2) {
            removeBlock();
        }
    }, false);

    document.addEventListener('mouseup', function (event) {
        if (event.button === 0) {
            press = false;
            clearInterval(intervalId);
        }
    }, false);

    // end controls pc
    // controls mobile
    /*  document.addEventListener('touchstart', () => {
  itemSelect
          camera.rotateX(.1)
      })*/
    // End controls mobile
    const animate = () => {

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        raycaster.setFromCamera(new Vector3(0, 0, 0), camera);

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

        world.step(1 / 60);

        if (playerBody.position.y <= 0) {
            canJump = true;
        }

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);
        camera.position.copy(playerBody.position);
        camera.position.y += .5;
        minimap.position.set(playerBody.position.x, playerBody.position.y + 40, playerBody.position.z);
        // camera.rotation.y += 0.0050;
        cannonDebugger.update();

        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        const size = 200;
        renderer.setViewport(window.innerWidth - size - 20, 490, size, size);
        renderer.setScissor(window.innerWidth - size - 20, 490, size, size);
        renderer.setScissorTest(true);
        renderer.render(scene, minimap);

        renderer.setScissorTest(false);
        requestAnimationFrame(animate);
    };
    animate();
}

document.addEventListener("DOMContentLoaded", () => {
    init()
})

