const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

app.all("/api/ai/gemini", async (req, res) => {
  try {
    const prompt = req.method === "POST" ? req.body?.prompt : req.query?.prompt;
    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ success: false, error: "prompt দিতে হবে" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY সেট করা নেই" });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const result = await model.generateContent(String(prompt));
    const text = result.response.text();
    return res.status(200).json({ success: true, answer: text, reply: text, result: { answer: text } });
  } catch (err) {
    console.error("[gemini api]", err);
    return res.status(500).json({ success: false, error: err.message || "unknown error" });
  }
});

app.get("/", (req, res) => res.send("AI API চালু আছে ✅"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
