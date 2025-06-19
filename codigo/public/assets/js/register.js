
import { registerUser, isAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  
    const registerForm = document.getElementById('registerForm');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerUserTypeSelect = document.getElementById('registerUserType');
    const registerMessage = document.getElementById('registerMessage');

   
    if (isAuthenticated()) {
        window.location.href = 'index.html';
    }

    
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = registerUsernameInput.value.trim();
        const email = registerEmailInput.value.trim();
        const password = registerPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const userType = registerUserTypeSelect.value;

        if (username === '' || email === '' || password === '' || confirmPassword === '' || userType === '') {
            displayMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (password.length < 6) {
            displayMessage('A senha deve ter no mínimo 6 caracteres.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('As senhas não coincidem.', 'error');
            return;
        }

     
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            displayMessage('Por favor, insira um formato de email válido (ex: seu@exemplo.com).', 'error');
            return;
        }

        displayMessage('Registrando...', '');
        registerForm.querySelector('button[type="submit"]').disabled = true;

        const result = await registerUser(username, email, password, userType);

        if (result.success) {
            displayMessage(result.message + ' Redirecionando...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 1500);
        } else {
            displayMessage(result.message, 'error');
            registerForm.querySelector('button[type="submit"]').disabled = false;
        }
    });

   
    function displayMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = 'auth-message'; 
        if (type) {
            registerMessage.classList.add(type); 
        }
        registerMessage.style.display = 'block'; 
    }
});