import { BoxGeometry, MeshBasicMaterial, Mesh, DoubleSide, TextureLoader, LinearMipmapLinearFilter } from 'three';
import { Body, Box, Vec3, Quaternion } from 'cannon-es';

//Creates a plane that extends its dimensions to the width and length of the terrain 
//and gives it a cube geometry and changes the texture by parameter, 
//contains its collision body and its movement is flexible in the three axes
class PlaneConstructor {
    constructor(positions = [0, 0, 0], texturePath = "", rotation = [.5, 0, 0], size = [5, 5], world) {
        const geometry = new BoxGeometry(size[0], .6, size[1]);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshBasicMaterial({ map: texture, wireframe: false, side: DoubleSide });
        this.plane = new Mesh(geometry, material);
        this.plane.rotation.x = Math.PI * rotation[0];
        this.plane.rotation.y = Math.PI * rotation[1];
        this.plane.rotation.z = Math.PI * rotation[2];
        this.plane.position.set(positions[0], positions[1], positions[2]);

        const terrainShape = new Box(new Vec3(size[0] / 2, .3, size[1] / 2));
        this.terrainBody = new Body({
            mass: 0,
            position: new Vec3(positions[0], positions[1], positions[2]),
            shape: terrainShape,
        });

        const cannonRotation = new Quaternion();
        cannonRotation.setFromEuler(Math.PI * rotation[0], Math.PI * rotation[1], Math.PI * rotation[2], 'XYZ');
        this.terrainBody.quaternion.copy(cannonRotation);

        world.addBody(this.terrainBody);
    }

    getMesh() {
        return this.plane;
    }

    getBody() {
        return this.plane;
    }

    update() {
        this.plane.position.copy(this.terrainBody.position);
        this.plane.quaternion.copy(this.terrainBody.quaternion);
    }

    reset(x, y, z) {
        this.terrainBody.position.set(x, y, z);
        this.terrainBody.velocity.set(0, 0, 0);
    }

    moveNegative(x = [0, 0.01], y = [0, 0.01], z = [0, 0.01]) {
        if (x[0]) {
            this.terrainBody.position.x -= x[1];
        }
        if (y[0]) {
            this.terrainBody.position.y -= y[1];
        }
        if (z[0]) {
            this.terrainBody.position.z -= z[1];
        }
    }
}

export default PlaneConstructor;