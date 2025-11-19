// Configuration Supabase
const SUPABASE_URL = 'https://nfxaylgcacsycaxpjshv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGF5bGdjYWNzeWNheHBqc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDQ4MDcsImV4cCI6MjA3OTEyMDgwN30.fD3Y4_qjcBxhWIIVYP4hQ3fgHQsLVszDldCj-NCTlsA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// État de l'application
let currentEditingItem = null;
let imageUploadCallback = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
    loadAdminData();
    initAdminEventListeners();
});

// Initialiser l'administration
function initAdmin() {
    // Vérifier l'authentification
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Afficher la section active
    showSection('dashboard');
}

// Charger les données de l'admin
async function loadAdminData() {
    try {
        // Charger les statistiques
        await loadStats();

        // Charger les slides Hero
        const { data: slides, error: slidesError } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index');

        if (!slidesError) {
            loadHeroSlidesEditor(slides || []);
        }

        // Charger les services
        const { data: services, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .order('order_index');

        if (!servicesError) {
            loadServicesEditor(services || []);
        }

        // Charger les projets
        const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (!projectsError) {
            loadProjectsEditor(projects || []);
        }

        // Charger les paramètres
        const { data: settings, error: settingsError } = await supabase
            .from('site_settings')
            .select('*')
            .single();

        if (!settingsError && settings) {
            loadSettings(settings);
        }

        // Charger les liens sociaux
        const { data: socialLinks, error: socialError } = await supabase
            .from('social_links')
            .select('*')
            .order('order_index');

        if (!socialError) {
            loadSocialLinksEditor(socialLinks || []);
        }

        // Charger les promotions
        const { data: promotions, error: promotionsError } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false });

        if (!promotionsError) {
            loadPromotionsEditor(promotions || []);
        }

    } catch (error) {
        console.error('Erreur lors du chargement des données admin:', error);
        showNotification('Erreur lors du chargement des données', 'error');
    }
}

// Charger les statistiques
async function loadStats() {
    try {
        const [
            projectsCount,
            servicesCount,
            messagesCount,
            promotionsCount
        ] = await Promise.all([
            supabase.from('projects').select('*', { count: 'exact' }),
            supabase.from('services').select('*', { count: 'exact' }),
            supabase.from('contact_messages').select('*', { count: 'exact' }),
            supabase.from('promotions').select('*', { count: 'exact' }).eq('is_active', true)
        ]);

        document.getElementById('projects-count').textContent = projectsCount.count || 0;
        document.getElementById('services-count').textContent = servicesCount.count || 0;
        document.getElementById('messages-count').textContent = messagesCount.count || 0;
        document.getElementById('promotions-count').textContent = promotionsCount.count || 0;

    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Afficher une section
function showSection(sectionId) {
    // Masquer toutes les sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Désactiver tous les liens
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Afficher la section demandée
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Activer le lien correspondant
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }

    // Mettre à jour le titre
    const title = document.getElementById('admin-section-title');
    if (title) {
        title.textContent = navLink ? navLink.textContent.trim() : 'Administration';
    }
}

// Charger l'éditeur de slides Hero
function loadHeroSlidesEditor(slides) {
    const container = document.getElementById('hero-slides-container');
    if (!container) return;

    container.innerHTML = '';

    slides.forEach((slide, index) => {
        const slideElement = createEditableItem({
            type: 'hero_slide',
            data: slide,
            index: index,
            fields: [
                { name: 'title', label: 'Titre', type: 'text', value: slide.title },
                { name: 'description', label: 'Description', type: 'textarea', value: slide.description },
                { name: 'image', label: 'Image', type: 'image', value: slide.image },
                { name: 'primary_button_text', label: 'Texte du bouton principal', type: 'text', value: slide.primary_button_text },
                { name: 'primary_button_link', label: 'Lien du bouton principal', type: 'text', value: slide.primary_button_link },
                { name: 'background', label: 'Arrière-plan', type: 'color', value: slide.background }
            ]
        });

        container.appendChild(slideElement);
    });
}

// Charger l'éditeur de services
function loadServicesEditor(services) {
    const container = document.getElementById('services-container');
    if (!container) return;

    container.innerHTML = '';

    services.forEach((service, index) => {
        const serviceElement = createEditableItem({
            type: 'service',
            data: service,
            index: index,
            fields: [
                { name: 'title', label: 'Titre', type: 'text', value: service.title },
                { name: 'description', label: 'Description', type: 'textarea', value: service.description },
                { name: 'icon', label: 'Icône FontAwesome', type: 'text', value: service.icon },
                { name: 'promotion_text', label: 'Texte de promotion', type: 'text', value: service.promotion_text }
            ]
        });

        container.appendChild(serviceElement);
    });
}

// Charger l'éditeur de projets
function loadProjectsEditor(projects) {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const projectElement = createEditableItem({
            type: 'project',
            data: project,
            index: index,
            fields: [
                { name: 'title', label: 'Titre', type: 'text', value: project.title },
                { name: 'short_description', label: 'Description courte', type: 'textarea', value: project.short_description },
                { name: 'description', label: 'Description complète', type: 'textarea', value: project.description },
                { name: 'category', label: 'Catégorie', type: 'text', value: project.category },
                { name: 'images', label: 'Images', type: 'gallery', value: project.images },
                { name: 'image_captions', label: 'Légendes des images', type: 'text', value: project.image_captions }
            ]
        });

        container.appendChild(projectElement);
    });
}

// Charger les paramètres
function loadSettings(settings) {
    // Paramètres généraux
    if (settings.site_name) {
        document.getElementById('site-name').value = settings.site_name;
    }
    if (settings.site_logo) {
        document.getElementById('site-logo').value = settings.site_logo;
    }
    if (settings.copyright_text) {
        document.getElementById('copyright-text').value = settings.copyright_text;
    }
    if (settings.admin_email) {
        document.getElementById('admin-email').value = settings.admin_email;
    }

    // Section À propos
    if (settings.about_title) {
        document.getElementById('about-title').value = settings.about_title;
    }
    if (settings.about_text_1) {
        document.getElementById('about-text-1').value = settings.about_text_1;
    }
    if (settings.about_text_2) {
        document.getElementById('about-text-2').value = settings.about_text_2;
    }
    if (settings.about_image) {
        document.getElementById('about-image').value = settings.about_image;
    }

    // Section Contact
    if (settings.contact_address) {
        document.getElementById('contact-address').value = settings.contact_address;
    }
    if (settings.contact_phone) {
        document.getElementById('contact-phone').value = settings.contact_phone;
    }
    if (settings.contact_email) {
        document.getElementById('contact-email').value = settings.contact_email;
    }
}

// Charger l'éditeur de liens sociaux
function loadSocialLinksEditor(socialLinks) {
    const container = document.getElementById('social-links-container');
    if (!container) return;

    container.innerHTML = '';

    socialLinks.forEach((link, index) => {
        const linkElement = createEditableItem({
            type: 'social_link',
            data: link,
            index: index,
            fields: [
                { name: 'platform', label: 'Plateforme', type: 'text', value: link.platform },
                { name: 'url', label: 'URL', type: 'text', value: link.url },
                { name: 'icon', label: 'Icône FontAwesome', type: 'text', value: link.icon }
            ]
        });

        container.appendChild(linkElement);
    });
}

// Charger l'éditeur de promotions
function loadPromotionsEditor(promotions) {
    const container = document.getElementById('promotions-container');
    if (!container) return;

    container.innerHTML = '';

    promotions.forEach((promotion, index) => {
        const promotionElement = createEditableItem({
            type: 'promotion',
            data: promotion,
            index: index,
            fields: [
                { name: 'title', label: 'Titre', type: 'text', value: promotion.title },
                { name: 'description', label: 'Description', type: 'textarea', value: promotion.description },
                { name: 'start_date', label: 'Date de début', type: 'date', value: promotion.start_date },
                { name: 'end_date', label: 'Date de fin', type: 'date', value: promotion.end_date },
                { name: 'is_active', label: 'Active', type: 'checkbox', value: promotion.is_active },
                { name: 'style', label: 'Style CSS', type: 'textarea', value: promotion.style }
            ]
        });

        container.appendChild(promotionElement);
    });
}

// Créer un élément éditable
function createEditableItem(config) {
    const element = document.createElement('div');
    element.className = 'editable-item';
    element.setAttribute('data-id', config.data.id);
    element.setAttribute('data-type', config.type);

    let fieldsHTML = '';
    config.fields.forEach(field => {
        fieldsHTML += createFieldHTML(field, config.data);
    });

    element.innerHTML = `
        <div class="editable-header">
            <h4>${config.data.title || config.data.platform || `Élément ${config.index + 1}`}</h4>
            <div class="item-actions">
                <button class="btn btn-primary btn-sm" onclick="saveItem(this)">Sauvegarder</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(this)">Supprimer</button>
            </div>
        </div>
        <div class="editable-fields">
            ${fieldsHTML}
        </div>
    `;

    return element;
}

// Créer le HTML d'un champ
function createFieldHTML(field, data) {
    const value = field.value || '';

    switch (field.type) {
        case 'textarea':
            return `
                <div class="form-group">
                    <label>${field.label}</label>
                    <textarea class="form-control" data-field="${field.name}">${value}</textarea>
                </div>
            `;
        
        case 'checkbox':
            return `
                <div class="form-group">
                    <label>
                        <input type="checkbox" data-field="${field.name}" ${value ? 'checked' : ''}>
                        ${field.label}
                    </label>
                </div>
            `;
        
        case 'image':
            return `
                <div class="form-group">
                    <label>${field.label}</label>
                    <div class="image-field">
                        <input type="text" class="form-control" data-field="${field.name}" value="${value}" placeholder="URL de l'image">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="openImagePicker(this)">Choisir une image</button>
                        ${value ? `<div class="image-preview-small"><img src="${value}" alt="Preview"></div>` : ''}
                    </div>
                </div>
            `;
        
        case 'gallery':
            return `
                <div class="form-group">
                    <label>${field.label}</label>
                    <div class="gallery-field">
                        <button type="button" class="btn btn-secondary btn-sm" onclick="openGalleryPicker(this)">Gérer la galerie</button>
                    </div>
                </div>
            `;
        
        default:
            return `
                <div class="form-group">
                    <label>${field.label}</label>
                    <input type="${field.type}" class="form-control" data-field="${field.name}" value="${value}">
                </div>
            `;
    }
}

// Ouvrir le sélecteur d'image
function openImagePicker(button) {
    const input = button.previousElementSibling;
    currentEditingItem = input;
    
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Sauvegarder un élément
async function saveItem(button) {
    const itemElement = button.closest('.editable-item');
    const itemType = itemElement.getAttribute('data-type');
    const itemId = itemElement.getAttribute('data-id');
    
    const fields = itemElement.querySelectorAll('[data-field]');
    const data = {};

    fields.forEach(field => {
        const fieldName = field.getAttribute('data-field');
        if (field.type === 'checkbox') {
            data[fieldName] = field.checked;
        } else {
            data[fieldName] = field.value;
        }
    });

    try {
        let result;
        if (itemId && itemId !== 'new') {
            // Mettre à jour l'élément existant
            result = await supabase
                .from(itemType + 's')
                .update(data)
                .eq('id', itemId);
        } else {
            // Créer un nouvel élément
            result = await supabase
                .from(itemType + 's')
                .insert([data]);
        }

        if (result.error) throw result.error;

        showNotification('Élément sauvegardé avec succès', 'success');
        loadAdminData(); // Recharger les données

    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

// Supprimer un élément
async function deleteItem(button) {
    const itemElement = button.closest('.editable-item');
    const itemType = itemElement.getAttribute('data-type');
    const itemId = itemElement.getAttribute('data-id');

    if (!itemId || itemId === 'new') {
        itemElement.remove();
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from(itemType + 's')
            .delete()
            .eq('id', itemId);

        if (error) throw error;

        showNotification('Élément supprimé avec succès', 'success');
        itemElement.remove();

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression', 'error');
    }
}

// Ajouter un nouveau slide Hero
document.getElementById('add-hero-slide')?.addEventListener('click', function() {
    const container = document.getElementById('hero-slides-container');
    const newSlide = createEditableItem({
        type: 'hero_slide',
        data: { id: 'new', title: 'Nouveau slide', description: '', image: '' },
        index: container.children.length,
        fields: [
            { name: 'title', label: 'Titre', type: 'text', value: 'Nouveau slide' },
            { name: 'description', label: 'Description', type: 'textarea', value: '' },
            { name: 'image', label: 'Image', type: 'image', value: '' },
            { name: 'primary_button_text', label: 'Texte du bouton principal', type: 'text', value: 'Voir nos projets' },
            { name: 'primary_button_link', label: 'Lien du bouton principal', type: 'text', value: '#projects' },
            { name: 'background', label: 'Arrière-plan', type: 'color', value: '' }
        ]
    });

    container.appendChild(newSlide);
});

// Ajouter un nouveau service
document.getElementById('add-service')?.addEventListener('click', function() {
    const container = document.getElementById('services-container');
    const newService = createEditableItem({
        type: 'service',
        data: { id: 'new', title: 'Nouveau service', description: '', icon: 'fas fa-cog' },
        index: container.children.length,
        fields: [
            { name: 'title', label: 'Titre', type: 'text', value: 'Nouveau service' },
            { name: 'description', label: 'Description', type: 'textarea', value: '' },
            { name: 'icon', label: 'Icône FontAwesome', type: 'text', value: 'fas fa-cog' },
            { name: 'promotion_text', label: 'Texte de promotion', type: 'text', value: '' }
        ]
    });

    container.appendChild(newService);
});

// Ajouter un nouveau projet
document.getElementById('add-project')?.addEventListener('click', function() {
    const container = document.getElementById('projects-container');
    const newProject = createEditableItem({
        type: 'project',
        data: { id: 'new', title: 'Nouveau projet', description: '', category: 'general' },
        index: container.children.length,
        fields: [
            { name: 'title', label: 'Titre', type: 'text', value: 'Nouveau projet' },
            { name: 'short_description', label: 'Description courte', type: 'textarea', value: '' },
            { name: 'description', label: 'Description complète', type: 'textarea', value: '' },
            { name: 'category', label: 'Catégorie', type: 'text', value: 'general' },
            { name: 'images', label: 'Images', type: 'gallery', value: '' },
            { name: 'image_captions', label: 'Légendes des images', type: 'text', value: '' }
        ]
    });

    container.appendChild(newProject);
});

// Ajouter un nouveau lien social
document.getElementById('add-social-link')?.addEventListener('click', function() {
    const container = document.getElementById('social-links-container');
    const newLink = createEditableItem({
        type: 'social_link',
        data: { id: 'new', platform: 'Nouveau réseau', url: '', icon: 'fab fa-link' },
        index: container.children.length,
        fields: [
            { name: 'platform', label: 'Plateforme', type: 'text', value: 'Nouveau réseau' },
            { name: 'url', label: 'URL', type: 'text', value: '' },
            { name: 'icon', label: 'Icône FontAwesome', type: 'text', value: 'fab fa-link' }
        ]
    });

    container.appendChild(newLink);
});

// Ajouter une nouvelle promotion
document.getElementById('add-promotion')?.addEventListener('click', function() {
    const container = document.getElementById('promotions-container');
    const newPromotion = createEditableItem({
        type: 'promotion',
        data: { 
            id: 'new', 
            title: 'Nouvelle promotion', 
            description: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            is_active: true
        },
        index: container.children.length,
        fields: [
            { name: 'title', label: 'Titre', type: 'text', value: 'Nouvelle promotion' },
            { name: 'description', label: 'Description', type: 'textarea', value: '' },
            { name: 'start_date', label: 'Date de début', type: 'date', value: new Date().toISOString().split('T')[0] },
            { name: 'end_date', label: 'Date de fin', type: 'date', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
            { name: 'is_active', label: 'Active', type: 'checkbox', value: true },
            { name: 'style', label: 'Style CSS', type: 'textarea', value: '' }
        ]
    });

    container.appendChild(newPromotion);
});

// Initialiser les événements de l'admin
function initAdminEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Actions rapides
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Sauvegarder tout
    document.getElementById('save-all')?.addEventListener('click', function() {
        saveAllSettings();
    });

    // Prévisualiser
    document.getElementById('preview-site')?.addEventListener('click', function() {
        window.open('index.html', '_blank');
    });

    // Déconnexion
    document.getElementById('logout')?.addEventListener('click', function() {
        localStorage.removeItem('admin_token');
        window.location.href = 'index.html';
    });

    // Modal d'image
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        // Fermer la modal
        imageModal.querySelector('.modal-close').addEventListener('click', function() {
            imageModal.style.display = 'none';
        });

        document.getElementById('cancel-image').addEventListener('click', function() {
            imageModal.style.display = 'none';
        });

        // Upload d'image
        const uploadArea = document.getElementById('upload-area');
        const imageUpload = document.getElementById('image-upload');

        uploadArea.addEventListener('click', function() {
            imageUpload.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
        });

        uploadArea.addEventListener('dragleave', function() {
            uploadArea.style.borderColor = 'var(--gray-light)';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-light)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleImageUpload(files[0]);
            }
        });

        imageUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        });

        // Confirmer la sélection d'image
        document.getElementById('confirm-image').addEventListener('click', function() {
            const preview = document.getElementById('image-preview').querySelector('img');
            if (preview && currentEditingItem) {
                currentEditingItem.value = preview.src;
                
                // Mettre à jour l'aperçu
                const previewContainer = currentEditingItem.closest('.image-field');
                let previewSmall = previewContainer.querySelector('.image-preview-small');
                
                if (!previewSmall) {
                    previewSmall = document.createElement('div');
                    previewSmall.className = 'image-preview-small';
                    previewContainer.appendChild(previewSmall);
                }
                
                previewSmall.innerHTML = `<img src="${preview.src}" alt="Preview">`;
            }
            
            imageModal.style.display = 'none';
        });
    }

    // Gestion des thèmes saisonniers
    const themeSelect = document.getElementById('seasonal-theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            localStorage.setItem('seasonal_theme', this.value);
        });
    }

    const themeStartDate = document.getElementById('theme-start-date');
    const themeEndDate = document.getElementById('theme-end-date');
    
    if (themeStartDate && themeEndDate) {
        themeStartDate.addEventListener('change', function() {
            localStorage.setItem('theme_start_date', this.value);
        });
        
        themeEndDate.addEventListener('change', function() {
            localStorage.setItem('theme_end_date', this.value);
        });
    }
}

// Gérer l'upload d'image
function handleImageUpload(file) {
    if (!file.type.match('image.*')) {
        showNotification('Veuillez sélectionner une image valide', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Sauvegarder tous les paramètres
async function saveAllSettings() {
    try {
        // Récupérer tous les paramètres
        const settings = {
            site_name: document.getElementById('site-name').value,
            site_logo: document.getElementById('site-logo').value,
            copyright_text: document.getElementById('copyright-text').value,
            admin_email: document.getElementById('admin-email').value,
            about_title: document.getElementById('about-title').value,
            about_text_1: document.getElementById('about-text-1').value,
            about_text_2: document.getElementById('about-text-2').value,
            about_image: document.getElementById('about-image').value,
            contact_address: document.getElementById('contact-address').value,
            contact_phone: document.getElementById('contact-phone').value,
            contact_email: document.getElementById('contact-email').value
        };

        // Sauvegarder les paramètres
        const { error } = await supabase
            .from('site_settings')
            .upsert([settings]);

        if (error) throw error;

        showNotification('Tous les paramètres ont été sauvegardés', 'success');

    } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error);
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Style de la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Fermer la notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.remove();
    });

    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// CSS pour l'animation des notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 10px;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
document.head.appendChild(notificationStyles);
