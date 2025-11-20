// Configuration et initialisation de l'administration
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🔧 Initialisation du panneau d\'administration');
    
    // Vérifier l'authentification
    await checkAuth();
    
    // Charger les données de l'administration
    await loadAdminData();
    
    // Initialiser les événements de l'administration
    initAdminEvents();
});

// Vérifier l'authentification
async function checkAuth() {
    // Vérifier si l'utilisateur est déjà authentifié
    const isAuthenticated = localStorage.getItem('admin-authenticated') === 'true';
    const authTimestamp = localStorage.getItem('admin-auth-timestamp');
    
    // Vérifier si l'authentification a expiré (24 heures)
    if (authTimestamp) {
        const now = new Date().getTime();
        const authTime = parseInt(authTimestamp);
        const hoursDiff = (now - authTime) / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
            localStorage.removeItem('admin-authenticated');
            localStorage.removeItem('admin-auth-timestamp');
            window.location.href = 'index.html';
            return;
        }
    }
    
    if (!isAuthenticated) {
        // Afficher le formulaire de connexion
        showLoginModal();
    }
}

// Afficher le modal de connexion
function showLoginModal() {
    const modal = document.createElement('div');
    modal.id = 'login-modal';
    modal.innerHTML = `
        <div class="login-modal-content">
            <div class="login-header">
                <h2>Connexion Administrateur</h2>
                <p>Accès réservé au personnel autorisé</p>
            </div>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-username">Nom d'utilisateur</label>
                    <input type="text" id="login-username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Mot de passe</label>
                    <input type="password" id="login-password" class="form-control" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Se connecter</button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = modal.querySelector('.login-modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
    `;
    
    document.body.appendChild(modal);
    
    // Gérer la soumission du formulaire
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            // Vérifier les identifiants
            const isValid = await verifyAdminCredentials(username, password);
            
            if (isValid) {
                // Authentification réussie
                localStorage.setItem('admin-authenticated', 'true');
                localStorage.setItem('admin-auth-timestamp', new Date().getTime().toString());
                modal.remove();
                
                // Afficher une notification
                showAdminNotification('Connexion réussie!', 'success');
                
                // Charger les données
                await loadAdminData();
            } else {
                showAdminNotification('Identifiants incorrects', 'error');
            }
        } catch (error) {
            console.error('Erreur authentification:', error);
            showAdminNotification('Erreur lors de la connexion', 'error');
        }
    });
}

// Vérifier les identifiants administrateur
async function verifyAdminCredentials(username, password) {
    try {
        if (!window.dbManager) {
            throw new Error('Gestionnaire de base de données non disponible');
        }
        
        // Récupérer les paramètres pour vérifier les identifiants
        const settings = await window.dbManager.getSettings();
        
        if (settings.admin_username === username && settings.admin_password === password) {
            return true;
        }
        
        // Vérifier également les identifiants par défaut
        if (username === 'admin' && password === 'admin123') {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Erreur vérification identifiants:', error);
        
        // Fallback: vérifier les identifiants par défaut
        return username === 'admin' && password === 'admin123';
    }
}

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('admin-authenticated');
    localStorage.removeItem('admin-auth-timestamp');
    window.location.href = 'index.html';
});

// Charger les données de l'administration
async function loadAdminData() {
    try {
        console.log('📥 Chargement des données admin...');
        
        // Afficher un indicateur de chargement
        showAdminLoading();
        
        // Charger les statistiques
        await loadDashboardStats();
        
        // Charger les slides hero
        await loadAdminHeroSlides();
        
        // Charger les services
        await loadAdminServices();
        
        // Charger les projets
        await loadAdminProjects();
        
        // Charger les paramètres
        await loadAdminSettings();
        
        // Charger les promotions
        await loadAdminPromotions();
        
        // Masquer l'indicateur de chargement
        hideAdminLoading();
        
        console.log('✅ Données admin chargées avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données admin:', error);
        hideAdminLoading();
        showAdminNotification('Erreur lors du chargement des données', 'error');
    }
}

// Afficher l'indicateur de chargement admin
function showAdminLoading() {
    const loading = document.createElement('div');
    loading.id = 'admin-loading';
    loading.innerHTML = `
        <div class="admin-loader">
            <div class="admin-spinner"></div>
            <p>Chargement des données...</p>
        </div>
    `;
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(loading);
}

// Masquer l'indicateur de chargement admin
function hideAdminLoading() {
    const loading = document.getElementById('admin-loading');
    if (loading) {
        loading.remove();
    }
}

// Afficher une notification admin
function showAdminNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `admin-notification admin-notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="admin-notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;
    
    // Couleur en fonction du type
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Bouton de fermeture
    const closeButton = notification.querySelector('.admin-notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    `;
    
    closeButton.addEventListener('click', function() {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Charger les statistiques du tableau de bord
async function loadDashboardStats() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        // Récupérer les données
        const projects = await window.dbManager.getProjects();
        const services = await window.dbManager.getServices();
        const heroSlides = await window.dbManager.getHeroSlides();
        
        // Mettre à jour les compteurs
        document.getElementById('projects-count').textContent = projects.filter(p => p.is_active).length;
        document.getElementById('services-count').textContent = services.filter(s => s.is_active).length;
        document.getElementById('hero-slides-count').textContent = heroSlides.filter(s => s.is_active).length;
        
        // Compter les messages (simulation)
        document.getElementById('messages-count').textContent = '12';
        
    } catch (error) {
        console.error('Erreur chargement statistiques:', error);
    }
}

// Charger les slides hero pour l'administration
async function loadAdminHeroSlides() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const slides = await window.dbManager.getHeroSlides();
        const heroSlidesList = document.getElementById('hero-slides-list');
        
        // Vider la liste
        heroSlidesList.innerHTML = '';
        
        // Ajouter les slides
        slides.forEach(slide => {
            const slideItem = document.createElement('div');
            slideItem.className = 'hero-slide-item';
            slideItem.innerHTML = `
                <div class="item-info">
                    <h4>${this.escapeHtml(slide.title)}</h4>
                    <p>${this.escapeHtml(slide.description.substring(0, 100))}...</p>
                    <small>Ordre: ${slide.display_order} | Statut: ${slide.is_active ? 'Actif' : 'Inactif'}</small>
                </div>
                <div class="item-actions">
                    <button class="item-action item-edit" data-id="${slide.id}" data-type="hero-slide">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action item-delete" data-id="${slide.id}" data-type="hero-slide">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            heroSlidesList.appendChild(slideItem);
        });
        
    } catch (error) {
        console.error('Erreur chargement slides hero:', error);
    }
}

// Les autres fonctions de chargement (services, projets, paramètres, promotions)
// suivent le même pattern que loadAdminHeroSlides...

// Charger les services pour l'administration
async function loadAdminServices() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const services = await window.dbManager.getServices();
        const servicesList = document.getElementById('services-list');
        
        // Vider la liste
        servicesList.innerHTML = '';
        
        // Ajouter les services
        services.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <div class="item-info">
                    <h4>${this.escapeHtml(service.title)}</h4>
                    <p>${this.escapeHtml(service.description.substring(0, 100))}...</p>
                    <small>Ordre: ${service.display_order} | Statut: ${service.is_active ? 'Actif' : 'Inactif'}</small>
                </div>
                <div class="item-actions">
                    <button class="item-action item-edit" data-id="${service.id}" data-type="service">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action item-delete" data-id="${service.id}" data-type="service">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            servicesList.appendChild(serviceItem);
        });
        
    } catch (error) {
        console.error('Erreur chargement services:', error);
    }
}

// Charger les projets pour l'administration
async function loadAdminProjects() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const projects = await window.dbManager.getProjects();
        const projectsList = document.getElementById('projects-list');
        
        // Vider la liste
        projectsList.innerHTML = '';
        
        // Ajouter les projets
        projects.forEach(project => {
            const projectItem = document.createElement('div');
            projectItem.className = 'project-item';
            projectItem.innerHTML = `
                <div class="item-info">
                    <h4>${this.escapeHtml(project.title)}</h4>
                    <p>${this.escapeHtml(project.description.substring(0, 100))}...</p>
                    <small>Catégorie: ${project.category} | Statut: ${project.is_active ? 'Actif' : 'Inactif'}</small>
                </div>
                <div class="item-actions">
                    <button class="item-action item-edit" data-id="${project.id}" data-type="project">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action item-delete" data-id="${project.id}" data-type="project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            projectsList.appendChild(projectItem);
        });
        
    } catch (error) {
        console.error('Erreur chargement projets:', error);
    }
}

// Charger les paramètres pour l'administration
async function loadAdminSettings() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        // Récupérer toutes les données
        const settings = await window.dbManager.getSettings();
        const aboutInfo = await window.dbManager.getAboutInfo();
        const contactInfo = await window.dbManager.getContactInfo();
        const footerInfo = await window.dbManager.getFooterInfo();
        
        // Remplir le formulaire des paramètres généraux
        document.getElementById('site-name').value = settings.site_name || 'Rayz.com';
        document.getElementById('site-logo').value = settings.site_logo || '';
        document.getElementById('primary-color').value = settings.primary_color || '#0096D6';
        document.getElementById('secondary-color').value = settings.secondary_color || '#FF6B35';
        document.getElementById('admin-username').value = settings.admin_username || 'admin';
        document.getElementById('admin-password').value = settings.admin_password || '';
        
        // Remplir le formulaire À propos
        document.getElementById('about-title').value = aboutInfo.title || '';
        document.getElementById('about-text-1').value = aboutInfo.text1 || '';
        document.getElementById('about-text-2').value = aboutInfo.text2 || '';
        document.getElementById('about-image').value = aboutInfo.image || '';
        document.getElementById('stat-1').value = aboutInfo.stats?.stat1 || '';
        document.getElementById('stat-2').value = aboutInfo.stats?.stat2 || '';
        document.getElementById('stat-3').value = aboutInfo.stats?.stat3 || '';
        
        // Remplir le formulaire de contact
        document.getElementById('contact-address').value = contactInfo.address || '';
        document.getElementById('contact-phone').value = contactInfo.phone || '';
        document.getElementById('contact-email').value = contactInfo.email || '';
        
        // Remplir les réseaux sociaux
        const socialInputs = document.getElementById('social-inputs');
        socialInputs.innerHTML = '';
        
        const socialNetworks = contactInfo.social_networks || [];
        
        socialNetworks.forEach((social, index) => {
            const socialInput = document.createElement('div');
            socialInput.className = 'social-input';
            socialInput.innerHTML = `
                <select class="form-control" name="social-platform-${index}">
                    <option value="facebook" ${social.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
                    <option value="twitter" ${social.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
                    <option value="instagram" ${social.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
                    <option value="linkedin" ${social.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                    <option value="whatsapp" ${social.platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
                    <option value="youtube" ${social.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
                </select>
                <input type="text" class="form-control" name="social-url-${index}" value="${social.url || ''}" placeholder="URL du réseau social">
                <button type="button" class="remove-social" ${index === 0 ? 'disabled' : ''}>&times;</button>
            `;
            
            socialInputs.appendChild(socialInput);
        });
        
        // Remplir le formulaire du pied de page
        document.getElementById('footer-title').value = footerInfo.title || '';
        document.getElementById('footer-description').value = footerInfo.description || '';
        document.getElementById('copyright-name').value = footerInfo.copyright_name || '';
        
    } catch (error) {
        console.error('Erreur chargement paramètres:', error);
    }
}

// Charger les promotions pour l'administration
async function loadAdminPromotions() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const promotions = await window.dbManager.getPromotions();
        const promotionsList = document.getElementById('promotions-list');
        
        // Vider la liste
        promotionsList.innerHTML = '';
        
        // Ajouter les promotions
        promotions.forEach(promotion => {
            const promotionItem = document.createElement('div');
            promotionItem.className = 'promotion-item';
            promotionItem.innerHTML = `
                <div class="item-info">
                    <h4>${this.escapeHtml(promotion.title)}</h4>
                    <p>${this.escapeHtml(promotion.description)}</p>
                    <small>Du ${promotion.start_date} au ${promotion.end_date} | Statut: ${promotion.is_active ? 'Actif' : 'Inactif'} | Thème: ${promotion.theme}</small>
                </div>
                <div class="item-actions">
                    <button class="item-action item-edit" data-id="${promotion.id}" data-type="promotion">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="item-action item-delete" data-id="${promotion.id}" data-type="promotion">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            promotionsList.appendChild(promotionItem);
        });
        
    } catch (error) {
        console.error('Erreur chargement promotions:', error);
    }
}

// Initialiser les événements de l'administration
function initAdminEvents() {
    // Navigation entre les sections
    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetSection = this.getAttribute('data-section');
                
                // Masquer toutes les sections
                adminSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Désactiver tous les liens
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Activer la section cible
                const targetElement = document.getElementById(targetSection);
                if (targetElement) {
                    targetElement.classList.add('active');
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Les autres événements (formulaires, boutons, etc.) restent similaires...
    // [Le reste du code des événements reste inchangé]
}

// Échapper le HTML pour la sécurité
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
