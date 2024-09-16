import { BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter } from 'three'
import { Body, Box, Vec3, World } from 'cannon-es';

class CubeMesh {
    constructor(position=[0,0,0], texturePath = "../../../public/textures/g_5.png",altura=1, world) {
        const geometry = new BoxGeometry(1, altura, 1);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshStandardMaterial({ map: texture, wireframe: false });
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(position[0], position[1], position[2])

        const shape = new Box(new Vec3(0.5, altura / 2, 0.5)); 
        this.body = new Body({
            mass: 0, 
            position: new Vec3(position[0], position[1], position[2]),
            shape: shape 
        });
        
        world.addBody(this.body);
    }

    getMesh() {
        return this.cube;
    }

}

export default CubeMesh;