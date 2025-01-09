import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { writeFileSync } from "fs";

let counter = 1;

export const saveOutput = (path: string, data: any) => {
  writeFileSync(
    `./src/rag/output/response_${counter}_${path}.json`,
    JSON.stringify(data, null, 2)
  );
  counter++;
};

const store: Record<string, InMemoryChatMessageHistory> = {};

export const getMessageHistory = (sessionId: string): BaseChatMessageHistory => {
  if (!Object.keys(store).includes(sessionId)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
};
