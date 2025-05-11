const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/customers
router.post('/', async (req, res) => {
    try {
        const { name, email, total_spent = 0, visit_count = 0, last_active } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const query = `
      INSERT INTO customers (name, email, total_spent, visit_count, last_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const result = await pool.query(query, [name, email, total_spent, visit_count, last_active]);
        return res.status(201).json({ customer: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('Error inserting customer:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/details', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.id AS customer_id,
                c.name,
                c.email,
                c.total_spent,
                c.visit_count,
                c.last_active,
                o.id AS order_id,
                o.amount,
                o.order_date
            FROM customers c
            LEFT JOIN orders o ON c.id = o.customer_id
            ORDER BY c.id, o.order_date DESC
        `);

        // Grouping customers and their orders
        const customersMap = {};

        result.rows.forEach(row => {
            const {
                customer_id,
                name,
                email,
                total_spent,
                visit_count,
                last_active,
                order_id,
                amount,
                order_date
            } = row;

            if (!customersMap[customer_id]) {
                customersMap[customer_id] = {
                    id: customer_id,
                    name,
                    email,
                    total_spent,
                    visit_count,
                    last_active,
                    orders: []
                };
            }

            if (order_id) {
                customersMap[customer_id].orders.push({
                    id: order_id,
                    amount,
                    order_date
                });
            }
        });

        res.status(200).json(Object.values(customersMap));
    } catch (err) {
        console.error('❌ Error fetching grouped customer data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
