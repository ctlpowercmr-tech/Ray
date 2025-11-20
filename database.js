// Configuration de la base de données PostgreSQL (Supabase)
const DB_CONFIG = {
    supabaseUrl: 'https://kbttmzacnzcbgucbdtgu.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidHRtemFjbnpjYmd1Y2JkdGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzM2MTUsImV4cCI6MjA3OTIwOTYxNX0.Xh2sMIF5aQMBpr6Go88W3Arz1uK5a0clunrCl7AdpUc',
    // Fallback vers localStorage si Supabase n'est pas configuré
    useLocalStorage: true
};

// Initialisation de la base de données
class DatabaseManager {
    constructor() {
        this.supabase = null;
        this.isConnected = false;
        this.useLocalStorage = DB_CONFIG.useLocalStorage;
        this.init();
    }

    async init() {
        try {
            // Vérifier si Supabase est disponible
            if (window.supabase && DB_CONFIG.supabaseUrl && DB_CONFIG.supabaseKey && 
                !DB_CONFIG.supabaseUrl.includes('your-project')) {
                this.supabase = window.supabase.createClient(DB_CONFIG.supabaseUrl, DB_CONFIG.supabaseKey);
                
                // Tester la connexion
                const { data, error } = await this.supabase.from('site_settings').select('count');
                if (!error) {
                    this.isConnected = true;
                    console.log('✅ Connexion Supabase établie');
                } else {
                    throw new Error('Erreur de connexion Supabase');
                }
            } else {
                throw new Error('Configuration Supabase manquante');
            }
        } catch (error) {
            console.warn('❌ Supabase non disponible, utilisation du localStorage:', error.message);
            this.isConnected = false;
            this.initLocalStorage();
        }
    }

    // Initialiser le localStorage avec des données par défaut
    initLocalStorage() {
        if (!localStorage.getItem('rayz_site_data')) {
            const defaultData = this.getDefaultData();
            localStorage.setItem('rayz_site_data', JSON.stringify(defaultData));
            console.log('📁 Données par défaut initialisées dans localStorage');
        }
    }

    // Obtenir les données par défaut
    getDefaultData() {
        return {
            settings: {
                site_name: "Rayz.com",
                site_logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0IDE0TDI2IDIwTDE0IDI2VjE0WiIgZmlsbD0iIzAwOTZENiIvPgo8L3N2Zz4K",
                primary_color: "#0096D6",
                secondary_color: "#FF6B35",
                admin_username: "admin",
                admin_password: "admin123"
            },
            hero_slides: [
                {
                    id: 1,
                    title: "Solutions de Sécurité Innovantes",
                    description: "Rayz.com est votre partenaire de confiance pour l'installation de systèmes de surveillance modernes, Starlink, alarmes et bien plus encore.",
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE1MCAxNTBINDVWMTE1SDE1MFYxNTBaIiBmaWxsPSIjRTVFN0VGIi8+CjxwYXRoIGQ9Ik0xNTAgMTg1SDQ1VjIyMEgxNTBWMTg1WiIgZmlsbD0iI0U1RTdFRiIvPgo8cGF0aCBkPSJNMTUwIDI1NUg0NVYyOTBIMTUwVjI1NVoiIGZpbGw9IiNFNUU3RUYiLz4KPHBhdGggZD0iTTE1MCAzMjVINDVWMzYwSDE1MFYzMjVaIiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIyNSIgcj0iODAiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI2MCAyMjVMMzIwIDI2NVYxODVMMjYwIDIyNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0zNDAgMjI1TDI4MCAxODVWMjY1TDM0MCAyMjVaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIzNzAiIHk9IjE1MCIgd2lkdGg9IjE4NSIgaGVpZ2h0PSIyMDAiIHJ4PSIxMCIgZmlsbD0iI0Y1RjdGQSIvPgo8cmVjdCB4PSIzOTAiIHk9IjE3MCIgd2lkdGg9IjE0NSIgaGVpZ2h0PSIxNDAiIHJ4PSI1IiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjQxMCIgY3k9IjE5MCIgcj0iNSIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0MzAiIGN5PSIxOTAiIHI9IjUiIGZpbGw9IiMwMDk2RDYiLz4KPGNpcmNsZSBjeD0iNDUwIiBjeT0iMTkwIiByPSI1IiBmaWxsPSIjMDA5NkQ2Ii8+CjxyZWN0IHg9IjQxMCIgeT0iMjEwIiB3aWR0aD0iMTI1IiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSI0MTAiIHk9IjIzMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyNTAiIHdpZHRoPSI4NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyNzAiIHdpZHRoPSI3NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyOTAiIHdpZHRoPSI2NSIgaGVpZ2h0PSIxMCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPC9zdmc+Cg==",
                    display_order: 1,
                    is_active: true
                }
            ],
            services: [
                {
                    id: 1,
                    icon: "fas fa-video",
                    title: "Surveillance Vidéo",
                    description: "Installation de systèmes de vidéosurveillance haute définition avec détection intelligente et vision nocturne.",
                    display_order: 1,
                    is_active: true
                }
            ],
            projects: [
                {
                    id: 1,
                    title: "Surveillance Résidentielle Premium",
                    description: "Installation complète d'un système de surveillance 4K avec détection intelligente pour une villa de luxe.",
                    category: "surveillance",
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTEwIiByPSI0MCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxMTAiIHI9IjE1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjExMCIgcj0iOCIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIxMCIgeT0iMTUwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjMwIiB5PSIxNjAiIHdpZHRoPSIyOTAiIGhlaWdodD0iNDAiIHJ4PSI1IiBmaWxsPSIjRTlFN0VGIi8+Cjwvc3ZnPgo=",
                    is_active: true
                }
            ],
            promotions: [
                {
                    id: 1,
                    title: "Offre Spéciale Noël",
                    description: "20% de réduction sur tous les systèmes de surveillance",
                    start_date: "2023-12-01",
                    end_date: "2023-12-31",
                    is_active: true,
                    theme: "noel"
                }
            ],
            contact_info: {
                address: "123 Avenue de la Sécurité, 75000 Paris",
                phone: "+33 1 23 45 67 89",
                email: "contact@rayz.com",
                social_networks: [
                    { platform: "facebook", url: "https://facebook.com/rayz" },
                    { platform: "twitter", url: "https://twitter.com/rayz" },
                    { platform: "instagram", url: "https://instagram.com/rayz" },
                    { platform: "linkedin", url: "https://linkedin.com/company/rayz" },
                    { platform: "whatsapp", url: "https://wa.me/33123456789" }
                ]
            },
            about_info: {
                title: "À Propos de Rayz.com",
                text1: "Fondée en 2018, Rayz.com est devenue un leader dans le domaine des solutions de sécurité et de connectivité innovantes. Notre équipe d'experts est passionnée par la création d'environnements plus sûrs et mieux connectés.",
                text2: "Nous nous spécialisons dans l'installation de systèmes de vidéosurveillance modernes, de solutions Starlink, de systèmes d'alarme et de contrôle d'accès. Notre approche personnalisée garantit que chaque client reçoit la solution parfaitement adaptée à ses besoins.",
                image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNDYwIiBoZWlnaHQ9IjM2MCIgcng9IjEwIiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTIxMCAxNTBMMjUwIDExMEwyOTAgMTUwSDIxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOTAgMTUwTDI1MCAxOTBMMjEwIDE1MEgyOTBaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxNTAiIHk9IjI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgZmlsbD0iI0U5RTdFRiIvPgo8cmVjdCB4PSIxNzAiIHk9IjI2MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI2MCIgcng9IjUiIGZpbGw9IiNGNEY2RjgiLz4KPC9zdmc+Cg==",
                stats: {
                    stat1: "500+",
                    stat2: "98%",
                    stat3: "24/7"
                }
            },
            footer_info: {
                title: "Rayz.com",
                description: "Votre partenaire de confiance pour des solutions de sécurité innovantes et performantes.",
                copyright_name: "Rayz.com"
            }
        };
    }

    // Méthodes pour récupérer les données
    async getSettings() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('site_settings')
                .select('*')
                .single();
            return error ? this.getLocalStorageData().settings : data;
        }
        return this.getLocalStorageData().settings;
    }

    async getHeroSlides() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('hero_slides')
                .select('*')
                .order('display_order', { ascending: true });
            return error ? this.getLocalStorageData().hero_slides : data;
        }
        return this.getLocalStorageData().hero_slides;
    }

    async getServices() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('services')
                .select('*')
                .order('display_order', { ascending: true });
            return error ? this.getLocalStorageData().services : data;
        }
        return this.getLocalStorageData().services;
    }

    async getProjects() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('projects')
                .select('*')
                .eq('is_active', true);
            return error ? this.getLocalStorageData().projects : data;
        }
        return this.getLocalStorageData().projects;
    }

    async getPromotions() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('promotions')
                .select('*')
                .eq('is_active', true);
            return error ? this.getLocalStorageData().promotions : data;
        }
        return this.getLocalStorageData().promotions;
    }

    async getContactInfo() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('contact_info')
                .select('*')
                .single();
            return error ? this.getLocalStorageData().contact_info : data;
        }
        return this.getLocalStorageData().contact_info;
    }

    async getAboutInfo() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('about_info')
                .select('*')
                .single();
            return error ? this.getLocalStorageData().about_info : data;
        }
        return this.getLocalStorageData().about_info;
    }

    async getFooterInfo() {
        if (this.isConnected) {
            const { data, error } = await this.supabase
                .from('footer_info')
                .select('*')
                .single();
            return error ? this.getLocalStorageData().footer_info : data;
        }
        return this.getLocalStorageData().footer_info;
    }

    // Méthodes pour sauvegarder les données (admin)
    async saveSettings(settings) {
        if (this.isConnected) {
            const { error } = await this.supabase
                .from('site_settings')
                .upsert(settings);
            if (error) {
                console.error('Erreur sauvegarde settings:', error);
                return this.saveToLocalStorage('settings', settings);
            }
            return true;
        }
        return this.saveToLocalStorage('settings', settings);
    }

    async saveHeroSlides(slides) {
        if (this.isConnected) {
            const { error } = await this.supabase
                .from('hero_slides')
                .upsert(slides);
            if (error) {
                console.error('Erreur sauvegarde hero_slides:', error);
                return this.saveToLocalStorage('hero_slides', slides);
            }
            return true;
        }
        return this.saveToLocalStorage('hero_slides', slides);
    }

    // Méthodes utilitaires pour le localStorage
    getLocalStorageData() {
        const data = localStorage.getItem('rayz_site_data');
        return data ? JSON.parse(data) : this.getDefaultData();
    }

    saveToLocalStorage(key, value) {
        try {
            const data = this.getLocalStorageData();
            data[key] = value;
            localStorage.setItem('rayz_site_data', JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erreur sauvegarde localStorage:', error);
            return false;
        }
    }

    // Synchroniser les données locales avec la base de données
    async syncLocalToDatabase() {
        if (!this.isConnected) return false;
        
        try {
            const localData = this.getLocalStorageData();
            
            // Synchroniser chaque table
            for (const [table, data] of Object.entries(localData)) {
                if (Array.isArray(data)) {
                    const { error } = await this.supabase
                        .from(table)
                        .upsert(data);
                    if (error) console.error(`Erreur sync ${table}:`, error);
                } else {
                    const { error } = await this.supabase
                        .from(table)
                        .upsert(data);
                    if (error) console.error(`Erreur sync ${table}:`, error);
                }
            }
            
            console.log('✅ Synchronisation terminée');
            return true;
        } catch (error) {
            console.error('❌ Erreur synchronisation:', error);
            return false;
        }
    }
}

// Créer une instance globale
window.dbManager = new DatabaseManager();

// Exporter pour utilisation dans d'autres fichiers
window.DatabaseManager = DatabaseManager;
