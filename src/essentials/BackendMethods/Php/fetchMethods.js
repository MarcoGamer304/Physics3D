export async function getData(){
    try {
        const response = await fetch('http://localhost:8000/api/terrain/1', {
            method: 'GET'
        });
        let result = await response.json();
        return result;
    } catch (err) {
        console.error('Error al descargar la matriz:', err);
    }
}