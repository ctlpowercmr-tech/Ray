// Configuration PostgreSQL pour Render
const POSTGRES_URL = process.env.DATABASE_URL;

// Fonctions de base de données pour Render PostgreSQL
async function initDatabase() {
    try {
        console.log('Initialisation de la base de données PostgreSQL Render');
        // Test de connexion
        await testConnection();
        return true;
    } catch (error) {
        console.error('Erreur connexion PostgreSQL:', error);
        return false;
    }
}

async function testConnection() {
    // Implémentez votre test de connexion PostgreSQL ici
    // Utilisez le package 'pg' pour Node.js
    const { Client } = require('pg');
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    await client.connect();
    await client.query('SELECT NOW()');
    await client.end();
}

// Fonctions de base de données
async function queryDatabase(sql, params = []) {
    const { Client } = require('pg');
    const client = new Client({
        connectionString: POSTGRES_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
    
    try {
        await client.connect();
        const result = await client.query(sql, params);
        return result.rows;
    } finally {
        await client.end();
    }
}

async function saveSiteData(dataType, data) {
    const sql = `
        INSERT INTO site_data (data_type, content, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        ON CONFLICT (data_type) 
        DO UPDATE SET content = $2, updated_at = NOW()
        RETURNING *;
    `;
    
    return await queryDatabase(sql, [dataType, JSON.stringify(data)]);
}

async function getSiteData(dataType) {
    const sql = 'SELECT content FROM site_data WHERE data_type = $1 ORDER BY updated_at DESC LIMIT 1;';
    const result = await queryDatabase(sql, [dataType]);
    
    if (result.length > 0) {
        return JSON.parse(result[0].content);
    }
    return null;
}

// Exporter les fonctions
window.databaseFunctions = {
    initDatabase,
    queryDatabase,
    saveSiteData,
    getSiteData
};
