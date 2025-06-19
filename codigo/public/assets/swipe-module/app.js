// public/assets/swipe-module/app.js
import { listaDePerfisBase } from './perfis.js'; // Importa os perfis base
import { getUsers, isAuthenticated, getUserType } from '../js/auth.js'; // Importa getUsers do auth.js (agora exportado!)

let indiceAtual = 0;
let listaDePerfisCompleta = []; // Lista que vai combinar perfis base e perfis criados

// Função para formatar usuários do localStorage para o formato de perfil
function formatarUsuarioParaPerfil(usuario) {
    // Você pode criar uma imagem padrão para usuários criados ou baseada no tipo
    const defaultImage = usuario.type === 'artflow' ? 'assets/img/default-artflow.png' : 'assets/img/default-user.png';
    return {
        nome: usuario.username,
        idade: 'Idade Indef.', // Não temos idade no registro, pode ser adicionado depois
        nota: 'Nota Indef.', // Não temos nota no registro
        imagem: defaultImage,
        portfolioPreview: `assets/portfolio/default-portfolio-preview.html?user=${usuario.username}`, // Link genérico ou dinâmico
        isRegisteredUser: true, // Flag para identificar que é um usuário registrado
        type: usuario.type
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
            nome: "Nenhum Perfil Disponível",
            idade: '',
            nota: '',
            imagem: '',
            portfolioPreview: '',
            isEmpty: true
        });
    }

    // Embaralha a lista para que a ordem não seja sempre a mesma (opcional)
    // for (let i = listaDePerfisCompleta.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [listaDePerfisCompleta[i], listaDePerfisCompleta[j]] = [listaDePerfisCompleta[j], listaDePerfisCompleta[i]];
    // }
}


// Função para carregar perfil atual na UI
function carregarPerfil(perfil) {
    const profileImage = document.querySelector('.profile-image');
    const profileInfo = document.querySelector('.profile-info');
    const portfolioPreview = document.getElementById("portfolio-preview");
    const swipePortfolioButton = document.querySelector('.swipe-portfolio-button');

    if (perfil.isEmpty) {
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
            <p>${perfil.isRegisteredUser ? `Tipo: ${perfil.type.charAt(0).toUpperCase() + perfil.type.slice(1)}` : ''}</p>
        `;
        if(swipePortfolioButton) swipePortfolioButton.style.display = 'inline-block';
    }


    portfolioPreview.style.display = 'none';
    portfolioPreview.innerHTML = '';
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
}

function superLike() {
    const perfil = document.getElementById('perfil');
    perfil.style.transform = 'scale(1.1)';
    setTimeout(() => {
        perfil.style.transform = '';
        proximoPerfil(); // Carrega o próximo perfil após o superLike
    }, 500);
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
    // Em uma aplicação real, você passaria o ID ou nome do perfil para a página de chat
    alert(`Enviando mensagem para ${perfilAtual.nome}! (Redirecionando para o Chat)`);
    window.location.href = "chat.html"; // Redireciona para a página de chat
}

// Torna as funções globais para o HTML poder chamá-las via onclick
window.boost = boost;
window.superLike = superLike;
window.like = like;
window.dislike = dislike;
window.verPreviewPortfolio = verPreviewPortfolio;
window.atualizarPerfil = atualizarPerfil;
window.enviarMensagem = enviarMensagem;