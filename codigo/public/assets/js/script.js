import { getUserAnnouncements } from './auth.js'; // AGORA NO TOPO DO ARQUIVO

document.addEventListener('DOMContentLoaded', () => {
    const announcementContainer = document.getElementById('announcement-container');

    async function fetchAnnouncements() {
        try {
            const responseStatic = await fetch('assets/data/announcements.json');
            if (!responseStatic.ok) {
                throw new Error(`Erro ao carregar anúncios estáticos: ${responseStatic.status} ${responseStatic.statusText}`);
            }
            const staticAnnouncements = await responseStatic.json();

            const userAnnouncements = getUserAnnouncements();

            const allAnnouncements = [...staticAnnouncements, ...userAnnouncements];

            announcementContainer.innerHTML = '';

            if (allAnnouncements.length === 0) {
                announcementContainer.innerHTML = '<p>Nenhum anúncio disponível no momento.</p>';
                return;
            }

            allAnnouncements.forEach(announcement => {
                const announcementItem = document.createElement('div');
                announcementItem.classList.add('announcement-item', 'art-nouveau-card');
                
                announcementItem.addEventListener('click', () => {
                    window.location.href = `announcement-detail.html?id=${announcement.id}`;
                });

                let imageHtml = '';
                if (announcement.imageUrl) {
                    imageHtml = `<img src="${announcement.imageUrl}" alt="${announcement.title}" class="announcement-image">`;
                }

                announcementItem.innerHTML = `
                    ${imageHtml}
                    <h3 class="art-nouveau-text">${announcement.title}</h3>
                    <p>${announcement.description}</p>
                    <div class="announcement-meta">
                        <span class="category art-nouveau-tag">Categoria: ${announcement.category}</span>
                        <span class="location art-nouveau-tag">Preço: R$ ${announcement.price.toFixed(2).replace('.', ',')}${announcement.price_unit || ''}</span>
                    </div>
                `;

                announcementContainer.appendChild(announcementItem);
            });

        } catch (error) {
            console.error('Ocorreu um erro ao buscar os anúncios:', error);
            announcementContainer.innerHTML = '<p>Não foi possível carregar os anúncios no momento. Por favor, tente novamente mais tarde.</p>';
        }
    }

    fetchAnnouncements();
});