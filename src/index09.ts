
import { chatGroq } from "./models";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";


const promptTemplate = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate("Traduce al {language} lo siguiente:"),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
]);

const parser = new StringOutputParser();

const main = async () => {
  const chain = RunnableSequence.from([promptTemplate, chatGroq, parser]);
  const result = await chain.invoke({
    language: "español",
    input: "Hello, world!",
  });
  console.log(result);
};

main().catch(console.error);

/*
Terminal output:

Hola, mundo!
*/
