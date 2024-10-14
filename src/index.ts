import dotenv from "dotenv";
import { model } from "./model/model";
import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, trimMessages } from "@langchain/core/messages";
import { trimmer } from "./messages/trimOptions";

dotenv.config();

const store: Record<string, InMemoryChatMessageHistory> = {};

const dummyGetSessionHistory = (sessionId: string): BaseChatMessageHistory => {
  if (!Object.keys(store).includes(sessionId)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
};

const chain = trimmer.pipe(model);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistory,
});

const main = async () => {
  const sessionId = "myCurrentSession";

  const chatHistory = dummyGetSessionHistory(sessionId);

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
