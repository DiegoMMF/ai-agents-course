import { ChatGroq } from "@langchain/groq";
import { BaseMessage, TrimMessagesFields } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { trimMessages } from "@langchain/core/messages";
import { messages } from "./messages/messages";
import dotenv from "dotenv";

dotenv.config();

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

const promptTemplate = PromptTemplate.fromTemplate("Dime un chiste sobre {topic}");

// const trimOptions: TrimMessagesFields = {
//   maxTokens: 1000,
//   strategy: "last",
//   includeSystem: true,
//   tokenCounter: (messages: BaseMessage[]) => {
//     return messages.reduce((acc, message) => acc + message.content.length, 0);
//   },
// };

const main = async () => {
  // const trimmedMessages = await trimMessages(messages, trimOptions);
  // const response = await llm.invoke(trimmedMessages);

  const response = await llm.invoke(
    await promptTemplate.format({ topic: "machine learning" })
  );
  console.log(response.content);
};

main().catch(console.error);

/*
Terminal output:

¿Por qué el modelo de machine learning no quería ir a la fiesta?

Porque no sabía cómo comportarse en un ambiente con tanta variabilidad y ruido. ¡Necesitaba más datos de entrenamiento!
*/
