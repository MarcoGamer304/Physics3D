import CannonDebugger from 'cannon-es-debugger';

//import the cannon-es debugger library to show the collision mesh
function Debugger(scene, world) {
    const cannonDebugger = new CannonDebugger(scene, world, {
        color: 0xffff00,
    });
    return cannonDebugger
}

export default Debugger;
