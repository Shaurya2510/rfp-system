const Imap = require("imap-simple");
const { simpleParser } = require("mailparser");
const db = require("./db");
const { generateStructuredRFP } = require("./aiService");
const { v4: uuidv4 } = require("uuid");

const imapConfig = {
    imap: {
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASS,
        host: process.env.IMAP_HOST,
        port: Number(process.env.IMAP_PORT),
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
        authTimeout: 10000
    }
};

async function checkInbox() {
    console.log("IMAP service running...");

    try {
        const connection = await Imap.connect(imapConfig);
        await connection.openBox("[Gmail]/All Mail", false);

        const searchCriteria = ["UNSEEN"];
        const fetchOptions = { bodies: [''], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("No new emails.");
            connection.end();
            return;
        }

        for (const msg of messages) {
            const all = msg.parts.find(p => p.which === '');

            if (!all || !all.body) {
                console.log("No body found.");
                continue;
            }

            const parsed = await simpleParser(all.body);

            console.log("DEBUG FROM:", parsed.from?.text);

            const sender =
                parsed.from?.value?.[0]?.address ||
                parsed.from?.text ||
                "unknown";

            console.log("Email received from:", sender);

            const subject = parsed.subject || "";
            const body = parsed.text || parsed.html || "";


            // SPAM FILTER REQUIRE VALID RFP ID IN SUBJECT

            const rfpIdMatch = subject.match(/[0-9a-fA-F-]{36}/);

            if (!rfpIdMatch) {
                console.log("Ignored email — No valid RFP ID found. (Likely spam)");
                continue;
            }

            const rfp_id = rfpIdMatch[0];
            console.log("✔ Valid RFP ID detected:", rfp_id);


            // FETCH RFP TO ENSURE IT EXISTS

            const rfpRes = await db.query("SELECT * FROM rfps WHERE id=$1", [rfp_id]);

            if (rfpRes.rowCount === 0) {
                console.log("RFP not found in DB. Ignoring email.");
                continue;
            }


            // CHECK VENDOR — AUTO-REGISTER IF NOT FOUND

            let vendorRes = await db.query(
                "SELECT * FROM vendors WHERE email=$1 LIMIT 1",
                [sender]
            );

            let vendor;

            if (vendorRes.rowCount === 0) {
                console.log(" Auto-registering vendor:", sender);

                const insertRes = await db.query(
                    "INSERT INTO vendors (id, name, email, category) VALUES ($1, $2, $3, $4) RETURNING *",
                    [uuidv4(), sender.split("@")[0], sender, "auto"]
                );

                vendor = insertRes.rows[0];
            } else {
                vendor = vendorRes.rows[0];
            }


            // AI PARSE PROPOSAL

            console.log("🤖 AI parsing vendor proposal...");
            const parsedProposal = await generateStructuredRFP(body);


            // STORE PROPOSAL IN DB

            const id = uuidv4();
            await db.query(
                `INSERT INTO vendor_proposals 
          (id, rfp_id, vendor_id, email_subject, email_body_raw, parsed_data)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [id, rfp_id, vendor.id, subject, body, parsedProposal]
            );

            console.log("Proposal saved to database!");
        }

        connection.end();
    } catch (err) {
        console.error("IMAP error:", err);
    }
}

module.exports = { checkInbox };
