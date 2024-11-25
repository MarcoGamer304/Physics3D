import { Vector3, Clock } from 'three';
import { moveDirection } from '../controlls/controlls';
import { Vec3 } from 'cannon-es';
import { setLevel, getLevel, increasefalls, levelsCompleted, updateCollectables, setScore } from '../../scenes/levels';
import { updateItemsStyle } from '../controlls/controlls'; 

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

function thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain, cameraLevel1, cameraLevel2, portalRenderTarget1, portalRenderTarget2, buildAdmin, portalLevel1, portalLevel2, raycasterCollitions, blockToPush, arboles, wall, wall2, cubeGravity, cubeGravity2, portalRenderTarget2Return, portalLevel2Return, portalCamera2Return, portalRenderTarget1Return, portalLevel1Return, portalCamera1Return, collectableWood, collectableStone) {

    const animate = () => {
        moveDirection(keys, playerBody, direction, camera);

        raycaster.setFromCamera(new Vector3(0, 0, 0), camera);
        raycasterCollitions.setFromCamera(new Vector3(0, 0, 0), camera);
        raycasterCollitions.ray.direction.copy(new Vector3(0, -1, 0));

        world.step(1 / 60);

        resetItems(playerBody, blockToPush, camera, collectableWood, collectableStone);
        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        camera.position.copy(playerBody.position);
        camera.position.y += .5;

        minimap.position.set(playerBody.position.x, playerBody.position.y + 60, playerBody.position.z);
        //cannonDebugger.update();
        terrain.update();
        buildAdmin.update();
        blockToPush.update();
        arboles.update();
        wall.update();
        wall2.update();
        cubeGravity.update();
        cubeGravity2.update();

        collectableWood.rotation.x += 0.01;
        collectableWood.rotation.y += 0.01;
        collectableStone.rotation.x += 0.01;
        collectableStone.rotation.y += 0.01;

        portalCollitions(playerBody, [portalLevel1, portalLevel2, portalLevel2Return, portalLevel1Return], camera);
        level2Colitions(playerBody, [wall, wall2], [cubeGravity, cubeGravity2]);

        rendererCameras(renderer, portalRenderTarget1, portalRenderTarget2, minimap, scene, cameraLevel1, cameraLevel2, camera, portalRenderTarget2Return, portalCamera2Return, portalRenderTarget1Return, portalCamera1Return);
        camerasAnimated([cameraLevel1, cameraLevel2]);

        requestAnimationFrame(animate);
    };
    animate();
}

function rendererCameras(renderer, portalRenderTarget1, portalRenderTarget2, minimap, scene, cameraLevel1, cameraLevel2, camera, portalRenderTarget2Return, portalCamera2Return, portalRenderTarget1Return, portalCamera1Return) {
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
    //portal 1 return
    renderer.setRenderTarget(portalRenderTarget1Return);
    renderer.render(scene, portalCamera1Return);
    renderer.setRenderTarget(null);
    //portal2
    renderer.setRenderTarget(portalRenderTarget2);
    renderer.render(scene, cameraLevel2);
    renderer.setRenderTarget(null);
    //portal 2 return
    renderer.setRenderTarget(portalRenderTarget2Return);
    renderer.render(scene, portalCamera2Return);
    renderer.setRenderTarget(null);

    renderer.setScissorTest(false);
}

function cameraAnimation(camera, camMove) {
    if (camMove) {
        if (camera.position.y > 4) {
            camera.position.y -= 0.01;
            camera.position.z -= 0.01;
            camera.rotation.y -= 0.0001;
        } else {
            camMove = false;
        }
    } else {
        if (camera.position.y <= 4) {
            camera.position.y += 0.01;
            camera.position.z += 0.01;
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

function portalCollitions(playerBody, arrayPortales, camera) {
    if (!arrayPortales) return;

    arrayPortales.forEach(element => {
        const distance = playerBody.position.distanceTo(element.position);
        if (distance <= 1) {
            if (element.index === 1) {
                playerBody.position.set(400, 50, 165);
                setLevel(1);
            } else if (element.index == 1.1) {
                playerBody.position.set(100, 15, 154);
                setLevel(0);
                levelsCompleted();
            } else if (element.index === 0) {
                playerBody.position.set(-50, 50, 165);
                camera.lookAt(new Vector3(-70, 44, 900))
                setLevel(2);
            } else if (element.index === 0.1) {
                playerBody.position.set(100, 15, 154);
                setLevel(0);
                levelsCompleted();
            }
        }
    });
}

function resetItems(playerBody, blockToPush, camera, collectableWood, collectableStone) {
    if (playerBody.position.y <= -10) { increasefalls() }

    switch (getLevel()) {
        case 1:
            if (playerBody.position.y <= -10) {
                playerBody.position.set(400, 50, 165)
            }
            if (playerBody.position.distanceTo(collectableWood.position) <= .7) {
                if(collectableWood.visible === true){
                    updateCollectables([1,true],[]);
                    setScore(30);
                    updateItemsStyle();
                }
                collectableWood.visible = false;
                
            }
            if (blockToPush.getMesh().position.y <= 20) {
                blockToPush.reset(360, 70, 165);
            }
            break;
        case 2:
            if (playerBody.position.y <= -10) {
                playerBody.position.set(-50, 50, 165);
                camera.lookAt(new Vector3(-70, 44, 900))
            }
            if (playerBody.position.distanceTo(collectableStone.position) <= .7) {
                if(collectableStone.visible === true){
                    updateCollectables([],[1, true]);
                    setScore(30);
                    updateItemsStyle();
                }
               collectableStone.visible = false;
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

function level2Colitions(playerBody, walllv2, cubesl2) {
    if (!walllv2) return;
    if (!cubesl2) return;

    walllv2.forEach(wall => {
        const distance = wall.getBody().position.distanceTo(playerBody.position);
        if (distance <= 5) {
            wall.moveNegative([1, 0.02], [0, 0.01], [0, 0.01]);
        } else {
            wall.reset(wall.coords[0], wall.coords[1], wall.coords[2]);
        }
    });

    cubesl2.forEach(cube => {
        const distance = cube.getMesh().position.distanceTo(playerBody.position);
        if (distance <= 3) {
            cube.moveNegative([0, 0.01], [1, 0.01], [0, 0.01]);
        } else {
            cube.reset(cube.coords[0], cube.coords[1], cube.coords[2]);
        }
    })
}

export default thread