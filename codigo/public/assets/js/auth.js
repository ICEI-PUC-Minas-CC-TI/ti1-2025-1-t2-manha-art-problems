// public/assets/js/auth.js

const STORAGE_KEY = 'artflow_users';
const AUTH_KEY = 'isAuthenticated';
const CURRENT_USER_KEY = 'currentUser';
const USER_TYPE_KEY = 'userType';

// NOVO: Chave para armazenar anúncios criados pelos usuários
const USER_ANNOUNCEMENTS_KEY = 'artflow_user_announcements'; 

export function getUsers() {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function authenticateUser(username, password, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();
            const foundUser = users.find(
                user => (user.username === username || user.email === username) && user.password === password && user.type === type
            );

            if (foundUser) {
                localStorage.setItem(AUTH_KEY, 'true');
                localStorage.setItem(CURRENT_USER_KEY, foundUser.username);
                localStorage.setItem(USER_TYPE_KEY, foundUser.type);
                resolve({ success: true });
            } else {
                resolve({ success: false, message: 'Usuário, senha ou tipo de conta inválidos.' });
            }
        }, 1000);
    });
}

export function registerUser(username, email, password, type) {
    return new Promise(resolve => {
        setTimeout(() => {
            const users = getUsers();

            const existingUser = users.find(user => user.username === username || user.email === email);
            if (existingUser) {
                resolve({ success: false, message: 'Usuário ou email já cadastrados.' });
                return;
            }

            const newUser = { username, email, password, type, savedProfiles: [] };
            users.push(newUser);
            saveUsers(users);

            localStorage.setItem(AUTH_KEY, 'true');
            localStorage.setItem(CURRENT_USER_KEY, username);
            localStorage.setItem(USER_TYPE_KEY, type);

            resolve({ success: true, message: 'Conta criada com sucesso!' });
        }, 1000);
    });
}

export function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === 'true';
}

export function getUserType() {
    return localStorage.getItem(USER_TYPE_KEY);
}

export function getCurrentUsername() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function saveProfileForUser(username, profile) {
    const users = getUsers();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
        if (!users[userIndex].savedProfiles) {
            users[userIndex].savedProfiles = [];
        }

        const isAlreadySaved = users[userIndex].savedProfiles.some(
            p => p.id === profile.id
        );

        if (!isAlreadySaved) {
            const savedProfileData = {
                id: profile.id,
                nome: profile.nome,
                imagem: profile.imagem,
                profession: profile.profession || profile.type || 'Artista',
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
    return false;
}

export function getSavedProfiles(username) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    return user ? (user.savedProfiles || []) : [];
}

// NOVO: Função para obter anúncios criados por usuários
export function getUserAnnouncements() {
    const announcementsJson = localStorage.getItem(USER_ANNOUNCEMENTS_KEY);
    return announcementsJson ? JSON.parse(announcementsJson) : [];
}

// NOVO: Função para salvar anúncios criados por usuários
export function saveUserAnnouncements(announcements) {
    localStorage.setItem(USER_ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
}

export function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(USER_TYPE_KEY);
}