const express = require("express");
const router = express.Router();
const db = require("../db");
const { generateStructuredRFP } = require("../aiService");
const { v4: uuidv4 } = require("uuid");


router.post("/inbound", async (req, res) => {
    try {
        console.log("Inbound email received:", req.body);

        const {
            from,
            to,
            subject,
            text,
            html,
            headers,
            attachments = []
        } = req.body;


        const vendorEmail = from?.email || from;
        const vendorRes = await db.query(
            "SELECT * FROM vendors WHERE email = $1 LIMIT 1",
            [vendorEmail]
        );

        if (vendorRes.rowCount === 0) {
            return res.status(404).json({ error: "Vendor not found for email", vendorEmail });
        }
        const vendor = vendorRes.rows[0];


        const rfp_id = req.body.rfp_id || null;

        if (!rfp_id) {
            return res.status(400).json({ error: "Missing rfp_id in webhook payload" });
        }


        const rfpRes = await db.query("SELECT * FROM rfps WHERE id=$1", [rfp_id]);
        if (rfpRes.rowCount === 0) {
            return res.status(404).json({ error: "RFP not found" });
        }
        const rfp = rfpRes.rows[0];


        const emailText = text || html || subject || "";


        const parsedProposal = await generateStructuredRFP(emailText);


        const id = uuidv4();
        const insertQuery = `
      INSERT INTO vendor_proposals 
      (id, rfp_id, vendor_id, email_subject, email_body_raw, attachments, parsed_data)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

        const saved = await db.query(insertQuery, [
            id,
            rfp_id,
            vendor.id,
            subject,
            emailText,
            attachments,
            parsedProposal
        ]);

        res.json({
            message: "Vendor proposal saved successfully",
            proposal: saved.rows[0]
        });

    } catch (error) {
        console.error("Inbound email error:", error);
        res.status(500).json({ error: "server_error", detail: error.toString() });
    }
});
router.get("/", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT vp.*, v.name AS vendor_name, v.email AS vendor_email
             FROM vendor_proposals vp
             JOIN vendors v ON v.id = vp.vendor_id
             ORDER BY vp.created_at DESC`
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Proposals fetch error:", err);
        res.status(500).json({ error: "server_error" });
    }
});

module.exports = router;
