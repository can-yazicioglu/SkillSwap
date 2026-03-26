import { api, requireLogin } from './app.js';

await requireLogin();

const params = new URLSearchParams(window.location.search)
const otherUsername = params.get('username')
const messages = await api(`/chat?username=${otherUsername}`)

const chatAvatar = document.getElementById('chat-avatar');
const chatUsername = document.getElementById('chat-username');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');

chatAvatar.textContent = otherUsername.slice(0, 2);
chatUsername.textContent = otherUsername;

if (messages) {
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        const timeString = new Date(message.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        if (message.you === 0) {
            messageDiv.className = 'message-received';
            messageDiv.style.cssText = 'align-self: flex-start; max-width: 70%; background: #f3f4f6; padding: 0.75rem; border-radius: 15px; border-bottom-left-radius: 5px;';
        } else {
            messageDiv.className = 'message-sent';
            messageDiv.style.cssText = 'align-self: flex-end; max-width: 70%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem; border-radius: 15px; border-bottom-right-radius: 5px;';
        }
        messageDiv.innerHTML = '<div>' + message.content + '</div><div style="font-size: 0.7rem; opacity: 0.8; margin-top: 0.25rem;">' + timeString + '</div>';
        messageList.appendChild(messageDiv);
    });

    messageList.scrollTop = messageList.scrollHeight;
}

// Function to send a message
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
      }

    // Get current time
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = hours + ':' + minutes;

    // Create new message bubble
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-sent';
    messageDiv.style.cssText = 'align-self: flex-end; max-width: 70%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem; border-radius: 15px; border-bottom-right-radius: 5px;';
    messageDiv.innerHTML = '<div>' + messageText + '</div><div style="font-size: 0.7rem; opacity: 0.8; margin-top: 0.25rem;">' + timeString + '</div>';

    // Add to message list
    messageList.appendChild(messageDiv);

    // Clear input
    messageInput.value = '';

    // Scroll to bottom
    messageList.scrollTop = messageList.scrollHeight;
}

// Send button click
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

// Enter key press
if (messageInput) {
    messageInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await sendMessage();
        }
    });
}