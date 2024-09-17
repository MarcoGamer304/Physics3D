import { PlaneGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, DoubleSide,TextureLoader, LinearMipmapLinearFilter } from 'three'

class Plane {
    constructor(positions=[0,0,0], rotation = .5, texturePath="", rotationY= 0) {
        const geometry = new PlaneGeometry(300, 300);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshBasicMaterial({ map: texture, wireframe: false });
        this.plane = new Mesh(geometry, material);
        this.plane.rotation.x = Math.PI * rotation;
        this.plane.rotation.y = Math.PI - rotationY;
        this.plane.position.set(positions[0], positions[1], positions[2]);
    }
    getMesh() {
        return this.plane;
    }

}
export default Plane;
