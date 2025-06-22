// public/assets/swipe-module/app.js
import { listaDePerfisBase } from './perfis.js';
import { getUsers, isAuthenticated, getUserType, getCurrentUsername, saveProfileForUser } from '../js/auth.js';
import { showNotification } from '../js/utils.js';

let indiceAtual = 0;
let listaDePerfisCompleta = [];

function formatarUsuarioParaPerfil(usuario) {
    const defaultImage = usuario.type === 'artflow' ? 'assets/img/default-artflow.png' : 'assets/img/default-user.png';
    return {
        id: usuario.username,
        nome: usuario.username,
        idade: 'Idade Indef.',
        nota: 'Nota Indef.',
        imagem: defaultImage,
        portfolioPreview: `assets/portfolio/default-portfolio-preview.html?user=${usuario.username}`,
        isRegisteredUser: true,
        type: usuario.type,
        profession: usuario.type === 'artflow' ? 'Artista Registrado' : 'Cliente Registrado'
    };
}

function carregarListaDePerfis() {
    const usuariosRegistrados = getUsers();
    const perfisDeUsuarios = usuariosRegistrados
        .filter(user => user.type === 'artflow')
        .map(formatarUsuarioParaPerfil);

    listaDePerfisCompleta = [...listaDePerfisBase, ...perfisDeUsuarios];

    if (listaDePerfisCompleta.length === 0) {
        listaDePerfisCompleta.push({
            id: "empty-profile",
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


function carregarPerfil(perfil) {
    const perfilElement = document.getElementById('perfil');
    const profileImage = perfilElement.querySelector('.profile-image');
    const profileInfo = perfilElement.querySelector('.profile-info');
    const portfolioPreview = document.getElementById("portfolio-preview");
    const swipePortfolioButton = perfilElement.querySelector('.swipe-portfolio-button');

    perfilElement.classList.remove('fade-in-scale');

    if (perfil.isEmpty) {
        profileImage.style.background = `url('assets/img/default-empty.png') center center / cover no-repeat`;
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

    requestAnimationFrame(() => {
        perfilElement.classList.add('fade-in-scale');
    });
}

export function carregarPerfilInicial() {
    carregarListaDePerfis();
    indiceAtual = 0;
    if (listaDePerfisCompleta.length > 0) {
        carregarPerfil(listaDePerfisCompleta[indiceAtual]);
    } else {
        carregarPerfil({isEmpty: true, nome: "Nenhum Perfil Disponível"});
    }
}


function boost() {
    const perfil = document.getElementById('perfil');
    perfil.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        perfil.style.animation = '';
    }, 500);
    proximoPerfil();
}

function superLike() {
    const superLikeBtn = document.getElementById('superLikeBtn');
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

    superLikeBtn.classList.remove('pulsing');
    void superLikeBtn.offsetWidth;
    superLikeBtn.classList.add('pulsing');

    if (saved) {
        showNotification(`Perfil de ${perfilAtual.nome} salvo com sucesso!`, 'success');
    } else {
        showNotification(`Perfil de ${perfilAtual.nome} já está salvo.`, 'info');
    }

    setTimeout(() => {
        proximoPerfil();
        superLikeBtn.classList.remove('pulsing');
    }, 600);
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

function proximoPerfil() {
    indiceAtual = (indiceAtual + 1) % listaDePerfisCompleta.length;
    carregarPerfil(listaDePerfisCompleta[indiceAtual]);
}

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
    carregarListaDePerfis();
    indiceAtual = 0;
    carregarPerfil(listaDePerfisCompleta[indiceAtual]);
}

function enviarMensagem() {
    const perfilAtual = listaDePerfisCompleta[indiceAtual];
    showNotification(`Iniciando chat com ${perfilAtual.nome}!`, 'info');
    setTimeout(() => {
        window.location.href = "chat.html";
    }, 1000);
}

window.boost = boost;
window.superLike = superLike;
window.like = like;
window.dislike = dislike;
window.verPreviewPortfolio = verPreviewPortfolio;
window.atualizarPerfil = atualizarPerfil;
window.enviarMensagem = enviarMensagem;