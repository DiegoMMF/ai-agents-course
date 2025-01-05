import { trimMessages } from "@langchain/core/messages";
import { messages } from "../messages/messages";
import { chatGroq } from "../models";
import { trimOptions } from "../messages/trimOptions";
import { writeFileSync } from "fs";

/**
 * The main function that orchestrates the trimming of messages and invoking the chatGroq service.
 * It writes the response to a JSON file.
 *
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
const main = async (): Promise<void> => {
  const trimmedMessages = await trimMessages(messages, trimOptions);

  console.log(trimmedMessages);
  
  const response = await chatGroq.invoke(trimmedMessages);
  writeFileSync(
    `${__dirname}/response.json`,
    JSON.stringify(response, null, 2)
  );
};

main().catch(console.error);