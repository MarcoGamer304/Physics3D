import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setControls(camera, renderer){
    return new OrbitControls( camera, renderer.domElement);
}


