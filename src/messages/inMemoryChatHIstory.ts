import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { msgs } from "./messages";

const chatHistory = new InMemoryChatMessageHistory(msgs.slice(0, -1));

// The following is a dummy implementation of a function that gets the chat history 
// for a given session ID
export const dummyGetSessionHistoryV1 = (sessionId: string): BaseChatMessageHistory => {
  if (sessionId !== "1") {
    throw new Error("Session not found");
  }
  return chatHistory;
};

export const store: Record<string, InMemoryChatMessageHistory> = {};

export const dummyGetSessionHistoryV2 = (
  sessionId: string
): BaseChatMessageHistory => {
  if (!Object.keys(store).includes(sessionId)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
};
