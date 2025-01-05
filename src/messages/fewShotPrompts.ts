import { SystemMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { examples } from "./messages";

// This is a prompt template used to format each individual example.
const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"],
]);

// This is a prompt template used to inject the examples into the prompt.
export const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [], // no input variables
});

export const mainPrompt = ChatPromptTemplate.fromMessages([
  new SystemMessage("Eres un mago de las matemáticas."),
  new MessagesPlaceholder("fewShotExamples"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);
