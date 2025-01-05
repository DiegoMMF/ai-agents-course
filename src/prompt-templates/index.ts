import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { msgs } from "../messages/messages";
import { chatGroq } from "../models";
import { writeFileSync } from "fs";

// Prompt template (simple and old way)
const promptTemplateLegacy = PromptTemplate.fromTemplate("Haz un chiste de {topic}");

// Chat prompt template (with system message and messages placeholder)
const promptTemplateNew = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  ),
  new MessagesPlaceholder("msgs"),
]);

const main = async () => {
  const responseLegacy = await chatGroq.invoke(
    await promptTemplateLegacy.format({ topic: "machine learning" })
  );
  writeFileSync(
    `${__dirname}/responseLegacy.json`,
    JSON.stringify(responseLegacy, null, 2)
  );

  const responseNew = await chatGroq.invoke(
    await promptTemplateNew.format({ msgs })
  );
  writeFileSync(
    `${__dirname}/responseNew.json`,
    JSON.stringify(responseNew, null, 2)
  );
};

main().catch(console.error);
