import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { getMessageHistory, saveOutput } from "./utils";
import { chromaVectorStore } from "../db/embeddings";
import { chatGroq as llm } from "../models/models";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { SystemMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const main = async () => {
  // Carga de documentos PDF a partir de un directorio
  const loader = new DirectoryLoader("./src/rag/pdfs", {
    ".pdf": (path) => new PDFLoader(path),
  });

  // Nota:
  // Es importante saber que cuando los documentos son más largos, debemos separarlos
  // en chunks. De esta manera, el modelo puede procesarlos de manera más eficiente.

  // Splitting documents.
  // El chunkSize y chunkOverlap deben ser ajustados según el tamaño de los docs.
  // Si son muy largos, se debe aumentar el chunkSize y disminuir el chunkOverlap.
  // Si son muy cortos, se debe disminuir el chunkSize y aumentar el chunkOverlap.
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const docs = await loader.load();
  saveOutput("docs", docs);

  const splittedDocs = await textSplitter.splitDocuments(docs);
  saveOutput("splittedDocs", splittedDocs);

  // Adding documents to the vector store (LLM already added in definition)
  // Guardar addedDocs es innecesario pero se hace para que poder ver el resultado.
  const addedDocs = await chromaVectorStore.addDocuments(splittedDocs);
  saveOutput("addedDocs", addedDocs);

  // El retriever se encarga de buscar la información relevante en la vector store.
  const retriever = chromaVectorStore.asRetriever();
  saveOutput("retriever", retriever);

  // System prompt
  // Este prompt se utiliza para que el modelo entienda el contexto de los documentos
  // que se le proporcionan.
  const systemPrompt = `
    Eres un asistente solícito que devuelve información relevante sobre los documentos
    que se te proporcionan. Incluye emojis en tus respuestas para que sean más
    amigables y fáciles de entender.
    Tienes el siguiente contexto: {context}
  `;

  // Contextualized system prompt
  // A diferencia del system prompt, este se utiliza para que el modelo entienda
  // el historial de conversación y el contexto que se le proporciona.
  const contextualizedQSystemPrompt = `
    Responde según el historial de conversación y el contexto que se te proporciona.
    Si no tienes información relevante, simplemente responde con "No sé".
    Además, responde de manera profesional a la pregunta que se te hace.
  `;

  const contextualizedQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizedQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  // First, create the history-aware retriever
  const historyAwareRetriever = await createHistoryAwareRetriever({
    retriever,
    llm,
    rephrasePrompt: contextualizedQPrompt,
  });

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  // Stuff Documents Chain
  // Combina los fragmentos recuperados con la pregunta del usuario para generar una
  // respuesta más completa y precisa.
  const questionAnswerChain = createStuffDocumentsChain({ llm, prompt: qaPrompt });

  // Retrieval Chain
  // Generación de la Respuesta: El modelo de lenguaje toma los fragmentos recuperados
  // y los utiliza como contexto adicional para generar la respuesta. Esta combinación
  // de información permite que las respuestas estén basadas en información más reciente
  // o específica, extraída de documentos cargados en el vector store.
  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: await questionAnswerChain,
  });

  const conversationalRagChain = new RunnableWithMessageHistory({
    runnable: ragChain,
    getMessageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    outputMessagesKey: "answer",
  });

  const queryResult = await conversationalRagChain.invoke(
    { input: "Cuáles son las ventas del último trimestre?" },
    { configurable: { sessionId: "user-123" } }
  );
  saveOutput("queryResult", queryResult);

  const queryResult2 = await ragChain.invoke(
    { input: "Dame una receta keto para el desayuno" },
    { configurable: { sessionId: "user-123" } }
  );
  saveOutput("queryResult2", queryResult2);
};

main().catch(console.error);
