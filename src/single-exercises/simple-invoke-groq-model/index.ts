import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { chatGroq } from "../../models/models";
import { writeFileSync } from "fs";

const chatOne = async () => {
  const systemMessage = new SystemMessage(
    "Eres un profesor de programación que explica de manera sencilla y clara."
  );

  const humanMessage = new HumanMessage(
    "Qué hace el paquete de Node.js llamado: @xenova/transformers?"
  );

  const response = await chatGroq.invoke([systemMessage, humanMessage]);

  writeFileSync(`${__dirname}/response1.json`, JSON.stringify(response, null, 2));
};

const chatTwo = async () => {
  const systemMessage = new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  );

  const humanMessage = new HumanMessage(
    "Puedes ayudarme a organizar las tareas de la día?"
  );

  const assistantMessage = new AIMessage(
    "Claro, puedo ayudarte a organizar tus tareas. ¿Cuáles son las tareas que tienes para hoy?"
  );

  const humanMessage2 = new HumanMessage(
    "Tengo que hacer ejercicio, revisar los emails y preparar el almuerzo."
  );

  const response = await chatGroq.invoke([
    systemMessage,
    humanMessage,
    assistantMessage,
    humanMessage2,
  ]);

  writeFileSync(`${__dirname}/response2.json`, JSON.stringify(response, null, 2));
};

chatOne().catch(console.error);
chatTwo().catch(console.error);
