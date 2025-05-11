const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/receipt - single update
router.post('/', async (req, res) => {
    try {
        const { campaign_id, customer_id, status } = req.body;

        if (!campaign_id || !customer_id || !status) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        await pool.query(
            `UPDATE communication_log
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE campaign_id = $2 AND customer_id = $3`,
            [status, campaign_id, customer_id]
        );

        return res.status(200).json({ message: 'Status updated' });
    } catch (err) {
        console.error(' Receipt update failed:', err);
        return res.status(500).json({ error: 'Internal error' });
    }
});

// POST /api/receipt/batch - batch update
router.post('/batch', async (req, res) => {
    const client = await pool.connect();
    try {
        const { receipts } = req.body;
        if (!receipts || !Array.isArray(receipts)) {
            return res.status(400).json({ error: 'Invalid batch format' });
        }

        await client.query('BEGIN'); // Start transaction

        const updatePromises = receipts.map(r =>
            client.query(
                `UPDATE communication_log
                 SET status = $1, updated_at = CURRENT_TIMESTAMP
                 WHERE campaign_id = $2 AND customer_id = $3`,
                [r.status, r.campaign_id, r.customer_id]
            )
        );

        await Promise.all(updatePromises); // Execute all updates in parallel

        await client.query('COMMIT'); // Commit transaction
        return res.status(200).json({ message: 'Batch update successful' });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error(' Batch update error:', err);
        return res.status(500).json({ error: 'Internal error' });
    } finally {
        client.release(); // Release client connection
    }
});

module.exports = router;
