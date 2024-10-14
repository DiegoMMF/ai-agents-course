import dotenv from "dotenv";
import { model } from "./model/model";
import {
  BaseChatMessageHistory,
  InMemoryChatMessageHistory,
} from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, trimMessages } from "@langchain/core/messages";

dotenv.config();

const store: Record<string, InMemoryChatMessageHistory> = {};

const dummyGetSessionHistory = (sessionId: string): BaseChatMessageHistory => {
  if (!Object.keys(store).includes(sessionId)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
};

const trimmer = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: model.getNumTokens,
  includeSystem: true,
});

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

{
  firstResponse: "You mentioned earlier that your name is Diego. Is there something else you would like to ask or talk about? I'm here to help.",
  firstChatHistory: InMemoryChatMessageHistory {
    lc_serializable: false,
    lc_kwargs: {},
    lc_namespace: [ 'langchain', 'stores', 'message', 'in_memory' ],
    messages: [
      HumanMessage {
        "content": "Hello, how are you? My name is Diego",
        "additional_kwargs": {},
        "response_metadata": {}
      },
      AIMessage {
        "content": "Hi. I'm here and ready to help you. How can I assist you today?",
        "additional_kwargs": {},
        "response_metadata": {},
        "tool_calls": [],
        "invalid_tool_calls": []
      },
      HumanMessage {
        "content": "Hello, how are you? My name is Diego",
        "additional_kwargs": {},
        "response_metadata": {}
      },
      AIMessage {
        "id": "run-e17e4724-1979-43ba-a32f-8856a34221ca",
        "content": "You mentioned earlier that your name is Diego. Is there something else you would like to ask or talk about? I'm here to help.",
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 30,
            "promptTokens": 50,
            "totalTokens": 80
          },
          "finish_reason": "stop"
        },
        "tool_calls": [],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "input_tokens": 50,
          "output_tokens": 30,
          "total_tokens": 80
        }
      }
    ]
  },
  secondResponse: "I don't have the ability to know your name unless you tell me. I can only provide information and answer questions to the best of my knowledge based on the data I have been trained on.",
  secondChatHistory: InMemoryChatMessageHistory {
    lc_serializable: false,
    lc_kwargs: {},
    lc_namespace: [ 'langchain', 'stores', 'message', 'in_memory' ],
    messages: [
      HumanMessage {
        "content": "What is my name?",
        "additional_kwargs": {},
        "response_metadata": {}
      },
      AIMessage {
        "id": "run-a3024697-f931-468a-a822-877117a7690e",
        "content": "I don't have the ability to know your name unless you tell me. I can only provide information and answer questions to the best of my knowledge based on the data I have been trained on.",
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "completionTokens": 41,
            "promptTokens": 13,
            "totalTokens": 54
          },
          "finish_reason": "stop"
        },
        "tool_calls": [],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "input_tokens": 13,
          "output_tokens": 41,
          "total_tokens": 54
        }
      }
    ]
  }
}
*/
