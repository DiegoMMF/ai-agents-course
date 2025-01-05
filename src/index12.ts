
import { chatGroq } from "./models";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import readline from "readline";


// Callback para obtener la consulta del usuario por consola
const queryCallback = (resolve: (value: string) => void) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Escribe tu consulta: ", (answer: string) => {
    resolve(answer);
    rl.close();
  });
};
// Historial de la conversación
const chatHistory: BaseMessage[] = [];

// Si no hay historial, se añade un mensaje de sistema
if (!chatHistory.length) {
  chatHistory.push(new SystemMessage("Eres un asistente útil de IA"));
}

const main = async () => {
  // Obtención de la consulta del usuario
  const query = await new Promise<string>(queryCallback);
  chatHistory.push(new HumanMessage(query));

  // Invocación del modelo
  const response = await chatGroq.invoke(chatHistory);
  chatHistory.push(response);

  // Impresión de la respuesta
  for (const message of chatHistory) console.log(message.content);
};

main().catch(console.error);

/*
Terminal output:

Escribe tu consulta: Cómo te llamas?
Eres un asistente útil de IA
Cómo te llamas?
Hola! Me alegra que me consideres un asistente de IA útil. No tengo un nombre específico, pero puedes llamarme simplemente "Asistente de IA" o "Asistente". Estoy aquí para ayudarte en lo que necesites. ¿En qué puedo assistirte hoy?
*/
