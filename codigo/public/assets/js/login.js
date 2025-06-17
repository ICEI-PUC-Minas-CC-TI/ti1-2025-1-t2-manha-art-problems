
import { authenticateUser, isAuthenticated } from './auth.js'; 

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');

    
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === '' || password === '') {
            displayMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        displayMessage('Autenticando...', ''); 
        loginForm.querySelector('button[type="submit"]').disabled = true; 

        const result = await authenticateUser(username, password);

        if (result.success) {
            displayMessage('Login bem-sucedido! Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500); 
        } else {
            displayMessage(result.message, 'error');
            loginForm.querySelector('button[type="submit"]').disabled = false; 
        }
    });

    function displayMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = 'login-message'; 
        if (type) {
            loginMessage.classList.add(type); 
        }
        loginMessage.style.display = 'block'; 
    }
});