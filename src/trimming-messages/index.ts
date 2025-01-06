import { trimMessages } from "@langchain/core/messages";
import { msgs } from "../messages/messages";
import { chatGroq } from "../models";
import { getTrimmedMessages, trimOptions } from "../messages/trimOptions";
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
  const trimmedMessages = await trimMessages(msgs, trimOptions);
  console.log(
    trimmedMessages
      .map((x) =>
        JSON.stringify(
          {
            role: x.getType(),
            content: x.content,
          },
          null,
          2
        )
      )
      .join("\n\n")
  );

  const response = await chatGroq.invoke(trimmedMessages);
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));

  const trimmedMessagesThroughFunction = await getTrimmedMessages();
  console.log(
    trimmedMessagesThroughFunction
      .map((x) =>
        JSON.stringify(
          {
            role: x.getType(),
            content: x.content,
          },
          null,
          2
        )
      )
      .join("\n\n")
  );
};

main().catch(console.error);
