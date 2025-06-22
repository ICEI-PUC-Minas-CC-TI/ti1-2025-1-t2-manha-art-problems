

const notificationElement = document.getElementById('customNotification');
let notificationTimeout;

/**
 * Exibe uma notificação personalizada na tela.
 * @param {string} message 
 * @param {string} type 
 * @param {number} duration.
 */
export function showNotification(message, type = 'info', duration = 3000) {
    if (!notificationElement) {
        console.error('Elemento de notificação personalizada (#customNotification) não encontrado no DOM!');
        const fallbackNotification = document.createElement('div');
        fallbackNotification.textContent = message;
        fallbackNotification.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white; padding: 15px; border-radius: 5px; z-index: 9999;
            opacity: 0; transition: opacity 0.3s;
        `;
        document.body.appendChild(fallbackNotification);
        setTimeout(() => { fallbackNotification.style.opacity = '1'; }, 10);
        setTimeout(() => {
            fallbackNotification.style.opacity = '0';
            setTimeout(() => { fallbackNotification.remove(); }, 300);
        }, duration);
        return;
    }

    notificationElement.textContent = message;
    notificationElement.className = 'custom-notification show';
    
    if (type === 'success') {
        notificationElement.classList.add('success');
    } else if (type === 'error') {
        notificationElement.classList.add('error');
    } else if (type === 'info') {
        notificationElement.classList.add('info');
    }

    clearTimeout(notificationTimeout);

    notificationTimeout = setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.addEventListener('transitionend', function handler() {
            notificationElement.classList.remove('success', 'error', 'info');
            notificationElement.removeEventListener('transitionend', handler);
        });
    }, duration);
}