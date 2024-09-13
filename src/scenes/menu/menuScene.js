import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import Cube from "../../components/shapes/cube.js";
import scene from "../../utils/scene.js";
import camera from "../../utils/camera.js";  
import renderer from "../../utils/renderer.js"; 
import ambientLigth from "../../components/ligths/ambientLigth.js"
import directionalLight from "../../components/ligths/directionalLight.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

function init() {
    const loader = new GLTFLoader();

    console.log(scene)

    const cube1 = new Cube(1, 0x000fff, 2,3).getMesh();
    scene.add(cube1)

    scene.add(ambientLigth);
    camera.position.set(0, 1, 10);

    scene.add(directionalLight);
    directionalLight.position.set(-10, 10, 10);

    window.addEventListener('resize', onWindowResize, false);

    let object;
    let objToRender = 'city';

    const topLigth = new THREE.DirectionalLight(0xffffff, 1);
    topLigth.position.set(500, 500, 500)
    topLigth.castShadow = true;
    scene.add(topLigth)
    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    scene.add(ambientLight);



    loader.load(
        `models/${objToRender}/scene.gltf`,
        function (gltf) {
            object = gltf.scene;

            object.traverse((child) => {
                if (child.isMesh) {
                    if (!child.material.onBeforeRender) {
                        child.material.onBeforeRender = function () {}; 
                    }
                }
            });

            scene.add(object);
        },
        function (xhr) {
            alert((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error(error);
            alert(error);
        }
    );

    let controls;
    controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("container3D").appendChild(renderer.domElement);

    function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(init, 100);
});

