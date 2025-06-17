document.addEventListener('DOMContentLoaded', () => {
    const announcementContainer = document.getElementById('announcement-container');

    async function fetchAnnouncements() {
        try {
            // Caminho atualizado para o JSON de anúncios
            const response = await fetch('assets/data/announcements.json');


            if (!response.ok) {

                throw new Error(`Erro ao carregar anúncios: ${response.status} ${response.statusText}`);
            }


            const announcements = await response.json();


            announcementContainer.innerHTML = '';


            announcements.forEach(announcement => {
                const announcementItem = document.createElement('div');
                announcementItem.classList.add('announcement-item', 'art-nouveau-card');


                let imageHtml = '';
                if (announcement.imageUrl) {
                    // O caminho da imagem agora é relativo ao index.html, então inclua assets/img/
                    imageHtml = `<img src="${announcement.imageUrl}" alt="${announcement.title}" class="announcement-image">`;
                }


                announcementItem.innerHTML = `
                    ${imageHtml}
                    <h3 class="art-nouveau-text">${announcement.title}</h3>
                    <p>${announcement.description}</p>
                    <div class="announcement-meta">
                        <span class="category art-nouveau-tag">Categoria: ${announcement.category}</span>
                        <span class="location art-nouveau-tag">Preço: ${announcement.price}</span>
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