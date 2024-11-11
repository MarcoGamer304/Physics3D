export function thread(scene, camera, renderer){
    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    animate();
}