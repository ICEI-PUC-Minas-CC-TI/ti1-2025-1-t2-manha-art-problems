
import { isAuthenticated, getCurrentUsername, getUserType } from './auth.js';

const COMMENTS_STORAGE_KEY = 'artflow_comments';
let currentAnnouncementId = null; 


function getAllCommentsFromStorage() {
    const commentsJson = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return commentsJson ? JSON.parse(commentsJson) : [];
}


function saveAllCommentsToStorage(comments) {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}


function loadAndDisplayComments(announcementId) {
    const commentsListDiv = document.getElementById('comments-list');
    const allComments = getAllCommentsFromStorage();
    const commentsForThisAnnouncement = allComments.filter(comment => comment.announcementId === announcementId);

    commentsListDiv.innerHTML = ''; 

    if (commentsForThisAnnouncement.length === 0) {
        commentsListDiv.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
    }

    commentsForThisAnnouncement.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); 

    commentsForThisAnnouncement.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');

        const formattedDate = new Date(comment.timestamp).toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        commentItem.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author} <span class="user-type">(${comment.userType.charAt(0).toUpperCase() + comment.userType.slice(1)})</span></span>
                <span class="comment-date">${formattedDate}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        `;
        commentsListDiv.appendChild(commentItem);
    });
}


async function handleCommentSubmission(event) {
    event.preventDefault();

    const commentTextArea = document.getElementById('comment-text');
    const commentText = commentTextArea.value.trim();

    if (!commentText) {
        alert('Por favor, escreva um comentário antes de enviar.');
        return;
    }

    if (!isAuthenticated()) {
        alert('Você precisa estar logado para comentar.');
        window.location.href = 'login.html';
        return;
    }

    const author = getCurrentUsername();
    const userType = getUserType();
    const timestamp = new Date().toISOString();

    const newComment = {
        id: Date.now().toString(),
        announcementId: currentAnnouncementId,
        author,
        userType,
        text: commentText,
        timestamp
    };

    const allComments = getAllCommentsFromStorage();
    allComments.push(newComment);
    saveAllCommentsToStorage(allComments);

    commentTextArea.value = '';
    loadAndDisplayComments(currentAnnouncementId); 
}


export function initCommentsSection(announcementId) {
    currentAnnouncementId = announcementId; 
    const commentFormSection = document.getElementById('comment-form-section');

    if (isAuthenticated()) {
        const username = getCurrentUsername();
        const userType = getUserType();
        commentFormSection.innerHTML = `
            <h4 class="comment-as">Comentar como: ${username} (${userType.charAt(0).toUpperCase() + userType.slice(1)})</h4>
            <form id="comment-form" class="comment-form">
                <textarea id="comment-text" placeholder="Escreva seu comentário aqui..." required></textarea>
                <button type="submit" class="art-nouveau-button">Enviar Comentário</button>
            </form>
        `;
        document.getElementById('comment-form').addEventListener('submit', handleCommentSubmission);
    } else {
        commentFormSection.innerHTML = `
            <p class="login-to-comment-message">
                Para deixar um comentário, por favor <a href="login.html">faça login</a> ou <a href="register.html">crie uma conta</a>.
            </p>
        `;
    }

    loadAndDisplayComments(announcementId);
}