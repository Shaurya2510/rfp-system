require('dotenv').config();
const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

(async () => {
    try {
        const models = await client.models.list();
        console.log("Available models for your account:");
        models.data.forEach(m => console.log(`- ${m.id}`));
    } catch (err) {
        console.error("Error listing models:", err);
    }
})();
