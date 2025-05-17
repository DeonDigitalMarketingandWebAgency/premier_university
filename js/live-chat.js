// Chat Manager
const chat = {
    history: [],
    agentOnline: true,
    unread: 0,
    init() {
        this.bindEvents()
        this.loadHistory()
        this.updateChatTime()
        this.checkAgentAvailability()
    },

    bindEvents() {
        // Button Click Events
        document.getElementById('chatButton').addEventListener('click', () => this.toggleChat())
        document.getElementById('closeChat').addEventListener('click', () => this.closeChat())
        document.getElementById('minimizeChat').addEventListener('click', () => this.minimizeChat())

        // Message Submission
        document.getElementById('sendMessage').addEventListener('click', () => this.sendMessage())
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage()
        })
    },

    toggleChat() {
        const chatBox = document.getElementById('chatBox')
        chatBox.classList.toggle('d-none')
        this.resetUnread()
        if (!chatBox.classList.contains('d-none')) {
            this.scrollToBottom()
        }
    },

    async sendMessage() {
        const input = document.getElementById('chatInput')
        const message = input.value.trim()

        if (!message) return

        // Add user message
        this.addMessage(message, 'user')
        input.value = ''

        // Simulate agent response
        if (this.agentOnline) {
            this.showTypingIndicator()
            setTimeout(() => {
                this.addMessage(this.generateResponse(message), 'agent')
                this.hideTypingIndicator()
            }, 1500)
        } else {
            this.addMessage("Our agents are currently unavailable. Please try again later.", 'system')
        }

        this.saveHistory()
    },

    addMessage(text, sender) {
        const messagesDiv = document.getElementById('chatMessages')
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const messageDiv = document.createElement('div')
        messageDiv.className = `message message-${sender}`
        messageDiv.innerHTML = `
                <div class="message-text">${text}</div>
                <div class="message-time text-end" style="font-size:0.75em; opacity:0.7">${time}</div>
            `

        messagesDiv.appendChild(messageDiv)
        this.scrollToBottom()

        if (sender === 'agent' && document.getElementById('chatBox').classList.contains('d-none')) {
            this.incrementUnread()
        }
    },

    showTypingIndicator() {
        const typing = document.createElement('div')
        typing.className = 'typing-indicator'
        typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>'
        document.getElementById('chatMessages').appendChild(typing)
        this.scrollToBottom()
    },

    hideTypingIndicator() {
        document.querySelector('.typing-indicator')?.remove()
    },

    scrollToBottom() {
        const messagesDiv = document.getElementById('chatMessages')
        messagesDiv.scrollTop = messagesDiv.scrollHeight
    },

    incrementUnread() {
        this.unread++
        document.getElementById('unreadCount').textContent = this.unread
    },

    resetUnread() {
        this.unread = 0
        document.getElementById('unreadCount').textContent = '0'
    },

    updateChatTime() {
        document.getElementById('chatTime').textContent = new Date().toLocaleTimeString()
    },

    checkAgentAvailability() {
        // Simulate agent availability check
        setInterval(() => {
            this.agentOnline = Math.random() > 0.1 // 90% available
            document.getElementById('agentStatus').textContent =
                this.agentOnline ? 'Online' : 'Offline'
            document.getElementById('agentStatus').className =
                this.agentOnline ? 'text-success' : 'text-danger'
        }, 5000)
    },

    generateResponse(message) {
        // Simple AI response generator
        const responses = {
            hello: "Hello! How can I assist you today?",
            hours: "Our office hours are Monday-Friday 8AM-6PM EST.",
            admission: "For admissions inquiries, please visit our admissions page or email admissions@premieruni.edu",
            default: "Thank you for your message. Our team will respond shortly."
        }

        const lowerMsg = message.toLowerCase()
        return Object.entries(responses).find(([key]) => lowerMsg.includes(key))?.[1] || responses.default
    },

    saveHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.history))
    },

    loadHistory() {
        const history = localStorage.getItem('chatHistory')
        if (history) {
            JSON.parse(history).forEach(msg => this.addMessage(msg.text, msg.sender))
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => chat.init())