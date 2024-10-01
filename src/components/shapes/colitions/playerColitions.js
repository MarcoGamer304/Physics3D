import * as CANNON from 'cannon-es';

function PlayerColitions(world) {
    const playerBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(96, 2, 159),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    });
    world.addBody(playerBody);

    return playerBody
}

export default PlayerColitions;