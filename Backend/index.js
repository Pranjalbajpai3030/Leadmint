const express = require('express');
const cors = require('cors');
const pool = require('./db');
const axios = require('axios'); // Import axios
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// DELIVERY WORKER LOGIC

const DELIVERY_BATCH_INTERVAL = 5000; // 5 seconds
const RECEIPT_ENDPOINT = 'http://localhost:5000/api/receipt';

const simulateDelivery = () => {
    return Math.random() < 0.9 ? 'SENT' : 'FAILED';
};

const processBatch = async () => {
    try {
        // Fetch pending messages
        const { rows } = await pool.query(`
            SELECT id, campaign_id, customer_id
            FROM communication_log
            WHERE status = 'PENDING'
            LIMIT 50
        `);

        if (!rows.length) return;

        console.log(`🚚 Processing ${rows.length} messages...`);

        // Simulate and collect results
        const receipts = rows.map(row => ({
            campaign_id: row.campaign_id,
            customer_id: row.customer_id,
            status: simulateDelivery()
        }));

        // Send POSTs to /api/receipt (batch mode)
        await axios.post(RECEIPT_ENDPOINT + '/batch', { receipts });

        console.log(`✅ Batch update complete for ${receipts.length} messages.`);
    } catch (err) {
        console.error(' Delivery worker error:', err.message);
    }
};

// Run worker every 5 seconds
setInterval(processBatch, DELIVERY_BATCH_INTERVAL);

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

// API routes
app.get('/', (req, res) => {
    res.send('Server is running, and the database connection is established!');
});

app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/segments', require('./routes/segments'));
app.use('/api/campaigns', require('./routes/campaign'));
app.use('/api/receipt', require('./routes/recipent'));

// CORS & Headers Middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    next();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
