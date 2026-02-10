import OpenAI from "openai";
import dotenv from "dotenv";
import promptSync from "prompt-sync";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Context = {
  role: "system" | "user" | "assistant";
  content: string;
}[];

const context: Context = [
  {
    role: "system",
    content: "You are a helpful assistant that helps answer questions.",
  },
  {
    role: "user",
    content: "How are you?",
  },
];

async function chatCompletion() {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: context,
  });
  const responseMessage = response.output_text;
  context.push({
    role: "assistant",
    content: responseMessage,
  });
  console.log("Assistant:", responseMessage);
}

async function run() {
  const prompt = promptSync({ sigint: true });
  while (true) {
    const userInput = prompt("You: ");
    if (!userInput) {
      continue;
    }
    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting chat...");
      break;
    }
    context.push({
      role: "user",
      content: userInput,
    });
    await chatCompletion();
  }
}
run();
