// public/assets/js/auth.js

// Usa localStorage para simular um "banco de dados" de usuários.
// Em um ambiente real, isso viria de um servidor e um banco de dados.
const STORAGE_KEY = 'artflow_users'; // Chave para armazenar usuários no localStorage
const AUTH_KEY = 'isAuthenticated';
const CURRENT_USER_KEY = 'currentUser';
const USER_TYPE_KEY = 'userType';

function getUsers() {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Simula uma requisição de autenticação a um backend.
 * @param {string} username O nome de usuário ou email.
 * @param {string} password A senha.
 * @param {string} type O tipo de usuário (cliente/artflow).
 * @returns {Promise<Object>} Uma promessa que resolve com { success: true } em caso de sucesso ou { success: false, message: string } em caso de falha.
 */
export function authenticateUser(username, password, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();
            const foundUser = users.find(
                u => (u.username === username || u.email === username) && u.password === password && u.type === type
            );

            if (foundUser) {
                localStorage.setItem(AUTH_KEY, 'true');
                localStorage.setItem(CURRENT_USER_KEY, foundUser.username);
                localStorage.setItem(USER_TYPE_KEY, foundUser.type); // Salva o tipo de usuário
                resolve({ success: true });
            } else {
                resolve({ success: false, message: 'Usuário, senha ou tipo de conta inválidos.' });
            }
        }, 1000);
    });
}

/**
 * Simula a criação de uma nova conta de usuário.
 * @param {string} username O nome de usuário.
 * @param {string} email O email do usuário.
 * @param {string} password A senha.
 * @param {string} type O tipo de usuário (cliente/artflow).
 * @returns {Promise<Object>} Uma promessa que resolve com { success: true } ou { success: false, message: string }.
 */
export function registerUser(username, email, password, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();

            // Validação de e-mail para domínio @roberto.com
            if (!email.endsWith('@roberto.com')) {
                resolve({ success: false, message: 'O email deve ser do domínio @roberto.com.' });
                return;
            }

            // Verifica se username ou email já existem
            const existingUser = users.find(u => u.username === username || u.email === email);
            if (existingUser) {
                resolve({ success: false, message: 'Usuário ou email já cadastrados.' });
                return;
            }

            const newUser = { username, email, password, type };
            users.push(newUser);
            saveUsers(users);

            // Automaticamente loga o usuário após o registro
            localStorage.setItem(AUTH_KEY, 'true');
            localStorage.setItem(CURRENT_USER_KEY, username);
            localStorage.setItem(USER_TYPE_KEY, type); // Salva o tipo de usuário

            resolve({ success: true, message: 'Conta criada com sucesso!' });
        }, 1000);
    });
}

/**
 * Verifica se o usuário está autenticado.
 * @returns {boolean} True se o usuário estiver autenticado, false caso contrário.
 */
export function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

/**
 * Retorna o tipo de usuário logado.
 * @returns {string|null} 'cliente', 'artflow' ou null se não estiver logado.
 */
export function getUserType() {
    return localStorage.getItem(USER_TYPE_KEY);
}

/**
 * Retorna o nome de usuário logado.
 * @returns {string|null} Nome de usuário ou null se não estiver logado.
 */
export function getCurrentUsername() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

/**
 * Realiza o logout do usuário.
 */
export function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
    // Limpar o array de usuários registrados se quiser que eles sumam após o refresh.
    // Para manter os registros, não remova STORAGE_KEY.
    // localStorage.removeItem(STORAGE_KEY); // Descomente se quiser limpar TODOS os registros no logout
}