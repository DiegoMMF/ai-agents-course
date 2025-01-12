import { z } from "zod";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { tool } from "@langchain/core/tools";
import { cheerioLoader } from "../../utils/loaders";
import { textSplitter } from "../../utils/splitters";
import { fireworksEmbeddings } from "../../utils/embeddings";
// import { saveOutput } from "../rag/utils";

const vectorStoreAsRetriever = async () => {
  const loadedDocs = await cheerioLoader.load();
  // saveOutput("loadedDocs", loadedDocs[0], "./src/legacyAgentExecutor/output/");

  const splittedDocs = await textSplitter.splitDocuments(loadedDocs);
  // saveOutput("splittedDocs", splittedDocs, "./src/legacyAgentExecutor/output/");

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splittedDocs,
    fireworksEmbeddings
  );
  // saveOutput("vectorStore", vectorStore, "./src/legacyAgentExecutor/output/");
  return vectorStore.asRetriever();
};

// * Testing our vector store as retriever:

/* vectorStoreAsRetriever()
  .then((retriever) => retriever.invoke("How to upload a dataset?"))
  .then((retrieverResult) =>
    saveOutput(
      "retrieverResult",
      retrieverResult[0],
      "./src/legacyAgentExecutor/output/"
    )
  ); */

export const retrieverTool = tool(
  async ({ input }, config) => {
    const retriever = await vectorStoreAsRetriever();
    const docs = await retriever.invoke(input, config);
    return docs.map((doc: { pageContent: string }) => doc.pageContent).join("\n\n");
  },
  {
    name: "langsmith_search",
    description:
      "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
    schema: z.object({
      input: z.string(),
    }),
  }
);
