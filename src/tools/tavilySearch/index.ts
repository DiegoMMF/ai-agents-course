import dotenv from "dotenv";
dotenv.config();

import { saveOutput } from "../../rag/utils";
import { StructuredTool, tool } from "@langchain/core/tools";
import { AIMessageChunk, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableConfig, RunnableLambda } from "@langchain/core/runnables";
import { chatGroq } from "../../utils/models";
import { tvly } from "./tvly";

const main = async () => {
  // * We can invoke dirrectly with args:
  // const directSearchResult = await tvly.invoke(
  //   "Are there alternatives to Fireworks Embeddings?"
  // );
  // saveOutput("directSearchResult", directSearchResult, "./src/agents/output/");

  // * Through one argument:
  // const inputArgumentResult = await tvly.invoke({
  //   input: "Are there alternatives to LangChain?",
  // });
  // saveOutput("inputArgumentResult", inputArgumentResult, "./src/agents/output/");

  // * Or we can invoke the tool with a model-generated ToolCall
  // const mockedModelGeneratedToolCall = {
  //   name: tvly.name,
  //   args: { input: "Are there alternatives to Groq?" },
  //   id: "1",
  //   type: "tool_call",
  // };
  // const toolCallResult = await tvly.invoke(
  //   mockedModelGeneratedToolCall
  // );
  // saveOutput("toolCallResult", toolCallResult, "./src/agents/output/");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. You have access to the following tools: {tool_names}. {tools}",
    ],
    ["placeholder", "{messages}"],
  ]);

  const modelWithTools = chatGroq.bindTools([tvly]);
  const chain = prompt.pipe(modelWithTools);

  const processUserInput = async (
    userInput: string,
    config: Partial<RunnableConfig<Record<string, any>>> | undefined
  ): Promise<AIMessageChunk> => {
    const humanMessage: HumanMessage = new HumanMessage(userInput);
    const aiMsg: AIMessageChunk = await chain.invoke(
      { messages: [humanMessage] },
      config
    );
    const toolMsgs: ToolMessage[] = await tvly.batch(
      aiMsg.tool_calls || [],
      config
    );
    return chain.invoke({ messages: [humanMessage, aiMsg, ...toolMsgs] }, config);
  };

  const toolChain = RunnableLambda.from(processUserInput);

  // * We could also create a tool from the TavilySearchResults class
  const tavilySearchTool: StructuredTool = tool(tvly.invoke, {
    name: "tavily_search",
    description: "Search the web for information",
  });
  console.log("typeof tavilySearchTool: ", typeof tavilySearchTool);

  const toolChainResult = await toolChain.invoke(
    "what is the current weather in sf?"
  );
  saveOutput("toolChainResult", toolChainResult, "./src/agents/output/");
};

main();
