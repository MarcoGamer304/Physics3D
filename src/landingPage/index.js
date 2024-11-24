import { register, login } from "../essentials/BackendMethods/Php/fetchMethods";

const banner = document.getElementById('banner')
const windowHeigth = window.innerHeight;
const windowWidth = window.innerHeight;

banner.style.height = windowHeigth + 'px';
banner.style.Width = windowWidth + 'px';

const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginClose = document.getElementById('loginClose');
const loginForm = document.getElementById('loginForm');
const playNow = document.getElementById('play-now');

const btnRegister = document.getElementById('btnRegister');
const registerClose = document.getElementById('registerClose');
const registerModal = document.getElementById('registerModal');
const returnLogin = document.getElementById('returnLogin');
const registerForm = document.getElementById('registerForm');

const inputRegisterUser = document.getElementById('input-register-user');
const inputRegisterEmail = document.getElementById('input-register-email');

const canvas = document.getElementById('canvasFrame');
const sections = document.getElementsByClassName('section');
let currentSection = 0;
let startY = 0;
let onCanvas;

localStorage.clear();

btnRegister.addEventListener('click', () => {
    registerModal.showModal();
    loginModal.close();
}),

    registerClose.addEventListener('click', () => {
        registerModal.close();
    });

returnLogin.addEventListener('click', () => {
    registerModal.close();
    loginModal.showModal();
})

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    inputRegisterEmail.style.background = 'white';
    inputRegisterUser.style.background = 'white';

    let response = await register({
        "username": document.getElementById('input-register-user').value,
        "password": document.getElementById('input-register-pass').value,
        "contry": document.getElementById('input-register-country').value,
        "email": document.getElementById('input-register-email').value,
        "phone": document.getElementById('input-register-languge').value,
        "language": document.getElementById('input-register-phone').value
    });

    if (response.acces_token) {
        registerModal.close();
    }
    if (response.errors.username) {
        console.log('usuario incorrecto')
        inputRegisterUser.style.background = 'red';
    }
    if (response.errors.email) {
        console.log('email incorrecto')
        inputRegisterEmail.style.background = 'red';
    }
})

loginBtn.addEventListener('click', () => {
    loginModal.showModal();
})

loginClose.addEventListener('click', () => {
    loginModal.close()
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        let response = await login({
            "username": document.getElementById('input-login-user').value,
            "password": document.getElementById('input-login-pass').value
        });

        if (response.token) { 
            localStorage.setItem('token', response.token.split('|')[1]);
            localStorage.setItem('username', response.user);
        } 
    } catch (error) {
        console.error('Logging error:', error);
    }

    document.getElementById('input-login-user').value = '';
    document.getElementById('input-login-pass').value = '';

    loginBtn.innerText = localStorage.getItem('username') || 'Login';
    loginModal.close();
});

playNow.addEventListener('click', () => {
    if (!localStorage.getItem("token")) {
        loginModal.showModal();
    } else {
        window.location.href = '../../game.html';
    }
})

canvas.addEventListener('mouseover', () => {
    onCanvas = true;
})

canvas.addEventListener('mouseout', () => {
    onCanvas = false;
})

window.addEventListener('wheel', (e) => {
    if (onCanvas) return;
    if (e.deltaY > 0) {
        if (currentSection < sections.length - 1) {
            currentSection++;
        }
    } else {
        if (currentSection > 0) {
            currentSection--;
        }
    }
    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
});

window.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});

window.addEventListener('touchend', (e) => {
    const endY = e.changedTouches[0].clientY;
    if (startY > endY + 50) {
        if (currentSection < sections.length - 1) {
            currentSection++;
        }
    } else if (startY < endY - 50) {
        if (currentSection > 0) {
            currentSection--;
        }
    }
    sections[currentSection].scrollIntoView({ behavior: 'smooth' });
});


