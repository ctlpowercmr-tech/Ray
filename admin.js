// Admin Authentication
const ADMIN_PASSWORD = 'admin123'; // Change this in production
let isAuthenticated = false;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const adminPassword = document.getElementById('adminPassword');

// Login functionality
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = adminPassword.value;
    const button = e.target.querySelector('.btn-login');
    const originalText = button.innerHTML;
    
    // Loading animation
    button.innerHTML = '<div class="btn-loader"></div>';
    button.disabled = true;
    
    setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
            isAuthenticated = true;
            localStorage.setItem('adminAuthenticated', 'true');
            
            // Success animation
            button.innerHTML = '<i class="fas fa-check"></i> Connexion réussie!';
            button.style.background = 'var(--admin-success)';
            
            setTimeout(() => {
                loginScreen.style.opacity = '0';
                setTimeout(() => {
                    loginScreen.classList.add('hidden');
                    dashboard.classList.remove('hidden');
                    initializeDashboard();
                }, 300);
            }, 1000);
        } else {
            // Error animation
            button.innerHTML = '<i class="fas fa-times"></i> Erreur';
            button.style.background = 'var(--admin-error)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                adminPassword.value = '';
                adminPassword.focus();
            }, 2000);
        }
    }, 1000);
});

// Check authentication on load
window.addEventListener('load', () => {
    if (localStorage.getItem('adminAuthenticated') === 'true') {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        initializeDashboard();
    }
});

// Logout function
function logout() {
    isAuthenticated = false;
    localStorage.removeItem('adminAuthenticated');
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
    loginScreen.style.opacity = '1';
}

// Dashboard initialization
function initializeDashboard() {
    updateStats();
    loadActivities();
    loadMedia();
    loadSettings();
    
    // Tab switching
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Forms handling
    setupForms();
}

// Tab switching
function switchTab(tabName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    // Update title
    const titles = {
        'overview': 'Tableau de bord',
        'content': 'Gestion du contenu',
        'media': 'Gestion des médias',
        'settings': 'Paramètres',
        'maintenance': 'Maintenance'
    };
    document.getElementById('pageTitle').textContent = titles[tabName];
}

// Update statistics
function updateStats() {
    // Simulate real statistics
    const visits = Math.floor(Math.random() * 1000) + 500;
    const users = Math.floor(Math.random() * 500) + 200;
    const avgTime = Math.floor(Math.random() * 300) + 120;
    
    animateCounter('visitsCount', visits);
    animateCounter('usersCount', users);
    document.getElementById('avgTime').textContent = `${avgTime}s`;
}

// Counter animation
function animateCounter(elementId, target) {
    const element = document.getElementById(elementId);
    const start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Load recent activities
function loadActivities() {
    const activities = [
        { time: 'Il y a 5 minutes', action: 'Nouvelle visite sur la page d\'accueil', type: 'visit' },
        { time: 'Il y a 15 minutes', action: 'Formulaire de contact soumis', type: 'form' },
        { time: 'Il y a 1 heure', action: 'Mise à jour du contenu effectuée', type: 'update' },
        { time: 'Il y a 2 heures', action: 'Nouvel utilisateur connecté', type: 'user' }
    ];
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <span class="activity-time">${activity.time}</span>
                <span class="activity-action">${activity.action}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        'visit': 'eye',
        'form': 'envelope',
        'update': 'edit',
        'user': 'user'
    };
    return icons[type] || 'info';
}

// Load media
function loadMedia() {
    const mediaGrid = document.getElementById('mediaGrid');
    const defaultImages = [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ];
    
    mediaGrid.innerHTML = defaultImages.map((src, index) => `
        <div class="media-item" data-id="${index}">
            <img src="${src}" alt="Media ${index + 1}">
            <div class="media-overlay">
                <button class="btn-edit" onclick="editMedia(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteMedia(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// File upload handling
document.getElementById('fileInput').addEventListener('change', (e) => {
    const files = e.target.files;
    const mediaGrid = document.getElementById('mediaGrid');
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newMedia = document.createElement('div');
                newMedia.className = 'media-item';
                newMedia.innerHTML = `
                    <img src="${e.target.result}" alt="New media">
                    <div class="media-overlay">
                        <button class="btn-edit" onclick="editMedia(this)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="deleteMedia(this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                mediaGrid.appendChild(newMedia);
            };
            reader.readAsDataURL(file);
        }
    });
});

// Logo upload
document.getElementById('logoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const logoPreview = document.getElementById('logoPreview');
            logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
            
            // Update logo on main site
            localStorage.setItem('companyLogo', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Form handling
function setupForms() {
    // General info form
    document.getElementById('generalInfoForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveFormData('generalInfo', {
            companyName: document.getElementById('companyName').value,
            contactEmail: document.getElementById('contact
