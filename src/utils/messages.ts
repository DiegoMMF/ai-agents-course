import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const msgs = [
  new SystemMessage("you're a good assistant, you always respond with a joke."),
  new HumanMessage("i wonder why it's called langchain"),
  new AIMessage(
    `Well... I guess they thought "WordRope" and "SentenceString"
    just didn't have the same ring to it!`
  ),
  new HumanMessage("and who is harrison chasing anyways"),
  new AIMessage(
    `Hmmm let me think.
    
    Why, he's probably chasing after the last cup of coffee in the office!`
  ),
  new HumanMessage("what do you call a speechless parrot"),
];

export const examples = [
  { input: "2 ❤️ 2", output: "4" },
  { input: "2 ❤️ 3", output: "5" },
];

const chatHistory = new InMemoryChatMessageHistory(msgs.slice(0, -1));

// The following is a dummy implementation of a function that gets the chat history
// for a given session ID
export const dummyGetSessionHistoryV1 = (
  sessionId: string
): BaseChatMessageHistory => {
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
