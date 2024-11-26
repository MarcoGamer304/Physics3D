import { PlaneGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, DoubleSide,TextureLoader, LinearMipmapLinearFilter } from 'three'
import { Body, Box, Vec3, Quaternion} from 'cannon-es';

//Creates a plane that extends its dimensions to the width and length of the terrain 
//and gives it a plane geometry and changes the texture by parameter, 
//contains its collision body and is static
class Floor {
    constructor(positions=[0,0,0], rotation = .5, texturePath="", rotationY= 0, size =[5,5], world) {
        const geometry = new PlaneGeometry(size[0], size[1]);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshBasicMaterial({ map: texture, wireframe: false, side: DoubleSide});
        this.floor = new Mesh(geometry, material);
        this.floor.rotation.x = Math.PI * rotation;
        this.floor.rotation.y = Math.PI - rotationY;
        this.floor.position.set(positions[0], positions[1], positions[2]);

        const terrainShape = new Box(new Vec3(size[0]/2,0, size[1]/2));
        const terrainBody = new Body({
            mass: 0,
            position: new Vec3(positions[0], positions[1], positions[2]),
            shape: terrainShape,
        });

        terrainBody.quaternion.setFromAxisAngle(new Vec3(0, 0, 1), -rotationY);     
        world.addBody(terrainBody);
    }

    getMesh() {
        return this.floor;
    }
}
export default Floor;
