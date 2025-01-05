import dotenv from "dotenv";
import { chatGroq } from "./models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const jokeQuery = "Dime un chiste";

const parser = new JsonOutputParser();

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

const chain = promptWithParser.pipe(chatGroq).pipe(parser);

const main = async () => {
  const result = await chain.invoke({ query: jokeQuery });
  console.log(result);
};

main().catch(console.error);

/* Terminal output:

{
  chiste: '¿Por qué no se invita a Tetris a las fiestas? Porque siempre pone líneas.',
  explicacion: 'Este chiste es gracioso porque hace una analogía entre el juego Tetris y las fiestas. En Tetris, el objetivo es encajar piezas geométricas llamadas tetrominós para crear líneas completas y eliminarlas. La broma está en que, si Tetris fuera una persona, siempre estaría creando líneas y posiblemente arruinaría la diversión en una fiesta, donde las líneas no son deseables.'
}
*/
