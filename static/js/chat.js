/**
 * KoraQuest Chat - WebSocket Handler
 * 
 * Handles real-time messaging via WebSocket connections
 */

class ChatWebSocket {
    constructor(conversationId, wsUrl) {
        this.conversationId = conversationId;
        this.wsUrl = wsUrl;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.isTyping = false;
        this.typingTimeout = null;
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatForm = document.getElementById('chatForm');
        this.connectionStatus = document.getElementById('connectionStatus');
        this.statusText = document.getElementById('statusText');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.typingUser = document.getElementById('typingUser');
        this.loadMoreBtn = document.getElementById('loadMoreBtn');
        this.loadMoreContainer = document.getElementById('loadMoreContainer');
        this.oldestMessageId = null;
        
        this.init();
    }

    init() {
        this.connect();
        this.setupEventListeners();
        this.setupAutoResize();
        this.scrollToBottom();
    }

    connect() {
        try {
            this.updateConnectionStatus('connecting', 'Connecting...');
            this.socket = new WebSocket(this.wsUrl);

            this.socket.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.updateConnectionStatus('connected', 'Connected');
                this.sendPing();
            };

            this.socket.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus('disconnected', 'Connection error');
            };

            this.socket.onclose = () => {
                console.log('WebSocket disconnected');
                this.updateConnectionStatus('disconnected', 'Disconnected');
                this.attemptReconnect();
            };

        } catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.updateConnectionStatus('disconnected', 'Connection failed');
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            this.updateConnectionStatus('connecting', `Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                this.connect();
            }, this.reconnectDelay);
        } else {
            this.updateConnectionStatus('disconnected', 'Connection lost. Please refresh.');
        }
    }

    updateConnectionStatus(status, text) {
        if (this.connectionStatus) {
            this.connectionStatus.className = `connection-status ${status}`;
        }
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    }

    setupEventListeners() {
        // Form submission
        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }

        // Input change handler
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                this.handleInputChange();
                this.autoResize();
            });

            this.messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Load more messages
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadOlderMessages();
            });
        }
    }

    handleInputChange() {
        const hasText = this.messageInput.value.trim().length > 0;
        if (this.sendButton) {
            this.sendButton.disabled = !hasText || !this.isConnected();
        }

        // Send typing indicator
        if (hasText && !this.isTyping) {
            this.sendTyping(true);
            this.isTyping = true;
        }

        // Clear typing indicator after 3 seconds of no typing
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            if (this.isTyping) {
                this.sendTyping(false);
                this.isTyping = false;
            }
        }, 3000);
    }

    sendTyping(isTyping) {
        if (this.isConnected()) {
            this.socket.send(JSON.stringify({
                type: 'typing',
                is_typing: isTyping
            }));
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.isConnected()) {
            return;
        }

        // Send via WebSocket
        this.socket.send(JSON.stringify({
            type: 'chat_message',
            message: message
        }));

        // Clear input
        this.messageInput.value = '';
        this.autoResize();
        if (this.sendButton) {
            this.sendButton.disabled = true;
        }

        // Stop typing indicator
        if (this.isTyping) {
            this.sendTyping(false);
            this.isTyping = false;
        }
    }

    handleMessage(data) {
        switch (data.type) {
            case 'chat_message':
                this.displayMessage(data.message);
                break;
            case 'typing':
                this.showTypingIndicator(data.username, data.is_typing);
                break;
            case 'read_receipt':
                this.updateReadReceipt(data.message_id);
                break;
            case 'pong':
                // Keep-alive response
                break;
            case 'user_join':
            case 'user_leave':
                // Optional: show user join/leave notifications
                break;
            case 'error':
                console.error('Chat error:', data.message);
                this.showError(data.message);
                break;
        }
    }

    displayMessage(messageData) {
        if (!this.messagesArea) return;

        // Hide typing indicator
        if (this.typingIndicator) {
            this.typingIndicator.classList.remove('active');
        }

        // Check if message already exists
        const existing = this.messagesArea.querySelector(`[data-message-id="${messageData.id}"]`);
        if (existing) return;

        const messageDiv = document.createElement('div');
        const isMine = messageData.sender_id === this.getCurrentUserId();
        messageDiv.className = `message ${isMine ? 'mine' : ''}`;
        messageDiv.dataset.messageId = messageData.id;

        const avatar = this.createAvatar(messageData.sender_avatar, messageData.sender_name);
        const content = this.createMessageContent(messageData, isMine);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        // Insert before typing indicator
        if (this.typingIndicator) {
            this.messagesArea.insertBefore(messageDiv, this.typingIndicator);
        } else {
            this.messagesArea.appendChild(messageDiv);
        }

        // Track oldest message for pagination
        if (!this.oldestMessageId || messageData.id < this.oldestMessageId) {
            this.oldestMessageId = messageData.id;
        }

        this.scrollToBottom();
    }

    createAvatar(avatarUrl, senderName) {
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (avatarUrl) {
            const img = document.createElement('img');
            img.src = avatarUrl;
            img.alt = senderName;
            avatarDiv.appendChild(img);
        } else {
            avatarDiv.textContent = senderName.charAt(0).toUpperCase();
        }
        
        return avatarDiv;
    }

    createMessageContent(messageData, isMine) {
        const wrapper = document.createElement('div');
        wrapper.className = 'message-content-wrapper';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        const textP = document.createElement('p');
        textP.className = 'message-text';
        textP.textContent = messageData.content;
        bubble.appendChild(textP);

        wrapper.appendChild(bubble);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'message-meta';

        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = this.formatTime(messageData.timestamp);
        metaDiv.appendChild(timeSpan);

        if (isMine) {
            const readIcon = document.createElement('i');
            if (messageData.is_read) {
                readIcon.className = 'bi bi-check2-all message-read';
                readIcon.title = 'Read';
            } else {
                readIcon.className = 'bi bi-check2';
                readIcon.title = 'Sent';
            }
            metaDiv.appendChild(readIcon);
        }

        wrapper.appendChild(metaDiv);
        return wrapper;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }

    showTypingIndicator(username, isTyping) {
        if (!this.typingIndicator || !this.typingUser) return;

        if (isTyping) {
            this.typingUser.textContent = username;
            this.typingIndicator.classList.add('active');
        } else {
            this.typingIndicator.classList.remove('active');
        }
    }

    updateReadReceipt(messageId) {
        const messageDiv = this.messagesArea.querySelector(`[data-message-id="${messageId}"]`);
        if (messageDiv) {
            const metaDiv = messageDiv.querySelector('.message-meta');
            if (metaDiv) {
                const readIcon = metaDiv.querySelector('.bi-check2-all');
                if (!readIcon) {
                    const sentIcon = metaDiv.querySelector('.bi-check2');
                    if (sentIcon) {
                        sentIcon.className = 'bi bi-check2-all message-read';
                        sentIcon.title = 'Read';
                    }
                }
            }
        }
    }

    loadOlderMessages() {
        if (!this.oldestMessageId) return;

        const url = `/api/chat/${this.conversationId}/messages/?before=${this.oldestMessageId}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.success && data.messages && data.messages.length > 0) {
                    const firstMessage = this.messagesArea.querySelector('.message');
                    const scrollHeight = this.messagesArea.scrollHeight;
                    const scrollTop = this.messagesArea.scrollTop;

                    data.messages.forEach(message => {
                        const messageDiv = this.createMessageElement(message);
                        if (firstMessage) {
                            this.messagesArea.insertBefore(messageDiv, firstMessage);
                        } else {
                            this.messagesArea.insertBefore(messageDiv, this.typingIndicator);
                        }
                    });

                    // Restore scroll position
                    this.messagesArea.scrollTop = scrollTop + (this.messagesArea.scrollHeight - scrollHeight);

                    // Update oldest message ID
                    this.oldestMessageId = data.messages[0].id;

                    // Show/hide load more button
                    if (!data.has_more) {
                        this.loadMoreContainer.style.display = 'none';
                    }
                } else {
                    this.loadMoreContainer.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error loading older messages:', error);
            });
    }

    createMessageElement(messageData) {
        const messageDiv = document.createElement('div');
        const isMine = messageData.is_mine;
        messageDiv.className = `message ${isMine ? 'mine' : ''}`;
        messageDiv.dataset.messageId = messageData.id;

        const avatar = this.createAvatar(messageData.sender_avatar, messageData.sender_name);
        const content = this.createMessageContent(messageData, isMine);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        return messageDiv;
    }

    scrollToBottom() {
        if (this.messagesArea) {
            setTimeout(() => {
                this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
            }, 100);
        }
    }

    sendPing() {
        // Send ping every 30 seconds to keep connection alive
        setInterval(() => {
            if (this.isConnected()) {
                this.socket.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }

    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }

    getCurrentUserId() {
        // Get user ID from a data attribute or global variable
        const container = document.querySelector('.chat-room-container');
        return container ? parseInt(container.dataset.userId) : null;
    }

    setupAutoResize() {
        if (this.messageInput) {
            this.messageInput.addEventListener('input', () => {
                this.autoResize();
            });
        }
    }

    autoResize() {
        if (this.messageInput) {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        }
    }

    showError(message) {
        // Simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.chat-room-container');
    if (container) {
        const conversationId = container.dataset.conversationId;
        const wsUrl = container.dataset.wsUrl;

        if (conversationId && wsUrl) {
            window.chat = new ChatWebSocket(conversationId, wsUrl);
        }
    }
});
