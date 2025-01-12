import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { msgs } from "../../utils/messages";
import { chatGroq } from "../../utils/models";
import { writeFileSync } from "fs";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

const promptTemplateLegacy = PromptTemplate.fromTemplate("Haz un chiste de {topic}");
// This method is designed for traditional language models that process
// single prompts. It creates a prompt template that formats user input into a single
// string, making it suitable for straightforward queries where context is limited to
// the current input.

const promptTemplateNew = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  ),
  new MessagesPlaceholder("msgs"),
]);
// This method is tailored for chat-based models that require handling multiple
// messages in a conversation. It organizes inputs into a structured list of messages
// allowing for more interactive and conversational exchanges.

/**
 * A template for creating a chat prompt that translates a given input to a specified language.
 *
 * This template consists of two parts:
 * 1. A system message prompt that instructs the system to translate the following text to a specified language.
 * 2. A placeholder for the input message that will be translated.
 *
 * @constant
 * @type {ChatPromptTemplate}
 *
 * @example
 * const prompt = alternativePromptTemplate.fill({ language: 'es', input: 'Hello, world!' });
 * This will create a prompt that translates "Hello, world!" to Spanish.
 */
const alternativePromptTemplate: ChatPromptTemplate =
  ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate("Traduce al {language} lo siguiente:"),
    new MessagesPlaceholder("input"), // or: HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);

/**
 * An instance of StringOutputParser used to parse string outputs.
 */
const parser = new StringOutputParser();

const main = async () => {
  const responseLegacy = await chatGroq.invoke(
    await promptTemplateLegacy.format({ topic: "machine learning" })
  );
  writeFileSync(
    `${__dirname}/responseLegacy.json`,
    JSON.stringify(responseLegacy, null, 2)
  );

  const responseNew = await chatGroq.invoke(
    await promptTemplateNew.format({ msgs })
  );
  writeFileSync(
    `${__dirname}/responseNew.json`,
    JSON.stringify(responseNew, null, 2)
  );

  /**
   * Creates a sequence of runnable tasks from the provided array of tasks.
   * The sequence includes the following tasks:
   * - `alternativePromptTemplate`: A task that generates an alternative prompt template.
   * - `chatGroq`: A task that processes the chat input using Groq.
   * - `parser`: A task that parses the response.
   *
   * @constant {RunnableSequence} responseFromChain - The sequence of runnable tasks.
   */
  const responseFromChain = RunnableSequence.from([
    alternativePromptTemplate,
    chatGroq,
    parser,
  ]);
  const result = await responseFromChain.invoke({
    language: "español",
    input: "Hello, world!",
  });
  writeFileSync(
    `${__dirname}/responseFromChain.json`,
    JSON.stringify(result, null, 2)
  );
};

main().catch(console.error);

/* 
In summary, `PromptTemplate` is ideal for simpler, direct prompts, while
`ChatPromptTemplate` is designed for more complex interactions that require
maintaining dialogue history.
*/
