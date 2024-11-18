import CubeMesh from "../../components/shapes/cubeMesh.js";
import PlaneConstructor from "../../components/shapes/PlaneColitions.js";


export function buildLevel2(world, scene, elements, wall, wall2,cubeGravity,cubeGravity2) {

    const floorLv2 = new PlaneConstructor([-50, 48, 165], "../../../public/textures/stone.png", [0, 0, 0], [5, 10], world).getMesh();

    const c1 = new CubeMesh([-51, 47, 175], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c2 = new CubeMesh([-55, 48, 180], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c3 = new CubeMesh([-49, 47, 185], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const inclinado = new PlaneConstructor([-50, 49, 193], "../../../public/textures/stone.png", [0, 0, 0], [5, 7], world).getMesh();
    const inclinadof9 = new PlaneConstructor([-50, 49, 206], "../../../public/textures/stone.png", [0, 0, 0], [5, 7], world).getMesh();
    const c4 = new CubeMesh([-51, 47, 217], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c5 = new CubeMesh([-53, 46, 227], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const finish3 = new PlaneConstructor([-49, 45, 243], "../../../public/textures/stone.png", [0, 0, 0], [5, 10], world).getMesh();

    scene.add(floorLv2, c1, c2, c3, inclinado, wall, wall2, inclinadof9, c4, c5, cubeGravity, cubeGravity2, finish3);
    elements.push(floorLv2, c1, c2, c3, inclinado, wall, wall2, inclinadof9, c4, c5, cubeGravity, cubeGravity2, finish3);
}


