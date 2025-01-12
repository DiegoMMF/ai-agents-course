import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

export const chatGroq = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

export const chatGoogleGenerativeAI = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
});
