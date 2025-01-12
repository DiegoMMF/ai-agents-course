import { saveOutput } from "../rag/utils";
import { chatGroq } from "../utils/models";
import { retrieverTool } from "./retriever";
import { tvly } from "./tvly";

tvly
  .invoke("what is the weather in SF")
  .then((searchResult) =>
    saveOutput("tvly", searchResult, "./src/legacyAgentExecutor/output/")
  );

retrieverTool
  .invoke({ input: "How do I install LangSmith?" })
  .then((retrieverResult) =>
    saveOutput("retrieverTool", retrieverResult, "./src/legacyAgentExecutor/output/")
  );

// We could simply use the runnableModelWithTools to run an agent without memory
const runnableModelWithTools = chatGroq.bindTools([tvly, retrieverTool]);
saveOutput(
  "runnableModelWithTools",
  runnableModelWithTools,
  "./src/legacyAgentExecutor/output/"
);

// Greetings:
runnableModelWithTools
  .invoke([
    {
      role: "system",
      content:
        "You can respond directly to the user or use tools when needed. For general conversation, respond directly.",
    },
    { role: "user", content: "Hi!" },
  ])
  .then((greetings) =>
    saveOutput("greetings", greetings, "./src/legacyAgentExecutor/output/")
  );

// Search
runnableModelWithTools
  .invoke([{ role: "user", content: "What is the weather in SF?" }])
  .then((searchResult) =>
    saveOutput("searchResult", searchResult, "./src/legacyAgentExecutor/output/")
  );

// Retriever:
runnableModelWithTools
  .invoke([{ role: "user", content: "How do I install LangSmith?" }])
  .then((retrieverResult) =>
    saveOutput(
      "retrieverResult",
      retrieverResult,
      "./src/legacyAgentExecutor/output/"
    )
  );
