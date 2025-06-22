
import { isAuthenticated, getUserType, getCurrentUsername } from './auth.js';
import { showNotification } from './utils.js';


const filtrosData = {
    "filtros": {
        "tags": [
            {
                "categoria": "Artes Visuais",
                "subtags": [
                    "Desenhista", "Artista Digital", "Pintor", "Escultor", "Ilustrador",
                    "Gravurista", "Quadrinista", "Tatuador", "Artista de Rua (Grafiteiro, Muralista)",
                    "Cartunista", "Animador (2D, 3D)", "Modelador 3D", "Artista de Instalação",
                    "Artista Conceitual"
                ]
            },
            {
                "categoria": "Audiovisual",
                "subtags": [
                    "Videomaker", "Fotógrafo", "Cineasta", "Diretor de Fotografia",
                    "Editor de Vídeo", "Técnico de Som (Mixagem, Captação)", "Designer de Som",
                    "Produtor Audiovisual", "Roteirista"
                ]
            },
            {
                "categoria": "Artes Performáticas",
                "subtags": [
                    "Ator", "Bailarino", "Músico (Instrumentista, Vocalista)", "Compositor",
                    "DJ", "Palhaço", "Artista Circense", "Dramaturgo", "Regente"
                ]
            },
            {
                "categoria": "Outras Áreas Criativas",
                "subtags": [
                    "Designer Gráfico", "Web Designer", "Designer de Produto", "Designer de Moda",
                    "Arquiteto", "Decorador de Interiores", "Escritor", "Poeta",
                    "Curador de Arte", "Crítico de Arte"
                ]
            }
        ]
    }
};

const USER_ANNOUNCEMENTS_KEY = 'artflow_user_announcements';


function getUserAnnouncements() {
    const announcementsJson = localStorage.getItem(USER_ANNOUNCEMENTS_KEY);
    return announcementsJson ? JSON.parse(announcementsJson) : [];
}

function saveUserAnnouncements(announcements) {
    localStorage.setItem(USER_ANNOUNCEMENTS_KEY, JSON.stringify(announcements));
}

document.addEventListener('DOMContentLoaded', () => {
    const createServiceForm = document.getElementById('createServiceForm');
    const serviceCategorySelect = document.getElementById('serviceCategory');
    const portfolioMediaInputs = document.getElementById('portfolioMediaInputs');
    const addMediaButton = document.getElementById('addMediaButton');
    const createServiceSection = document.querySelector('.create-service-section'); 


    if (!isAuthenticated() || getUserType() !== 'artflow') {
        createServiceSection.innerHTML = `
            <p class="access-restricted-message art-nouveau-text">
                Acesso restrito! Somente artistas ArtFlow logados podem criar serviços.<br>
                Por favor, <a href="login.html">faça login</a> como artista ou <a href="register.html">crie uma conta de artista</a>.
            </p>
        `;
        
        document.querySelector('footer').style.display = 'none'; 
        return; 
    }


    function populateCategories() {
        filtrosData.filtros.tags.forEach(categoria => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = categoria.categoria;
            categoria.subtags.forEach(subtag => {
                const option = document.createElement('option');
                option.value = subtag;
                option.textContent = subtag;
                optgroup.appendChild(option);
            });
            serviceCategorySelect.appendChild(optgroup);
        });
    }

    
    function addMediaInput(type = 'image', url = '') {
        const mediaInputItem = document.createElement('div');
        mediaInputItem.classList.add('media-input-item');
        mediaInputItem.innerHTML = `
            <select class="art-nouveau-input media-type-select">
                <option value="image" ${type === 'image' ? 'selected' : ''}>Imagem</option>
                <option value="video" ${type === 'video' ? 'selected' : ''}>Vídeo</option>
            </select>
            <input type="url" class="art-nouveau-input media-url-input" placeholder="URL da mídia (Ex: .jpg, .mp4)" value="${url}">
            <button type="button" class="remove-media-button art-nouveau-button">-</button>
        `;
        portfolioMediaInputs.appendChild(mediaInputItem);

 
        mediaInputItem.querySelector('.remove-media-button').addEventListener('click', () => {
            mediaInputItem.remove();
        });
    }

  
    addMediaButton.addEventListener('click', () => addMediaInput());

 
    createServiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const serviceTitle = document.getElementById('serviceTitle').value.trim();
        const serviceDescription = document.getElementById('serviceDescription').value.trim();
        const serviceCategory = serviceCategorySelect.value;
        const servicePrice = parseFloat(document.getElementById('servicePrice').value);
        const servicePriceUnit = document.getElementById('servicePriceUnit').value;
        const mainImageUrl = document.getElementById('mainImageUrl').value.trim();

     
        if (!serviceTitle || !serviceDescription || !serviceCategory || isNaN(servicePrice) || servicePrice <= 0 || !mainImageUrl) {
            showNotification('Por favor, preencha todos os campos obrigatórios e verifique o preço.', 'error');
            return;
        }

       
        const portfolioMedia = [];
        portfolioMediaInputs.querySelectorAll('.media-input-item').forEach(item => {
            const type = item.querySelector('.media-type-select').value;
            const url = item.querySelector('.media-url-input').value.trim();
            if (url) {
                portfolioMedia.push({ type, src: url });
            }
        });

       
        const newAnnouncement = {
            id: 'user-service-' + Date.now().toString(), 
            title: serviceTitle,
            description: serviceDescription,
            category: serviceCategory, 
            price: servicePrice,
            price_unit: servicePriceUnit,
            imageUrl: mainImageUrl,
            artist_name: getCurrentUsername(), 
            tags: [serviceCategory], 
            portfolio_media: portfolioMedia
        };

        
        filtrosData.filtros.tags.forEach(cat => {
            if (cat.subtags.includes(serviceCategory)) {
                newAnnouncement.tags = [...newAnnouncement.tags, ...cat.subtags.filter(tag => tag !== serviceCategory)];
            }
        });


        const userAnnouncements = getUserAnnouncements();
        userAnnouncements.push(newAnnouncement);
        saveUserAnnouncements(userAnnouncements);

        showNotification('Serviço publicado com sucesso!', 'success');
        createServiceForm.reset(); 
        portfolioMediaInputs.innerHTML = '';
        addMediaInput(); 
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });

   
    populateCategories();
    addMediaInput(); 
});