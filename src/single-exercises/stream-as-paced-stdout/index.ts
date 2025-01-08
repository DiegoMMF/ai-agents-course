import { chatGroq } from "../../models/models";
import { PromptTemplate } from "@langchain/core/prompts";

const query = "Dime un chiste en menos de 50 palabras";

// Crear el template de prompt
const promptWithParser = new PromptTemplate({
  template: "Responde la solicitud del usuario: {query}",
  inputVariables: ["query"],
});

// Función para simular escritura lenta en consola
const writeSlowly = async (text: string) => {
  for (const char of text) {
    process.stdout.write(char);
    await new Promise((resolve) => setTimeout(resolve, 70));
  }
};

// Función principal
const main = async () => {
  try {
    // Generar el prompt con la consulta
    const formattedPrompt = await promptWithParser.format({ query });

    // Llamar al modelo chatGroq
    const result = await chatGroq.stream(formattedPrompt);

    // Iterar sobre el stream para mostrar el contenido
    for await (const chunk of result) {
      if (chunk.content) {
        await writeSlowly(chunk.content as string);
      }
    }

    console.log(); // Nueva línea al final
  } catch (error) {
    console.error("Error:", error);
  }
};

// Ejecutar la función principal
main();
