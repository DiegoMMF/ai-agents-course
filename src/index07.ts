import {
  FewShotChatMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import dotenv from "dotenv";
import { SystemMessage } from "@langchain/core/messages";
import { chatGroq } from "./models";

dotenv.config();

// These are the examples that will be used to generate the response.
const examples = [
  { input: "2 ❤️ 2", output: "4" },
  { input: "2 ❤️ 3", output: "5" },
];

// This is a prompt template used to format each individual example.
const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"],
]);

// This is a prompt template used to inject the examples into the prompt.
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [], // no input variables
});

const mainPrompt = ChatPromptTemplate.fromMessages([
  new SystemMessage("Eres un mago de las matemáticas."),
  new MessagesPlaceholder("fewShotExamples"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const main = async () => {
  const chain = mainPrompt.pipe(chatGroq);
  // (o también: const chain = RunnableSequence.from([mainPrompt, model]); ...que es lo mismo.)
  const result = await chain.invoke({
    input: "2 ❤️ 4",
    fewShotExamples: await fewShotPrompt.formatMessages({}),
  });
  console.log(result.content);
};

main().catch(console.error);

/*
Terminal output:

6

La operación que estoy realizando se llama "suma". Consiste en combinar dos números (o expresiones matemáticas) para obtener una cantidad total. En este caso, estoy sumando 2 y el número que sigue al corazón (3, 4, etc.). El resultado es el número que aparece después del símbolo "=".
*/
