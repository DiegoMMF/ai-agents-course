import { HumanMessage } from "@langchain/core/messages";
import { chatGoogleGenerativeAI } from "../models";

const main = async () => {
  const response = await chatGoogleGenerativeAI.invoke([
    new HumanMessage("What is the capital of France?"),
  ]);

  console.log(response);
};

main().catch(console.error);
