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
import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/dist/esm/simplex-noise.js';
import terrainPreload from '../../tools/terrainPreload.js'
import * as CANNON from 'cannon-es';
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
        isMobile.style.zIndex = "2";
    };

    const direction = new Vector3();
    let keys = {};

    const Player = new Cube([0, 2, 0], "../../../public/textures/wood.jpg").getMesh();
    scene.add(Player);
/*
    const noise = new SimplexNoise();

    function generateMinecraftTerrain(width, height, scale) {
        const terrain = [];

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let z = Math.floor(noise.noise2D(x / scale, y / scale) * 10);

                z = Math.max(0, z);

                terrain.push([x, z, y]);
            }
        }
        return terrain;
    }

    const terrain = generateMinecraftTerrain(100, 100, 100);
*/
    const floor = new Terrain(terrainPreload,"../../../public/textures/g_5.png" , world).getMesh();
    scene.add(floor)

    scene.add(ambientLigth);
    scene.add(directionalLight);
    camera.position.set(0, 4, 0);

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
    }

    function onKeyUp(event) {
        keys[event.code] = false;
    }
    // end controls pc
    // controls mobile
    document.addEventListener('touchstart', () => {

        camera.rotateX(.1)
    })
    // End controls mobile

    const animate = () => {

        camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();
        const speedPositive = keys['ShiftLeft'] ? 0.6 : 0.04;
        if (keys['KeyW']) {
            Player.position.addScaledVector(direction, speedPositive);
            camera.position.addScaledVector(direction, speedPositive);
        }
        if (keys['KeyS']) {
            Player.position.addScaledVector(direction, -0.04);
            camera.position.addScaledVector(direction, -0.04);
        }
        if (keys['KeyA']) {
            const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
            Player.position.addScaledVector(right, -0.04);
            camera.position.addScaledVector(right, -0.04);
        }
        if (keys['KeyD']) {
            const right = new Vector3().crossVectors(direction, new Vector3(0, 1, 0)).normalize();
            Player.position.addScaledVector(right, 0.04);
            camera.position.addScaledVector(right, 0.04);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}

document.addEventListener("DOMContentLoaded", () => {

    init()
})

