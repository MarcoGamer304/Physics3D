export async function getData(){
    try {
        const response = await fetch('http://192.168.100.143/api/terrain/6', {
            method: 'GET'
        });
        let result = await response.json();
        return result;
    } catch (err) {
        console.error('Error al descargar la matriz:', err);
    }
}