import { DirectionalLight, AmbientLight } from "three";

export function light(scene){
    const ambientLight = new AmbientLight(0xffffff, 0.5);
    const light = new DirectionalLight(0xffffff, 1);

    light.position.set(5, 10, 7);

    scene.add(light, ambientLight);

}

