const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const { generateStructuredRFP } = require('../aiService');

// 1. Create RFP
router.post('/create', async (req, res) => {
    try {
        const { title, description_raw } = req.body;

        if (!description_raw) {
            return res.status(400).json({ error: 'description_raw is required' });
        }


        const structured = await generateStructuredRFP(description_raw);

        const id = uuidv4();

        const query = `
      INSERT INTO rfps (id, title, description_raw, structured_data)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

        const values = [id, title || null, description_raw, structured];

        const result = await db.query(query, values);

        res.json({
            message: "RFP created successfully with AI",
            rfp: result.rows[0]
        });

    } catch (error) {
        console.error("AI RFP error:", error);
        res.status(500).json({ error: "server_error" });
    }
});


// 2. Get list of all RFPs
router.get('/', async (req, res) => {
    try {
        const r = await db.query('SELECT * FROM rfps ORDER BY created_at DESC');
        res.json(r.rows);
    } catch (error) {
        console.error("Error fetching RFPs:", error);
        res.status(500).json({ error: "server_error" });
    }
});

// 3. Get RFP by ID
router.get('/:id', async (req, res) => {
    try {
        const r = await db.query('SELECT * FROM rfps WHERE id=$1', [req.params.id]);
        if (r.rowCount === 0) {
            return res.status(404).json({ error: 'not_found' });
        }
        res.json(r.rows[0]);
    } catch (error) {
        console.error("Error fetching RFP:", error);
        res.status(500).json({ error: "server_error" });
    }
});


// 4. DELETE RFP 

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;


        const result = await db.query('DELETE FROM rfps WHERE id = $1', [id]);


        if (result.rowCount === 0) {
            return res.status(404).json({ error: "RFP not found" });
        }

        res.json({ message: "RFP deleted successfully" });

    } catch (error) {
        console.error("Error deleting RFP:", error);
        res.status(500).json({ error: "server_error" });
    }
});

module.exports = router;