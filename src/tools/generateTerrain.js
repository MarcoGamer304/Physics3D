import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@3.0.0/dist/esm/simplex-noise.js';

const noise = new SimplexNoise();

export function generateTerrain(width, height, scale = 170) {
    const terrain = [];

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let z = Math.floor(noise.noise2D(x / scale, y / scale) * 10);

            z = Math.max(0, z);
            if (z !== 0) {
                terrain.push([x, z, y]);
            }
        }
    }
    return terrain;
}