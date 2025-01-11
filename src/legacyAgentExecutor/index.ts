import { saveOutput } from "../rag/utils";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { llm } from "./config";
import { tvly } from "./tvly";
import { retrieverTool } from "./retriever";
import { AgentExecutor } from "langchain/agents";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const store: Record<string, BaseChatMessageHistory> = {};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. You can respond directly to the user or use tools when needed. For general conversation, respond directly.",
  ],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = async () => {
  const agent = createToolCallingAgent({
    llm,
    tools: [tvly, retrieverTool],
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: [tvly, retrieverTool],
  });

  //   const greetings = await agentExecutor.invoke({ input: "Hi!" });
  //   saveOutput("greetings", greetings, "./src/legacyAgentExecutor/output/");

  //   const langsmithHelp = await agentExecutor.invoke({
  //     input: "how can langsmith help with testing?",
  //   });
  //   saveOutput("langsmithHelp", langsmithHelp, "./src/legacyAgentExecutor/output/");

  //   const weather = await agentExecutor.invoke({ input: "whats the weather in sf?" });
  //   saveOutput("weather", weather, "./src/legacyAgentExecutor/output/");

  // Here we pass in an empty list of messages for chat_history because it is the first message in the chat
  //   const agentWithoutMemory = await agentExecutor.invoke({
  //     input: "hi! my name is bob",
  //     chat_history: [],
  //   });
  //   saveOutput(
  //     "agentWithoutMemory",
  //     agentWithoutMemory,
  //     "./src/legacyAgentExecutor/output/"
  //   );

  // Here we pass in the chat_history as the previous messages in the chat
  //   const agentWithMemory = await agentExecutor.invoke({
  //     chat_history: [
  //       { role: "user", content: "hi! my name is bob" },
  //       { role: "assistant", content: "Hello Bob! How can I assist you today?" },
  //     ],
  //     input: "what's my name?",
  //   });
  //   saveOutput(
  //     "agentWithMemory",
  //     agentWithMemory,
  //     "./src/legacyAgentExecutor/output/"
  //   );

  // If we want to keep track of these messages automatically, we can wrap this in a RunnableWithMessageHistory.
  const agentWithChatHistory = new RunnableWithMessageHistory({
    runnable: agentExecutor,
    getMessageHistory: (sessionId: string): BaseChatMessageHistory =>
      store[sessionId] ?? (store[sessionId] = new ChatMessageHistory()),

    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
  });

  const memoryAgentResponse = await agentWithChatHistory.invoke(
    { input: "hi! I'm bob" },
    { configurable: { sessionId: "mamma" } }
  );
  saveOutput(
    "memoryAgentResponse",
    memoryAgentResponse,
    "./src/legacyAgentExecutor/output/"
  );

  const agentWithMemory = await agentExecutor.invoke({
    input: "what's my name?",
    chat_history: [
      { role: "user", content: "hi! my name is bob" },
      { role: "assistant", content: "Hello Bob! How can I assist you today?" },
    ],
  });
  saveOutput("agentWithMemory", agentWithMemory, "./src/legacyAgentExecutor/output/");
};

agent();
