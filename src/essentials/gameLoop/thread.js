import { Vector3 } from 'three';
import { moveDirection } from '../controlls/controlls';

const isPortrait = window.matchMedia("(orientation: portrait)").matches;

let height;
let width;

if (isPortrait) {
     height = window.innerHeight * 50 / 100 < 200 ? 150 : 200;
     width = window.innerWidth * 20 / 100 < 200 ? 200 : 200;
} else {
     height = window.innerHeight * 50 / 100 < 200 ? 100 : 200;
     width = window.innerWidth * 20 / 100 < 200 ? 100 : 200;
}

function thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene, terrain) {

    const animate = () => {

        moveDirection(keys, playerBody, direction, camera);

        raycaster.setFromCamera(new Vector3(0, 0, 0), camera);
        world.step(1 / 60);

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        camera.position.copy(playerBody.position);
        camera.position.y += .5;
        //camera.rotation.y += .01
        minimap.position.set(playerBody.position.x, playerBody.position.y + 60, playerBody.position.z);
        cannonDebugger.update();
        terrain.update();
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        renderer.setViewport(window.innerWidth - height - 20, window.innerHeight * 67 / 100, height, width);
        renderer.setScissor(window.innerWidth - height - 20, window.innerHeight * 67 / 100, height, width);
        renderer.setScissorTest(true);
        renderer.render(scene, minimap);

        renderer.setScissorTest(false);
        requestAnimationFrame(animate);
    };
    animate();
}

export default thread