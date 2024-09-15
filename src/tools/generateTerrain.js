import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/dist/esm/simplex-noise.js';

const noise = new SimplexNoise();
    
function generateTerrain(width, height, scale) {
    const terrain = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let z = Math.floor(noise.noise2D(x / scale, y / scale) * 10);

            z = Math.max(0, z);

            terrain.push([x, z, y]);
        }
    }
    return terrain;
}