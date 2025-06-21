// public/assets/js/auth.js

// Usa localStorage para simular um "banco de dados" de usuários.
// Em um ambiente real, isso viria de um servidor e um banco de dados.
const STORAGE_KEY = 'artflow_users'; // Chave para armazenar usuários no localStorage
const AUTH_KEY = 'isAuthenticated';
const CURRENT_USER_KEY = 'currentUser';
const USER_TYPE_KEY = 'userType';

// Função auxiliar para obter todos os usuários registrados
export function getUsers() {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// Função auxiliar para salvar a lista completa de usuários registrados
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

            // Verifica se username ou email já existem
            const existingUser = users.find(u => u.username === username || u.email === email);
            if (existingUser) {
                resolve({ success: false, message: 'Usuário ou email já cadastrados.' });
                return;
            }

            // NOVO: Adicionado array 'savedProfiles' vazio para novos usuários
            const newUser = { username, email, password, type, savedProfiles: [] };
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
 * NOVO: Salva um perfil para o usuário logado atualmente.
 * @param {string} username O nome de usuário logado.
 * @param {Object} profile O objeto do perfil a ser salvo.
 * @returns {boolean} True se salvo com sucesso, false caso contrário (ex: já salvo).
 */
export function saveProfileForUser(username, profile) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        // Inicializa savedProfiles se não existir
        if (!users[userIndex].savedProfiles) {
            users[userIndex].savedProfiles = [];
        }

        // Verifica se o perfil já foi salvo para evitar duplicatas (ex: pelo nome ou ID)
        const isAlreadySaved = users[userIndex].savedProfiles.some(
            p => p.id === profile.id // Usa o ID para verificar duplicatas
        );

        if (!isAlreadySaved) {
            // Salva apenas os dados essenciais para o perfil salvo
            const savedProfileData = {
                id: profile.id, // ID único do perfil
                nome: profile.nome,
                imagem: profile.imagem,
                profession: profile.profession || profile.type || 'Artista', // Prioriza profissão, senão tipo, senão genérico
            };
            users[userIndex].savedProfiles.push(savedProfileData);
            saveUsers(users);
            console.log(`Perfil ${profile.nome} salvo para ${username}.`);
            return true;
        } else {
            console.log(`Perfil ${profile.nome} já estava salvo para ${username}.`);
            return false;
        }
    }
    return false; // Usuário não encontrado
}

/**
 * NOVO: Obtém os perfis salvos para o usuário logado atualmente.
 * @param {string} username O nome de usuário logado.
 * @returns {Array} Um array de perfis salvos.
 */
export function getSavedProfiles(username) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    return user ? (user.savedProfiles || []) : [];
}


/**
 * Realiza o logout do usuário.
 */
export function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
    // IMPORTANTE: Não remova STORAGE_KEY aqui para manter os registros e perfis salvos
}