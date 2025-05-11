const express = require('express');
const router = express.Router();
const pool = require('../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Utility (same as in segmentRoutes)
const buildWhereClause = (rules) => {
    const build = (node) => {
        if (node.condition === 'AND' || node.condition === 'OR') {
            const clauses = node.rules.map(build);
            return `(${clauses.join(` ${node.condition} `)})`;
        } else {
            const field = node.field;
            const operator = node.operator;
            const value = typeof node.value === 'string' ? `'${node.value}'` : node.value;
            return `${field} ${operator} ${value}`;
        }
    };
    return build(rules);
};

// POST /api/campaigns
router.post('/', async (req, res) => {
    try {

        console.log('Request body:', req.body);
        const { segment_id, message } = req.body;

        if (!segment_id || !message) {
            return res.status(400).json({ error: 'segment_id and message are required' });
        }

        // Get segment details and rules
        const segmentResult = await pool.query('SELECT * FROM segments WHERE id = $1', [segment_id]);
        if (segmentResult.rowCount === 0) {
            return res.status(404).json({ error: 'Segment not found' });
        }

        const segment = segmentResult.rows[0];
        const rules = segment.rules;
        const whereClause = buildWhereClause(rules);

        // Fetch matching customer IDs
        const customersResult = await pool.query(`SELECT id FROM customers WHERE ${whereClause}`);
        const customerIds = customersResult.rows.map(row => row.id);

        // Insert into campaigns table
        const campaignInsert = await pool.query(
            `INSERT INTO campaigns (segment_id, message) VALUES ($1, $2) RETURNING *`,
            [segment_id, message]
        );
        const campaign = campaignInsert.rows[0];

        // Insert communication_log entries (batch insert)
        if (customerIds.length > 0) {
            const values = customerIds.map((cid) => `(${campaign.id}, ${cid}, 'PENDING', CURRENT_TIMESTAMP)`).join(',');
            await pool.query(`
                INSERT INTO communication_log (campaign_id, customer_id, status, updated_at)
                VALUES ${values}
            `);
        }

        return res.status(201).json({
            campaign,
            customers_targeted: customerIds.length
        });

    } catch (err) {
        console.error('Error creating campaign:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/generate-message", async (req, res) => {
    const { segment_id, prompt } = req.body;

    if (!segment_id || !prompt) {
        return res.status(400).json({ error: "segment_id and prompt are required" });
    }

    const systemPrompt = `
Generate a **short, catchy marketing message** based on this user intent:
"${prompt}"

🎯 Output Rules:
- Include relevant emojis to grab attention.
- Message length: Max 15-20 words.
- Should feel personalized and customer-friendly.
- Do NOT add any intro or explanation.
- Strictly output in this JSON format:

{
  "segment_id": ${segment_id},
  "message": "Your generated message here"
}

🔴 ONLY return JSON. No markdown. No extra comments.
`;

    try {
        const result = await model.generateContent(systemPrompt);
        let aiResponse = result.response.text();

        // Clean up (remove ```json formatting if any)
        aiResponse = aiResponse.replace(/```json\n?|```/g, "").trim();

        try {
            const parsed = JSON.parse(aiResponse);
            res.json(parsed);
        } catch (err) {
            console.error("Parsing Error:", err);
            res.status(500).json({ error: "Invalid AI response", raw: aiResponse });
        }
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "Failed to generate message" });
    }
});

module.exports = router;

// GET /api/campaigns/history - Get list of past campaigns with stats
router.get('/history', async (req, res) => {
    try {
        const query = `
            SELECT 
                c.id AS campaign_id,
                c.message,
                c.segment_id,
                c.created_at,
                COUNT(cl.*) AS audience_size,
                COUNT(CASE WHEN cl.status = 'SENT' THEN 1 END) AS sent_count,
                COUNT(CASE WHEN cl.status = 'FAILED' THEN 1 END) AS failed_count
            FROM 
                campaigns c
            LEFT JOIN 
                communication_log cl ON c.id = cl.campaign_id
            GROUP BY 
                c.id
            ORDER BY 
                c.created_at DESC
        `;

        const { rows } = await pool.query(query);
        res.status(200).json({ campaigns: rows });
    } catch (err) {
        console.error('Error fetching campaign history:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
