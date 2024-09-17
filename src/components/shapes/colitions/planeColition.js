import * as CANNON from 'cannon-es';

function PlaneColitions(world) {
    const terrainShape = new CANNON.Box(new CANNON.Vec3(150, 0.5, 150));
    const terrainBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(150, 0, 150),
        shape: terrainShape,
    });
    world.addBody(terrainBody);
}

export default PlaneColitions;