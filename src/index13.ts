import dotenv from "dotenv";
import { chatGroq } from "./model/model";
import { HumanMessage } from "@langchain/core/messages";
import { getUserInput } from "./consoleInput/getUserInput";
import { chatHistory } from "./messages/manualChatHistory";

dotenv.config();

const main = async () => {
  // Obtención de la consulta del usuario
  const query = await new Promise<string>(getUserInput);
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
