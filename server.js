
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const __dirname = new URL('.', import.meta.url).pathname;

app.use(express.static(__dirname));
const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
try {
const { message } = req.body;

const response = await client.responses.create({
model: "gpt-4o-mini",
input: message,
});

res.json({ reply: response.output[0].content[0].text });
} catch (error) {
console.error(error);
res.status(500).json({ error: "Server error" });
}
});

app.listen(3000, () => {
console.log("Server running at http://localhost:3000");
});
