import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import { writeFileSync } from "fs";
import { examples } from "../messages/messages";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

// This is a prompt template used to format each individual example.
const examplePrompt = ChatPromptTemplate.fromMessages([
  new HumanMessage("{input}"), // ["human", "{input}"], <- See the note below.
  new AIMessage("{output}"), // ["ai", "{output}"], <- See the note below.
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
const fewShotPrompt: FewShotChatMessagePromptTemplate =
  new FewShotChatMessagePromptTemplate({
    examplePrompt,
    examples,
    inputVariables: [],
  });

const main = async () => {
  // This is the final prompt that will be used to generate the response.
  const response = await fewShotPrompt.invoke({});

  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
  writeFileSync(
    `${__dirname}/responseToChatMessages.json`,
    JSON.stringify(response.toChatMessages(), null, 2)
  );
};

main().catch(console.error);

/*
NOTE: When considering best practices for using `ChatPromptTemplate.fromMessages()` 
in LangChain, first option is generally preferred:

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
