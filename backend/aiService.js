require('dotenv').config();
const Groq = require("groq-sdk");

const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

function rfpPrompt(text) {
    return `
You MUST return ONLY valid JSON. 
NO commentary, NO explanations, NO markdown, NO code blocks.

JSON structure:
{
  "items": [
    { "name": string, "qty": number, "specs": object }
  ],
  "budget": number | null,
  "delivery_days": number | null,
  "payment_terms": string | null,
  "warranty": string | null
}

If anything is missing, return null.

USER INPUT:
${text}

RETURN JSON ONLY:
`;
}

async function generateStructuredRFP(rawText) {
    const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: rfpPrompt(rawText) }],
        temperature: 0
    });

    let output = response.choices[0].message.content.trim();

    // Remove common markdown wrappers
    output = output.replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^\s*Here.*?:/i, "")
        .trim();

    // Extract the first JSON object only (with regex)
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        return { error: "AI_PARSE_ERROR", raw_output: output };
    }

    const jsonText = jsonMatch[0];

    try {
        return JSON.parse(jsonText);
    } catch (err) {
        return { error: "AI_PARSE_ERROR", raw_output: jsonText };
    }
}

module.exports = { generateStructuredRFP };
