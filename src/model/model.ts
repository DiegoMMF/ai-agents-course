import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

export const model = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});
