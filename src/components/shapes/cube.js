import { BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter } from 'three'

class Cube {
    constructor(positionParam, colorParam, x = 0, y = 0, texturePath = "") {
        const geometry = new BoxGeometry(1, 1, 1);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshStandardMaterial({ map: texture });
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(x, positionParam, y)
    }

    getMesh() {
        return this.cube;
    }
}

export default Cube;