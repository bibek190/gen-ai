import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

async function run() {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "user", content: "what is your name and how are you exist" },
      { role: "assistant", content: "I am an AI agent and doing well." },
      { role: "system", content: "You are a helpful AI assistant." },
    ],
  });
  console.log(response.choices[0].message.content);
}
run();
