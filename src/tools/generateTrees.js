
let trees = [];
let tronco = [];

export function generateTrees(terrainPhp) {

    const tree = [
        [130, 2, 166], [130, 3, 166], [130, 4, 166], [131, 4, 166], [130, 4, 167], [131, 4, 167],
        [130, 4, 165], [130, 4, 165], [131, 4, 165], [129, 4, 166], [129, 4, 167], [129, 4, 165],
        [130, 5, 166], [129, 5, 165], [130, 5, 165], [131, 5, 165], [131, 5, 166], [131, 5, 167],
        [130, 5, 167], [129, 5, 167], [129, 5, 166], [130, 6, 166], [132, 5, 167], [132, 5, 166],
        [132, 5, 165], [131, 5, 168], [130, 5, 168], [129, 5, 168], [128, 5, 166], [128, 5, 167],
        [128, 5, 165], [128, 5, 164], [131, 5, 164], [130, 5, 164], [129, 5, 164], [131, 6, 165],
        [131, 6, 166], [131, 6, 167], [130, 6, 167], [129, 6, 167], [129, 6, 166], [130, 6, 165],
        [129, 6, 165], [130, 7, 166]
    ];

    for (let index = 0; index < terrainPhp.length; index++) {
        const terr = terrainPhp[index];
        if (terr[1] > 1) {
            let random = Math.random();
            if (random < 0.01) {
                for (let index = 0; index < tree.length; index++) {
                    const element = tree[index];

                    let diferenciaX = element[0] - tree[0][0];
                    let diferenciaY = element[1] - tree[0][1];
                    let diferenciaZ = element[2] - tree[0][2];

                    if (index <= 1) {
                        tronco.push([terr[0] + diferenciaX, terr[1] + diferenciaY + 1, terr[2] + diferenciaZ]);
                    }
                    trees.push([terr[0] + diferenciaX, terr[1] + diferenciaY + 1, terr[2] + diferenciaZ]);
                }
            }
        }
    }


    /*
    console.log("hojas");
    console.log(JSON.stringify(trees, null, ""));
    
    console.info("troncos");
    console.info(JSON.stringify(tronco, null, ""));
    */
}
export function getTrees() {
    return trees;
}

export function getTronco() {
    return tronco;
}

