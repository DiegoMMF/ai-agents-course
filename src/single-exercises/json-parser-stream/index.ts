import { chatGroq } from "../../utils/models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { writeFileSync } from "fs";

const parser = new JsonOutputParser();

const firstTemplate = `Return a JSON object with a single key named "answer" that answers 
the following question: {question}. Do not wrap the JSON output in markdown blocks.`;

const jsonPrompt = ChatPromptTemplate.fromTemplate(firstTemplate);
const jsonChain = jsonPrompt.pipe(chatGroq).pipe(parser);

const jokeQuery = "Dime un chiste";
const promptWithParser = new PromptTemplate({
  template: `
    Responde la solicitud del usuario: {query}

    Tu respuesta DEBE ser un objeto JSON válido con la siguiente estructura:
    {{
      "chiste": "El chiste aquí",
      "explicacion": "Una breve explicación del chiste (opcional)"
    }}

    {formatInstructions}
  `,
  inputVariables: ["query"],
  partialVariables: { formatInstructions: parser.getFormatInstructions() },
});
const pipedChain = promptWithParser.pipe(chatGroq).pipe(parser);

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

  const result = await pipedChain.invoke({ query: jokeQuery });

  writeFileSync(
    `${__dirname}/response.json`,
    JSON.stringify(result, null, 2) + "\n",
    { flag: "a" }
  );
};

main().catch(console.error);
