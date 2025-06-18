// public/assets/js/login.js
import { authenticateUser, registerUser, isAuthenticated, getCurrentUsername, getUserType } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM para Login
    const loginSection = document.getElementById('loginSection');
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginUserTypeSelect = document.getElementById('userType');
    const loginMessage = document.getElementById('loginMessage');

    // Referências aos elementos do DOM para Registro
    const registerSection = document.getElementById('registerSection');
    const registerForm = document.getElementById('registerForm');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerUserTypeSelect = document.getElementById('registerUserType');
    const registerMessage = document.getElementById('registerMessage');

    // Referências aos botões de alternância
    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');

    // Função para mostrar a seção de login
    function showLoginSection() {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        showLoginBtn.classList.add('toggle-active');
        showRegisterBtn.classList.remove('toggle-active');
        clearMessages();
    }

    // Função para mostrar a seção de registro
    function showRegisterSection() {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        showRegisterBtn.classList.add('toggle-active');
        showLoginBtn.classList.remove('toggle-active');
        clearMessages();
    }

    // Adiciona event listeners para os botões de alternância
    showLoginBtn.addEventListener('click', showLoginSection);
    showRegisterBtn.addEventListener('click', showRegisterSection);

    // Se o usuário já estiver logado, redireciona para a página inicial
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }

    // Lógica para o formulário de LOGIN
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = loginUsernameInput.value.trim();
        const password = loginPasswordInput.value.trim();
        const userType = loginUserTypeSelect.value;

        if (username === '' || password === '' || userType === '') {
            displayMessage(loginMessage, 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        displayMessage(loginMessage, 'Autenticando...', '');
        loginForm.querySelector('button[type="submit"]').disabled = true;

        const result = await authenticateUser(username, password, userType);

        if (result.success) {
            displayMessage(loginMessage, `Bem-vindo(a) ${getCurrentUsername()} (${getUserType()})! Redirecionando...`, 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            displayMessage(loginMessage, result.message, 'error');
            loginForm.querySelector('button[type="submit"]').disabled = false;
        }
    });

    // Lógica para o formulário de REGISTRO
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const userType = registerUserTypeSelect.value;

        if (username === '' || email === '' || password === '' || confirmPassword === '' || userType === '') {
            displayMessage(registerMessage, 'Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (password.length < 6) {
            displayMessage(registerMessage, 'A senha deve ter no mínimo 6 caracteres.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            displayMessage(registerMessage, 'As senhas não coincidem.', 'error');
            return;
        }

        // Validação de domínio de e-mail já é feita em auth.js, mas uma validação visual aqui ajuda
        if (!email.endsWith('@roberto.com')) {
            displayMessage(registerMessage, 'O email deve ser do domínio @roberto.com.', 'error');
            return;
        }

        displayMessage(registerMessage, 'Registrando...', '');
        registerForm.querySelector('button[type="submit"]').disabled = true;

        const result = await registerUser(username, email, password, userType);

        if (result.success) {
            displayMessage(registerMessage, result.message + ' Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html'; // Redireciona após registro bem-sucedido
            }, 1500);
        } else {
            displayMessage(registerMessage, result.message, 'error');
            registerForm.querySelector('button[type="submit"]').disabled = false;
        }
    });

    // Função auxiliar para exibir mensagens
    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = 'auth-message'; // Reseta classes
        if (type) {
            element.classList.add(type); // Adiciona 'success' ou 'error'
        }
        element.style.display = 'block'; // Mostra a mensagem
    }

    // Função para limpar todas as mensagens
    function clearMessages() {
        loginMessage.style.display = 'none';
        registerMessage.style.display = 'none';
        loginMessage.textContent = '';
        registerMessage.textContent = '';
    }
});