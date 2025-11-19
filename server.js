const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration Supabase avec vos identifiants
const supabaseUrl = 'https://nfxaylgcacsycaxpjshv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meGF5bGdjYWNzeWNheHBqc2h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NDQ4MDcsImV4cCI6MjA3OTEyMDgwN30.fD3Y4_qjcBxhWIIVYP4hQ3fgHQsLVszDldCj-NCTlsA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware de sécurité
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://nfxaylgcacsycaxpjshv.supabase.co"]
        }
    }
}));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Routes pour l'API
app.get('/api/site-data', async (req, res) => {
    try {
        const [
            settings,
            slides,
            services,
            projects,
            socialLinks,
            promotions
        ] = await Promise.all([
            supabase.from('site_settings').select('*').single(),
            supabase.from('hero_slides').select('*').order('order_index'),
            supabase.from('services').select('*').order('order_index'),
            supabase.from('projects').select('*').order('created_at', { ascending: false }),
            supabase.from('social_links').select('*').order('order_index'),
            supabase.from('promotions').select('*').eq('is_active', true)
                .gte('end_date', new Date().toISOString())
                .lte('start_date', new Date().toISOString())
        ]);

        res.json({
            settings: settings.data,
            slides: slides.data,
            services: services.data,
            projects: projects.data,
            socialLinks: socialLinks.data,
            promotions: promotions.data
        });
    } catch (error) {
        console.error('Error fetching site data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour soumettre le formulaire de contact
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const { data, error } = await supabase
            .from('contact_messages')
            .insert([{
                name,
                email,
                phone,
                service,
                message,
                created_at: new Date().toISOString()
            }]);

        if (error) throw error;

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route pour l'authentification admin
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérification basique
        if (username === 'admin' && password === 'admin123') {
            const token = 'valid-admin-token-' + Date.now();
            res.json({ success: true, token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    if (token.startsWith('valid-admin-token')) {
        next();
    } else {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Routes protégées pour l'administration
app.put('/api/admin/update-settings', authenticateToken, async (req, res) => {
    try {
        const { settings } = req.body;

        const { data, error } = await supabase
            .from('site_settings')
            .upsert([settings]);

        if (error) throw error;

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Servir les fichiers statiques
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
