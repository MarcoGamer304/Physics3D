import { Vector3 } from 'three';
import { moveDirection } from '../controlls/controlls';
const size = 200;

function thread(camera, direction, raycaster, playerBody, keys, world, playerMesh, minimap, cannonDebugger, renderer, canJump, scene) {
    const animate = () => {

        moveDirection(keys, playerBody, direction, camera);

        raycaster.setFromCamera(new Vector3(0, 0, 0), camera);
        world.step(1 / 60);

        playerMesh.position.copy(playerBody.position);
        playerMesh.quaternion.copy(playerBody.quaternion);

        camera.position.copy(playerBody.position);
        camera.position.y += .5;

        minimap.position.set(playerBody.position.x, playerBody.position.y + 40, playerBody.position.z);
        cannonDebugger.update();

        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        renderer.setViewport(window.innerWidth - size - 20, 490, size, size);
        renderer.setScissor(window.innerWidth - size - 20, 490, size, size);
        renderer.setScissorTest(true);
        renderer.render(scene, minimap);

        renderer.setScissorTest(false);
        requestAnimationFrame(animate);
    };
    animate();
}

export default thread