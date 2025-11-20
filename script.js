// Configuration et initialisation
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initialisation du site Rayz.com');
    
    // Initialiser la base de données
    await initDatabase();
    
    // Charger les données du site
    await loadSiteData();
    
    // Initialiser les événements
    initEvents();
    
    // Initialiser EmailJS
    initEmailJS();
});

// Initialisation de la base de données
async function initDatabase() {
    try {
        // Attendre que le gestionnaire de base de données soit prêt
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        // Vérifier la connexion
        if (window.dbManager.isConnected) {
            console.log('✅ Base de données connectée');
        } else {
            console.log('📁 Utilisation du mode localStorage');
        }
        
    } catch (error) {
        console.error('❌ Erreur initialisation base de données:', error);
    }
}

// Charger les données du site
async function loadSiteData() {
    try {
        console.log('📥 Chargement des données du site...');
        
        // Afficher un indicateur de chargement
        showLoadingIndicator();
        
        // Charger les paramètres du site
        await loadSiteSettings();
        
        // Charger les slides de la bannière hero
        await loadHeroSlides();
        
        // Charger les services
        await loadServices();
        
        // Charger les projets
        await loadProjects();
        
        // Charger les informations de contact
        await loadContactInfo();
        
        // Charger les informations À propos
        await loadAboutInfo();
        
        // Charger les informations du footer
        await loadFooterInfo();
        
        // Charger les promotions actives
        await loadActivePromotions();
        
        // Initialiser les animations
        initAnimations();
        
        // Masquer l'indicateur de chargement
        hideLoadingIndicator();
        
        console.log('✅ Données chargées avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des données:', error);
        hideLoadingIndicator();
        showErrorNotification('Erreur lors du chargement des données');
    }
}

// Afficher un indicateur de chargement
function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Chargement des données...</p>
        </div>
    `;
    loader.style.cssText = `
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
        font-family: 'Montserrat', sans-serif;
    `;
    
    const loaderContent = loader.querySelector('.loader-content');
    loaderContent.style.cssText = `
        text-align: center;
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    `;
    
    const spinner = loader.querySelector('.loader-spinner');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #0096D6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 15px;
    `;
    
    // Ajouter l'animation CSS
    if (!document.querySelector('#loader-styles')) {
        const style = document.createElement('style');
        style.id = 'loader-styles';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loader);
}

// Masquer l'indicateur de chargement
function hideLoadingIndicator() {
    const loader = document.getElementById('global-loader');
    if (loader) {
        loader.remove();
    }
}

// Afficher une notification d'erreur
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF6B35;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Charger les paramètres du site
async function loadSiteSettings() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const settings = await window.dbManager.getSettings();
        
        // Appliquer les paramètres
        document.getElementById('site-name').textContent = settings.site_name || 'Rayz.com';
        document.getElementById('site-logo').src = settings.site_logo;
        document.getElementById('copyright-name').textContent = settings.site_name || 'Rayz.com';
        
        // Appliquer les couleurs CSS
        if (settings.primary_color) {
            document.documentElement.style.setProperty('--primary', settings.primary_color);
        }
        if (settings.secondary_color) {
            document.documentElement.style.setProperty('--secondary', settings.secondary_color);
        }
        
    } catch (error) {
        console.error('Erreur chargement paramètres:', error);
    }
}

// Charger les slides hero
async function loadHeroSlides() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const slides = await window.dbManager.getHeroSlides();
        const heroCarousel = document.getElementById('hero-carousel');
        
        // Filtrer les slides actifs
        const activeSlides = slides.filter(slide => slide.is_active);
        
        // Vider le carousel
        heroCarousel.innerHTML = '';
        
        // Ajouter les slides
        activeSlides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slideElement.style.background = `linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)`;
            
            slideElement.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <h1>${this.escapeHtml(slide.title)}</h1>
                        <p>${this.escapeHtml(slide.description)}</p>
                        <div class="hero-btns">
                            <a href="#projects" class="btn btn-primary">Voir nos projets</a>
                            <a href="https://shop.thetic.de" target="_blank" class="btn btn-shop"><i class="fas fa-shopping-cart"></i> Visiter notre boutique</a>
                        </div>
                    </div>
                    <div class="hero-image">
                        <img src="${slide.image}" alt="${this.escapeHtml(slide.title)}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeD0iMTUwIiB5PSIxNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTUwIiByeD0iMTAiIGZpbGw9IiMwMDk2RDYiLz4KPC9zdmc+Cg=='">
                    </div>
                </div>
            `;
            
            heroCarousel.appendChild(slideElement);
        });
        
        // Ajouter les indicateurs si on a des slides
        if (activeSlides.length > 0) {
            const indicators = document.createElement('div');
            indicators.className = 'carousel-indicators';
            
            activeSlides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
                indicator.setAttribute('data-slide', index);
                indicators.appendChild(indicator);
            });
            
            heroCarousel.appendChild(indicators);
            
            // Initialiser le carousel
            initHeroCarousel();
        }
        
    } catch (error) {
        console.error('Erreur chargement slides hero:', error);
    }
}

// Échapper le HTML pour la sécurité
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialiser le carousel hero
function initHeroCarousel() {
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselIndicators = document.querySelectorAll('.carousel-indicator');
    
    if (carouselSlides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        carouselSlides[index].classList.add('active');
        if (carouselIndicators[index]) {
            carouselIndicators[index].classList.add('active');
        }
        currentSlide = index;
    }
    
    carouselIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto-advance carousel
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(nextSlide);
    }, 5000);
}

// Charger les services
async function loadServices() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const services = await window.dbManager.getServices();
        const servicesGrid = document.getElementById('services-grid');
        const footerServices = document.getElementById('footer-services');
        
        // Filtrer les services actifs
        const activeServices = services.filter(service => service.is_active);
        
        // Vider la grille
        servicesGrid.innerHTML = '';
        if (footerServices) footerServices.innerHTML = '';
        
        // Ajouter les services
        activeServices.forEach((service, index) => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.style.transitionDelay = `${index * 0.1}s`;
            
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${this.escapeHtml(service.title)}</h3>
                <p>${this.escapeHtml(service.description)}</p>
                ${service.title.includes('Vente') || service.title.includes('Équipements') ? 
                  '<a href="https://shop.thetic.de" target="_blank" class="btn btn-shop" style="margin-top: 20px;"><i class="fas fa-shopping-cart"></i> Visiter notre boutique</a>' : 
                  ''}
            `;
            
            servicesGrid.appendChild(serviceCard);
            
            // Ajouter au footer
            if (footerServices) {
                const serviceLink = document.createElement('li');
                serviceLink.innerHTML = `<a href="#services">${this.escapeHtml(service.title)}</a>`;
                footerServices.appendChild(serviceLink);
            }
        });
        
    } catch (error) {
        console.error('Erreur chargement services:', error);
    }
}

// Charger les projets
async function loadProjects() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const projects = await window.dbManager.getProjects();
        const projectsGrid = document.getElementById('projects-grid');
        
        // Vider la grille
        projectsGrid.innerHTML = '';
        
        // Ajouter les projets
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            projectCard.setAttribute('data-project', project.id);
            projectCard.style.transitionDelay = `${index * 0.1}s`;
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${this.escapeHtml(project.title)}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPC9zdmc+Cg=='">
                    <div class="project-overlay">
                        <a href="#" class="btn btn-primary">Voir le projet</a>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${this.escapeHtml(project.title)}</h3>
                    <p>${this.escapeHtml(project.description)}</p>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
        
        // Initialiser les événements des projets
        initProjectEvents(projects);
        
    } catch (error) {
        console.error('Erreur chargement projets:', error);
    }
}

// Initialiser les événements des projets
function initProjectEvents(projects) {
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('projectModal');
    
    projectCards.forEach((card) => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const project = projects.find(p => p.id == projectId);
            if (project) {
                openProjectModal(project);
            }
        });
    });
    
    // Fermer la modal
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Fermer la modal en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigation du carousel de la modal
    const projectCarouselDots = document.querySelectorAll('.project-carousel-dot');
    projectCarouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showProjectSlide(index);
        });
    });
}

// Ouvrir la modal du projet
function openProjectModal(project) {
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const projectDetailTitle = document.getElementById('projectDetailTitle');
    const projectDetailDescription = document.getElementById('projectDetailDescription');
    
    if (!projectModal || !modalTitle) return;
    
    // Mettre à jour les informations de base
    modalTitle.textContent = project.title;
    projectDetailTitle.textContent = project.title;
    projectDetailDescription.textContent = project.description;
    
    // Afficher la modal
    projectModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Afficher une slide du carousel de projet
function showProjectSlide(index) {
    const projectCarouselSlides = document.querySelectorAll('.project-carousel-slide');
    const projectCarouselDots = document.querySelectorAll('.project-carousel-dot');
    
    projectCarouselSlides.forEach(slide => slide.classList.remove('active'));
    projectCarouselDots.forEach(dot => dot.classList.remove('active'));
    
    if (projectCarouselSlides[index]) {
        projectCarouselSlides[index].classList.add('active');
    }
    if (projectCarouselDots[index]) {
        projectCarouselDots[index].classList.add('active');
    }
}

// Charger les informations de contact
async function loadContactInfo() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const contactInfo = await window.dbManager.getContactInfo();
        const socialLinks = document.getElementById('social-links');
        const footerSocialLinks = document.getElementById('footer-social-links');
        
        // Mettre à jour les informations de contact
        if (contactInfo.address) {
            document.getElementById('contact-address').textContent = contactInfo.address;
            document.getElementById('footer-address').textContent = contactInfo.address;
        }
        if (contactInfo.phone) {
            document.getElementById('contact-phone').textContent = contactInfo.phone;
            document.getElementById('footer-phone').textContent = contactInfo.phone;
        }
        if (contactInfo.email) {
            document.getElementById('contact-email').textContent = contactInfo.email;
            document.getElementById('footer-email').textContent = contactInfo.email;
        }
        
        // Mettre à jour les réseaux sociaux
        if (contactInfo.social_networks && socialLinks) {
            socialLinks.innerHTML = '';
            footerSocialLinks.innerHTML = '';
            
            contactInfo.social_networks.forEach(social => {
                const iconClass = this.getSocialIconClass(social.platform);
                const socialLink = document.createElement('a');
                socialLink.href = social.url;
                socialLink.target = '_blank';
                socialLink.className = 'social-link';
                socialLink.innerHTML = `<i class="${iconClass}"></i>`;
                
                socialLinks.appendChild(socialLink.cloneNode(true));
                footerSocialLinks.appendChild(socialLink);
            });
        }
        
    } catch (error) {
        console.error('Erreur chargement contact:', error);
    }
}

// Obtenir la classe d'icône pour les réseaux sociaux
function getSocialIconClass(platform) {
    const icons = {
        facebook: 'fab fa-facebook-f',
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        linkedin: 'fab fa-linkedin-in',
        whatsapp: 'fab fa-whatsapp',
        youtube: 'fab fa-youtube'
    };
    return icons[platform] || 'fas fa-share-alt';
}

// Charger les informations À propos
async function loadAboutInfo() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const aboutInfo = await window.dbManager.getAboutInfo();
        
        // Mettre à jour les informations À propos
        if (aboutInfo.title) {
            document.getElementById('about-title').textContent = aboutInfo.title;
        }
        if (aboutInfo.text1) {
            document.getElementById('about-text-1').textContent = aboutInfo.text1;
        }
        if (aboutInfo.text2) {
            document.getElementById('about-text-2').textContent = aboutInfo.text2;
        }
        if (aboutInfo.image) {
            document.getElementById('about-image').src = aboutInfo.image;
        }
        if (aboutInfo.stats) {
            if (aboutInfo.stats.stat1) {
                document.getElementById('stat-1').textContent = aboutInfo.stats.stat1;
            }
            if (aboutInfo.stats.stat2) {
                document.getElementById('stat-2').textContent = aboutInfo.stats.stat2;
            }
            if (aboutInfo.stats.stat3) {
                document.getElementById('stat-3').textContent = aboutInfo.stats.stat3;
            }
        }
        
    } catch (error) {
        console.error('Erreur chargement about:', error);
    }
}

// Charger les informations du footer
async function loadFooterInfo() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const footerInfo = await window.dbManager.getFooterInfo();
        
        // Mettre à jour le footer
        if (footerInfo.title) {
            document.getElementById('footer-title').textContent = footerInfo.title;
        }
        if (footerInfo.description) {
            document.getElementById('footer-description').textContent = footerInfo.description;
        }
        if (footerInfo.copyright_name) {
            document.getElementById('copyright-name').textContent = footerInfo.copyright_name;
        }
        
    } catch (error) {
        console.error('Erreur chargement footer:', error);
    }
}

// Charger les promotions actives
async function loadActivePromotions() {
    try {
        if (!window.dbManager) {
            console.warn('Gestionnaire de base de données non disponible');
            return;
        }
        
        const promotions = await window.dbManager.getPromotions();
        const promoBanner = document.getElementById('promo-banner');
        const promoText = document.getElementById('promo-text');
        
        // Trouver une promotion active
        const now = new Date();
        const activePromotion = promotions.find(promo => {
            if (!promo.is_active) return false;
            
            const startDate = new Date(promo.start_date);
            const endDate = new Date(promo.end_date);
            endDate.setHours(23, 59, 59, 999); // Fin de la journée
            
            return now >= startDate && now <= endDate;
        });
        
        if (activePromotion && promoBanner && promoText) {
            promoText.textContent = activePromotion.description;
            promoBanner.style.display = 'block';
            
            // Appliquer le thème si spécifié
            if (activePromotion.theme && activePromotion.theme !== 'default') {
                document.body.classList.add(`theme-${activePromotion.theme}`);
            }
            
            // Fermer la bannière de promotion
            const closePromo = document.getElementById('close-promo');
            if (closePromo) {
                closePromo.addEventListener('click', function() {
                    promoBanner.style.display = 'none';
                });
            }
        }
        
    } catch (error) {
        console.error('Erreur chargement promotions:', error);
    }
}

// Initialiser les événements
function initEvents() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const nav = document.getElementById('nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Filter projects
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
}

// Initialiser les animations
function initAnimations() {
    // Animate elements on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .project-card, .stat');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    window.addEventListener('scroll', animateOnScroll);
    // Trigger once on load
    animateOnScroll();
}

// Initialiser EmailJS
function initEmailJS() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init('4gEzT9DkXPjvp2WxD');
            console.log('✅ EmailJS initialisé');
        } else {
            console.warn('❌ EmailJS non disponible');
        }
    } catch (error) {
        console.error('Erreur initialisation EmailJS:', error);
    }
}

// Gérer l'envoi du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    try {
        // Afficher un indicateur de chargement
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Envoyer l'email via EmailJS
        if (typeof emailjs !== 'undefined') {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message,
                to_email: 'ctlpowerr@gmail.com'
            };
            
            await emailjs.send('service_4ab2q68', 'template_default', templateParams);
        }
        
        // Afficher un message de succès
        showSuccessNotification('Merci pour votre message! Nous vous contacterons bientôt.');
        
        // Réinitialiser le formulaire
        this.reset();
        
    } catch (error) {
        console.error('Erreur envoi email:', error);
        showErrorNotification('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
        // Restaurer le bouton
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Afficher une notification de succès
function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}
