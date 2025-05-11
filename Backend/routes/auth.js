const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db'); // PostgreSQL DB connection

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sfdfsfdssecret-key';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'your-dsfsdfaSCXZgoogle-client-id';

const client = new OAuth2Client(CLIENT_ID);

// Google OAuth API
router.post('/google-login', async (req, res) => {
    const { tokenId } = req.body;
    if (!tokenId) {
        return res.status(400).json({ message: 'Token ID is required' });
    }

    try {
        // Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: google_id } = payload;

        // Check if user exists in PostgreSQL
        const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user;

        if (userQuery.rows.length === 0) {
            // Insert new user
            const insertQuery = await pool.query(
                'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
                [email, name, google_id]
            );
            user = insertQuery.rows[0];
        } else {
            user = userQuery.rows[0];
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Google login successful',
            token,
            userId: user.id,
        });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Server error during Google login' });
    }
});

module.exports = router;
