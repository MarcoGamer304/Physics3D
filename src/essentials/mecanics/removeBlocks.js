function RemoveBlock(scene, elements, raycaster) {
    const intersects = raycaster.intersectObjects(elements);

    if (intersects.length > 0) {
        const intersect = intersects[0];

        for (let index = 0; index < scene.children.length; index++) {
            const element = scene.children[index];
            if (element.position.x === Math.round(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.round(intersect.point.z)) {
                scene.remove(element);
            }
            if (element.position.x === Math.floor(intersect.point.x) && element.position.y === Math.round(intersect.point.y) && element.position.z === Math.floor(intersect.point.z)) {
                scene.remove(element);
            }
        }
    }
}

export default RemoveBlock