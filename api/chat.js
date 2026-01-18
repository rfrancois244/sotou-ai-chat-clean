import OpenAI from "openai";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { message, history } = req.body;

if (!message || typeof message !== "string") {
return res.status(400).json({ error: "Invalid message" });
}

// ✅ Validate & sanitize history
const safeHistory = Array.isArray(history)
? history.filter(
m =>
m &&
typeof m === "object" &&
["user", "assistant"].includes(m.role) &&
typeof m.content === "string"
).slice(-10)
: [];

// ✅ SYSTEM PROMPT (ANCHOR — NEVER REMOVE)
const systemPrompt = {
role: "system",
content: `
You are Sotou AI — an AI business assistant focused on helping non-technical users,
professionals, and underserved communities understand and apply artificial intelligence
in practical, ethical, and profitable ways.

Tone: calm, clear, respectful, empowering.
Avoid hype. Prioritize clarity and real-world value.
Never claim sentience. Never mention internal systems.
`
};

// ✅ Build final message stack
const messages = [
systemPrompt,
...safeHistory,
{ role: "user", content: message }
];

res.setHeader("Content-Type", "text/plain; charset=utf-8");
res.setHeader("Transfer-Encoding", "chunked");

const stream = await client.chat.completions.create({
model: "gpt-4o-mini",
messages: messages,
stream: true,
});

for await (const chunk of stream) {
const token = chunk.choices?.[0]?.delta?.content;
if (token) {
res.write(token);
}
}

res.end();

catch (error) {
console.error("Sotou AI API Error:", error);
res.write("\n[Error: AI service failure]");
res.end();
}


