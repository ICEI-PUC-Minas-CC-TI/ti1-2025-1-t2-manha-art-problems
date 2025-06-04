// Índice atual para navegar pelos perfis
let indiceAtual = 0;

// Função para carregar perfil atual
function carregarPerfil(perfil) {
    const profileImage = document.querySelector('.profile-image');
    const profileInfo = document.querySelector('.profile-info');
    const portfolioPreview = document.getElementById("portfolio-preview");

    if (perfil.imagem) {
        profileImage.style.background = `url('${perfil.imagem}') center center / cover no-repeat`;
    } else {
        profileImage.style.background = '#000';
    }

    profileInfo.innerHTML = `
        <p><strong>${perfil.nome}</strong>, ${perfil.idade} anos | Nota: ${perfil.nota}</p>
        <div style="margin-top: 10px;">
            <button onclick="verPreviewPortfolio()" style="
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
" onmouseover="this.style.backgroundColor='#0056b3'" 
onmouseout="this.style.backgroundColor='#007bff'">
    👁️ Ver Portfolio
</button>
    <!-- Área de preview do portfólio -->
    <div id="portfolio-preview" style="margin-top: 20px; border: 1px solid #ccc; padding: 10px; display: none;"></div>
  </div>
        </div>
    `;

    portfolioPreview.style.display = 'none';
    portfolioPreview.innerHTML = '';
}
function boost() {
    const perfil = document.getElementById('perfil');

    // Aplica a animação de chacoalho
    perfil.style.animation = 'shake 0.5s ease-in-out';

    console.log("Boost ativado!");

    // Remove a animação após terminar para poder reaplicá-la
    setTimeout(() => {
        perfil.style.animation = '';
    }, 500);
}
function superLike() {
    const perfil = document.getElementById('perfil');
    // Aplica o zoom (ex: 1.05x maior)
    perfil.style.transform = 'scale(1.1)';
    // Volta ao tamanho original após 500ms
    setTimeout(() => {
        perfil.style.transform = '';
    }, 500);
     // 4. Após centralizar, carrega próximo perfil
        setTimeout(() => {
            proximoPerfil();
            perfil.style.transition = '';
        }, 300);
    
}
// Carrega próximo perfil sem reload
function proximoPerfil() {
    indiceAtual = (indiceAtual + 1) % listaDePerfis.length;
    carregarPerfil(listaDePerfis[indiceAtual]);
}

function like() {
    const perfil = document.getElementById('perfil');

    // 1. Animação para a direita
    perfil.style.transform = 'translateX(100px) rotate(15deg)';
    
    // 2. Após animação, mostra alerta e centraliza
    setTimeout(() => {

        // 3. Volta pro centro com efeito suave
        perfil.style.transition = 'transform 0.3s ease';
        perfil.style.transform = 'translateX(0) rotate(0)';

        // 4. Depois de centralizado, carrega novo perfil
        setTimeout(() => {
            proximoPerfil();
            perfil.style.transition = '';
        }, 300);
    }, 500);
}
function dislike() {
    const perfil = document.getElementById('perfil');

    // 1. Animação para a esquerda
    perfil.style.transform = 'translateX(-100px) rotate(-15deg)';

    // 2. Após 500ms (tempo da animação), faça:
    setTimeout(() => {

        // 3. Centraliza com transição suave
        perfil.style.transition = 'transform 0.3s ease';
        perfil.style.transform = 'translateX(0) rotate(0)';
        
        // 4. Após centralizar, carrega próximo perfil
        setTimeout(() => {
            proximoPerfil();
            perfil.style.transition = '';
        }, 300);
    }, 500);
}



// Visualizar preview do portfólio
function verPreviewPortfolio() {
    const perfilAtual = listaDePerfis[indiceAtual];
    const container = document.getElementById("portfolio-preview");

    if (perfilAtual.portfolioPreview) {
        fetch(perfilAtual.portfolioPreview)
            .then(response => {
                if (!response.ok) throw new Error("Arquivo não encontrado");
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
proximoPerfil();
}

 function enviarMensagem() {
    window.location.href = "chat.html";
  }