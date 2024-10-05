import { Vector3 } from "three";

function RemoveBlock(scene, elements, raycaster, world, playerBody) {
    const intersects = raycaster.intersectObjects(elements);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        
        // Delimite radius of raycast and player position
        const vector3Raycast = new Vector3(intersect.point.x, intersect.point.y, intersect.point.z)
        const distance = vector3Raycast.distanceTo(playerBody.position);
        if (distance > 15) { return }
        //

        for (let index = 0; index < scene.children.length; index++) {
            const element = scene.children[index];

            if (element.position.x === Math.round(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.round(intersect.point.z)) {
                for (let index = 0; index < world.bodies.length; index++) {
                    const elementBody = world.bodies[index];
                    if (element.position.x === elementBody.initPosition.x && element.position.y === elementBody.initPosition.y && element.position.z === elementBody.initPosition.z) {
                        world.removeBody(elementBody)
                        break;
                    }
                }
                scene.remove(element);
            }
            if (element.position.x === Math.floor(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.floor(intersect.point.z)) {
                for (let index = 0; index < world.bodies.length; index++) {
                    const elementBody = world.bodies[index];
                    if (element.position.x === elementBody.initPosition.x && element.position.y === elementBody.initPosition.y && element.position.z === elementBody.initPosition.z) {
                        world.removeBody(elementBody)
                        break;
                    }
                }
                scene.remove(element);
            }
        }
    }
}

export default RemoveBlock