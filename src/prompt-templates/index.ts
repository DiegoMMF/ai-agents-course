import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { msgs } from "../messages/messages";
import { chatGroq } from "../models";
import { writeFileSync } from "fs";

const promptTemplateLegacy = PromptTemplate.fromTemplate("Haz un chiste de {topic}");
// This method is designed for traditional language models that process 
// single prompts. It creates a prompt template that formats user input into a single 
// string, making it suitable for straightforward queries where context is limited to 
// the current input.

const promptTemplateNew = ChatPromptTemplate.fromMessages([
  new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  ),
  new MessagesPlaceholder("msgs"),
]);
// This method is tailored for chat-based models that require handling multiple 
// messages in a conversation. It organizes inputs into a structured list of messages
// allowing for more interactive and conversational exchanges.

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

/* 
In summary, `PromptTemplate` is ideal for simpler, direct prompts, while
`ChatPromptTemplate` is designed for more complex interactions that require
maintaining dialogue history.
*/