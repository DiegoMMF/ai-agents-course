import { chatGroq } from "../models";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { writeFileSync } from "fs";

/**
 * Zod schema for validating the structure of an object containing an answer and its
 * source.
 *
 * @property {string} answer - The answer to the user's question.
 * @property {string} source - The source used to answer the user's question, should
 *                             be a website.
 */
const zodSchema = z.object({
  answer: z.string().describe("answer to the user's question"),
  source: z
    .string()
    .describe("source used to answer the user's question, should be a website."),
});

const parser = StructuredOutputParser.fromZodSchema(zodSchema);

const chain = RunnableSequence.from([
  ChatPromptTemplate.fromTemplate(
    "Answer the users question as best as possible.\n{format_instructions}\n{question}"
  ),
  chatGroq,
  parser,
]);

// Primero, imprimimos las instrucciones de formato
writeFileSync(
  `${__dirname}/responseInstructions.json`,
  JSON.stringify(parser.getFormatInstructions(), null, 2)
);

const main = async () => {
  const response = await chain.invoke({
    question: "What is the capital of France?",
    format_instructions: parser.getFormatInstructions(),
  });

  // Luego, imprimimos la respuesta
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
  JSON.stringify(response, null, 2);
};

main().catch(console.error);