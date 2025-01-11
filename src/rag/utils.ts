import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { writeFileSync } from "fs";

let counter = 1;

export const saveOutput = (
  path: string,
  data: string | object,
  rootPath: string = "./src/rag/output/"
) => {
  writeFileSync(
    `${rootPath}response_${counter}_${path}.json`,
    typeof data === "object" ? JSON.stringify(data, null, 2) : data
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
