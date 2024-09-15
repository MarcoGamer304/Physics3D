import { PerspectiveCamera } from "three";
class Camera {
    constructor(fov, aspect, near, far) {
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
    }
    getCamera() {
        return this.camera;
    }
}


export default Camera;