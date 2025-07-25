import Cube from "../../components/shapes/cube";
import Camera from "../../utils/camera.js";
import PortalCircle from "../../components/shapes/portalCircle";
import { WebGLRenderTarget } from "three";

const portalRotation = -29.84;
const texture = "../../../public/textures/wood.jpg";

export const generatePortals = (scene, portalsInfo) => {
  return portalsInfo.map((element, index) => {
    const portal = { ...element };

    const portalRenderTarget = new WebGLRenderTarget(512, 512);
    scene.add(new Cube(portal.cubeCoords, texture, 2).getMesh());
    const portalLevel = new PortalCircle(
      portal.cubeCoords,
      portalRenderTarget
    ).getMesh();
    portalLevel.position.x += 0.51;
    portalLevel.index = index;
    portalLevel.rotateY(portalRotation);
    scene.add(portalLevel);

    const portalCamera = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCamera.position.set(
      portal.cameraPosition[0],
      portal.cameraPosition[1],
      portal.cameraPosition[2]
    );
    portalCamera.lookAt(0, 0, 0);
    portalLevel.add(portalCamera);

    const portalRenderTargetReturn = new WebGLRenderTarget(512, 512);
    scene.add(new Cube(portal.cubeCoordsReturn, texture, 2).getMesh());
    const portalLevelReturn = new PortalCircle(
      portal.cubeCoordsReturn,
      portalRenderTargetReturn
    ).getMesh();
    portalLevelReturn.position.x += 0.51;
    portalLevelReturn.index = 0.1;
    portalLevelReturn.rotateY(portalRotation);
    scene.add(portalLevelReturn);

    const portalCameraReturn = new Camera(90, 0.5, 0.01, 1500).getCamera();
    portalCameraReturn.position.set(
      portal.cameraPositionReturn[0],
      portal.cameraPositionReturn[1],
      portal.cameraPositionReturn[2]
    );
    portalLevelReturn.add(portalCameraReturn);

    return {
      portalRenderTarget,
      portalCamera,
      portalRenderTargetReturn,
      portalCameraReturn,
      portalLevel,
      portalLevelReturn,
    };
  });
};
