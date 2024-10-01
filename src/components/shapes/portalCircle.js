import { CircleGeometry, Mesh, MeshStandardMaterial} from 'three'

class PortalCircle {
    constructor(position=[0,0,0], portalRenderTarget) {
        const geometry = new CircleGeometry(1);

        const material = new MeshStandardMaterial({ map: portalRenderTarget.texture});
        this.cube = new Mesh(geometry, material);
        this.cube.position.set(position[0], position[1], position[2])
        this.cube.scale.set(0.5, 1, 0.5);
    }

    getMesh() {
        return this.cube;
    }
}

export default PortalCircle;