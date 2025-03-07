// Password hash (change this to your desired password)
const PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // This is 'password'

// Utility function to hash password
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Initialize messages from localStorage
let messages = JSON.parse(localStorage.getItem('privateMessages') || '[]');

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('authenticated') === 'true';
}

// Authenticate user
async function authenticate(password) {
    const hashedPassword = await hashPassword(password);
    if (hashedPassword === PASSWORD_HASH) {
        sessionStorage.setItem('authenticated', 'true');
        showPrivateSection();
        return true;
    }
    return false;
}

// Show/hide private section
function showPrivateSection() {
    const privateSection = document.getElementById('private-messages');
    const authSection = document.getElementById('auth-section');
    
    if (isAuthenticated()) {
        privateSection.style.display = 'block';
        authSection.style.display = 'none';
        displayMessages();
    } else {
        privateSection.style.display = 'none';
        authSection.style.display = 'block';
    }
}

// Add new message
function addMessage(message) {
    const newMessage = {
        id: Date.now(),
        text: message,
        timestamp: new Date().toISOString()
    };
    messages.unshift(newMessage);
    localStorage.setItem('privateMessages', JSON.stringify(messages));
    displayMessages();
}

// Display messages
function displayMessages() {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = messages.map(msg => `
        <div class="message-item fade-up">
            <p>${msg.text}</p>
            <small>${new Date(msg.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    showPrivateSection();

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');
        
        if (await authenticate(password)) {
            errorMsg.textContent = '';
        } else {
            errorMsg.textContent = 'Incorrect password';
        }
    });

    // Message form submission
    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (message) {
            addMessage(message);
            messageInput.value = '';
        }
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('authenticated');
        showPrivateSection();
    });
});
