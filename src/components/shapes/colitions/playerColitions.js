import * as CANNON from 'cannon-es';

//Creates a Cannon-es body that is used as the player's collision
function PlayerColitions(world) {
    const playerBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(115, 4, 165),
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        material: new CANNON.Material({friction: 1, restitution: 0}),
        angularDamping: 1
    });

    world.addBody(playerBody);

    return playerBody
}

export default PlayerColitions;