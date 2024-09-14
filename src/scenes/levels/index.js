import scene from "../../utils/scene.js";
import camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import Plane from "../../components/shapes/plane.js";
import Terrain from '../../components/shapes/terrain.js'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/dist/esm/simplex-noise.js';
import terrainPreload from '../../tools/terrainPreload.js'
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

function init() {

    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

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
        controls = new OrbitControls( camera, renderer.domElement );
        isMobile.style.zIndex = "2";
    };

    const direction = new Vector3();
    let keys = {};
    let canJump = true; 
    let jumpSpeed = 6; 
    let isJumping = false;

    const playerMesh = new Cube([40, 30, 30], "../../../public/textures/wood.jpg").getMesh();
    scene.add(playerMesh);

    const playerBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(40, 30, 30),
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
        position: new CANNON.Vec3(50, 0.5, 51), // Position
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

    document.addEventListener('click', function () {
        if (detectDeviceType() === "Desktop")
            controls.lock();
    }, false);

    //controls pc
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

    function onKeyDown(event) {
        keys[event.code] = true;
        if (event.code === 'Space') {
            playerBody.velocity.y = jumpSpeed; // Apply jump speed
           
        }
    }

    function onKeyUp(event) {
        keys[event.code] = false;
    }
    // end controls pc
    // controls mobile
  /*  document.addEventListener('touchstart', () => {

        camera.rotateX(.1)
    })*/
    // End controls mobile
    const animate = () => {
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


        world.step(1 / 60);

        if (playerBody.position.y <= 0) {
            canJump = true;
        }

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);
        camera.position.copy(playerBody.position);
        // camera.position.y = (camera.position.y+2)
       
        cannonDebugger.update();

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}

document.addEventListener("DOMContentLoaded", () => {

    init()
})

