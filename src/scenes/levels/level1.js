import CubeMesh from "../../components/shapes/cubeMesh.js";
import PlaneConstructor from "../../components/shapes/PlaneColitions.js";

export function buildLevel1(world, scene, elements, blockToPush) {

    const floorLv1 = new PlaneConstructor([400, 48, 165], "../../../public/textures/stone.png", [0, 0, 0], [10, 10], world).getMesh();
    const inclinado = new PlaneConstructor([385, 46, 165], "../../../public/textures/stone.png", [0,0,0.1], [10, 10], world).getMesh();
    const f3 = new PlaneConstructor([370, 42, 165], "../../../public/textures/stone.png", [0, 0, 0], [7, 10], world).getMesh();
    const f6 = new PlaneConstructor([385, 47, 150], "../../../public/textures/stone.png", [0, 0, 0.1], [20, 5], world).getMesh();
    const f7 = new PlaneConstructor([377, 53, 150], "../../../public/textures/stone.png", [0, 90, -0.06], [20, 5], world).getMesh();
    const f4 = new PlaneConstructor([355, 36, 165], "../../../public/textures/stone.png", [0, 0, 0], [15, 10], world).getMesh();
    const f5 = new PlaneConstructor([362.5, 55, 165], "../../../public/textures/stone.png", [0, 0, 0], [7, 10], world).getMesh();
    const f8 = new PlaneConstructor([342, 40, 165], "../../../public/textures/stone.png", [0, 0, 0], [10, 10], world).getMesh();

    const c1 = new CubeMesh([370, 41.5, 155], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c2 = new CubeMesh([370, 42.5, 150], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c3 = new CubeMesh([362, 55, 150], "../../../public/textures/stone.png", 2, world, 100).getMesh();
    const c4 = new CubeMesh([362, 54.5, 156], "../../../public/textures/stone.png", 2, world, 100).getMesh();

    scene.add(floorLv1, inclinado, c1, f3, f4, f5, c2, f6, f7, c3, c4, blockToPush.getMesh(), f8);
    elements.push(floorLv1, inclinado, f3, c1, f4, f5, c2, f6, f7, c3, c4, blockToPush.getMesh(), f8);
}
