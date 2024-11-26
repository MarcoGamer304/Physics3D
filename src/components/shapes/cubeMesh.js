import { BoxGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter, Vector3 } from 'three'
import { Body, Box, Vec3, World } from 'cannon-es';

//Creates a block with variable dimensions and gives it a cube geometry and changes the texture by parameter, 
//contains methods to reset the movement of the mesh, with its collision body attached to the mesh coordinates 
//and flexible to movement in the three axes.
class CubeMesh {
    constructor(position = [0, 0, 0], texturePath = "../../../public/textures/g_5.png", size = 1, world, maxHeigth = 40, mass = 0) {
        const geometry = new BoxGeometry(size, size, size);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshStandardMaterial({ map: texture, wireframe: false });
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(position[0], position[1], position[2])

        const shape = new Box(new Vec3(size / 2, size / 2, size / 2));
        this.body = new Body({
            mass: mass,
            position: new Vec3(position[0], position[1], position[2]),
            shape: shape,
        });
        if (position[1] <= maxHeigth) {
            world.addBody(this.body);
        }
    }

    getMesh() {
        return this.cube;
    }

    update(){
        this.cube.position.copy(this.body.position);
        this.cube.quaternion.copy(this.body.quaternion);
    }

    reset(x,y,z){
        this.body.position.set(x,y,z);
        this.body.velocity.set(0,0,0);     
    }

    moveNegative(x = [0, 0.01], y = [0, 0.01], z = [0, 0.01]) {
        if (x[0]) {
            this.body.position.x -= x[1];
        }
        if (y[0]) {
            this.body.position.y -= y[1];
        }
        if (z[0]) {
            this.body.position.z -= z[1];
        }
    }

}

export default CubeMesh;