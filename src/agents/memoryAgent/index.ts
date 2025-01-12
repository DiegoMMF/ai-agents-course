import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { saveOutput } from "../../rag/utils";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { chatGroq as llm } from "../../utils/models";
import { tvly } from "../../tools/tavilySearch/tvly";

const promptHubUrl = "hwchase17/openai-functions-agent";

const main = async () => {
  const prompt = await pull<ChatPromptTemplate>(promptHubUrl);
  const tools = [tvly];
  const agent = createToolCallingAgent({ llm, prompt, tools });
  const executor = new AgentExecutor({ agent, tools });

  const nameQuery = await executor.invoke({
    input: "My name is Bob. What's my name?",
  });
  saveOutput("nameQuery", nameQuery, "./src/agents/memoryAgent/output/");

  const secondNameQuery = await executor.invoke({
    input: "What's my name?",
  });
  saveOutput("secondNameQuery", secondNameQuery, "./src/agents/memoryAgent/output/");
};

main();
