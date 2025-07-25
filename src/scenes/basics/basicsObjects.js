import PlayerColitions from "../../components/shapes/colitions/playerColitions";
import Cube from "../../components/shapes/cube";
import Floor from "../../components/shapes/Floor";
import Terrain from "../../components/shapes/terrain";
import UserBuild from "../../components/shapes/userBuilds";
import Camera from "../../utils/camera";

export const basicsObjects = (
  world,
  scene,
  terrainPhp,
  tree_leaves,
  tree_trunk,
  buildsAdminPhp,
  newBlocksArray
) => {
  const playerMesh = new Cube(
    [40, 2, 30],
    "../../../public/textures/wood.jpg",
    1
  ).getMesh();
  scene.add(playerMesh);
  const playerBody = PlayerColitions(world);

  const minimap = new Camera(90, 1, 0.01, 500).getCamera();
  minimap.position.set(playerMesh.position.x, 50, playerMesh.position.z);
  minimap.lookAt(playerMesh.position);

  const planeFloor = new Floor(
    [150, 0.5, 150],
    0.5,
    "../../../public/textures/dirt.png",
    0,
    [300, 300],
    world
  ).getMesh();
  scene.add(planeFloor);

  const arboles = new Terrain(
    tree_leaves,
    "../../../public/textures/leaves.png",
    world,
    playerBody,
    2
  );
  scene.add(arboles.getMesh());

  const troncoMesh = new Terrain(
    tree_trunk,
    "../../../public/textures/log.png",
    world,
    playerBody,
    2
  );
  scene.add(troncoMesh.getMesh());

  const terrain = new Terrain(
    terrainPhp,
    "../../../public/textures/g_5.png",
    world,
    playerBody,
    2
  );
  scene.add(terrain.getMesh());

  const buildAdmin = new Terrain(
    buildsAdminPhp,
    "../../../public/textures/brick_black.png",
    world,
    playerBody,
    2
  );
  scene.add(buildAdmin.getMesh());

  let elements = [
    planeFloor,
    terrain.getMesh(),
    buildAdmin.getMesh(),
    arboles.getMesh(),
    troncoMesh.getMesh(),
  ];

  if (newBlocksArray.length !== 0) {
    const userBuilds = new UserBuild(
      newBlocksArray,
      1,
      world,
      40,
      0,
      scene
    ).getMeshes();
    userBuilds.forEach((block) => {
      elements.push(block);
    });
  }

  return {
    playerMesh,
    playerBody,
    minimap,
    terrain,
    arboles,
    buildAdmin,
    elements,
  };
};
