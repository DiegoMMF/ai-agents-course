import {
  SystemMessage,
  HumanMessage,
  AIMessage,
  BaseMessage,
} from "@langchain/core/messages";

// const systemMessage = new SystemMessage(
//   "Eres un asistente útil."
// );

const humanMessage = new HumanMessage(
  "Puedes ayudarme a organizar las tareas de la día? Tengo que hacer ejercicio, revisar los emails y preparar el almuerzo."
);

export const messages: BaseMessage[] = [
  // systemMessage,
  humanMessage,
];
