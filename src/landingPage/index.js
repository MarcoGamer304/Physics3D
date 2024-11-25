import { register, login, logout, getLanguages, getCountries } from "../essentials/BackendMethods/Php/fetchMethods";
import { setTable } from "../stadistics/globalStadistics";

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

const selectLanguage = document.getElementById('selectLanguage');
const selectCountry = document.getElementById('selectCountry');
const logoutBtn = document.getElementById('logoutBtn');
const stadisticsBtn = document.getElementById('stadisticsBtn');
const stadisticsModal = document.getElementById('stadisticsModal')
const closeStadistics =document.getElementById('closeStadistics');

const canvas = document.getElementById('canvasFrame');
const sections = document.getElementsByClassName('section');
let currentSection = 0;
let startY = 0;
let onCanvas;

loginBtn.innerText = localStorage.getItem('username') || 'Login';

stadisticsBtn.addEventListener('click',()=>{
   stadisticsModal.showModal();
   setTable();
});

closeStadistics.addEventListener('click',()=>{
    stadisticsModal.close();
});

btnRegister.addEventListener('click', () => {
    registerModal.showModal();
    loginModal.close();
});

registerClose.addEventListener('click', () => {
    registerModal.close();
});

returnLogin.addEventListener('click', () => {
    registerModal.close();
    loginModal.showModal();
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    inputRegisterEmail.style.background = 'white';
    inputRegisterUser.style.background = 'white';

    let response = await register({
        "username": document.getElementById('input-register-user').value,
        "password": document.getElementById('input-register-pass').value,
        "contry": document.getElementById('selectCountry').value,
        "email": document.getElementById('input-register-email').value,
        "language": document.getElementById('selectLanguage').value
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
    setCountries();
    setLenguages();
})

loginClose.addEventListener('click', () => {
    loginModal.close()
});

logoutBtn.addEventListener('click', () => {
    if (localStorage.getItem('token')) {
        try {
            logout({ "token": localStorage.getItem('token') })
        } catch (error) {
            console.log(error)
        }
    }
    loginBtn.innerText = localStorage.getItem('username') || 'Login';
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (localStorage.getItem('token')) {
        try {
            logout({ "token": localStorage.getItem('token') })
        } catch (error) {
            console.log(error)
        }
    }
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

async function setCountries() {
    let response = await getCountries();

    response.forEach(element => {
        let option = document.createElement('option');
        option.setAttribute('value', element.country);
        option.innerText = element.country;
        selectCountry.appendChild(option);
    })
}

async function setLenguages() {
    let response = await getLanguages();

    response.forEach(element => {
        let option = document.createElement('option');
        option.setAttribute('value', element.language);
        option.innerText = element.language;
        selectLanguage.appendChild(option);
    });
}
