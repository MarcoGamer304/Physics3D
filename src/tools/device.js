import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function Device(camera,renderer) {

    let controls;
    const isMobile = document.querySelector("#controller");

    const detectDeviceType = () =>
        /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
            ? 'Mobile'
            : 'Desktop';

    if (detectDeviceType() === 'Desktop') {
        return controls = new PointerLockControls(camera, renderer.domElement);
       
    } else if (detectDeviceType() === 'Mobile') {
        isMobile.style.zIndex = "2";
        return controls = new OrbitControls(camera, renderer.domElement);
    };
}

export default Device