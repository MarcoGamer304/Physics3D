import * as CANNON from 'cannon-es';

function PlaneColitions(world) {
    const terrainShape = new CANNON.Box(new CANNON.Vec3(50, 0.5, 48.5));
    const terrainBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(50, 0, 51),
        shape: terrainShape,
    });
    world.addBody(terrainBody);
}

export default PlaneColitions;