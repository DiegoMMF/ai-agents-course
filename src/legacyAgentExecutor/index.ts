import { saveOutput } from "../rag/utils";
import { retrieverTool } from "./retriever";
import { tvly } from "./tvly";

// tvly
//   .invoke("what is the weather in SF")
//   .then((searchResult) =>
//     saveOutput("tvly", searchResult, "./src/legacyAgentExecutor/output/")
//   );

retrieverTool
  .invoke({ input: "How do I install LangSmith?" })
  .then((retrieverResult) =>
    saveOutput("retrieverTool", retrieverResult, "./src/legacyAgentExecutor/output/")
  );
