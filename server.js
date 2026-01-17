
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();
const SYSTEM_PROMPT = `
You are Sotou AI.
You help non-technical users understand AI, business, and technology clearly.
Be concise, accurate, practical, and empowering.
`;
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
res.send("Sotou AI Chat API is running");
});
if (!process.env.OPENAI_API_KEY) {
throw new Error("OPENAI_API_KEY is not set");
}
const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});
app.post("/chat", async (req, res) => {
try {
const { message } = req.body;
if (!message || typeof message !== "string") {
return res.status(400).json({ error: "Invalid message input" });
}

if (message.length > 2000) {
return res.status(400).json({ error: "Message too long" });
}

const response = await client.responses.create({
model: "gpt-4o-mini",

temperature: 0.4,
max_output_tokens: 400,

input: [
{ role: "system", content: SYSTEM_PROMPT },
{ role: "user", content: message }
]
})

res.json({ reply: response.output[0].content[0].text });
} catch (error) {
console.error(error);
res.status(500).json({ error: "Server error" });
}
});

export default app;


