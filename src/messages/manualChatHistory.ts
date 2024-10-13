import { BaseMessage, SystemMessage } from "@langchain/core/messages";

// Historial de la conversación
const chatHistory: BaseMessage[] = [];

// Si no hay historial, se añade un mensaje de sistema
if (!chatHistory.length) {
  chatHistory.push(new SystemMessage("Eres un asistente útil de IA"));
}

export { chatHistory };