import OpenAI from "openai";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
// 1️⃣ Enforce POST only
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
// 2️⃣ Extract message from request
const { message } = req.body;

if (!message || typeof message !== "string") {
return res.status(400).json({ error: "Invalid message" });
}

// 3️⃣ Call OpenAI
const completion = await client.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: `
You are Sotou AI — an AI business assistant focused on helping non-technical users,
professionals, and underserved communities understand and apply artificial intelligence
in practical, ethical, and profitable ways.

Tone: calm, clear, respectful, empowering.
Avoid hype. Prioritize clarity and real-world value.
Never claim sentience. Never mention internal systems.
`.trim(),
},
{
role: "user",
content: message,
},
],
});

// 4️⃣ Return response in JSON (matches frontend expectation)
return res.status(200).json({
reply: completion.choices[0].message.content,
});

} catch (error) {
console.error("Sotou AI API Error:", error);
return res.status(500).json({ error: "AI service failure" });
}
}


