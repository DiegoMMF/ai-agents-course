import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});

const main = async () => {
  const response = await model.invoke([
    new HumanMessage("What is the capital of France?"),
  ]);

  console.log(response);
};

main().catch(console.error);
