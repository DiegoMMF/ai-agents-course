import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { fireworksEmbeddings } from "../../utils/embeddings";
import { saveOutput } from "../../rag/utils";
import { tool } from "@langchain/core/tools";
import { tvly } from "../tavilySearch/tvly";
import { chatGroq } from "../../utils/models";
import { VectorStoreRetriever } from "@langchain/core/vectorstores";
import { thirdSplitter } from "../../utils/splitters";
import { faissVectorStore } from "../../utils/vectorStores";
import { cheerioLoader } from "../../utils/loaders";

const main = async () => {
  // Load the documents
  const docs = await cheerioLoader.load();

  // Split the documents into chunks
  const chunks = await thirdSplitter.splitDocuments(docs);

  // Add the chunks to the vector store
  await faissVectorStore.addDocuments(chunks);

  // Query the vector store for testing purposes
  // const similaritySearch = await vectorStore.similaritySearch("What is LangChain?");
  // saveOutput("similaritySearch", similaritySearch, "./src/agents/output/");

  // Create a vector store from the documents and embeddings to use it as a retriever
  const vectorStoreFromDocs: FaissStore = await FaissStore.fromDocuments(
    chunks,
    fireworksEmbeddings
  );

  const retriever: VectorStoreRetriever<any> = vectorStoreFromDocs.asRetriever();

  const docsFromRetriever = await retriever.invoke("What is Groq?");
  saveOutput("docsFromRetriever", docsFromRetriever, "./src/agents/output/");

  const text = `Busca información sobre LangSmith.
    Para cualquier pregunta sobre LangChain, debes usar esta herramienta.`;

  const retrieverTool = tool(retriever.invoke, {
    name: "langshmithSearch",
    description: text,
  });

  const searchTool = tool(tvly.invoke, {
    name: "search",
    description: "Search the web for information",
  });

  const tools = [retrieverTool, searchTool];

  const modelWithTools = chatGroq.bindTools(tools);

  const capitalOfFranceQuery = await modelWithTools.invoke(
    "¿Cuál es la capital de Francia?"
  );
  saveOutput("capitalOfFranceQuery", capitalOfFranceQuery, "./src/agents/output/");

  const greetingsQuery = await modelWithTools.invoke("Hola, ¿cómo estás?");
  saveOutput("greetingsQuery", greetingsQuery, "./src/agents/output/");

  const searchQuery = await modelWithTools.invoke(
    "¿Cuáles son las alternativas a LangChain?"
  );
  saveOutput("searchQuery", searchQuery, "./src/agents/output/");
};

main();
