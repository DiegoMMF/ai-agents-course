import dotenv from "dotenv";
import { model } from "./model/model";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { trimmer } from "./messages/trimOptions";
import { dummyGetSessionHistory, store } from "./messages/inMemoryChatHIstory";
import { MessagesPlaceholder } from "@langchain/core/prompts";

dotenv.config();

const chain = trimmer.pipe(model);

const sessionId = "myCurrentSession";

const chatHistory = dummyGetSessionHistory(sessionId);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistory,
});

// Continuar con lo de abajo...

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   new SystemMessage("You're a good assistant."),
//   new MessagesPlaceholder("history"),
//   new HumanMessage("What is my name?"),
// ]);

const main = async () => {
  await chatHistory.addMessages([
    new HumanMessage("Hello, how are you? My name is Diego"),
    new AIMessage("Hi. I'm here and ready to help you. How can I assist you today?"),
  ]);

  const result = await chainWithHistory.invoke(
    [new HumanMessage("What is my name?")],
    { configurable: { sessionId } }
  );

  const result2 = await chainWithHistory.invoke(
    [new HumanMessage("What is my name?")],
    { configurable: { sessionId: "anotherSession" } }
  );

  console.log({
    firstResponse: result.content,
    firstChatHistory: store[sessionId],
    secondResponse: result2.content,
    secondChatHistory: store["anotherSession"],
  });
};

main().catch(console.error);

/* Terminal output:


*/
