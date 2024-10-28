const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.BASE_URL || "https://api.gptsapi.net/v1",
});

const model = process.env.MODEL || "gpt-4o-mini";

module.exports = async function (req, res) {
    // 允许 CORS 请求
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).end();
    }

    try {
        const {prompt} = req.body;

        if (!Array.isArray(prompt) || !prompt.every(msg => msg.role && msg.content)) {
            return res.status(400).json({
                success: false,
                message: "Invalid prompt format. Should be an array of message objects with `role` and `content`.",
            });
        }

        const completion = await openai.chat.completions.create({
            model: model,
            messages: prompt,
        });

        res.status(200).json({
            success: true,
            response: completion.choices[0].message.content,
        });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({
            success: false,
            message: "Error with OpenAI API",
            error: error.message,
        });
    }
};