const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  // 使用 Vercel 环境变量
    baseURL: process.env.BASE_URL,
})

const model = process.env.MODEL || "gpt-4o-mini";
module.exports = async function (req, res) {
    // 允许 CORS 请求
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有来源（或者根据需要指定来源）

    // 处理 OPTIONS 请求（预检请求）
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).end(); // 返回 204 状态码表示成功
    }

    try {
        const {prompt} = req.body;

        // 调用 OpenAI 的 ChatGPT API
        const completion = await openai.chat.completions.create({
            model: model,  // 可以根据需要使用 GPT-4 或其他模型
            messages: prompt,
        });

        res.status(200).json({
            success: true,
            response: completion.choices[0].message.content,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error with OpenAI API",
            error: error.message,
        });
    }
};