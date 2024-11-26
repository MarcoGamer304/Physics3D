//feth methodos, to send and receive data from the backend over http protocols
async function post(audioBlob) {
    const formData = new FormData();
    formData.append("audio", audioBlob, 'audio.webm');

    try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData
        });
        let result;
        return result = await response.json();
    } catch (error) {
        console.error('Error al enviar el archivo:', error);
    }
}

export default post
