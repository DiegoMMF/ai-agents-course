import { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { saveOutput } from "../../rag/utils";
import {
  createReactAgent,
  AgentExecutor,
  AgentRunnableSequence,
  AgentStep,
  AgentFinish,
  AgentAction,
} from "langchain/agents";
import { chatGroq as llm } from "../../utils/models";
import { tvly } from "../../tools/tavilySearch/tvly";

const main = async () => {
  const prompt: ChatPromptTemplate = await pull<ChatPromptTemplate>(
    "hwchase17/openai-functions-agent"
  );
  saveOutput("prompt", prompt, "./src/tools/memoryAgent/output/");

  const agent: AgentRunnableSequence<
    { steps: AgentStep[] },
    AgentAction | AgentFinish
  > = await createReactAgent({ llm, prompt, tools: [tvly]});

  const executor = new AgentExecutor({
    agent,
    tools: [tvly],
  });

  const result = await executor.invoke({
    input: "Hi, I'm a human.",
    verbose: true,
  });
  saveOutput("result", result, "./src/tools/memoryAgent/output/");
};

main();
