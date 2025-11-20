// Configuration et initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser Supabase
    initSupabase();
    
    // Charger les données du site
    loadSiteData();
    
    // Initialiser les événements
    initEvents();
    
    // Initialiser EmailJS
    initEmailJS();
});

// Initialisation de Supabase
async function initSupabase() {
    // Cette fonction est définie dans supabase.js
    console.log('Supabase initialisé');
}

// Charger les données du site
async function loadSiteData() {
    try {
        // Charger les paramètres du site
        await loadSiteSettings();
        
        // Charger les slides de la bannière hero
        await loadHeroSlides();
        
        // Charger les services
        await loadServices();
        
        // Charger les projets
        await loadProjects();
        
        // Charger les promotions actives
        await loadActivePromotions();
        
        // Initialiser les animations
        initAnimations();
        
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Charger les paramètres du site
async function loadSiteSettings() {
    try {
        // Dans un cas réel, on récupérerait ces données de Supabase
        // Pour l'instant, on utilise des valeurs par défaut
        
        // Appliquer les couleurs du thème
        applyTheme('default');
        
    } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
    }
}

// Charger les slides de la bannière hero
async function loadHeroSlides() {
    try {
        const heroCarousel = document.getElementById('hero-carousel');
        
        // Données par défaut (dans un cas réel, viendraient de Supabase)
        const slides = [
            {
                title: "Solutions de Sécurité Innovantes",
                description: "Rayz.com est votre partenaire de confiance pour l'installation de systèmes de surveillance modernes, Starlink, alarmes et bien plus encore.",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE1MCAxNTBINDVWMTE1SDE1MFYxNTBaIiBmaWxsPSIjRTVFN0VGIi8+CjxwYXRoIGQ9Ik0xNTAgMTg1SDQ1VjIyMEgxNTBWMTg1WiIgZmlsbD0iI0U1RTdFRiIvPgo8cGF0aCBkPSJNMTUwIDI1NUg0NVYyOTBIMTUwVjI1NVoiIGZpbGw9IiNFNUU3RUYiLz4KPHBhdGggZD0iTTE1MCAzMjVINDVWMzYwSDE1MFYzMjVaIiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIyNSIgcj0iODAiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI2MCAyMjVMMzIwIDI2NVYxODVMMjYwIDIyNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNDAgMjI1TDI4MCAxODVWMjY1TDM0MCAyMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIzNzAiIHk9IjE1MCIgd2lkdGg9IjE4NSIgaGVpZ2h0PSIyMDAiIHJ4PSIxMCIgZmlsbD0iI0Y1RjdGQSIvPgo8cmVjdCB4PSIzOTAiIHk9IjE3MCIgd2lkdGg9IjE0NSIgaGVpZ2h0PSIxNDAiIHJ4PSI1IiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjQxMCIgY3k9IjE5MCIgcj0iNSIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0MzAiIGN5PSIxOTAiIHI9IjUiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMTkwIiByPSI1IiBmaWxsPSIjMDA5NkQ2Ii8+CjxyZWN0IHg9IjQxMCIgeT0iMjEwIiB3aWR0aD0iMTI1IiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSI0MTAiIHk9IjIzMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyNzAiIHdpZHRoPSI3NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyOTAiIHdpZHRoPSI2NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPC9zdmc+Cg=="
            },
            {
                title: "Installation Starlink Professionnelle",
                description: "Connectez-vous partout avec nos solutions d'installation Starlink haut débit pour particuliers et entreprises.",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTMwMCAxMDBIMzE1VjM1MEgzMDBWMTAwWiIgZmlsbD0iI0U1RTdFRiIvPgo8cGF0aCBkPSJNMjg1IDEwMEgzMDBWMzUwSDI4NVYxMDBaIiBmaWxsPSIjRTVFN0VGIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwSDE2NVYzMDBIMTUwVjE1MFoiIGZpbGw9IiNFNUU3RUYiLz4KPHBhdGggZD0iTTEzNSAxNTBIMTUwVjMwMEgxMzVWMTUwWiIgZmlsbD0iI0U1RTdFRiIvPgo8cGF0aCBkPSJNNDUwIDE1MEg0NjVWMzAwSDQ1MFYxNTBaIiBmaWxsPSIjRTVFN0VGIi8+CjxwYXRoIGQ9Ik00MzUgMTUwSDQ1MFYzMDAgSDQzNVYxNTBaIiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzAwOTZENiIvPgo8cGF0aCBkPSJNMjc1IDcwSDMyNVY5MEgyNzVWNzBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjk1IDU1TDMwNSA3NUgyODVMMjk1IDU1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMwNSA1NUwyOTUgNzVIMzE1TDMwNSA1NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMDAgMzUwSDQwMFYzNjVIMjAwVjM1MFoiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTE4NSAzMzVINDAwVjM1MEgxODVWMzM1WiIgZmlsbD0iIzAwOTZENiIvPgo8L3N2Zz4K"
            },
            {
                title: "Systèmes d'Alarme Complets",
                description: "Protégez votre propriété avec nos systèmes d'alarme avancés avec détection intelligente et notifications en temps réel.",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeD0iMTUwIiB5PSIxMDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjUwIiByeD0iMTAiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMTgwIiB5PSIxMzAiIHdpZHRoPSIyNDAiIGhlaWdodD0iMTgwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI4MCIgcj0iNDAiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iODAiIHI9IjE1IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIzMDAiIGN5PSI4MCIgcj0iOCIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIyMDAiIHk9IjE2MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjIwMCIgeT0iMTkwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiByeD0iMTAiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjAwIiB5PSIyMjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAiIHJ4PSIxMCIgZmlsbD0iI0Y4RkFGQyIvPgo8cmVjdCB4PSIyMDAiIHk9IjI1MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjRjVGQUZBIi8+CjxyZWN0IHg9IjI3MCIgeT0iMjgwIiB3aWR0aD0iNjAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjRkY2QjVCIi8+Cjwvc3ZnPgo="
            }
        ];
        
        // Vider le carousel
        heroCarousel.innerHTML = '';
        
        // Ajouter les slides
        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            slideElement.style.background = `linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)`;
            
            slideElement.innerHTML = `
                <div class="container">
                    <div class="hero-content">
                        <h1>${slide.title}</h1>
                        <p>${slide.description}</p>
                        <div class="hero-btns">
                            <a href="#projects" class="btn btn-primary">Voir nos projets</a>
                            <a href="https://shop.thetic.de" target="_blank" class="btn btn-shop"><i class="fas fa-shopping-cart"></i> Visiter notre boutique</a>
                        </div>
                    </div>
                    <div class="hero-image">
                        <img src="${slide.image}" alt="${slide.title}">
                    </div>
                </div>
            `;
            
            heroCarousel.appendChild(slideElement);
        });
        
        // Ajouter les indicateurs
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
            indicator.setAttribute('data-slide', index);
            indicators.appendChild(indicator);
        });
        
        heroCarousel.appendChild(indicators);
        
        // Initialiser le carousel
        initHeroCarousel();
        
    } catch (error) {
        console.error('Erreur lors du chargement des slides hero:', error);
    }
}

// Initialiser le carousel hero
function initHeroCarousel() {
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselIndicators = document.querySelectorAll('.carousel-indicator');
    let currentSlide = 0;
    
    function showSlide(index) {
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        carouselSlides[index].classList.add('active');
        carouselIndicators[index].classList.add('active');
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
        const servicesGrid = document.getElementById('services-grid');
        
        // Données par défaut (dans un cas réel, viendraient de Supabase)
        const services = [
            {
                icon: 'fas fa-video',
                title: 'Surveillance Vidéo',
                description: 'Installation de systèmes de vidéosurveillance haute définition avec détection intelligente et vision nocturne.'
            },
            {
                icon: 'fas fa-satellite-dish',
                title: 'Starlink',
                description: 'Installation professionnelle de systèmes Starlink pour une connectivité Internet haut débit partout.'
            },
            {
                icon: 'fas fa-shield-alt',
                title: 'Systèmes d\'Alarme',
                description: 'Solutions d\'alarme complètes avec détection de mouvement, capteurs et notifications en temps réel.'
            },
            {
                icon: 'fas fa-fingerprint',
                title: 'Contrôle d\'Accès',
                description: 'Installation de systèmes de contrôle d\'accès avec badges, empreintes digitales et reconnaissance faciale.'
            },
            {
                icon: 'fas fa-wifi',
                title: 'Réseaux Sécurisés',
                description: 'Configuration de réseaux Wi-Fi sécurisés avec pare-feu et systèmes de protection avancés.'
            },
            {
                icon: 'fas fa-store',
                title: 'Vente d\'Équipements',
                description: 'Large gamme d\'équipements de sécurité disponibles à l\'achat sur notre site web Rayz.com.'
            }
        ];
        
        // Vider la grille
        servicesGrid.innerHTML = '';
        
        // Ajouter les services
        services.forEach((service, index) => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.style.transitionDelay = `${index * 0.1}s`;
            
            serviceCard.innerHTML = `
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                ${service.title === 'Vente d\'Équipements' ? 
                  '<a href="https://shop.thetic.de" target="_blank" class="btn btn-shop" style="margin-top: 20px;"><i class="fas fa-shopping-cart"></i> Visiter notre boutique</a>' : 
                  ''}
            `;
            
            servicesGrid.appendChild(serviceCard);
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
    }
}

// Charger les projets
async function loadProjects() {
    try {
        const projectsGrid = document.getElementById('projects-grid');
        
        // Données par défaut (dans un cas réel, viendraient de Supabase)
        const projects = [
            {
                category: 'surveillance',
                title: 'Surveillance Résidentielle Premium',
                description: 'Installation complète d\'un système de surveillance 4K avec détection intelligente pour une villa de luxe.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTEwIiByPSI0MCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxMTAiIHI9IjE1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjExMCIgcj0iOCIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIxMCIgeT0iMTUwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjMwIiB5PSIxNjAiIHdpZHRoPSIyOTAiIGhlaWdodD0iNDAiIHJ4PSI1IiBmaWxsPSIjRTlFN0VGIi8+Cjwvc3ZnPgo=',
                modalImages: [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iMjUiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNzAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjI3MCIgeT0iMjgwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iMzUwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxyZWN0IHg9IjMwMCIgeT0iMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxwYXRoIGQ9Ik0yNTAgMTUwSDQwMFYyMDBIMjUwVjE1MFoiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI1MCAyMTBINDAwVjI1MEgyNTBWMjEwWiIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIyNzAiIHk9IjE2MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjcwIiB5PSIyMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPC9zdmc+Cg=='
                ],
                modalCaptions: [
                    'Image 1: Vue d\'ensemble du système installé',
                    'Image 2: Détails techniques de l\'installation',
                    'Image 3: Interface de contrôle du système'
                ],
                details: {
                    title: 'Surveillance Résidentielle Premium',
                    description: 'Installation complète d\'un système de surveillance 4K avec détection intelligente pour une villa de luxe. Ce projet incluait 12 caméras haute définition, un système d\'enregistrement centralisé et une application mobile pour le contrôle à distance.',
                    additional: 'Le client souhaitait une solution discrète mais efficace pour sécuriser sa propriété de 500m². Nous avons installé des caméras avec vision nocturne, détection de mouvement et alertes en temps réel.',
                    technologies: 'Caméras 4K IP, NVR 16 canaux, Détection intelligente, Application mobile dédiée',
                    duration: '3 semaines',
                    result: 'Système entièrement fonctionnel avec formation complète du client'
                }
            },
            {
                category: 'starlink',
                title: 'Connectivité Starlink Entreprise',
                description: 'Installation de systèmes Starlink pour une entreprise située en zone rurale avec besoins en bande passante élevés.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPHBhdGggZD0iTTEwMCA3MEgyNTBWMTEwSDEwMFY3MFoiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTEyMCAxMDBIMjMwVjEyMEgxMjBWMTEwWiIgZmlsbD0iI0Y4RkFGQyIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxNjAiIHI9IjMwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxwYXRoIGQ9Ik0xNTUgMTYwTDE3NSAxNDBMMTk1IDE2MEgxNTVaIiBmaWxsPSIjRjhGQUZDIi8+CjxwYXRoIGQ9Ik0xOTUgMTYwTDE3NSAxODBMMTU1IDE2MEgxOTVaIiBmaWxsPSIjRjhGQUZDIi8+Cjwvc3ZnPgo=',
                modalImages: [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iMzUwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxyZWN0IHg9IjMwMCIgeT0iMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxwYXRoIGQ9Ik0yNTAgMTUwSDQwMFYyMDBIMjUwVjE1MFoiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI1MCAyMTBINDAwVjI1MEgyNTBWMjEwWiIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIyNzAiIHk9IjE2MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjcwIiB5PSIyMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPC9zdmc+Cg==',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iMjUiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNzAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjI3MCIgeT0iMjgwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K'
                ],
                modalCaptions: [
                    'Image 1: Installation de l\'antenne Starlink',
                    'Image 2: Configuration du système',
                    'Image 3: Tests de connectivité'
                ],
                details: {
                    title: 'Connectivité Starlink Entreprise',
                    description: 'Installation de systèmes Starlink pour une entreprise située en zone rurale avec besoins en bande passante élevés.',
                    additional: 'L\'entreprise avait des difficultés avec les connexions Internet traditionnelles en raison de son emplacement éloigné. Nous avons installé un système Starlink avec redondance pour assurer une connectivité fiable.',
                    technologies: 'Starlink Business, Routeur haute performance, Système de sauvegarde',
                    duration: '2 semaines',
                    result: 'Connectivité Internet haut débit fiable avec temps d\'arrêt minimisés'
                }
            },
            {
                category: 'alarmes',
                title: 'Système d\'Alarme Complet',
                description: 'Installation d\'un système d\'alarme sans fil avec centrale, détecteurs et sirènes pour un immeuble résidentiel.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iODAiIHI9IjMwIiBmaWxsPSIjRkY2QjVCIi8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjgwIiByPSIxNSIgZmlsbD0iI0Y4RkFGQyIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSI4MCIgcj0iOCIgZmlsbD0iI0ZGNkI1QiIvPgo8cmVjdCB4PSIxNjAiIHk9IjExMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjgwIiByeD0iNSIgZmlsbD0iI0ZGNkI1QiIvPgo8cmVjdCB4PSIxNjUiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjYwIiByeD0iMyIgZmlsbD0iI0Y4RkFGQyIvPgo8L3N2Zz4K',
                modalImages: [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxwYXRoIGQ9Ik0yNTAgMTUwSDQwMFYyMDBIMjUwVjE1MFoiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI1MCAyMTBINDAwVjI1MEgyNTBWMjEwWiIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIyNzAiIHk9IjE2MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjcwIiB5PSIyMjAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgcng9IjMiIGZpbGw9IiNGNUY3RkEiLz4KPC9zdmc+Cg==',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIyMDAiIHI9IjYwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIwMCIgcj0iMjUiIGZpbGw9IiNGNUY3RkEiLz4KPHJlY3QgeD0iMjUwIiB5PSIyNzAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjI3MCIgeT0iMjgwIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDgwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjcwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIxMCIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIHJ4PSI1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iMzUwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0MDAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjMDA5NkQ2Ii8+CjxyZWN0IHg9IjMwMCIgeT0iMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K'
                ],
                modalCaptions: [
                    'Image 1: Centrale d\'alarme installée',
                    'Image 2: Détecteurs de mouvement',
                    'Image 3: Sirènes extérieures'
                ],
                details: {
                    title: 'Système d\'Alarme Complet',
                    description: 'Installation d\'un système d\'alarme sans fil avec centrale, détecteurs et sirènes pour un immeuble résidentiel.',
                    additional: 'Le système comprend une centrale de contrôle, des détecteurs de mouvement dans chaque appartement, des capteurs d\'ouverture sur les portes et fenêtres, et des sirènes intérieures et extérieures.',
                    technologies: 'Centrale d\'alarme sans fil, Détecteurs de mouvement, Capteurs d\'ouverture, Sirènes, Application mobile',
                    duration: '1 semaine',
                    result: 'Système d\'alarme complet avec surveillance 24/7 et notifications en temps réel'
                }
            }
        ];
        
        // Vider la grille
        projectsGrid.innerHTML = '';
        
        // Ajouter les projets
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            projectCard.setAttribute('data-project', index);
            projectCard.style.transitionDelay = `${index * 0.1}s`;
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                    <div class="project-overlay">
                        <a href="#" class="btn btn-primary">Voir le projet</a>
                    </div>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
        
        // Initialiser les événements des projets
        initProjectEvents(projects);
        
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
    }
}

// Initialiser les événements des projets
function initProjectEvents(projects) {
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('projectModal');
    
    projectCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const project = projects[index];
            openProjectModal(project);
        });
    });
    
    // Fermer la modal
    const modalClose = document.getElementById('modalClose');
    modalClose.addEventListener('click', function() {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
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
    const projectDetailAdditional = document.getElementById('projectDetailAdditional');
    const projectTechnologies = document.getElementById('projectTechnologies');
    const projectDuration = document.getElementById('projectDuration');
    const projectResult = document.getElementById('projectResult');
    
    // Mettre à jour les informations du projet
    modalTitle.textContent = project.details.title;
    projectDetailTitle.textContent = project.details.title;
    projectDetailDescription.textContent = project.details.description;
    projectDetailAdditional.textContent = project.details.additional;
    projectTechnologies.textContent = project.details.technologies;
    projectDuration.textContent = project.details.duration;
    projectResult.textContent = project.details.result;
    
    // Mettre à jour les images du carousel
    for (let i = 1; i <= 3; i++) {
        const modalImage = document.getElementById(`modal-image-${i}`);
        const modalCaption = document.getElementById(`modal-caption-${i}`);
        
        if (project.modalImages[i-1]) {
            modalImage.src = project.modalImages[i-1];
            modalCaption.textContent = project.modalCaptions[i-1];
        }
    }
    
    // Réinitialiser le carousel
    showProjectSlide(0);
    
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
    
    projectCarouselSlides[index].classList.add('active');
    projectCarouselDots[index].classList.add('active');
}

// Charger les promotions actives
async function loadActivePromotions() {
    try {
        // Dans un cas réel, on récupérerait les promotions actives de Supabase
        // Pour l'instant, on utilise des valeurs par défaut
        
        const promoBanner = document.getElementById('promo-banner');
        const promoText = document.getElementById('promo-text');
        
        // Exemple de promotion
        promoText.textContent = "🎄 Offre spéciale Noël: 20% de réduction sur tous les systèmes de surveillance! 🎄";
        promoBanner.style.display = 'block';
        
        // Fermer la bannière de promotion
        const closePromo = document.getElementById('close-promo');
        closePromo.addEventListener('click', function() {
            promoBanner.style.display = 'none';
        });
        
    } catch (error) {
        console.error('Erreur lors du chargement des promotions:', error);
    }
}

// Appliquer un thème
function applyTheme(theme) {
    document.body.className = '';
    
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem('site-theme', theme);
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
    
    if (mobileToggle) {
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
                if (nav.classList.contains('active')) {
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
    // Cette fonction est définie dans email.js
    console.log('EmailJS initialisé');
}

// Gérer l'envoi du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Dans un cas réel, on enverrait l'email via EmailJS
    // Pour l'instant, on affiche un message de confirmation
    
    alert('Merci pour votre message! Nous vous contacterons bientôt.');
    this.reset();
});
