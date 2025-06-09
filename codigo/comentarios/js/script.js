document.addEventListener('DOMContentLoaded', () => {
    const authorNameInput = document.getElementById('author-name');
    const commentTextInput = document.getElementById('comment-text');
    const submitCommentButton = document.getElementById('submit-comment');
    const commentsListDiv = document.getElementById('comments-list');

    let comments = []; 

  
    function loadComments() {
        const storedComments = localStorage.getItem('artistComments');
        if (storedComments) {
            comments = JSON.parse(storedComments);
            renderComments();
        }
    }


    function saveComments() {
        localStorage.setItem('artistComments', JSON.stringify(comments));
    }

    
    function renderComments() {
        commentsListDiv.innerHTML = ''; 
     
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
            commentsListDiv.appendChild(commentCard); 
        }
    }

  
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

            comments.push(newComment); 
            saveComments(); 
            renderComments(); 
            
          
            authorNameInput.value = '';
            commentTextInput.value = '';
        } else {
            alert('Por favor, preencha seu nome e o comentário.');
        }
    });

    
    loadComments();
});