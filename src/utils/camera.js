import { PerspectiveCamera } from "three";

//build and return a camera
class Camera {
    constructor(fov, aspect, near, far) {
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
    }
    getCamera() {
        return this.camera;
    }
}


export default Camera;