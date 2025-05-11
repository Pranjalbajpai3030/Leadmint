const express = require('express');
const pool = require('../db'); // Make sure this is your PG pool
const router = express.Router();

router.post('/dashboard', async (req, res) => {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    try {
        // 1. Total Customers
        const totalCustomersResult = await pool.query(`SELECT COUNT(*) FROM customers`);
        const totalCustomers = parseInt(totalCustomersResult.rows[0].count);

        // 2. Total Orders
        const totalOrdersResult = await pool.query(`SELECT COUNT(*) FROM orders`);
        const totalOrders = parseInt(totalOrdersResult.rows[0].count);

        // 3. User's Segments
        const segmentsResult = await pool.query(
            `SELECT id, name FROM segments WHERE user_id = $1`,
            [userId]
        );
        const segments = segmentsResult.rows;
        const totalSegments = segments.length;

        // 4. Campaigns linked to user's segments
        const campaignsResult = await pool.query(
            `SELECT c.id, c.message, c.segment_id, c.created_at, s.name AS segment_name, s.audience_size
       FROM campaigns c
       JOIN segments s ON c.segment_id = s.id
       WHERE s.user_id = $1
       ORDER BY c.created_at DESC
       LIMIT 5`,
            [userId]
        );
        const recentCampaigns = campaignsResult.rows;

        // 5. Campaign performance: success, failed, total
        const campaignIds = recentCampaigns.map(c => c.id);
        let performance = {};

        if (campaignIds.length > 0) {
            const perfQuery = `
        SELECT campaign_id, status, COUNT(*) as count
        FROM communication_log
        WHERE campaign_id = ANY($1)
        GROUP BY campaign_id, status
      `;
            const perfResult = await pool.query(perfQuery, [campaignIds]);

            // Map performance data
            performance = campaignIds.reduce((acc, id) => {
                acc[id] = { success: 0, failed: 0 };
                return acc;
            }, {});

            perfResult.rows.forEach(row => {
                const id = row.campaign_id;
                const count = parseInt(row.count);
                if (row.status === 'SENT') performance[id].success = count;
                else if (row.status === 'FAILED') performance[id].failed = count;
            });
        }

        // Add performance to campaigns
        const campaignsWithPerformance = recentCampaigns.map(c => ({
            id: c.id,
            message: c.message,
            segment: c.segment_name,
            created_at: c.created_at,
            audience_size: c.audience_size,
            success: performance[c.id]?.success || 0,
            failed: performance[c.id]?.failed || 0,
        }));

        return res.json({
            totalCustomers,
            totalOrders,
            totalSegments,
            totalCampaigns: campaignsWithPerformance.length,
            recentCampaigns: campaignsWithPerformance,
        });

    } catch (err) {
        console.error('Error in /dashboard:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
