import { chatGroq } from "../models/models";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { trimmer } from "../messages/trimOptions";
import {
  dummyGetSessionHistoryV2 as getMessageHistory,
  store,
} from "../messages/inMemoryChatMessageHistory";
import { writeFileSync } from "fs";

const runnable = trimmer.pipe(chatGroq);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory,
});

// Continuar con lo de abajo...

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   new SystemMessage("You're a good assistant."),
//   new MessagesPlaceholder("history"),
//   new HumanMessage("What is my name?"),
// ]);

const main = async () => {
  // Case: No chat history
  const loneResult = await chainWithHistory.invoke(
    [new HumanMessage("Hello, how are you?")],
    { configurable: { sessionId: "1" } }
  );
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(loneResult, null, 2));

  // Case: Chat history exists
  const sessionId = "myCurrentSession";
  const chatHistory = getMessageHistory(sessionId);

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

  const responses = {
    firstResponse: result.content,
    firstChatHistory: store[sessionId],
    secondResponse: result2.content,
    secondChatHistory: store["anotherSession"],
  };
  writeFileSync(`${__dirname}/responses.json`, JSON.stringify(responses, null, 2));
};

main().catch(console.error);
