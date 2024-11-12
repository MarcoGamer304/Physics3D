import * as CANNON from 'cannon-es';

function PlayerColitions(world) {
    const playerBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(115, 4, 165),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        material: new CANNON.Material({friction: 0, restitution: 0}),
    });
    world.addBody(playerBody);

    return playerBody
}

export default PlayerColitions;