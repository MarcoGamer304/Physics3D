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
        console.error('Error:', err);
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
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function updateStats(data) {
    try {
        const response = await fetch('http://localhost:8000/api/stadistics', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        console.log(result.state)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function getStats(data) {
    try {
        const response = await fetch('http://localhost:8000/api/user/stats', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        console.log(result.status)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function logout(data) {
    try {
        const response = await fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        let result = await response.json();
        console.log(result.message)
        localStorage.clear();
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function getLanguages() {
    try {
        const response = await fetch('http://localhost:8000/api/languages', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',               
            }
        });
        let result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function getCountries() {
    try {
        const response = await fetch('http://localhost:8000/api/countries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',               
            }
        });
        let result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function getGlobalStats() {
    try {
        const response = await fetch('http://localhost:8000/api/stadistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',               
            }
        });
        let result = await response.json();
        console.log(result)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function createStatsLog(data) {
    try {
        const response = await fetch('http://localhost:8000/api/session/log', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let result = await response.json();
        console.log(result.state)
        return result;
    } catch (err) {
        console.error('Error:', err);
    }
}
