// Utilitaire pour Render PostgreSQL
const { Client } = require('pg');

class RenderDatabase {
    constructor() {
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.end();
    }

    async getHeroSlides() {
        const result = await this.client.query('SELECT * FROM hero_slides WHERE is_active = true ORDER BY display_order');
        return result.rows;
    }

    async getServices() {
        const result = await this.client.query('SELECT * FROM services WHERE is_active = true ORDER BY display_order');
        return result.rows;
    }

    async getProjects() {
        const result = await this.client.query('SELECT * FROM projects WHERE is_active = true ORDER BY created_at DESC');
        return result.rows;
    }

    async saveContactMessage(messageData) {
        const sql = `
            INSERT INTO contact_messages (name, email, phone, service_type, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [
            messageData.name,
            messageData.email,
            messageData.phone,
            messageData.service,
            messageData.message
        ];
        
        const result = await this.client.query(sql, values);
        return result.rows[0];
    }
}

module.exports = RenderDatabase;
