const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/orders
router.post('/', async (req, res) => {
    try {
        const { customer_id, amount, order_date } = req.body;

        if (!customer_id || !amount) {
            return res.status(400).json({ error: 'customer_id and amount are required' });
        }

        const query = `
      INSERT INTO orders (customer_id, amount, order_date)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

        const result = await pool.query(query, [customer_id, amount, order_date || new Date()]);
        return res.status(201).json({ order: result.rows[0] });
    } catch (err) {
        console.error('Error inserting order:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
