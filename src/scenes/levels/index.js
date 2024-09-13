import scene from "../../utils/scene.js";
import camera from "../../utils/camera.js";
import renderer from "../../utils/renderer.js";
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import Cube from "../../components/shapes/cube.js";
import Plane from "../../components/shapes/plane.js";
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { Vector3 } from 'three';

function init() {

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

    const Player = new Cube(1, 0xf00f0f0, 0, 0, "../../../public/textures/wood.jpg").getMesh();
    scene.add(Player);

    const cube2 = new Cube(2, 0x00ff00, 0, 0, "../../../public/textures/images.jfif").getMesh();
    scene.add(cube2);

    const cube3 = new Cube(3, 0x00ff00, 0, 0, "../../../public/textures/images.jfif").getMesh();
    scene.add(cube3);

    const cube4 = new Cube(2, 0x00ff00, 1, 0, "../../../public/textures/images.jfif").getMesh();
    scene.add(cube4);

    const planeFloor = new Plane(0, 0, 0, .5, "../../../public/textures/pared.png").getMesh();
    scene.add(planeFloor);

    const paredAdelante = new Plane(0, 15, -15, 0, "../../../public/textures/pared.png").getMesh();
    scene.add(paredAdelante)

    const paredAtras = new Plane(0, 15, 15, 0, "../../../public/textures/pared.png").getMesh();
    scene.add(paredAtras)

    const paredIzquierda = new Plane(15, 15, 0, 0, "../../../public/textures/pared.png", .5).getMesh();
    scene.add(paredIzquierda)

    const paredDerecha = new Plane(-15, 15, 0, 0, "../../../public/textures/pared.png", .5).getMesh();
    scene.add(paredDerecha);

    scene.add(ambientLigth);
    scene.add(directionalLight);
    camera.position.set(0, 1, 0);


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
        const speedPositive = keys['ShiftLeft'] ? 0.07 : 0.04;
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
    init();
})

