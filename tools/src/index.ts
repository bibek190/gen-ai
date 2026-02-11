import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// creating our own tool to get time in new york
async function getTimeInNewYork() {
  return new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
}

type Content = {
  role: "system" | "user" | "assistant";
  content: string;
};

async function callOpenAITool() {
  const content: Content[] = [
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
    tools: [
      {
        type: "function",
        function: {
          name: "getTimeInNewYork",
          description: "Get the current time in New York",
        },
      },
    ],
    tool_choice: "auto",
  });
  //    decide tool to call
  const toolCall = response.output.find((item) => item.type === "tool_call");

  if (toolCall) {
    console.log("Tool requested:", toolCall.name);
    console.log("Arguments:", toolCall.arguments);
  }

  const responseMessage = response.output_text;
  console.log("Assistant:", responseMessage);
}
callOpenAITool();
