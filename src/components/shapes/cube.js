import { BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter } from 'three'

//Creates a block with variable dimensions and gives it a cube geometry 
//and changes the texture by parameter, contains methods to reset the movement of the mesh
class Cube {
    constructor(position=[0,0,0], texturePath = "../../../public/textures/g_5.png",altura=1, alt = 1) {
        const geometry = new BoxGeometry(alt, altura, alt);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshStandardMaterial({ map: texture, wireframe: false });
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(position[0], position[1], position[2])
    }

    getMesh() {
        return this.cube;
    }
    
    reset(x,y,z){
        this.body.position.set(x,y,z);
        this.body.velocity.set(0,0,0);     
    }
}

export default Cube;