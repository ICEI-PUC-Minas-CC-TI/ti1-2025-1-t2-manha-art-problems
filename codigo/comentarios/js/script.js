document.addEventListener('DOMContentLoaded', () => {
    const authorNameInput = document.getElementById('author-name');
    const commentTextInput = document.getElementById('comment-text');
    const submitCommentButton = document.getElementById('submit-comment');
    const commentsListDiv = document.getElementById('comments-list');

    let comments = []; // Array para armazenar os comentários

    // Função para carregar comentários do localStorage
    function loadComments() {
        const storedComments = localStorage.getItem('artistComments');
        if (storedComments) {
            comments = JSON.parse(storedComments);
            renderComments();
        }
    }

    // Função para salvar comentários no localStorage
    function saveComments() {
        localStorage.setItem('artistComments', JSON.stringify(comments));
    }

    // Função para renderizar (exibir) os comentários no HTML
    function renderComments() {
        commentsListDiv.innerHTML = ''; // Limpa a lista antes de renderizar
        // Renderiza os comentários em ordem inversa para os mais recentes aparecerem primeiro
        for (let i = comments.length - 1; i >= 0; i--) {
            const comment = comments[i];
            const commentCard = document.createElement('div');
            commentCard.classList.add('comment-card');

            commentCard.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-body">
                    <p>${comment.text}</p>
                </div>
            `;
            commentsListDiv.appendChild(commentCard); // Adiciona ao final da lista
        }
    }

    // Event listener para o botão de enviar comentário
    submitCommentButton.addEventListener('click', () => {
        const author = authorNameInput.value.trim();
        const text = commentTextInput.value.trim();

        if (author && text) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('pt-BR', options);

            const newComment = {
                author: author,
                text: text,
                date: formattedDate
            };

            comments.push(newComment); // Adiciona o novo comentário ao array
            saveComments(); // Salva no localStorage
            renderComments(); // Renderiza novamente a lista
            
            // Limpa o formulário
            authorNameInput.value = '';
            commentTextInput.value = '';
        } else {
            alert('Por favor, preencha seu nome e o comentário.');
        }
    });

    // Carrega os comentários quando a página é carregada
    loadComments();
});