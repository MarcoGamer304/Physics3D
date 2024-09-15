import { Scene, Color, TextureLoader } from 'three'

const scene = new Scene();

const textureLoader = new TextureLoader();
const texture = textureLoader.load("../../../public/textures/sky2.png", () => {
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
})
scene.background = texture;
export default scene;