document.addEventListener('DOMContentLoaded', function() {
    const messageList = document.getElementById('message-list');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-btn');
    
    // Scroll to bottom when page loads
    if (messageList) {
        messageList.scrollTop = messageList.scrollHeight;
    }
    
    // Function to send a message
    function sendMessage() {
        const messageText = messageInput.value.trim();
        
        if (messageText === '') {
            return;
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
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});