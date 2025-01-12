import { getMessageHistory, saveOutput } from "./utils";
import { chatGroq as llm } from "../utils/models";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import {
  contextualizedQPrompt,
  directoryLoader,
  qaPrompt,
  textSplitter,
  vectorStore,
} from "./config";

const main = async () => {
  // Carga los documentos fuente en un array de documentos.
  const docs = await directoryLoader.load();
  saveOutput("docs", docs);

  // Divide los documentos en chunks de texto para procesarlos más eficientemente.
  const splittedDocs = await textSplitter.splitDocuments(docs);
  saveOutput("splittedDocs", splittedDocs);

  // Traemos la Vector Store a la que previamente le agregamos el LLM de embeddings y
  // le agregamos los chunks de texto.
  const addedDocs = await vectorStore.addDocuments(splittedDocs);
  // Guardar addedDocs es innecesario pero se hace para que poder ver el resultado.
  saveOutput("addedDocs", addedDocs);

  // Instanciamos un VectorStoreRetriver cuyas queries no se basan en el contenido
  // del texto sino en el embedding.
  const retriever = vectorStore.asRetriever();
  saveOutput("retriever", retriever);

  // Hay otra forma de lograr lo mismo que el de arriba salvo que se puede configurar
  // el retriever, por ejemplo, el número de documentos a devolver, el filtro, etc.:
  // const retriever = new VectorStoreRetriever({ vectorStore, k: 10, filter: "X" });

  // Este retriever se encarga de buscar la información relevante en la vector store
  // teniendo en cuenta el historial de conversación.
  const historyAwareRetriever = await createHistoryAwareRetriever({
    retriever,
    llm,
    rephrasePrompt: contextualizedQPrompt,
  });
  saveOutput("historyAwareRetriever", historyAwareRetriever);

  // Combina los fragmentos recuperados con la pregunta del usuario para generar una
  // respuesta más completa y precisa.
  const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
  });
  saveOutput("questionAnswerChain", questionAnswerChain);

  // El LLM toma los fragmentos recuperados y los utiliza como contexto adicional
  // para generar la respuesta. Esta combinación de información permite que las
  // respuestas estén basadas en información más reciente o específica, extraída de
  // documentos cargados en el vector store.
  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });
  saveOutput("ragChain", ragChain);

  // Wrapper que se encarga de agregar el historial de conversación al LLM y que
  // el LLM pueda responder a la pregunta del usuario.
  const conversationalRagChain = new RunnableWithMessageHistory({
    runnable: ragChain,
    getMessageHistory,
    inputMessagesKey: "input",
    historyMessagesKey: "chat_history",
    outputMessagesKey: "answer",
  });
  saveOutput("conversationalRagChain", conversationalRagChain);

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

  const queryResult3 = await ragChain.invoke(
    { input: "Qué puedo hacer en Mendoza?" },
    { configurable: { sessionId: "user-123" } }
  );
  saveOutput("queryResult3", queryResult3);
};

main().catch(console.error);
