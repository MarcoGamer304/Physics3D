import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function DeviceController(camera, renderer) {

    let controls;
    const isMobile = document.querySelector("#controller");
    const menuModalBtn = document.getElementById('menuModalBtn');

    const detectDeviceType = () =>
        /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
            ? 'Mobile'
            : 'Desktop';

    if (detectDeviceType() === 'Desktop') {
        isMobile.style.zIndex = "0"; 
        menuModalBtn.style.zIndex = "0"; 
        return controls = new PointerLockControls(camera, renderer.domElement);

    } else if (detectDeviceType() === 'Mobile') {
        isMobile.style.zIndex = "2";
        menuModalBtn.style.zIndex = "20";       
        return controls = new OrbitControls(camera, renderer.domElement);
    };
}

//return device
export const detectDeviceType = () =>
    /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
        ? 'Mobile'
        : 'Desktop';

