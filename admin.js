// Configuration Supabase
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Éléments DOM
let currentSlide = 0;
let carouselInterval;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadSiteData();
    initEventListeners();
});

// Charger les données du site
async function loadSiteData() {
    try {
        // Charger les paramètres du site
        const { data: settings, error: settingsError } = await supabase
            .from('site_settings')
            .select('*')
            .single();

        if (!settingsError && settings) {
            applySiteSettings(settings);
        }

        // Charger les slides du carousel
        const { data: slides, error: slidesError } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index');

        if (!slidesError && slides) {
            loadHeroCarousel(slides);
        }

        // Charger les services
        const { data: services, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .order('order_index');

        if (!servicesError && services) {
            loadServices(services);
        }

        // Charger les projets
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (!projectsError && projects) {
            loadProjects(projects);
        }

        // Charger les promotions
        const { data: promotions, error: promotionsError } = await supabase
            .from('promotions')
            .select('*')
            .eq('is_active', true)
            .gte('end_date', new Date().toISOString())
            .lte('start_date', new Date().toISOString());

        if (!promotionsError && promotions && promotions.length > 0) {
            showPromotionBanner(promotions[0]);
        }

        // Charger les liens sociaux
        const { data: socialLinks, error: socialError } = await supabase
            .from('social_links')
            .select('*')
            .order('order_index');

        if (!socialError && socialLinks) {
            loadSocialLinks(socialLinks);
        }

        // Appliquer le thème saisonnier
        applySeasonalTheme();

    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Appliquer les paramètres du site
function applySiteSettings(settings) {
    if (settings.site_name) {
        document.getElementById('site-name').textContent = settings.site_name;
        document.title = settings.site_name;
    }

    if (settings.site_logo) {
        document.getElementById('site-logo').src = settings.site_logo;
    }

    if (settings.copyright_text) {
        document.getElementById('copyright-text').innerHTML = settings.copyright_text;
    }

    // Appliquer les titres et textes
    const textElements = [
        'services-title', 'services-subtitle',
        'projects-title', 'projects-subtitle',
        'about-title', 'about-text-1', 'about-text-2',
        'contact-title', 'contact-subtitle',
        'contact-info-title', 'contact-info-text',
        'contact-address', 'contact-phone', 'contact-email'
    ];

    textElements.forEach(id => {
        const element = document.getElementById(id);
        if (element && settings[id]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = settings[id];
            } else {
                element.textContent = settings[id];
            }
        }
    });
}

// Charger le carousel Hero
function loadHeroCarousel(slides) {
    const carousel = document.getElementById('hero-carousel');
    const indicators = document.querySelector('.carousel-indicators');
    
    carousel.innerHTML = '';
    if (indicators) indicators.innerHTML = '';

    slides.forEach((slide, index) => {
        // Créer le slide
        const slideElement = document.createElement('div');
        slideElement.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slideElement.style.background = slide.background || `linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)`;
        
        slideElement.innerHTML = `
            <div class="container">
                <div class="hero-content">
                    <h1>${slide.title}</h1>
                    <p>${slide.description}</p>
                    <div class="hero-btns">
                        <a href="${slide.primary_button_link || '#projects'}" class="btn btn-primary">${slide.primary_button_text || 'Voir nos projets'}</a>
                        <a href="https://shop.thetic.de" target="_blank" class="btn btn-shop"><i class="fas fa-shopping-cart"></i> Visiter notre boutique</a>
                    </div>
                </div>
                ${slide.image ? `
                <div class="hero-image">
                    <img src="${slide.image}" alt="${slide.title}">
                </div>
                ` : ''}
            </div>
        `;
        
        carousel.appendChild(slideElement);

        // Créer l'indicateur
        if (indicators) {
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', index);
            indicators.appendChild(indicator);
        }
    });

    // Redémarrer le carousel
    initCarousel();
}

// Initialiser le carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (carouselInterval) clearInterval(carouselInterval);
    
    carouselInterval = setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);

    // Ajouter les événements aux indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
}

// Afficher un slide spécifique
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

// Charger les services
function loadServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    const serviceSelect = document.getElementById('service');
    
    servicesGrid.innerHTML = '';
    serviceSelect.innerHTML = '<option value="">Sélectionnez un service</option>';

    services.forEach(service => {
        // Ajouter au grid
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.style.animationDelay = `${services.indexOf(service) * 0.1}s`;
        
        serviceCard.innerHTML = `
            <div class="service-icon">
                <i class="${service.icon || 'fas fa-cog'}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            ${service.promotion_text ? `<div class="promotion-badge">${service.promotion_text}</div>` : ''}
        `;
        
        servicesGrid.appendChild(serviceCard);

        // Ajouter au select
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.title;
        serviceSelect.appendChild(option);
    });

    // Animer les services
    animateOnScroll();
}

// Charger les projets
function loadProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsFilter = document.getElementById('projects-filter');
    
    projectsGrid.innerHTML = '';
    
    // Créer les filtres
    const categories = [...new Set(projects.map(p => p.category))];
    projectsFilter.innerHTML = `
        <button class="filter-btn active" data-filter="all">Tous</button>
        ${categories.map(cat => 
            `<button class="filter-btn" data-filter="${cat}">${cat}</button>`
        ).join('')}
    `;

    // Ajouter les projets
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-category', project.category);
        projectCard.setAttribute('data-project', project.id);
        projectCard.style.animationDelay = `${projects.indexOf(project) * 0.1}s`;
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.images ? project.images[0] : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTEwIiByPSI0MCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxMTAiIHI9IjE1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjExMCIgcj0iOCIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIxMCIgeT0iMTUwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjMwIiB5PSIxNjAiIHdpZHRoPSIyOTAiIGhlaWdodD0iNDAiIHJ4PSI1IiBmaWxsPSIjRTlFN0VGIi8+Cjwvc3ZnPgo='}" alt="${project.title}">
                <div class="project-overlay">
                    <a href="#" class="btn btn-primary">Voir le projet</a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.short_description}</p>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });

    // Ajouter les événements de filtrage
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            document.querySelectorAll('.project-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Ajouter les événements de modal
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId, projects);
        });
    });

    // Animer les projets
    animateOnScroll();
}

// Ouvrir la modal du projet
function openProjectModal(projectId, projects) {
    const project = projects.find(p => p.id == projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const projectDetailTitle = document.getElementById('projectDetailTitle');
    const projectDetailDescription = document.getElementById('projectDetailDescription');

    modalTitle.textContent = project.title;
    projectDetailTitle.textContent = project.title;
    projectDetailDescription.textContent = project.description;

    if (project.images && project.images.length > 0) {
        modalImage.src = project.images[0];
        modalCaption.textContent = project.image_captions ? project.image_captions[0] : 'Image du projet';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Afficher la bannière de promotion
function showPromotionBanner(promotion) {
    const banner = document.getElementById('promotion-banner');
    const promotionText = document.getElementById('promotion-text');
    
    if (banner && promotionText) {
        promotionText.textContent = promotion.title;
        banner.style.display = 'block';
        
        // Appliquer le style de la promotion
        if (promotion.style) {
            try {
                const style = JSON.parse(promotion.style);
                Object.keys(style).forEach(key => {
                    banner.style[key] = style[key];
                });
            } catch (e) {
                console.error('Erreur dans le style de promotion:', e);
            }
        }
    }
}

// Charger les liens sociaux
function loadSocialLinks(socialLinks) {
    const socialContainer = document.getElementById('social-links');
    const footerContainer = document.getElementById('footer-content');
    
    if (socialContainer) {
        socialContainer.innerHTML = socialLinks.map(link => `
            <a href="${link.url}" target="_blank" class="social-link">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    }
    
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="footer-col">
                <h4 id="footer-site-name">Rayz.com</h4>
                <p id="footer-description">Votre partenaire de confiance pour des solutions de sécurité innovantes et performantes.</p>
                <div class="social-links">
                    ${socialLinks.map(link => `
                        <a href="${link.url}" target="_blank" class="social-link">
                            <i class="${link.icon}"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
            <div class="footer-col">
                <h4>Liens rapides</h4>
                <ul class="footer-links">
                    <li><a href="#home">Accueil</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#projects">Projets</a></li>
                    <li><a href="#about">À propos</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Services</h4>
                <ul class="footer-links" id="footer-services">
                    <!-- Les services seront chargés dynamiquement -->
                </ul>
            </div>
            <div class="footer-col">
                <h4>Contact</h4>
                <ul class="footer-links">
                    <li><i class="fas fa-map-marker-alt"></i> <span id="footer-address">123 Avenue de la Sécurité, Paris</span></li>
                    <li><i class="fas fa-phone"></i> <span id="footer-phone">+33 1 23 45 67 89</span></li>
                    <li><i class="fas fa-envelope"></i> <span id="footer-email">contact@rayz.com</span></li>
                </ul>
            </div>
        `;
    }
}

// Appliquer le thème saisonnier
function applySeasonalTheme() {
    const theme = localStorage.getItem('seasonal_theme');
    const startDate = localStorage.getItem('theme_start_date');
    const endDate = localStorage.getItem('theme_end_date');
    
    if (theme && theme !== 'none') {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (now >= start && now <= end) {
            document.body.classList.add(`${theme}-theme`);
        } else {
            localStorage.removeItem('seasonal_theme');
            localStorage.removeItem('theme_start_date');
            localStorage.removeItem('theme_end_date');
        }
    }
}

// Initialiser les événements
function initEventListeners() {
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

    // Fermer la bannière de promotion
    const closePromotion = document.getElementById('close-promotion');
    if (closePromotion) {
        closePromotion.addEventListener('click', function() {
            document.getElementById('promotion-banner').style.display = 'none';
        });
    }

    // Fermer la modal
    const modalClose = document.getElementById('modalClose');
    const modal = document.getElementById('projectModal');
    
    if (modalClose && modal) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }

    // Smooth scrolling
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
                
                // Fermer le menu mobile si ouvert
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            }
        });
    });
}

// Soumettre le formulaire de contact
async function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message'),
        created_at: new Date().toISOString()
    };

    try {
        const { error } = await supabase
            .from('contact_messages')
            .insert([data]);

        if (error) throw error;

        alert('Merci pour votre message! Nous vous contacterons bientôt.');
        form.reset();
        
        // Envoyer un email via EmailJS
        sendEmailNotification(data);
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}

// Envoyer une notification par email
function sendEmailNotification(data) {
    // Configuration EmailJS
    emailjs.init('4gEzT9DkXPjvp2WxD');
    
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        to_email: 'ctlpowerr@gmail.com'
    };

    emailjs.send('service_4ab2q68', 'template_default', templateParams)
        .then(response => {
            console.log('Email envoyé avec succès:', response);
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
        });
}

// Animation au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .project-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}
