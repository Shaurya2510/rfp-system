const Groq = require("groq-sdk");

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function generateComparisonAI(rfp, proposals) {
    try {
        const response = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI procurement analyst. Analyze proposals and justify the best option."
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        rfp,
                        proposals
                    })
                }
            ]
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("AI Comparison Error:", err);
        return "AI summary unavailable.";
    }
}

module.exports = { generateComparisonAI };
