import post from '../BackendMethods/Python/fetchMethods.js';
import { saveData } from '../../scenes/levels/index.js';
import { createLog } from '../../scenes/levels/index.js';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent;

//web api to return text from voice, acction comands in base a words spoke
if (!SpeechRecognition || !SpeechGrammarList || !SpeechRecognitionEvent) {
    console.error("SpeechRecognition or SpeechGrammarList not supported in this browser.");
} else {
    const dictionary = [
        "login",
        "Login",
        "Estadisticas",
        "estadisticas",
        "Estadísticas",
        "estadísticas",
        "Jugar",
        "jugar",
        "Play",
        "play",
        "Menú",
        "menú",
        "Menu",
        "menu",
        "cerrar session",
        "Cerrar session",
        "Cerrar Session",
        "iniciar session",
        "Iniciar session",
        "Iniciar Session",
        "guardar",
        "Guardar",
        "Save",
        "save",
        "salir",
        "Salir",
        "exit",
        "Exit"
    ];
    const grammar = `#JSGF V1.0; grammar commands; public <command> = ${dictionary.join(
        " | ",
    )};`;

    const routes = {
        'Menú': '/index.html',
        'menú': '/index.html',
        'Menu': '/index.html',
        'menu': '/index.html',
        'jugar': '/game.html',
        'Jugar': '/game.html',
        'play': '/game.html',
        'Play': '/game.html',
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
    }

    recognition.onresult = (event) => {
        //voice comands
        const word = event.results[0][0].transcript;
        console.log(word)

        if (word === 'guardar' || word === 'Guardar' || word === 'save' || word === 'Save') {
            saveData();
            createLog(0);
        }

        if (word === 'salir' || word === 'Salir' || word === 'exit' || word === 'Exit') {
            saveData();
            createLog(1);

            setTimeout(() => {
                window.location.href = "../../../index.html";
            }, 2000);
        }

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
                            window.location.href = "../../../game.html";
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
        //console.log("Recognition service disconnected, restarting...");
        startRecognition();
    };
    startRecognition();
}
