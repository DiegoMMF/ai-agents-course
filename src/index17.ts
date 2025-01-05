
import { chatGroq } from "./models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";


const query = "Dime un chiste en menos de 50 palabras";

// const parser = new JsonOutputParser();

const promptWithParser = new PromptTemplate({
  template: "Responde la solicitud del usuario: {query}",
  inputVariables: ["query"],
});

const chain = promptWithParser.pipe(chatGroq); //.pipe(parser);

const writeSlowly = async (text: string) => {
  for (const char of text) {
    process.stdout.write(char);
    await new Promise((resolve) => setTimeout(resolve, 70));
  }
};

const main = async () => {
  const result = await chain.stream({ query });

  for await (const chunk of result) {
    if (chunk.content) {
      await writeSlowly(chunk.content as string);
    }
  }
  console.log();
};

main().catch(console.error);

/* Terminal output:

Por qué el pollo siempre cruza la calle? Porque allí está el otro lado.
¡Un clásico de siempre, en menos de 30 palabras!
*/
