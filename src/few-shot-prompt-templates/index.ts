import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { writeFileSync } from "fs";
import { examples } from "../messages/messages";
import { SystemMessage } from "@langchain/core/messages";
import { chatGroq } from "../models";
import { RunnableSequence } from "@langchain/core/runnables";
import { fewShotPrompt, mainPrompt } from "./fewShotPrompts";

const main = async () => {
  const responseOne = (await fewShotPrompt.invoke({})).toChatMessages();
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(responseOne, null, 2));

  /**
   * A constant representing the result of piping the mainPrompt through the chatGroq 
   * function. This chain can be used to process and transform data through the 
   * defined pipeline.
   */
  const chain = mainPrompt.pipe(chatGroq);
  /**
   * A sequence of runnable tasks created from the provided mainPrompt and chatGroq.
   * The sequence is executed in the order they are provided.
   *
   * @constant
   * @type {RunnableSequence}
   */
  const alternativeChain: RunnableSequence = RunnableSequence.from([
    mainPrompt,
    chatGroq,
  ]);

  const responseWithChain = await chain.invoke({
    input: "2 ❤️ 4",
    fewShotExamples: await fewShotPrompt.formatMessages({}),
  });
  writeFileSync(
    `${__dirname}/responseWithChain.json`,
    JSON.stringify(responseWithChain, null, 2)
  );

  const responseWithAlternativeChain = await alternativeChain.invoke({
    input: "2 ❤️ 4",
    fewShotExamples: await fewShotPrompt.formatMessages({}),
  });
  writeFileSync(
    `${__dirname}/responseWithAlternativeChain.json`,
    JSON.stringify(responseWithAlternativeChain, null, 2)
  );

  // Verify that the responses are the same
  const areTheSame =
    JSON.stringify(responseWithChain.content) ===
    JSON.stringify(responseWithAlternativeChain.content);
  console.log("Are the responses the same?", areTheSame); // true
};

main().catch(console.error);