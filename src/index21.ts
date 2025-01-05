import dotenv from "dotenv";
import { chatGroq } from "./model/model";
import { messages } from "./messages/messages";
import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, trimMessages } from "@langchain/core/messages";

dotenv.config();

const chatHistory = new InMemoryChatMessageHistory(messages.slice(0, -1));

// The following is a dummy implementation of a function that gets the chat history for a given session ID
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
  console.log(result);
};

main().catch(console.error);

/* Terminal output:

AIMessage {
  "id": "run-0ddc0a55-e266-4d62-a718-fbe5b867ffe5",
  "content": "Hello there! I'm just an AI, so I don't have feelings, but I'm here and ready to help you. How can I assist you today?",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "completionTokens": 37,
      "promptTokens": 122,
      "totalTokens": 159
    },
    "finish_reason": "stop"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 122,
    "output_tokens": 37,
    "total_tokens": 159
  }
}
*/
