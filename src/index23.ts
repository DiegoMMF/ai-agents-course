import { chatGroq } from "./models";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { trimmer } from "./messages/trimOptions";
import { dummyGetSessionHistoryV2, store } from "./messages/inMemoryChatMessageHistory";
import { MessagesPlaceholder } from "@langchain/core/prompts";

const chain = trimmer.pipe(chatGroq);

const sessionId = "myCurrentSession";

const chatHistory = dummyGetSessionHistoryV2(sessionId);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: dummyGetSessionHistoryV2,
});

// Continuar con lo de abajo...

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   new SystemMessage("You're a good assistant."),
//   new MessagesPlaceholder("history"),
//   new HumanMessage("What is my name?"),
// ]);

const main = async () => {
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
        "id": "run-e3335a23-fd99-4cd2-97f3-3d99adff4348",
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
        "id": "run-d0a15533-3432-4ad2-8487-79cae4259660",
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
