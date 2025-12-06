const express = require("express");
const router = express.Router();
const db = require("../db");
const { generateComparisonAI } = require("../comparisonAIService");

router.get("/:rfp_id", async (req, res) => {
    try {
        const rfp_id = req.params.rfp_id;

        // Fetching RFP
        const rfpRes = await db.query("SELECT * FROM rfps WHERE id=$1", [rfp_id]);
        if (rfpRes.rowCount === 0) {
            return res.status(404).json({ error: "RFP not found" });
        }
        const rfp = rfpRes.rows[0];

        // Fetching all proposals for this RFP
        const proposalsRes = await db.query(
            `SELECT vp.*, v.name AS vendor_name, v.email AS vendor_email
       FROM vendor_proposals vp
       JOIN vendors v ON v.id = vp.vendor_id
       WHERE vp.rfp_id=$1`,
            [rfp_id]
        );

        const proposals = proposalsRes.rows;

        if (proposals.length === 0) {
            return res.json({ message: "No vendor proposals yet" });
        }

        // Rule Based Scoring
        const scored = proposals.map((p) => {
            const parsed = p.parsed_data || {};

            const price = parsed?.items?.reduce((sum, item) => {
                return sum + (item.price || 0);
            }, 0) || 0;

            const delivery = parsed.delivery_days || 999;
            const warranty = parseInt(parsed.warranty) || 0;

            // Simple scoring logic
            const score =
                (100000 / (price || 1)) * 0.5 +
                (100 / (delivery || 1)) * 0.3 +
                (warranty * 10) * 0.2;

            return { ...p, score, price, delivery, warranty };
        });

        // Sorting by best score
        scored.sort((a, b) => b.score - a.score);

        // AI Summary
        const aiSummary = await generateComparisonAI(rfp, scored);

        res.json({
            rfp,
            proposals: scored,
            recommendation: scored[0],
            ai_summary: aiSummary,
        });

    } catch (err) {
        console.error("Comparison API error:", err);
        res.status(500).json({ error: "server_error" });
    }
});

module.exports = router;
