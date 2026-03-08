import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getNewYorkTime() {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
}

function calculator(a, b) {
  return a + b;
}

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "user",
        content: "What is 33+33 and what time is it in New York?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "getNewYorkTime",
          description: "Get the current time of new York",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "calculator",
          description: "A simple calculator that can add two numbers",
          parameters: {
            type: "object",
            properties: {
              a: {
                type: "number",
                description: "The first number",
              },
              b: {
                type: "number",
                description: "The second number",
              },
            },
            required: ["a", "b"],
          },
        },
      },
    ],
  });
  const message = response.choices[0].message;
  if (message.tool_calls) {
    const toolCall = message.tool_calls[0];
    const toolName = toolCall.function.name;

    if (toolName === "calculator") {
      const args = JSON.parse(toolCall.function.arguments);
      const result = calculator(args.a, args.b);
      console.log("Tool result:", result);
    }
    if (toolName === "getNewYorkTime") {
      const result = await getNewYorkTime();

      console.log("Tool result:", result);
    }
  }
}
run();
