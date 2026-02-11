import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
async function callOpenAITool() {
    const content = [
        {
            role: "system",
            content: "You are a helpful assistant that helps answer questions.",
        },
        {
            role: "user",
            content: "What is current time in New York?",
        },
    ];
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: content,
    });
    const responseMessage = response.output_text;
    console.log("Assistant:", responseMessage);
}
callOpenAITool();
//# sourceMappingURL=index.js.map