import { api, requireLogin } from './app.js';

await requireLogin();

const params = new URLSearchParams(window.location.search);
const otherUsername = params.get('username');
const messages = await api(`/chat?username=${encodeURIComponent(otherUsername)}`);

const chatAvatar = document.getElementById('chat-avatar');
const chatUsername = document.getElementById('chat-username');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

const RECEIVED_STYLE = 'align-self: flex-start; max-width: 70%; background: #f3f4f6; padding: 0.75rem; border-radius: 15px; border-bottom-left-radius: 5px;';
const SENT_STYLE = 'align-self: flex-end; max-width: 70%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem; border-radius: 15px; border-bottom-right-radius: 5px;';

chatAvatar.textContent = otherUsername.slice(0, 2);
chatUsername.textContent = otherUsername;

// Builds a message bubble with textContent so that message bodies are always
// rendered as plain text and never parsed as HTML.
function createMessageBubble(content, timeString, isMine) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isMine ? 'message-sent' : 'message-received';
    messageDiv.style.cssText = isMine ? SENT_STYLE : RECEIVED_STYLE;

    const contentDiv = document.createElement('div');
    contentDiv.textContent = content;

    const timeDiv = document.createElement('div');
    timeDiv.style.cssText = 'font-size: 0.7rem; opacity: 0.8; margin-top: 0.25rem;';
    timeDiv.textContent = timeString;

    messageDiv.append(contentDiv, timeDiv);
    return messageDiv;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

if (messages) {
    messages.forEach((message) => {
        const timeString = formatTime(new Date(message.sent_at));
        const bubble = createMessageBubble(message.content, timeString, message.you !== 0);
        messageList.appendChild(bubble);
    });

    messageList.scrollTop = messageList.scrollHeight;
}

async function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText === '') {
        return;
    }

    try {
        await api('/chat', 'POST', {
            receiver_username: otherUsername,
            content: messageText
        });

        showAlert('Message sent!', 'success');
    } catch (err) {
        showAlert(err.message, 'error');
        return;
    }

    const bubble = createMessageBubble(messageText, formatTime(new Date()), true);
    messageList.appendChild(bubble);

    messageInput.value = '';
    messageList.scrollTop = messageList.scrollHeight;
}

if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (messageInput) {
    messageInput.addEventListener('keypress', async function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await sendMessage();
        }
    });
}
