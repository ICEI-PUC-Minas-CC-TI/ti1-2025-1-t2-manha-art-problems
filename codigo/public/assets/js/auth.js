// public/assets/js/auth.js

/**

 * @param {string} username O nome de usuário ou email.
 * @param {string} password A senha.
 * @returns {Promise<Object>} Uma promessa que resolve com { success: true } em caso de sucesso ou { success: false, message: string } em caso de falha.
 */
export function authenticateUser(username, password) {
    return new Promise(resolve => {
      
        setTimeout(() => {
            const validUsers = [
                { user: 'admin', pass: 'admin123' },
                { user: 'teste@teste.com', pass: 'senha123' }
            ];

            const foundUser = validUsers.find(
                u => u.user === username && u.pass === password
            );

            if (foundUser) {
                
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', username);
                resolve({ success: true });
            } else {
                resolve({ success: false, message: 'Usuário ou senha inválidos.' });
            }
        }, 1000); 
    });
}

/**
 * Verifica se o usuário está autenticado.
 * @returns {boolean} True se o usuário estiver autenticado, false caso contrário.
 */
export function isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

/**
 * Realiza o logout do usuário.
 */
export function logoutUser() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
}