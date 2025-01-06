import { chatGoogleGenerativeAI, chatGroq } from "../models";
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { writeFileSync } from "fs";
import { getUserInput } from "./getUserInput";

// Historial de la conversación
const chatHistory: BaseMessage[] = [];

// Si no hay historial, se añade un mensaje de sistema
if (!chatHistory.length) {
  chatHistory.push(new SystemMessage("Eres un asistente útil de IA"));
}

const main = async () => {
  // Obtención de la consulta del usuario
  const query = await new Promise<string>(getUserInput);
  chatHistory.push(new HumanMessage(query));

  // Invocación del modelo
  // const responseFromGroq = await chatGroq.invoke(chatHistory);
  // chatHistory.push(responseFromGroq);

  const responseFromGoogle = await chatGoogleGenerativeAI.invoke(chatHistory);
  chatHistory.push(responseFromGoogle);

  // Impresión de la respuesta
  for (const message of chatHistory) {
    writeFileSync(
      `${__dirname}/response.json`,
      JSON.stringify(message.content, null, 2) + "\n",
      {
        flag: "a",
      }
    );
  }
};

main().catch(console.error);
