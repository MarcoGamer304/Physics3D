import { BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4, TextureLoader } from 'three';
import * as CANNON from 'cannon-es';

class Terrain {
  constructor(terrainData, texturePath = "../../../public/textures/g_5.png", world, playerBody, activationDistance = 2) {
    this.world = world;
    this.playerBody = playerBody;
    this.activationDistance = activationDistance;

    const geometry = new BoxGeometry(1, 1, 1);
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new MeshStandardMaterial({ map: texture });

    this.mesh = new InstancedMesh(geometry, material, terrainData.length);

    this.terrainData = terrainData;
    this.bodies = []; 
    this.activeBodies = new Set(); 

    terrainData.forEach((coord, index) => {
      const matrix = new Matrix4();
      matrix.setPosition(coord[0], coord[1], coord[2]);
      this.mesh.setMatrixAt(index, matrix);

      const halfExtents = new CANNON.Vec3(0.5, 0.5, 0.5);
      const shape = new CANNON.Box(halfExtents);
      const body = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(coord[0], coord[1], coord[2])
      });
      body.addShape(shape);

      this.bodies.push(body);
    });
  }

  update() {
    const playerPosition = this.playerBody.position;

    this.bodies.forEach((body, index) => {
      const bodyPosition = body.position;
      const distance = playerPosition.distanceTo(bodyPosition);

      if (distance < this.activationDistance) {
        if (!this.activeBodies.has(body)) {
          this.world.addBody(body);
          this.activeBodies.add(body);
        }
      } else {
        if (this.activeBodies.has(body)) {
          this.world.removeBody(body);
          this.activeBodies.delete(body);  
        }
      }
    });
  }

  getMesh() {
    return this.mesh;
  }
}

export default Terrain;
