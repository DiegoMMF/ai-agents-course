import { HumanMessage } from "@langchain/core/messages";
import { chatGoogleGenerativeAI } from "../../utils/models";
import { writeFileSync } from "fs";

/**
 * The main function that invokes the Google Generative AI model with a prompt
 * and writes the response to a JSON file.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const main = async (): Promise<void> => {
  const response = await chatGoogleGenerativeAI.invoke([
    new HumanMessage("What is the capital of Germany?"),
  ]);

  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
};

main().catch(console.error);
