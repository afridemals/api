const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const prompt =
      req.method === "POST"
        ? req.body?.prompt
        : req.query?.prompt;

    if (!prompt || !String(prompt).trim()) {
      return res.status(400).json({ success: false, error: "prompt দিতে হবে" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "GEMINI_API_KEY সেট করা নেই (Vercel env var এ দিন)" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(String(prompt));
    const text = result.response.text();

    return res.status(200).json({
      success: true,
      answer: text,
      reply: text,
      result: { answer: text }
    });
  } catch (err) {
    console.error("[gemini api]", err);
    return res.status(500).json({ success: false, error: err.message || "unknown error" });
  }
};
