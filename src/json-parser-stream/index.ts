import { chatGroq } from "../models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { writeFileSync } from "fs";

const template = `Return a JSON object with a single key named "answer" that answers 
the following question: {question}. Do not wrap the JSON output in markdown blocks.`;

const jsonPrompt = ChatPromptTemplate.fromTemplate(template);
const jsonParser = new JsonOutputParser();
const jsonChain = jsonPrompt.pipe(chatGroq).pipe(jsonParser);

const main = async () => {
  const stream = await jsonChain.stream({
    question: "Who invented the microscope?",
  });

  for await (const chunk of stream) {
    // Write the output to a response.json file after newline without overwriting it.
    writeFileSync(
      `${__dirname}/response.txt`,
      JSON.stringify(chunk, null, 2) + "\n",
      { flag: "a" }
    );
  }
};

main().catch(console.error);
