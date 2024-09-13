import { WebGLRenderer } from 'three'

const renderer = new WebGLRenderer({ antialias: false, powerPreference: "low-power" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 1.5 : 1);
document.body.appendChild(renderer.domElement);



export default renderer;