import { BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter } from 'three'

class Cube {
    constructor(position=[0,0,0], texturePath = "../../../public/textures/g_5.png") {
        const geometry = new BoxGeometry(1, 1, 1);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshStandardMaterial({ map: texture });
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(position[0], position[1], position[2])
    }

    getMesh() {
        return this.cube;
    }
}

export default Cube;