import Cube from "../../components/shapes/cube.js";
import CubeMesh from "../../components/shapes/cubeMesh.js";
import PlaneConstructor from "../../components/shapes/PlaneColitions.js";

export function buildLevel2(world, scene, elements) {

    const wall = new PlaneConstructor(
        [-47.8, 51.8, 193],
        "../../../public/textures/wood.jpg",
        [0.5, 0, 0.5],
        [7, 5],
        world
    );
    const wall2 = new PlaneConstructor(
        [-47.8, 51.8, 206],
        "../../../public/textures/wood.jpg",
        [0.5, 0, 0.5],
        [7, 5],
        world
    );

    wall.coords = [-47.8, 51.8, 193];
    wall2.coords = [-47.8, 51.8, 206];

    const cubeGravity = new CubeMesh(
        [-49, 48, 222],
        "../../../public/textures/sand.png",
        2,
        world,
        100
    );
    const cubeGravity2 = new CubeMesh(
        [-49, 46, 232],
        "../../../public/textures/sand.png",
        2,
        world,
        100
    );
    cubeGravity.coords = [-49, 48, 222];
    cubeGravity2.coords = [-49, 46, 232];

    const collectableStone = new Cube(
        [-49, 46.3, 243],
        "../../../public/textures/wood.jpg",
        0.6,
        0.6
    );

    const floorLv2 = new PlaneConstructor([-50, 48, 165], "../../../public/textures/stone.png", [0, 0, 0], [5, 10], world).getMesh();
    const c1 = new CubeMesh([-51, 47, 175], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c2 = new CubeMesh([-55, 48, 180], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c3 = new CubeMesh([-49, 47, 185], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const inclinado = new PlaneConstructor([-50, 49, 193], "../../../public/textures/stone.png", [0, 0, 0], [5, 7], world).getMesh();
    const inclinadof9 = new PlaneConstructor([-50, 49, 206], "../../../public/textures/stone.png", [0, 0, 0], [5, 7], world).getMesh();
    const c4 = new CubeMesh([-51, 47, 217], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c5 = new CubeMesh([-53, 46, 227], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const finish3 = new PlaneConstructor([-49, 45, 243], "../../../public/textures/stone.png", [0, 0, 0], [5, 10], world).getMesh();

    scene.add(floorLv2, c1, c2, c3, inclinado, wall.getMesh(), wall2.getMesh(), inclinadof9, c4, c5, cubeGravity.getMesh(), cubeGravity2.getMesh(), finish3, collectableStone.getMesh());
    elements.push(floorLv2, c1, c2, c3, inclinado, wall.getMesh(), wall2.getMesh(), inclinadof9, c4, c5, cubeGravity.getMesh(), cubeGravity2.getMesh(), finish3);

    return {
        wall,
        wall2,
        cubeGravity,
        cubeGravity2,
        collectableStone
    };
}


