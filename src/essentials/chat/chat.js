import { io } from 'socket.io-client'
import { detectDeviceType } from '../../tools/Device'; 

// connnect http to change ws connection
const socket = io.connect('http://expresssocketio-production-211e.up.railway.app');
const menssageList = document.getElementById('menssageList')
const form = document.getElementById('myForm');

const nameUser = localStorage.getItem('username')
//register in sala at server
socket.emit('userRegister', nameUser);

//emit new Message at server
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const textConstant = document.getElementById('text');
    const text = textConstant.value;
    textConstant.value = '';
    if (text !== '') {
        socket.emit('newMessage', text)
    }

});
//recive message on server
socket.on('respuestaServidor', (data) => {
    createPElement(data)
});
//fix chat
function ajustChat(){
    const messaging = document.getElementById('messaging')
    if(detectDeviceType() === 'Mobile'){
        messaging.style.minHeight = '82%'
        messaging.style.maxHeight = '150px'
        messaging.style.overflow = 'visible'
    }
  
}
ajustChat()
function createPElement(data) {

    const newDiv = document.createElement('div')
    newDiv.className = 'messageContainer';
    
    const newUser = document.createElement('span')
    data.user === nameUser ? newUser.innerText = 'Me' : newUser.innerText = data.user;
    newUser.className = 'username';
    newDiv.appendChild(newUser);

    const newMessage = document.createElement('p')
    newMessage.className = 'message';
    newMessage.innerText = data.message;

    const spanInfo = document.createElement('span')
    spanInfo.innerText = new Date().toLocaleTimeString();
    spanInfo.style.fontSize = '0.7em'

    newDiv.appendChild(newMessage);
    newDiv.appendChild(spanInfo)

    if(data.user === nameUser){
        newDiv.style.backgroundColor = '#097fe7'
        newDiv.style.color = 'white'
    }
    menssageList.appendChild(newDiv);

    menssageList.scrollTop = menssageList.scrollHeight;
    console.log('Mensaje desde el servidor:', data);
}