import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage, trimMessages } from "@langchain/core/messages";
import { messages } from "./messages/messages";
// import { trimOptions } from "./messages/trimOptions";
import dotenv from "dotenv";
import { chatGroq } from "./model/model";

dotenv.config();

// Prompt template (simple and old way)
// const promptTemplate = PromptTemplate.fromTemplate("Dime un chiste sobre {topic}");

// Chat prompt template (with system message and messages placeholder)
const promptTemplate = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  ),
  // messages placeholder to inject the messages afterwards
  new MessagesPlaceholder("msgs"),
]);

const main = async () => {
  // const trimmedMessages = await trimMessages(messages, trimOptions);
  // const response = await llm.invoke(trimmedMessages);

  // const response = await model.invoke(
  //   await promptTemplate.format({ topic: "machine learning" })
  // );

  const response = await chatGroq.invoke(
    await promptTemplate.format({ msgs: messages })
  );
  console.log(response.content);
};

main().catch(console.error);

/*
Terminal output:

Por supuesto, aquí te ayudo a organizar tus tareas para hoy:

1. **Mañana**
   - 7:00 - 8:00: Desayuna y prepárate para hacer ejercicio.
   - 8:00 - 9:00: Realiza tu rutina de ejercicios.
   - 9:00 - 10:00: Dúchate, viste y prepárate para revisar los correos electrónicos.
   - 10:00 - 12:00: Revisa y responde tus emails.

2. **Mediodía**
   - 12:00 - 13:00: Prepara el almuerzo.
   - 13:00 - 14:00: Disfruta de tu almuerzo.

Esta es una organización básica de tu tiempo. Por supuesto, siempre puedes ajustarla según tus necesidades y prioridades. ¡Que tengas un gran día!
*/
