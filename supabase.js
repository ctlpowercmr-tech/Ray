// Configuration Supabase
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialiser Supabase
let supabase;

function initSupabase() {
    try {
        // Vérifier si Supabase est disponible
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase initialisé avec succès');
        } else {
            console.warn('Supabase non disponible, utilisation du mode démo');
            // En mode démo, on utilise le localStorage pour simuler une base de données
            initDemoMode();
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Supabase:', error);
        initDemoMode();
    }
}

// Mode démo (fallback)
function initDemoMode() {
    console.log('Mode démo activé - utilisation du localStorage');
    
    // Initialiser les données par défaut si elles n'existent pas
    if (!localStorage.getItem('site-data')) {
        const defaultData = {
            settings: {
                siteName: 'Rayz.com',
                siteLogo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxMCIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0IDE0TDI2IDIwTDE0IDI2VjE0WiIgZmlsbD0iIzAwOTZENiIvPgo8L3N2Zz4K',
                primaryColor: '#0096D6',
                secondaryColor: '#FF6B35',
                adminUsername: 'admin',
                adminPassword: 'admin123'
            },
            heroSlides: [
                {
                    id: 1,
                    title: "Solutions de Sécurité Innovantes",
                    description: "Rayz.com est votre partenaire de confiance pour l'installation de systèmes de surveillance modernes, Starlink, alarmes et bien plus encore.",
                    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDYwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDUwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE1MCAxNTBINDVWMTE1SDE1MFYxNTBaIiBmaWxsPSIjRTVFN0VGIi8+CjxwYXRoIGQ9Ik0xNTAgMTg1SDQ1VjIyMEgxNTBWMTg1WiIgZmlsbD0iI0U1RTdFRiIvPgo8cGF0aCBkPSJNMTUwIDI1NUg0NVYyOTBIMTUwVjI1NVoiIGZpbGw9IiNFNUU3RUYiLz4KPHBhdGggZD0iTTE1MCAzMjVINDVWMzYwSDE1MFYzMjVaIiBmaWxsPSIjRTVFN0VGIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIyNSIgcj0iODAiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTI2MCAyMjVMMzIwIDI2NVYxODVMMjYgMjI1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTM0MCAyMjVMMjgwIDE4NVYyNjVMMzQwIDIyNVoiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjM3MCIgeT0iMTUwIiB3aWR0aD0iMTg1IiBoZWlnaHQ9IjIwMCIgcng9IjEwIiBmaWxsPSIjRjVGQUZBIi8+CjxyZWN0IHg9IjM5MCIgeT0iMTcwIiB3aWR0aD0iMTQ1IiBoZWlnaHQ9IjE0MCIgcng9IjUiIGZpbGw9IiNFNUU3RUYiLz4KPGNpcmNsZSBjeD0iNDEwIiBjeT0iMTkwIiByPSI1IiBmaWxsPSIjMDA5NkQ2Ii8+CjxjaXJjbGUgY3g9IjQzMCIgY3k9IjE5MCIgcj0iNSIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSI0NTAiIGN5PSIxOTAiIHI9IjUiIGZpbGw9IiMwMDk2RDYiLz4KPHJlY3QgeD0iNDEwIiB5PSIyMTAiIHdpZHRoPSIxMjUiIGhlaWdodD0iMTAiIHJ4PSI1IiBmaWxsPSIjRTVFN0VGIi8+CjxyZWN0IHg9IjQxMCIgeT0iMjMwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSI0MTAiIHk9IjI1MCIgd2lkdGg9Ijg1IiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSI0MTAiIHk9IjI3MCIgd2lkdGg9Ijc1IiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8cmVjdCB4PSI0MTAiIHk9IjI5MCIgd2lkdGg9IjY1IiBoZWlnaHQ9IjEwIiByeD0iNSIgZmlsbD0iI0U1RTdFRiIvPgo8L3N2Zz4K",
                    order: 1,
                    active: true
                }
            ],
            services: [
                {
                    id: 1,
                    icon: 'fas fa-video',
                    title: 'Surveillance Vidéo',
                    description: 'Installation de systèmes de vidéosurveillance haute définition avec détection intelligente et vision nocturne.',
                    order: 1,
                    active: true
                }
            ],
            projects: [
                {
                    id: 1,
                    title: 'Surveillance Résidentielle Premium',
                    description: 'Installation complète d\'un système de surveillance 4K avec détection intelligente pour une villa de luxe.',
                    category: 'surveillance',
                    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDM1MCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzNTAiIGhlaWdodD0iMjIwIiByeD0iMTAiIGZpbGw9IiNGNEY2RjgiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjIwMCIgcng9IjUiIGZpbGw9IiNFOUU3RUYiLz4KPGNpcmNsZSBjeD0iMTc1IiBjeT0iMTEwIiByPSI0MCIgZmlsbD0iIzAwOTZENiIvPgo8Y2lyY2xlIGN4PSIxNzUiIGN5PSIxMTAiIHI9IjE1IiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjE3NSIgY3k9IjExMCIgcj0iOCIgZmlsbD0iIzAwOTZENiIvPgo8cmVjdCB4PSIxMCIgeT0iMTUwIiB3aWR0aD0iMzMwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGQUZDIi8+CjxyZWN0IHg9IjMwIiB5PSIxNjAiIHdpZHRoPSIyOTAiIGhlaWdodD0iNDAiIHJ4PSI1IiBmaWxsPSIjRTlFN0VGIi8+Cjwvc3ZnPgo=',
                    active: true
                }
            ],
            promotions: [
                {
                    id: 1,
                    title: 'Offre Spéciale Noël',
                    description: '20% de réduction sur tous les systèmes de surveillance',
                    startDate: '2023-12-01',
                    endDate: '2023-12-31',
                    active: true,
                    theme: 'noel'
                }
            ],
            contact: {
                address: '123 Avenue de la Sécurité, 75000 Paris',
                phone: '+33 1 23 45 67 89',
                email: 'contact@rayz.com',
                socialNetworks: [
                    { platform: 'facebook', url: 'https://facebook.com/rayz' },
                    { platform: 'twitter', url: 'https://twitter.com/rayz' },
                    { platform: 'instagram', url: 'https://instagram.com/rayz' },
                    { platform: 'linkedin', url: 'https://linkedin.com/company/rayz' },
                    { platform: 'whatsapp', url: 'https://wa.me/33123456789' }
                ]
            },
            about: {
                title: 'À Propos de Rayz.com',
                text1: 'Fondée en 2018, Rayz.com est devenue un leader dans le domaine des solutions de sécurité et de connectivité innovantes. Notre équipe d\'experts est passionnée par la création d\'environnements plus sûrs et mieux connectés.',
                text2: 'Nous nous spécialisons dans l\'installation de systèmes de vidéosurveillance modernes, de solutions Starlink, de systèmes d\'alarme et de contrôle d\'accès. Notre approche personnalisée garantit que chaque client reçoit la solution parfaitement adaptée à ses besoins.',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiByeD0iMTUiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNDYwIiBoZWlnaHQ9IjM2MCIgcng9IjEwIiBmaWxsPSIjRjhGQUZDIi8+CjxjaXJjbGUgY3g9IjI1MCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiMwMDk2RDYiLz4KPHBhdGggZD0iTTIxMCAxNTBMMjUwIDExMEwyOTAgMTUwSDIxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yOTAgMTUwTDI1MCAxOTBMMjEwIDE1MEgyOTBaIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxNTAiIHk9IjI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIxMCIgZmlsbD0iI0U5RTdFRiIvPgo8cmVjdCB4PSIxNzAiIHk9IjI2MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSI2MCIgcng9IjUiIGZpbGw9IiNGNEY2RjgiLz4KPC9zdmc+Cg==',
                stats: {
                    stat1: '500+',
                    stat2: '98%',
                    stat3: '24/7'
                }
            },
            footer: {
                title: 'Rayz.com',
                description: 'Votre partenaire de confiance pour des solutions de sécurité innovantes et performantes.',
                copyrightName: 'Rayz.com'
            }
        };
        
        localStorage.setItem('site-data', JSON.stringify(defaultData));
    }
}

// Fonctions pour récupérer les données
async function getSiteData() {
    if (supabase) {
        // Utiliser Supabase en production
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();
                
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Erreur Supabase:', error);
            return getDemoData();
        }
    } else {
        // Utiliser le mode démo
        return getDemoData();
    }
}

// Récupérer les données en mode démo
function getDemoData() {
    const data = localStorage.getItem('site-data');
    return data ? JSON.parse(data) : null;
}

// Sauvegarder les données
async function saveSiteData(data) {
    if (supabase) {
        // Utiliser Supabase en production
        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert(data);
                
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Erreur Supabase:', error);
            return saveDemoData(data);
        }
    } else {
        // Utiliser le mode démo
        return saveDemoData(data);
    }
}

// Sauvegarder les données en mode démo
function saveDemoData(data) {
    try {
        localStorage.setItem('site-data', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde démo:', error);
        return false;
    }
}

// Exporter les fonctions
window.supabaseFunctions = {
    initSupabase,
    getSiteData,
    saveSiteData
};
