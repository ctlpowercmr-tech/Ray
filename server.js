const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Routes API
app.get('/api/site-info', async (req, res) => {
    const { data, error } = await supabase
        .from('site_info')
        .select('*')
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/services', async (req, res) => {
    const { data, error } = await supabase
        .from('services')
        .select('*');
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/media', async (req, res) => {
    const { data, error } = await supabase
        .from('media')
        .select('*');
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/maintenance', async (req, res) => {
    const { data, error } = await supabase
        .from('maintenance')
        .select('*')
        .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Update routes with authentication
app.post('/api/update-site-info', authenticateAdmin, async (req, res) => {
    const { companyName, contactEmail, contactPhone, contactAddress } = req.body;
    
    const { data, error } = await supabase
        .from('site_info')
        .update({ 
            company_name: companyName,
            contact_email: contactEmail,
            contact_phone: contactPhone,
            contact_address: contactAddress
        })
        .eq('id', 1);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, data });
});

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
    const password = req.headers['x-admin-password'];
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
}

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
