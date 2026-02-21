const fetchButton = document.getElementById('fetchUsers');
const userListDiv = document.getElementById('userList');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

const API_URL = 'https://jsonplaceholder.typicode.com/users';

fetchButton.addEventListener('click', fetchAndDisplayUsers);

async function fetchAndDisplayUsers() {
    clearResults();
    
    try {
        showLoading(true);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(API_URL, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const users = await response.json();
        
        showLoading(false);
        
        displayUsers(users);
        
    } catch (error) {
        showLoading(false);
        
        handleError(error);
    }
}

function displayUsers(users) {
    userListDiv.innerHTML = '';
    
    if (!users || users.length === 0) {
        userListDiv.innerHTML = '<p class="no-data">No users found.</p>';
        return;
    }
    
    const countDisplay = document.createElement('p');
    countDisplay.className = 'user-count';
    countDisplay.textContent = `Found ${users.length} users`;
    userListDiv.appendChild(countDisplay);
    
    users.forEach(user => {
        const userCard = createUserCard(user);
        userListDiv.appendChild(userCard);
    });
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const { 
        id, 
        name, 
        email, 
        address 
    } = user;
    
    const city = address?.city || 'City not available';
    
    card.innerHTML = `
        <div class="user-id">#${id}</div>
        <h3>${escapeHtml(name)}</h3>
        <p>
            <span class="label">📧 Email:</span>
            <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
        </p>
        <p>
            <span class="label">🏙️ City:</span>
            ${escapeHtml(city)}
        </p>
    `;
    
    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleError(error) {
    let errorMessage = '';
    
    if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your internet connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
    } else {
        errorMessage = `Error: ${error.message}`;
    }
    
    showError(errorMessage);
    console.error('Fetch error:', error);
}

function showLoading(show) {
    if (show) {
        loadingDiv.classList.remove('hidden');
        fetchButton.disabled = true;
        fetchButton.textContent = 'Loading...';
    } else {
        loadingDiv.classList.add('hidden');
        fetchButton.disabled = false;
        fetchButton.textContent = 'Fetch Users';
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function clearResults() {
    userListDiv.innerHTML = '';
    errorDiv.classList.add('hidden');
}