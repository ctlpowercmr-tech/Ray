// ==========================================
// RAYZ SECURITY - SITE ULTRA-MODERNE
// Script Principal avec API Integration
// ==========================================

// Configuration API
const API_BASE_URL = window.location.origin;
const API_ENDPOINTS = {
    siteInfo: '/api/site-info',
    services: '/api/services',
    media: '/api/media',
    maintenance: '/api/maintenance',
    stats: '/api/stats',
    activities: '/api/activities',
    updateSiteInfo: '/api/update-site-info',
    updateServices: '/api/update-services',
    updateSocial: '/api/update-social',
    updateMaintenance: '/api/update-maintenance',
    uploadMedia: '/api/upload-media',
    deleteMedia: '/api/delete-media'
};

// État global
let siteData = {
    info: {},
    services: [],
    media: [],
    maintenance: {},
    stats: {},
    activities: []
};

// ==========================================
// INITIALISATION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation Rayz Security...');
    
    // Initialiser Three.js
    await initThreeJS();
    
    // Charger les données
    await loadAllData();
    
    // Initialiser les animations
    initAnimations();
    
    // Initialiser les interactions
    initInteractions();
    
    // Démarrer les mises à jour en temps réel
    startRealTimeUpdates();
    
    console.log('✅ Site initialisé avec succès!');
});

// ==========================================
// THREE.JS - PARTICULES 3D
// ==========================================

let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;

async function initThreeJS() {
    if (typeof THREE === 'undefined') {
        console.log('⚠️ Three.js non chargé, passage en mode 2D');
        return;
    }
    
    try {
        // Scene
        scene = new THREE.Scene();
        
        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Renderer
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        const particlesContainer = document.getElementById('particles');
        if (particlesContainer) {
            particlesContainer.appendChild(renderer.domElement);
            
            // Créer les particules
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 1500;
            const posArray = new Float32Array(particlesCount * 3);
            
            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 15;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            // Material
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.008,
                color: 0x0066ff,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            
            particles = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particles);
            
            // Démarrer l'animation
            animateThreeJS();
            console.log('✅ Three.js initialisé');
        }
    } catch (error) {
        console.log('⚠️ Erreur Three.js:', error);
    }
}

function animateThreeJS() {
    requestAnimationFrame(animateThreeJS);
    
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        particles.rotation.z += 0.0002;
        
        // Interaction souris
        particles.rotation.x += mouseY * 0.00005;
        particles.rotation.y += mouseX * 0.00005;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Mouse tracking
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Resize handler
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ==========================================
// GESTION DES DONNÉES API
// ==========================================

async function loadAllData() {
    try {
        console.log('📊 Chargement des données...');
        
        // Charger toutes les données en parallèle
        const [siteInfo, services, media, maintenance, stats, activities] = await Promise.all([
            fetchData(API_ENDPOINTS.siteInfo),
            fetchData(API_ENDPOINTS.services),
            fetchData(API_ENDPOINTS.media),
            fetchData(API_ENDPOINTS.maintenance),
            fetchData(API_ENDPOINTS.stats),
            fetchData(API_ENDPOINTS.activities)
        ]);
        
        // Stocker les données
        siteData.info = siteInfo || {};
        siteData.services = services || [];
        siteData.media = media || [];
        siteData.maintenance = maintenance || {};
        siteData.stats = stats || {};
        siteData.activities = activities || [];
        
        // Appliquer les données au DOM
        applySiteData();
        
        console.log('✅ Données chargées');
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
        // Charger les données locales par défaut
        loadDefaultData();
    }
}

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`⚠️ Impossible de charger ${endpoint}:`, error);
        return null;
    }
}

function loadDefaultData() {
    // Données par défaut si l'API n'est pas disponible
    siteData.info = {
        company_name: 'Rayz Security',
        contact_email: 'contact@rayz.com',
        contact_phone: '+33 1 23 45 67 89',
        contact_address: 'Paris, France'
    };
    
    siteData.services = [
        {
            name: 'Vidéosurveillance Ultra-HD',
            description: 'Systèmes de caméras 4K/8K avec IA intégrée',
            features: ['Reconnaissance faciale', 'Analyse comportementale', 'Stockage cloud sécurisé']
        },
        {
            name: 'Starlink Enterprise',
            description: 'Connexion satellite ultra-rapide',
            features: ['Configuration optimale', 'Test de vitesse', 'Support technique']
        }
    ];
    
    siteData.maintenance = {
        is_active: false,
        message: 'Site en maintenance - Revenez bientôt'
    };
    
    applySiteData();
}

function applySiteData() {
    // Appliquer les informations du site
    if (siteData.info.company_name) {
        document.querySelectorAll('.logo-text, .footer-brand-3d span').forEach(el => {
            el.textContent = siteData.info.company_name;
        });
    }
    
    // Appliquer le mode maintenance
    if (siteData.maintenance.is_active) {
        const maintenanceBanner = document.getElementById('maintenance-banner');
        const maintenanceMessage = document.getElementById('maintenance-message');
        
        if (maintenanceBanner) {
            maintenanceBanner.classList.add('active');
            if (siteData.maintenance.message) {
                maintenanceMessage.textContent = siteData.maintenance.message;
            }
        }
    }
    
    // Appliquer les messages personnalisés
    const customMessage = localStorage.getItem('customMessage');
    if (customMessage) {
        showCustomMessage(JSON.parse(customMessage));
    }
}

// ==========================================
// ANIMATIONS GSAP
// ==========================================

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.log('⚠️ GSAP non chargé');
        return;
    }
    
    // Enregistrer ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Animation hero title
    gsap.from('.hero-title-3d .title-line', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.5
    });
    
    // Animation hero stats
    gsap.from('.hero-stats .stat-item', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        delay: 1,
        ease: "power2.out"
    });
    
    // Animation compteurs
    animateCounters();
    
    // Animation bento grid
    gsap.from('.bento-item', {
        duration: 1,
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.services-3d',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
    
    // Animation showcase
    gsap.from('.showcase-item', {
        duration: 1.5,
        rotationY: 90,
        opacity: 0,
        scrollTrigger: {
            trigger: '.projets-3d',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (target) {
            gsap.to(counter, {
                duration: 2,
                innerHTML: target,
                snap: { innerHTML: 1 },
                ease: "power2.inOut",
                delay: 1.5,
                onUpdate: function() {
                    counter.innerHTML = Math.floor(counter.innerHTML);
                }
            });
        }
    });
}

// ==========================================
// INTERACTIONS UTILISATEUR
// ==========================================

function initInteractions() {
    // Navigation 3D
    initNavigation3D();
    
    // Showcase navigation
    initShowcaseNavigation();
    
    // Formulaire de contact
    initContactForm();
    
    // Boutons d'action
    initActionButtons();
}

function initNavigation3D() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item.querySelector('.nav-cube'), {
                    duration: 0.3,
                    scale: 1.1,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(item.querySelector('.nav-cube'), {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            }
        });
        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            if (section) {
                scrollToSection(section);
            }
        });
    });
}

function initShowcaseNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const slide = btn.getAttribute('data-slide');
            
            // Update active button
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Animate showcase transition
            if (typeof gsap !== 'undefined') {
                gsap.to('.showcase-item', {
                    duration: 0.5,
                    rotationY: -90,
                    opacity: 0,
                    onComplete: () => {
                        // Here you would load the actual slide content
                        gsap.to('.showcase-item', {
                            duration: 0.5,
                            rotationY: 0,
                            opacity: 1
                        });
                    }
                });
            }
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const button = e.target.querySelector('.btn-submit-3d');
            const originalHTML = button.innerHTML;
            
            // Animation de chargement
            button.innerHTML = '<div class="btn-loader"></div>';
            button.disabled = true;
            
            try {
                // Simuler l'envoi du formulaire
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Succès
                button.innerHTML = '<i class="fas fa-check"></i> Message envoyé!';
                button.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                    button.style.background = '';
                    e.target.reset();
                }, 3000);
                
            } catch (error) {
                // Erreur
                button.innerHTML = '<i class="fas fa-times"></i> Erreur';
                button.style.background = 'var(--error-color)';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                    button.style.background = '';
                }, 3000);
            }
        });
    }
}

function initActionButtons() {
    // Boutons hero
    document.querySelectorAll('.btn-primary-3d, .btn-secondary-3d').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1.05,
                    ease: "power2.out"
                });
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(btn, {
                    duration: 0.3,
                    scale: 1,
                    ease: "power2.out"
                });
            }
        });
    });
}

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        if (typeof gsap !== 'undefined') {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: {
                    y: section,
                    offsetY: 100
                },
                ease: "power2.inOut"
            });
        } else {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function showCustomMessage(messageData) {
    // Créer et afficher un message personnalisé
    const messageContainer = document.createElement('div');
    messageContainer.className = `custom-message ${messageData.type}`;
    messageContainer.innerHTML = `
        <div class="message-content">
            <h4>${messageData.title}</h4>
            <p>${messageData.content}</p>
            <button class="close-message">&times;</button>
        </div>
    `;
    
    document.body.appendChild(messageContainer);
    
    // Animer l'apparition
    if (typeof gsap !== 'undefined') {
        gsap.from(messageContainer, {
            duration: 0.5,
            y: -100,
            opacity: 0,
            ease: "power2.out"
        });
    }
    
    // Fermer le message
    messageContainer.querySelector('.close-message').addEventListener('click', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(messageContainer, {
                duration: 0.3,
                y: -100,
                opacity: 0,
                onComplete: () => messageContainer.remove()
            });
        } else {
            messageContainer.remove();
        }
    });
    
    // Auto-fermer après 5 secondes
    setTimeout(() => {
        if (messageContainer.parentNode) {
            messageContainer.querySelector('.close-message').click();
        }
    }, 5000);
}

// ==========================================
// MISES À JOUR EN TEMPS RÉEL
// ==========================================

function startRealTimeUpdates() {
    // Mettre à jour les stats toutes les 30 secondes
    setInterval(async () => {
        try {
            const stats = await fetchData(API_ENDPOINTS.stats);
            if (stats) {
                siteData.stats = stats;
                updateStatsDisplay();
            }
        } catch (error) {
            console.error('Erreur mise à jour stats:', error);
        }
    }, 30000);
    
    // Vérifier les nouvelles activités toutes les 10 secondes
    setInterval(async () => {
        try {
            const activities = await fetchData(API_ENDPOINTS.activities);
            if (activities && activities.length > siteData.activities.length) {
                siteData.activities = activities;
                updateActivitiesDisplay();
            }
        } catch (error) {
            console.error('Erreur mise à jour activités:', error);
        }
    }, 10000);
}

function updateStatsDisplay() {
    if (siteData.stats.visits !== undefined) {
        document.getElementById('visitsCount') && animateCounter('visitsCount', siteData.stats.visits);
    }
    if (siteData.stats.users !== undefined) {
        document.getElementById('usersCount') && animateCounter('usersCount', siteData.stats.users);
    }
    if (siteData.stats.avgTime !== undefined) {
        const avgTimeElement = document.getElementById('avgTime');
        if (avgTimeElement) {
            avgTimeElement.textContent = `${siteData.stats.avgTime}s`;
        }
    }
}

function updateActivitiesDisplay() {
    // Mettre à jour l'affichage des activités si la section est visible
    const activityList = document.getElementById('activityList');
    if (activityList && siteData.activities.length > 0) {
        // Implementation pour mettre à jour l'affichage
        console.log('Nouvelles activités:', siteData.activities);
    }
}

// ==========================================
// STYLES DYNAMIQUES
// ==========================================

// Ajouter les styles CSS dynamiques
const dynamicStyles = `
    .custom-message {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--dark-card);
        border: 1px solid var(--admin-border);
        border-radius: 10px;
        padding: 1.5rem;
        max-width: 400px;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    
    .custom-message.info { border-left: 4px solid var(--admin-primary); }
    .custom-message.success { border-left: 4px solid var(--admin-success); }
    .custom-message.warning { border-left: 4px solid var(--admin-warning); }
    .custom-message.error { border-left: 4px solid var(--admin-error); }
    
    .message-content h4 {
        margin: 0 0 0.5rem 0;
        color: var(--text-primary);
    }
    
    .message-content p {
        margin: 0;
        color: var(--text-secondary);
    }
    
    .close-message {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .btn-loader {
        width: 20px;
        height: 20px;
        border: 2px solid #ffffff;
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// Injection des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// ==========================================
// GESTION DES ERREURS
// ==========================================

window.addEventListener('error', (event) => {
    console.error('❌ Erreur globale:', event.error);
    // Vous pouvez ajouter ici un système de rapport d'erreurs
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse non gérée:', event.reason);
    // Vous pouvez ajouter ici un système de rapport d'erreurs
});

// ==========================================
// EXPORT POUR ADMIN
// ==========================================

// Fonctions disponibles pour l'admin
window.SiteAPI = {
    refreshData: loadAllData,
    showMessage: showCustomMessage,
    updateStats: updateStatsDisplay,
    getSiteData: () => siteData
};

console.log('🎯 Site Rayz Security prêt! API disponible: window.SiteAPI');
