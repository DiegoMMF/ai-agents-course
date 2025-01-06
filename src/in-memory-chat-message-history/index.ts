
import { chatGroq } from "../models";
import { msgs } from "../messages/messages";
import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, trimMessages } from "@langchain/core/messages";
import { writeFileSync } from "fs";

const chatHistory = new InMemoryChatMessageHistory(msgs.slice(0, -1));

// The following is a dummy implementation of a function that gets the chat history 
// for a given session ID
const dummyGetSessionHistory = (sessionId: string): BaseChatMessageHistory => {
  if (sessionId !== "1") {
    throw new Error("Session not found");
  }
  return chatHistory;
};

// Create a trimmer
const trimmer = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: chatGroq.getNumTokens,
  includeSystem: true,
});

const chain = trimmer.pipe(chatGroq);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistory,
});

const main = async () => {
  const result = await chainWithHistory.invoke(
    [new HumanMessage("Hello, how are you?")],
    { configurable: { sessionId: "1" } }
  );
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(result, null, 2));
};

main().catch(console.error);