import CubeMesh from "../../components/shapes/cubeMesh.js";
import { Vector3 } from "three";

function AddBlock(world, scene, elements, raycaster, itemSelect, playerBody, newBlocksArray) {

    if(!itemSelect){ return; }
    const intersects = raycaster.intersectObjects(elements);

    //intersects if raycast collition to any on elements array
    if (intersects.length > 0) {
        const intersect = intersects[0];

        // Delimite radius of raycast and player position
        const vector3Raycast = new Vector3(intersect.point.x, intersect.point.y, intersect.point.z)
        const distance = vector3Raycast.distanceTo(playerBody.position);
        if (distance > 15) { return }
        //

        const y = Math.floor(intersect.point.y) == 0 ? 1 : Math.round(intersect.point.y);
        const newCube = new CubeMesh([Math.round(intersect.point.x), y, Math.round(intersect.point.z)], itemSelect, 1, world).getMesh();
        const positionToCheck = [Math.round(intersect.point.x), y, Math.round(intersect.point.z)];

        // check if block exist in that position
        const alreadyExists = newBlocksArray.some(block =>
            block[0] === positionToCheck[0] &&
            block[1] === positionToCheck[1] &&
            block[2] === positionToCheck[2]
        );

        if (alreadyExists) {
            if (y <= 40) {
                const newCubeFix = new CubeMesh([Math.floor(intersect.point.x), y, Math.floor(intersect.point.z)], itemSelect, 1, world).getMesh();
                scene.add(newCubeFix);
                elements.push(newCubeFix);
                newBlocksArray.push([newCubeFix.position.x, newCubeFix.position.y, newCubeFix.position.z, itemSelect]);
            }

        } else {
            if (y <= 40) {
                scene.add(newCube);
                elements.push(newCube);
                newBlocksArray.push([newCube.position.x, newCube.position.y, newCube.position.z, itemSelect]);
            }
        }
    }
}

export default AddBlock
