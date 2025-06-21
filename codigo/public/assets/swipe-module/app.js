// public/assets/swipe-module/app.js
import { listaDePerfisBase } from './perfis.js';
import { getUsers, isAuthenticated, getUserType, getCurrentUsername, saveProfileForUser } from '../js/auth.js'; // Importa novas funções

let indiceAtual = 0;
let listaDePerfisCompleta = [];
const notificationElement = document.getElementById('customNotification');
let notificationTimeout;

// Função para exibir notificações personalizadas
function showNotification(message, duration = 3000) {
    // Verifica se o elemento de notificação está disponível
    if (notificationElement) {
        notificationElement.textContent = message;
        notificationElement.classList.add('show'); // Adiciona a classe para mostrar a notificação

        // Limpa qualquer timeout anterior para que a notificação possa ser mostrada imediatamente
        clearTimeout(notificationTimeout);

        // Define um novo timeout para esconder a notificação após a duração especificada
        notificationTimeout = setTimeout(() => {
            notificationElement.classList.remove('show'); // Remove a classe para esconder a notificação
        }, duration);
    } else {
        // Fallback para o alert() do navegador se o elemento de notificação não for encontrado
        console.error('Elemento de notificação personalizada (#customNotification) não encontrado no DOM!');
        alert(message);
    }
}

// Função para formatar usuários do localStorage para o formato de perfil
function formatarUsuarioParaPerfil(usuario) {
    // Você pode criar uma imagem padrão para usuários criados ou baseada no tipo
    const defaultImage = usuario.type === 'artflow' ? 'assets/img/default-artflow.png' : 'assets/img/default-user.png';
    return {
        id: usuario.username, // Usa o username como ID único para usuários criados
        nome: usuario.username,
        idade: 'Idade Indef.', // Não temos idade no registro, pode ser adicionado depois
        nota: 'Nota Indef.', // Não temos nota no registro
        imagem: defaultImage,
        portfolioPreview: `assets/portfolio/default-portfolio-preview.html?user=${usuario.username}`,
        isRegisteredUser: true, // Flag para identificar que é um usuário registrado
        type: usuario.type,
        profession: usuario.type === 'artflow' ? 'Artista Registrado' : 'Cliente Registrado' // Define uma profissão genérica
    };
}

// Função para combinar perfis base e usuários registrados
function carregarListaDePerfis() {
    const usuariosRegistrados = getUsers(); // Obtém usuários do localStorage
    const perfisDeUsuarios = usuariosRegistrados
        .filter(user => user.type === 'artflow') // Filtra apenas artistas para o swipe, se desejar
        .map(formatarUsuarioParaPerfil);

    listaDePerfisCompleta = [...listaDePerfisBase, ...perfisDeUsuarios];

    // Se não houver perfis, adicione um perfil "vazio" ou de mensagem
    if (listaDePerfisCompleta.length === 0) {
        listaDePerfisCompleta.push({
            id: "empty-profile", // ID para o perfil vazio
            nome: "Nenhum Perfil Disponível",
            idade: '',
            nota: '',
            imagem: '',
            portfolioPreview: '',
            isEmpty: true
        });
    }

    // Opcional: Embaralha a lista para que a ordem não seja sempre a mesma
    // for (let i = listaDePerfisCompleta.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [listaDePerfisCompleta[i], listaDePerfisCompleta[j]] = [listaDePerfisCompleta[j], listaDePerfisCompleta[i]];
    // }
}


// Função para carregar perfil atual na UI
function carregarPerfil(perfil) {
    const perfilElement = document.getElementById('perfil'); // Pega o container do perfil
    const profileImage = perfilElement.querySelector('.profile-image');
    const profileInfo = perfilElement.querySelector('.profile-info');
    const portfolioPreview = document.getElementById("portfolio-preview");
    const swipePortfolioButton = perfilElement.querySelector('.swipe-portfolio-button');

    // Remove a classe de animação para resetar a animação
    perfilElement.classList.remove('fade-in-scale');

    if (perfil.isEmpty) {
        // Se o perfil padrão de "vazio" for o único, não tente carregar imagem ou info detalhada
        profileImage.style.background = `url('assets/img/default-empty.png') center center / cover no-repeat`; // Imagem para "vazio"
        profileInfo.innerHTML = `
            <p><strong>${perfil.nome}</strong></p>
            <p>Cadastre-se ou crie um perfil de artista para ver mais!</p>
        `;
        if(swipePortfolioButton) swipePortfolioButton.style.display = 'none';
    } else {
        profileImage.style.background = `url('${perfil.imagem}') center center / cover no-repeat`;
        profileInfo.innerHTML = `
            <p><strong>${perfil.nome}</strong>, ${perfil.idade} anos | Nota: ${perfil.nota}</p>
            <p>${perfil.profession || perfil.type ? `Profissão: ${perfil.profession || perfil.type.charAt(0).toUpperCase() + perfil.type.slice(1)}` : ''}</p>
        `;
        if(swipePortfolioButton) swipePortfolioButton.style.display = 'inline-block';
    }

    portfolioPreview.style.display = 'none';
    portfolioPreview.innerHTML = '';

    // Adiciona a classe de animação após um pequeno delay para garantir que o DOM seja atualizado
    // Isso "reinicia" a animação
    requestAnimationFrame(() => {
        perfilElement.classList.add('fade-in-scale');
    });
}

// Exporta esta função para ser chamada de index.html
export function carregarPerfilInicial() {
    carregarListaDePerfis(); // Garante que a lista esteja atualizada
    indiceAtual = 0; // Sempre começa do primeiro perfil ao abrir
    if (listaDePerfisCompleta.length > 0) {
        carregarPerfil(listaDePerfisCompleta[indiceAtual]);
    } else {
        // Lida com o caso de não haver perfis
        carregarPerfil({isEmpty: true, nome: "Nenhum Perfil Disponível"});
    }
}


// Funções de interação (like, dislike, superLike, boost)
function boost() {
    const perfil = document.getElementById('perfil');
    perfil.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        perfil.style.animation = '';
    }, 500);
    proximoPerfil(); // Avança para o próximo perfil após o boost
}

// ATUALIZADO: superLike agora salva o perfil e tem animação
function superLike() {
    const superLikeBtn = document.getElementById('superLikeBtn'); // Pega o botão da estrela
    const perfilAtual = listaDePerfisCompleta[indiceAtual];

    if (!isAuthenticated()) {
        showNotification("Você precisa estar logado para salvar perfis!", 'error');
        return;
    }
    
    if (perfilAtual.isEmpty) {
        showNotification("Não há perfil para salvar.", 'info');
        return;
    }

    const currentUser = getCurrentUsername();
    const saved = saveProfileForUser(currentUser, perfilAtual);

    // Remove e adiciona a classe para garantir que a animação seja reiniciada
    superLikeBtn.classList.remove('pulsing');
    void superLikeBtn.offsetWidth; // Trigger reflow to restart animation
    superLikeBtn.classList.add('pulsing');

    if (saved) {
        showNotification(`Perfil de ${perfilAtual.nome} salvo com sucesso!`, 'success');
    } else {
        showNotification(`Perfil de ${perfilAtual.nome} já está salvo.`, 'info');
    }

    // Avança para o próximo perfil após a animação
    setTimeout(() => {
        proximoPerfil();
        superLikeBtn.classList.remove('pulsing'); // Remove a classe após a animação
    }, 600); // Duração da animação
}


function like() {
    const perfil = document.getElementById('perfil');
    perfil.style.transform = 'translateX(100px) rotate(15deg)';
    setTimeout(() => {
        perfil.style.transition = 'transform 0.3s ease';
        perfil.style.transform = 'translateX(0) rotate(0)';
        setTimeout(() => {
            proximoPerfil();
            perfil.style.transition = '';
        }, 300);
    }, 500);
}

function dislike() {
    const perfil = document.getElementById('perfil');
    perfil.style.transform = 'translateX(-100px) rotate(-15deg)';
    setTimeout(() => {
        perfil.style.transition = 'transform 0.3s ease';
        perfil.style.transform = 'translateX(0) rotate(0)';
        setTimeout(() => {
            proximoPerfil();
            perfil.style.transition = '';
        }, 300);
    }, 500);
}

// Carrega próximo perfil
function proximoPerfil() {
    indiceAtual = (indiceAtual + 1) % listaDePerfisCompleta.length;
    carregarPerfil(listaDePerfisCompleta[indiceAtual]);
}

// Visualizar preview do portfólio
function verPreviewPortfolio() {
    const perfilAtual = listaDePerfisCompleta[indiceAtual];
    const container = document.getElementById("portfolio-preview");

    if (perfilAtual.portfolioPreview) {
        fetch(perfilAtual.portfolioPreview)
            .then(response => {
                if (!response.ok) throw new Error("Arquivo não encontrado ou erro de rede");
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
                container.style.display = 'block';
            })
            .catch(err => {
                container.innerHTML = `<em>Erro ao carregar preview: ${err.message}</em>`;
                container.style.display = 'block';
            });
    } else {
        container.innerHTML = "<em>Nenhum preview disponível.</em>";
        container.style.display = 'block';
    }
}

function atualizarPerfil(){
    // Recarrega a lista de perfis completa (incluindo novos usuários)
    carregarListaDePerfis();
    indiceAtual = 0; // Opcional: reiniciar do primeiro perfil após atualizar
    carregarPerfil(listaDePerfisCompleta[indiceAtual]);
}

function enviarMensagem() {
    const perfilAtual = listaDePerfisCompleta[indiceAtual];
    showNotification(`Iniciando chat com ${perfilAtual.nome}!`, 'info');
    setTimeout(() => {
        window.location.href = "chat.html"; // Redireciona após a notificação
    }, 1000); // Pequeno delay para a notificação aparecer
}

// Torna as funções globais para o HTML poder chamá-las via onclick
window.boost = boost;
window.superLike = superLike;
window.like = like;
window.dislike = dislike;
window.verPreviewPortfolio = verPreviewPortfolio;
window.atualizarPerfil = atualizarPerfil;
window.enviarMensagem = enviarMensagem;