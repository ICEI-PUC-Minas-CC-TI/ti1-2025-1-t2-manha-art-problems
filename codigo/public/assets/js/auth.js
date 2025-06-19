
const STORAGE_KEY = 'artflow_users'; 
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
 * @param {string} username O nome de usuário ou email.
 * @param {string} password A senha.
 * @param {string} type O tipo de usuário (cliente/artflow).
 * @returns {Promise<Object>} 
 * */
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

 * @param {string} username O nome de usuário.
 * @param {string} email O email do usuário.
 * @param {string} password A senha.
 * @param {string} type O tipo de usuário (cliente/artflow).
 * @returns {Promise<Object>} 
 */
export function registerUser(username, email, password, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();

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
}