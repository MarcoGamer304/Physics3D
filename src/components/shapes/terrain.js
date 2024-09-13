import { BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4, TextureLoader } from 'three';
import * as CANNON from 'cannon-es';

class Terrain {
  constructor(terrainData, texturePath = "../../../public/textures/g_5.png", world) {
    const geometry = new BoxGeometry(1, 1, 1);
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new MeshStandardMaterial({ map: texture });

    this.mesh = new InstancedMesh(geometry, material, terrainData.length);

    const terrainShape = new CANNON.Box(new CANNON.Vec3(50, -10, 50)); 
    const terrainBody = new CANNON.Body({
      mass: 0, 
      position: new CANNON.Vec3(0, 0, 0),
      type: CANNON.Body.STATIC,
    });
    terrainBody.addShape(terrainShape);
    world.addBody(terrainBody);

  
    terrainData.forEach((coord, index) => {
      const matrix = new Matrix4();
      matrix.setPosition(coord[0], coord[1], coord[2]);
      this.mesh.setMatrixAt(index, matrix);
    });
  }

  getMesh() {
    return this.mesh;
  }
}
 export default Terrain