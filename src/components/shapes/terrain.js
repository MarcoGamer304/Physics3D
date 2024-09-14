import { BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4, TextureLoader } from 'three';

class Terrain {
  constructor(terrainData, texturePath = "../../../public/textures/g_5.png") {
    const geometry = new BoxGeometry(1, 1, 1);
    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(texturePath);
    const material = new MeshStandardMaterial({ map: texture });

    this.mesh = new InstancedMesh(geometry, material, terrainData.length);

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
export default Terrain;
