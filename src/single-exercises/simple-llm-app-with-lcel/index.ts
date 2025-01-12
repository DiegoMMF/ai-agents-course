import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { chatGroq } from "../../utils/models";
import { writeFileSync } from "fs";

const parser = new StringOutputParser();

/**
 * An array of message objects used for translation purposes.
 * The array contains a system message prompting the translation task
 * and a human message with the text to be translated.
 */
const messagesWithoutTemplate = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

/**
 * Creates a ChatPromptTemplate instance from an array of message templates.
 *
 * @constant
 * @type {ChatPromptTemplate}
 *
 * @param {Array} messages - An array of message templates where each element is a
 * tuple containing the message type and the template string.
 * @param {string} messages[].0 - The type of the message (e.g., "system", "user").
 * @param {string} messages[].1 - The template string for the message.
 *
 * @example
 * const promptTemplate = ChatPromptTemplate.fromMessages([
 *   ["system", systemTemplate],
 *   ["user", humanTemplate],
 * ]);
 */
const promptTemplate: ChatPromptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "Translate the following into {language}:"],
  ["user", "{text}"],
]);

(async () => {
  // Define the model
  const rawResult = await chatGroq.invoke(messagesWithoutTemplate);
  const resultOne = parser.invoke(rawResult);
  writeFileSync(`${__dirname}/responseOne.json`, JSON.stringify(resultOne, null, 2));

  // Also we could directly pipe the result to the parser
  const parsedResult = await chatGroq.pipe(parser).invoke(messagesWithoutTemplate);
  const resultTwo = await chatGroq.invoke(parsedResult);
  writeFileSync(`${__dirname}/responseTwo.json`, JSON.stringify(resultTwo, null, 2));

  // Create a chain
  const llmChain = promptTemplate.pipe(chatGroq).pipe(parser);

  // Invoke the chain
  const result = await llmChain.invoke({
    language: "spanish",
    text: "I love you, my darling!",
  });
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(result, null, 2));

  const promptValue = await promptTemplate.invoke({
    language: "spanish",
    text: "I love you, my darling!",
  });
  const messages = promptValue.toChatMessages();
  const resultThree = await chatGroq.invoke(messages);
  writeFileSync(
    `${__dirname}/responseThree.json`,
    JSON.stringify(resultThree, null, 2)
  );
})();
