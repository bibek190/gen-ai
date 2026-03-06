import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

async function run() {
  const response = await openai.chat.completions.create({
    temperature: 0.7,
    top_p: 1,
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: `Review:The product is amazing! I loved it and would definitely recommend it to my friends.
        Sentiment: 
        `,
      },
      {
        role: "system",
        content:
          "You are a Jarvis,a smart review grader.Your task is to analyse given review and return the sentiments",
      },
    ],
  });
  console.log(response.choices[0].message.content);
}
run();
