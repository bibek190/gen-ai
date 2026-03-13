import { OpenAI } from "openai";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is missing in .env");
}

if (!process.env.TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is missing in .env");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

async function getUpdate({ query }) {
  const response = await tavilyClient.search(query);
  const data = response.results?.map((result) => result.content).join("\n\n");
  return data;
}

const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant that provides concise answers to questions.",
  },
  {
    role: "user",
    content: "When was iPhone 17 launched?",
  },
];

const tools = [
  {
    type: "function",
    function: {
      name: "getUpdate",
      description:
        "Get the latest information from the websearch and realtime database",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query for retrieving latest information",
          },
        },
        required: ["query"],
      },
    },
  },
];

async function run() {
  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools: tools,
    tool_choice: "auto",
  });
  messages.push(response.choices[0].message);
  const tool_calls = response.choices[0].message.tool_calls;
  if (!tool_calls) {
    console.log("Assistant", response.choices[0].message.content);
    return;
  }
  for (const tool of tool_calls) {
    const toolName = tool.function.name;
    const args = JSON.parse(tool.function.arguments);
    // console.log("toolname:", toolName);
    if (toolName === "getUpdate") {
      const tool_Response = await getUpdate(args);
      messages.push({
        role: "tool",
        name: toolName,
        tool_call_id: tool.id,
        content: tool_Response,
      });
      // console.log("tool response:", tool_Response);
    }
  }
  const finalResponse = await client.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools: tools,
    tool_choice: "auto",
  });
  console.log("Assistant : ", finalResponse.choices[0].message.content);
}
run();
