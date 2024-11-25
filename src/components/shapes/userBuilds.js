import { BoxGeometry, MeshBasicMaterial, DoubleSide, Mesh, MeshStandardMaterial, TextureLoader, LinearMipmapLinearFilter, Vector3 } from 'three'
import { Body, Box, Vec3, World } from 'cannon-es';

class UserBuild {
    constructor(constructions, size = 1, world, maxHeigth = 40, mass = 0,scene) {

        this.instances = [];

        constructions.forEach(position => {
            const geometry = new BoxGeometry(size, size, size);

            const textureLoader = new TextureLoader();
            const texture = textureLoader.load(position[3], (texture) => {
                texture.generateMipmaps = true;
                texture.minFilter = LinearMipmapLinearFilter;
            });

            const material = new MeshStandardMaterial({ map: texture, wireframe: false, side: DoubleSide });
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
            this.instances.push(this.cube);
            scene.add(this.cube)
        });    
    }
    getMeshes() {
        return this.instances;
    }
}

export default UserBuild;