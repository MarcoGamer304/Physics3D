import CubeMesh from "../../components/shapes/cubeMesh.js";

const newBlocksArray = [];

function AddBlock(world, scene, elements, raycaster, itemSelect) {
  
    const intersects = raycaster.intersectObjects(elements);

    if (intersects.length > 0) {
        const intersect = intersects[0];

        const y = Math.floor(intersect.point.y) == 0 ? 1 : Math.round(intersect.point.y);
        const newCube = new CubeMesh([Math.round(intersect.point.x), y, Math.round(intersect.point.z)], itemSelect, 1, world).getMesh();
        const positionToCheck = [Math.round(intersect.point.x), y, Math.round(intersect.point.z)];

        const alreadyExists = newBlocksArray.some(block =>
            block[0] === positionToCheck[0] &&
            block[1] === positionToCheck[1] &&
            block[2] === positionToCheck[2]
        );

        if (alreadyExists) {
            const newCubeFix = new CubeMesh([Math.floor(intersect.point.x), y, Math.floor(intersect.point.z)], itemSelect, 1, world).getMesh();
            scene.add(newCubeFix);
            elements.push(newCubeFix);
            newBlocksArray.push([newCubeFix.position.x, newCubeFix.position.y, newCubeFix.position.z]);
        } else {
            scene.add(newCube);
            elements.push(newCube);
            newBlocksArray.push([newCube.position.x, newCube.position.y, newCube.position.z]);
        }
    }
}

export default AddBlock