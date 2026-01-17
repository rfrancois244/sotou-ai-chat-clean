
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
res.send("Sotou AI Chat API is running");
});

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

export default app;


