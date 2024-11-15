import { Vector3, Clock } from 'three';
import { moveDirection } from '../controlls/controlls';
import { Vec3 } from 'cannon-es';
import { setLevel, getLevel } from '../../scenes/levels';
const isPortrait = window.matchMedia("(orientation: portrait)").matches;

let height;
let width;

let cam1Move = true;
let cam2Move = true;

if (isPortrait) {
    height = window.innerHeight * 50 / 100 < 200 ? 150 : 200;
    width = window.innerWidth * 20 / 100 < 200 ? 200 : 200;
} else {
    height = window.innerHeight * 50 / 100 < 200 ? 100 : 200;
    width = window.innerWidth * 20 / 100 < 200 ? 100 : 200;
}

function thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, cameraLevel1, cameraLevel2, portalRenderTarget1, portalRenderTarget2, buildAdmin, portalLevel1, portalLevel2, raycasterCollitions, blockToPush) {

    const animate = () => {
        moveDirection(keys, playerBody, direction, camera);

        raycaster.setFromCamera(new Vector3(0, 0, 0), camera);
        raycasterCollitions.setFromCamera(new Vector3(0, 0, 0), camera);
        raycasterCollitions.ray.direction.copy(new Vector3(0, -1, 0));

        world.step(1 / 60);

        resetItems(playerBody, blockToPush);
        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        camera.position.copy(playerBody.position);
        camera.position.y += .5;

        minimap.position.set(playerBody.position.x, playerBody.position.y + 60, playerBody.position.z);
        //cannonDebugger.update();
        terrain.update();
        buildAdmin.update();
        blockToPush.update();
        
        portalCollitions(playerBody, [portalLevel1, portalLevel2]);
        
        rendererCameras(renderer, portalRenderTarget1, portalRenderTarget2, minimap, scene, cameraLevel1, cameraLevel2, camera);
        camerasAnimated([cameraLevel1, cameraLevel2]);

        requestAnimationFrame(animate);
    };
    animate();
}

function rendererCameras(renderer, portalRenderTarget1, portalRenderTarget2, minimap, scene, cameraLevel1, cameraLevel2, camera) {
    //CubeCamera
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    //minmap
    renderer.setViewport(window.innerWidth - height - 20, window.innerHeight * 67 / 100, height, width);
    renderer.setScissor(window.innerWidth - height - 20, window.innerHeight * 67 / 100, height, width);
    renderer.setScissorTest(true);
    renderer.render(scene, minimap);
    //portal 
    renderer.setRenderTarget(portalRenderTarget1);
    renderer.render(scene, cameraLevel1);
    renderer.setRenderTarget(null);
    //portal2
    renderer.setRenderTarget(portalRenderTarget2);
    renderer.render(scene, cameraLevel2);
    renderer.setRenderTarget(null);

    renderer.setScissorTest(false);
}

function cameraAnimation(camera, camMove) {
    if (camMove) {
        if (camera.position.y >= 4) {
            camera.position.y -= 0.01;
            camera.position.z -= 0.02;
            camera.rotation.y -= 0.0001;
        } else {
            camMove = false;
        }
    } else {
        if (camera.position.y <= 6) {
            camera.position.y += 0.01;
            camera.position.z += 0.02;
            camera.rotation.y += 0.0001;
        } else {
            camMove = true;
        }
    }
    return camMove;
}

function camerasAnimated(cameras) {
    cam1Move = cameraAnimation(cameras[0], cam1Move);
    cam2Move = cameraAnimation(cameras[1], cam2Move);
}

function portalCollitions(playerBody, arrayPortales) {
    if (!arrayPortales) return;

    arrayPortales.forEach(element => {
        const distance = playerBody.position.distanceTo(element.position);
        if (distance <= 1) {
            console.log("portal: " + element.index);
            if (element.index === 1) {
                playerBody.position.set(400, 50, 165);
                setLevel(1);
            } else if (element.index === 0) {
                playerBody.position.set(150, 15, 200);
                setLevel(2);
            }
        }
    });
}

function resetItems(playerBody,blockToPush) {
    switch (getLevel()) {
        case 1:
            if (playerBody.position.y <= -10) {
                playerBody.position.set(400, 50, 165)
            }
            if (blockToPush.getMesh().position.y <= 20) {
                blockToPush.reset(360, 70, 165);
            }
            break;
        case 2:
            if (playerBody.position.y <= 30) {
                playerBody.position.set(360, 70, 165)
            }
            break;
        case 3:
            if (playerBody.position.y <= -10) {
                playerBody.position.set(360, 70, 165)
            }
            break;

        default:
            if (playerBody.position.y <= -10) {
                playerBody.position.set(100, 15, 154)
            }
            break;
    }
}

export default thread