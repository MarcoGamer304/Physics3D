import CannonDebugger from 'cannon-es-debugger';

function Debugger(scene, world) {
    const cannonDebugger = new CannonDebugger(scene, world, {
        color: 0xffff00,
    });
    return cannonDebugger
}

export default Debugger;
