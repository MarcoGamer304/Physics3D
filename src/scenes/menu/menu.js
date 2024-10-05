const loginModal = document.querySelector('#login-modal');
const openLogin = document.querySelector('#btn-open-login');
const closeLogin = document.querySelector('#btn-close-login');

const registerModal = document.querySelector('#register-modal')
const openRegister = document.querySelector('#btn-open-register');
const closeRegister = document.querySelector('#btn-close-register');

const loginForm = document.getElementById('loginForm')

openLogin.addEventListener("click", () => {
    loginModal.showModal();
})

closeLogin.addEventListener("click", () => {
    loginModal.close();
})

openRegister.addEventListener("click", () => {
    registerModal.showModal();
})

closeRegister.addEventListener("click", () => {
    registerModal.close();
})

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

   login();
    window.location.href = '../../../index2.html'
})


function login() {
    localStorage.clear()
    const inputUser = document.getElementById('input-user');
    const inputPassword = document.getElementById('input-password');

    localStorage.setItem('username', inputUser.value);
    localStorage.setItem('password', inputPassword.value);
}
