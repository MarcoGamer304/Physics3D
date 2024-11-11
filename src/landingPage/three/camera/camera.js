import { PerspectiveCamera, Vector3 } from "three";

const camera = new PerspectiveCamera(75, 350 / 350, 0.1, 2000);

camera.position.z = 19;
camera.position.y = 8;
camera.position.x = 4;

export default camera;