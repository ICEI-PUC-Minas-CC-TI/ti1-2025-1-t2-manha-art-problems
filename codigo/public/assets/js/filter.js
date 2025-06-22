// public/assets/js/filter.js

// Importa a função para obter anúncios de usuários do auth.js
import { getUserAnnouncements } from './auth.js'; 

const filtrosData = {
    "filtros": {
        "palavra_chave": "",
        "preco": {
            "min": 0,
            "max": 1000 // Aumentei o max para o range slider
        },
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

const tagsFilterDiv = document.getElementById('tags-filter');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const minValueSpan = document.getElementById('min-value');
const maxValueSpan = document.getElementById('max-value');
const resultsContainer = document.getElementById('results-container');
const keywordInput = document.getElementById('keyword-filter');
const applyFiltersButton = document.getElementById('apply-filters-button');

let allAnnouncements = [];

async function fetchAnnouncementsForFilter() {
    try {
        // Busca anúncios estáticos
        const responseStatic = await fetch('assets/data/announcements.json');
        if (!responseStatic.ok) {
            throw new Error(`Erro ao carregar anúncios estáticos para filtro: ${responseStatic.status} ${responseStatic.statusText}`);
        }
        const staticAnnouncements = await responseStatic.json();

        // Busca anúncios criados por usuários (do localStorage)
        const userAnnouncements = getUserAnnouncements();

        // Combina as duas listas de anúncios
        allAnnouncements = [...staticAnnouncements, ...userAnnouncements];
        
        // Exibe todos os anúncios inicialmente (antes de aplicar qualquer filtro)
        mostrarTalentos(allAnnouncements);

    } catch (error) {
        console.error('Ocorreu um erro ao buscar os anúncios para filtro:', error);
        resultsContainer.innerHTML = '<p>Não foi possível carregar os talentos para o filtro no momento.</p>';
    }
}

function gerarFiltrosDeTags() {
    filtrosData.filtros.tags.forEach(categoria => {
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('categoria-group');

        const categoriaTitulo = document.createElement('div');
        categoriaTitulo.classList.add('categoria-title');
        categoriaTitulo.textContent = categoria.categoria;
        categoriaTitulo.addEventListener('click', () => {
            const subtagsDiv = categoriaDiv.querySelector('.subtags');
            subtagsDiv.classList.toggle('open');
            categoriaTitulo.classList.toggle('active');
        });
        categoriaDiv.appendChild(categoriaTitulo);

        const subtagsDiv = document.createElement('div');
        subtagsDiv.classList.add('subtags');
        categoria.subtags.forEach(subtag => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `tag-${subtag.replace(/ /g, '-').replace(/[()]/g, '')}`;
            checkbox.name = 'tag';
            checkbox.value = subtag;

            const label = document.createElement('label');
            label.htmlFor = `tag-${subtag.replace(/ /g, '-').replace(/[()]/g, '')}`;
            label.textContent = subtag;

            const subtagDiv = document.createElement('div');
            subtagDiv.appendChild(checkbox);
            subtagDiv.appendChild(label);
            subtagsDiv.appendChild(subtagDiv);
        });
        categoriaDiv.appendChild(subtagsDiv);

        tagsFilterDiv.appendChild(categoriaDiv);
    });
}

function atualizarValoresPreco() {
    minValueSpan.textContent = `R$ ${parseFloat(minPriceInput.value).toFixed(2).replace('.', ',')}`;
    maxValueSpan.textContent = `R$ ${parseFloat(maxPriceInput.value).toFixed(2).replace('.', ',')}`;
}

function mostrarTalentos(listaTalentos) {
    resultsContainer.innerHTML = '';
    if (listaTalentos.length === 0) {
        resultsContainer.innerHTML = '<p>Nenhum talento encontrado com os filtros selecionados.</p>';
        return;
    }

    listaTalentos.forEach(talento => {
        const talentoCard = document.createElement('div');
        talentoCard.classList.add('announcement-item', 'art-nouveau-card');
        talentoCard.dataset.id = talento.id;

        talentoCard.innerHTML = `
            <img src="${talento.imageUrl}" alt="${talento.title}" class="announcement-image">
            <h3 class="art-nouveau-text">${talento.title}</h3>
            <p class="description">${talento.description}</p>
            <div class="announcement-meta">
                <span class="category art-nouveau-tag">Categoria: ${talento.category}</span>
                <span class="price art-nouveau-tag">Preço: R$ ${talento.price.toFixed(2).replace('.', ',')}${talento.price_unit || ''}</span>
                <span class="tags art-nouveau-tag">Tags: ${talento.tags.join(', ')}</span>
            </div>
        `;
        talentoCard.addEventListener('click', () => {
            window.location.href = `announcement-detail.html?id=${talento.id}`;
        });
        resultsContainer.appendChild(talentoCard);
    });
}

function filtrarResultados() {
    const keyword = keywordInput.value.toLowerCase();
    const minPrice = parseFloat(minPriceInput.value);
    const maxPrice = parseFloat(maxPriceInput.value);
    const selectedTags = Array.from(document.querySelectorAll('#tags-filter input[name="tag"]:checked')).map(cb => cb.value);

    const resultadosFiltrados = allAnnouncements.filter(announcement => {
        const titleLower = announcement.title.toLowerCase();
        const descriptionLower = announcement.description.toLowerCase();
        const priceValido = announcement.price >= minPrice && announcement.price <= maxPrice;

        const keywordValida = keyword === '' || titleLower.includes(keyword) || descriptionLower.includes(keyword);

        const tagsValidas = selectedTags.length === 0 || selectedTags.every(tag => announcement.tags.includes(tag));
        
        return priceValido && keywordValida && tagsValidas;
    });

    mostrarTalentos(resultadosFiltrados);
}

document.addEventListener('DOMContentLoaded', () => {
    gerarFiltrosDeTags();
    atualizarValoresPreco();
    fetchAnnouncementsForFilter(); // Carrega os anúncios para o filtro

    // Adiciona ouvintes de evento para os inputs de preço
    minPriceInput.addEventListener('input', () => {
        if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
            maxPriceInput.value = minPriceInput.value;
        }
        atualizarValoresPreco();
        filtrarResultados(); // Filtra ao mover o slider
    });

    maxPriceInput.addEventListener('input', () => {
        if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
            minPriceInput.value = maxPriceInput.value;
        }
        atualizarValoresPreco();
        filtrarResultados(); // Filtra ao mover o slider
    });

    keywordInput.addEventListener('input', filtrarResultados); // Filtra em tempo real na digitação
    applyFiltersButton.addEventListener('click', filtrarResultados); // Botão "Buscar Harmonia"
    
    // Adiciona ouvintes para todos os checkboxes de tags (para filtrar ao clicar na tag)
    tagsFilterDiv.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox' && event.target.name === 'tag') {
            filtrarResultados();
        }
    });
});