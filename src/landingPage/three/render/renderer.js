import { WebGLRenderer } from 'three'

const renderer = new WebGLRenderer({
    antialias: true,  
    powerPreference: 'high-performance',
    alpha: true
});

renderer.setSize( 350, 350 );

export default renderer;