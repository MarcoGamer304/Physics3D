import { Scene, TextureLoader, LinearMipMapLinearFilter } from 'three'

const scene = new Scene();

const textureLoader = new TextureLoader();
const texture = textureLoader.load("../../../public/textures/sky2.png", () => {
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipMapLinearFilter;
})
scene.background = texture;
export default scene;