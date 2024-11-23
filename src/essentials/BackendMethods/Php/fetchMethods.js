export async function getData() {
    try {
        const response = await fetch(/*'http://192.168.100.143/api/terrain/6'*/'http://localhost:8000/api/terrain/1', {
            method: 'GET'
        });
        let result = await response.json();
        return result;
    } catch (err) {
        console.error('Error al descargar la matriz:', err);
    }
}


export async function register(data) {
    try {
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        return result;
    } catch (err) {
        console.error('Error al descargar la matriz:', err);
    }
}

export async function login(data) {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.error('Error al descargar la matriz:', err);
    }
}