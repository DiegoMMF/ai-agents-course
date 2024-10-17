import dotenv from "dotenv";
import { model } from "./model/model";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { trimmer } from "./messages/trimOptions";
import { dummyGetSessionHistory, store } from "./messages/inMemoryChatHIstory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

dotenv.config();

const chain = trimmer.pipe(model);

const sessionId = "myCurrentSession";

const chatHistory = dummyGetSessionHistory(sessionId);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistory,
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  new SystemMessage("You're a good assistant."),
  new MessagesPlaceholder("history"),
  new HumanMessage("What is my name?"),
]);

const main = async () => {
  await chatHistory.addMessages([
    new HumanMessage("Hello, how are you? My name is Diego"),
    new AIMessage("Hi. I'm here and ready to help you. How can I assist you today?"),
  ]);

  const result = await chainWithHistory.invoke(
    [new HumanMessage("What is my name?")],
    { configurable: { sessionId } }
  );

  console.log({ resltContent: result.content, chatHistory: store[sessionId] });
};

main().catch(console.error);

/* Terminal output:

{
  resltContent: "You mentioned earlier that your name is Diego. Is there something else you would like to ask or talk about? I'm here to help.",
  chatHistory: InMemoryChatMessageHistory {
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
        "id": "run-88d7d9c9-bce6-4860-8678-91723ebcc046",
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
  }
}
*/
