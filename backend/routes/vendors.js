const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// Add vendor
router.post('/add', async (req, res) => {
    try {
        const { name, email, category, notes } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Vendor name is required" });
        }

        const id = uuidv4();

        const query = `
      INSERT INTO vendors (id, name, email, category, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

        const values = [
            id,
            name,
            email || null,
            category || null,
            notes || null
        ];

        const result = await db.query(query, values);

        res.json({
            message: "Vendor added successfully",
            vendor: result.rows[0]
        });

    } catch (err) {
        console.error("Vendor Add Error:", err);
        res.status(500).json({ error: "server_error" });
    }
});

// List vendors
router.get('/', async (req, res) => {
    try {
        const r = await db.query(`
      SELECT * FROM vendors
      ORDER BY created_at DESC
    `);
        res.json(r.rows);
    } catch (err) {
        console.error("Vendor List Error:", err);
        res.status(500).json({ error: "server_error" });
    }
});
// DELETE vendor
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const result = await db.query("DELETE FROM vendors WHERE id=$1", [id]);

        return res.json({ message: "Vendor deleted successfully" });
    } catch (err) {
        console.error("Delete vendor error:", err);
        res.status(500).json({ error: "server_error" });
    }
});


module.exports = router;
