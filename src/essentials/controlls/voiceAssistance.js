import  post  from '../BackendMethods/Python/fetchMethods.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

if (!SpeechRecognition || !SpeechGrammarList || !SpeechRecognitionEvent) {
    console.error("SpeechRecognition or SpeechGrammarList not supported in this browser.");
} else {
    const dictionary = [
        "login",
        "Login",
        "estadísticas",
        "Estadísticas",
        "black",
        "Nivel 1",
        "nivel 1",
        "Nivel 2",
        "nivel 2",
        "Menu",
        "menu",
    ];
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${dictionary.join(
        " | ",
    )};`;

    const routes = {
        'Menú': '/index.html',
        'menú': '/index.html',
        'Nivel 1': '/index2.html',
        'nivel 1': '/index2.html',
        'Nivel 2': '/level2.html',
        'nivel 2': '/level2.html'
    };

    const recognition = new SpeechRecognition();
    const speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);

    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let mediaRecorder;
    let audioChunks = [];
    let audioBlob;

    function startRecognition() {
        recognition.start();
        console.log("Ready to receive a color command.");
    }

    recognition.onresult = (event) => {

        const word = event.results[0][0].transcript;
        console.log(word)

        if (word === 'login' || word === 'Login') {
            //Voice Recorder
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        audioBlob = new Blob(audioChunks, { 'type': 'audio/webm; codecs=opus' });
                        console.log(audioBlob)

                        const response = await post(audioBlob);

                        if (response.Distance <= 90) {
                            window.location.href = "../../../index2.html";
                        } else {
                            alert('Las voces no coinciden')
                        }
                        console.log('responce distance: ' + response.Distance)
                        audioChunks = [];
                    };

                    mediaRecorder.start();
                })
                .catch(error => console.error('Error al acceder al micrófono', error));

            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000)
        }
        
        //Envia a el valor de la clave rutas si no coincide con la ruta actual de la ventana
        if (routes[word] && window.location.pathname !== routes[word]) {
            window.location.href = "../../.." + routes[word];
        }
        console.log(`Aproximacion: ${event.results[0][0].confidence}`);
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onnomatch = () => {
    };

    recognition.onerror = () => {
        recognition.stop();
        startRecognition();
    };

    recognition.onend = () => {
        console.log("Recognition service disconnected, restarting...");
        startRecognition();
    };
    startRecognition();
}
