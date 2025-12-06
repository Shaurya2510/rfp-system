const express = require('express');
const router = express.Router();
const { sendRfpEmail } = require('../emailService');
const db = require('../db');

router.post('/send', async (req, res) => {
    try {
        const { rfp_id, vendor_id } = req.body;

        if (!rfp_id || !vendor_id) {
            return res.status(400).json({ error: "rfp_id and vendor_id are required" });
        }

        // Fetching RFP
        const rfpRes = await db.query("SELECT * FROM rfps WHERE id=$1", [rfp_id]);
        if (rfpRes.rowCount === 0) {
            return res.status(404).json({ error: "RFP not found" });
        }
        const rfp = rfpRes.rows[0];

        // Fetching vendor
        const vendorRes = await db.query("SELECT * FROM vendors WHERE id=$1", [vendor_id]);
        if (vendorRes.rowCount === 0) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        const vendor = vendorRes.rows[0];

        // Subject (with RFP ID)
        const subject = `RFP ${rfp.id} - ${rfp.title}`;

        // Generating clean items list
        const itemsListText = rfp.structured_data.items
            .map(i =>
                `- ${i.qty} × ${i.name} (${Object.entries(i.specs || {})
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")})`
            )
            .join("\n");

        const itemsListHtml = rfp.structured_data.items
            .map(i =>
                `<li><strong>${i.qty} × ${i.name}</strong><br>
                ${Object.entries(i.specs || {})
                    .map(([k, v]) => `${k}: ${v}`)
                    .join("<br>")}
                </li>`
            )
            .join("");


        const textBody = `
Hello ${vendor.name},

You are invited to submit a proposal for this RFP.

${rfp.description_raw}

--- Item Details ---
${itemsListText}

Budget: ₹${rfp.structured_data.budget}
Delivery Time: ${rfp.structured_data.delivery_days} days
Payment Terms: ${rfp.structured_data.payment_terms}
Warranty: ${rfp.structured_data.warranty}

Please reply with your proposal.

Regards,
Procurement Team
        `;


        const htmlBody = `
        <p>Hello <strong>${vendor.name}</strong>,</p>

        <p>You are invited to submit a proposal for this RFP:</p>
        <p>${rfp.description_raw.replace(/\n/g, "<br>")}</p>

        <h3>Item Details</h3>
        <ul>
            ${itemsListHtml}
        </ul>

        <p><strong>Budget:</strong> ₹${rfp.structured_data.budget}</p>
        <p><strong>Delivery Time:</strong> ${rfp.structured_data.delivery_days} days</p>
        <p><strong>Payment Terms:</strong> ${rfp.structured_data.payment_terms}</p>
        <p><strong>Warranty:</strong> ${rfp.structured_data.warranty}</p>

        <p>Please reply with your proposal.</p>
        `;


        const result = await sendRfpEmail(vendor.email, subject, textBody, htmlBody);

        if (!result.success) {
            return res.status(500).json({ error: "Email sending failed", detail: result.error });
        }

        res.json({ message: "Email sent successfully!", info: result.info });

    } catch (error) {
        console.error("Email route error:", error);
        res.status(500).json({ error: "server_error" });
    }
});

module.exports = router;
