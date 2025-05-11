const express = require('express');
const router = express.Router();
const pool = require('../db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Utility: Convert rule JSON to SQL WHERE clause
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

// POST /api/segments
router.post('/', async (req, res) => {
    try {
        // Check if required fields exist
        const { user_id, name, rules } = req.body;
        if (!user_id || !name || !rules) {
            return res.status(400).json({ error: 'user_id, name, and rules are required' });
        }

        // Log the incoming request for debugging
        console.log('Received body:', req.body);

        // Ensure rules is a valid object
        if (typeof rules !== 'object' || Array.isArray(rules)) {
            return res.status(400).json({ error: 'rules must be a valid JSON object' });
        }

        // Build where clause from rules
        const whereClause = buildWhereClause(rules);

        // Log the where clause to debug
        console.log('WHERE Clause:', whereClause);

        // Query to get the audience size
        const audienceQuery = `SELECT COUNT(*) FROM customers WHERE ${whereClause}`;
        const audienceResult = await pool.query(audienceQuery);

        // Log the audience size for debugging
        console.log('Audience Size:', audienceResult.rows[0].count);

        const audienceSize = parseInt(audienceResult.rows[0].count, 10);

        // Query to fetch matching customer details
        const customerQuery = `
            SELECT id, name, email, total_spent AS totalAmount
            FROM customers
            WHERE ${whereClause}
        `;
        const customerResult = await pool.query(customerQuery);

        // Log the matching customers for debugging
        console.log('Matching Customers:', customerResult.rows);

        // Insert query to save the segment
        const insertQuery = `
            INSERT INTO segments (user_id, name, rules, audience_size)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        // Log the values going into the insert query
        console.log('Inserting Segment:', {
            user_id,
            name,
            rules: JSON.stringify(rules),
            audience_size: audienceSize
        });

        // Execute the insert query
        const result = await pool.query(insertQuery, [user_id, name, JSON.stringify(rules), audienceSize]);

        // Return the created segment along with customer details
        return res.status(201).json({
            segment: {
                ...result.rows[0],
                rules,
                customers: customerResult.rows // Include matching customer details
            }
        });

    } catch (err) {
        console.error('Error creating segment:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.post("/generate-rule", async (req, res) => {
    const { user_id, segment_name, prompt } = req.body;

    if (!user_id || !segment_name || !prompt) {
        return res.status(400).json({ error: "user_id, segment_name, and prompt are required." });
    }

    const strictPrompt = `
    Based on the user prompt below, generate ONLY a valid JSON object for a customer segment.
    The format must be strictly like this:

    {
      "user_id": ${user_id},
      "name": "${segment_name}",
      "rules": {
        "condition": "AND",
        "rules": [
          {
            "field": "total_spent",
            "operator": ">",
            "value": 1000
          },
          {
            "field": "visit_count",
            "operator": "<",
            "value": 5
          }
        ]
      }
    }

    Strict Guidelines:
    - If the prompt is not clear, return an empty JSON object. 
    - Output only valid JSON (no markdown, no code blocks, no text).
    - Only use these fields in rules: "total_spent", "visit_count", "last_active".
    - Use logical values and comparisons based on the input.
    - Limit to 2–4 rules inside the "rules" array.
    - Provide no extra explanation, only JSON.

    User Prompt: "${prompt}"
    `;

    try {
        const result = await model.generateContent(strictPrompt);
        let rawText = await result.response.text();

        // Clean and trim any code formatting
        rawText = rawText.replace(/```json\n|\n```/g, "").trim();

        try {
            const parsed = JSON.parse(rawText);
            res.json(parsed);
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            res.status(500).json({ error: "Invalid JSON response from model", raw: rawText });
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to generate segment data" });
    }
});


module.exports = router;