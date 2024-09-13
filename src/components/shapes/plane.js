import { PlaneGeometry, MeshBasicMaterial, Mesh, MeshStandardMaterial, DoubleSide,TextureLoader, LinearMipmapLinearFilter } from 'three'

class Plane {
    constructor(x = 0, y = 0, z = 0, rotation = .5, texturePath="", rotationY= 0) {
        const geometry = new PlaneGeometry(30, 30);

        const textureLoader = new TextureLoader();
        const texture = textureLoader.load(texturePath, (texture) => {
            texture.generateMipmaps = true;
            texture.minFilter = LinearMipmapLinearFilter;
        });

        const material = new MeshBasicMaterial({ map: texture, side: DoubleSide });
        this.plane = new Mesh(geometry, material);
        this.plane.rotation.x = Math.PI * rotation;
        this.plane.rotation.y = Math.PI * rotationY;
        this.plane.position.set(x, y, z);
    }
    getMesh() {
        return this.plane;
    }

}
export default Plane;
