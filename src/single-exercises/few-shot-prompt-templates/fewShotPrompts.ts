import { SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { examples } from "../../utils/messages";

/**
 * A template for creating chat prompts with predefined messages.
 * 
 * This example uses the `ChatPromptTemplate` to create a prompt with
 * a human input and an AI output. The placeholders `{input}` and
 * `{output}` are used to dynamically insert the respective values
 * during the prompt generation.
 * 
 * @example
 * const examplePrompt = ChatPromptTemplate.fromMessages([
 *   ["human", "{input}"],
 *   ["ai", "{output}"],
 * ]);
 */
const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"], // See note below
  ["ai", "{output}"],   // See note below
]);

/**
 * Creates a new instance of FewShotChatMessagePromptTemplate with the provided
 * example prompt and examples. (To inject the examples into the prompt.)
 *
 * @constant
 * @type {FewShotChatMessagePromptTemplate}
 * @param {PromptTemplate} examplePrompt - The template for the example prompt.
 * @param {Array<Example>} examples - An array of example objects to be used in the prompt.
 * @param {Array<string>} inputVariables - An array of input variable names.
 */
export const fewShotPrompt: FewShotChatMessagePromptTemplate =
  new FewShotChatMessagePromptTemplate({
    examplePrompt,
    examples,
    inputVariables: [],
  });

/**
 * The `mainPrompt` constant is a ChatPromptTemplate that constructs a prompt for a
 * chatbot. It includes a system message indicating that the chatbot is a math wizard,
 * a placeholder for few-shot examples, and a template for human messages that will
 * be filled with user input.
 *
 * @constant
 * @type {ChatPromptTemplate}
 */
export const mainPrompt: ChatPromptTemplate = ChatPromptTemplate.fromMessages([
  new SystemMessage("Eres un mago de las matemáticas."),
  new MessagesPlaceholder("fewShotExamples"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

/*
NOTE: When considering best practices for using `ChatPromptTemplate.fromMessages()` 
in LangChain, is generally preferred:
* new HumanMessage("{input}") over ["human", "{input}"]
and 
* new AIMessage("{output}") over ["ai", "{output}"]
but the choice may depend on the specific requirements of your implementation.

Reasons for Preference:
1.	Clarity and Structure: Using `new HumanMessage()` and `new AIMessage()` 
  provides a clear structure that explicitly defines the message types. This enhances 
  readability and ensures that the roles of each message are well understood, which 
  is crucial for maintaining clarity in chat interactions.
2.	Type Safety: Instantiating message objects (like `HumanMessage` and `AIMessage`)
  can offer better type safety and validation, reducing the risk of errors that might 
  occur when using plain strings with roles.
3.	Integration with LangChain Features: The use of message classes allows for better
  integration with other LangChain features, such as message formatting and 
  processing. This can lead to more robust handling of messages in complex 
  applications.
4.	Future Compatibility: As LangChain evolves, using structured message objects may 
  be more compatible with future updates or features within the framework, ensuring 
  that your implementation remains up-to-date and functional.
*/

