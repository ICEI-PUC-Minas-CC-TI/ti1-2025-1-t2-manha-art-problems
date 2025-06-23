
import { authenticateUser, isAuthenticated } from './auth.js'; // Removido registerUser

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM para Login
    const loginForm = document.getElementById('loginForm');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginUserTypeSelect = document.getElementById('userType');
    const loginMessage = document.getElementById('loginMessage');

    // Se o usuário já estiver logado, redireciona para a página inicial
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }

    //  LOGIN
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
            displayMessage(loginMessage, 'Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            displayMessage(loginMessage, result.message, 'error');
            loginForm.querySelector('button[type="submit"]').disabled = false;
        }
    });

    //  exibir mensagens (apenas para o loginMessage)
    function displayMessage(element, message, type) {
        element.textContent = message;
        element.className = 'auth-message'; // Reseta classes
        if (type) {
            element.classList.add(type); // Adiciona 'success' ou 'error'
        }
        element.style.display = 'block'; // Mostra a mensagem
    }
});