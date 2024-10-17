import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";

export const store: Record<string, InMemoryChatMessageHistory> = {};

export const dummyGetSessionHistory = (
  sessionId: string
): BaseChatMessageHistory => {
  if (!Object.keys(store).includes(sessionId)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
};
