import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { saveOutput } from "./utils";
import { chromaVectorStore } from "../db/embeddings";

// * Carga de documentos PDF a partir de un directorio
const loader = new DirectoryLoader("./src/rag/pdfs", {
  ".pdf": (path) => new PDFLoader(path),
});

// * Nota:
// * Es importante saber que cuando los documentos son más largos, debemos separarlos
// * en chunks. De esta manera, el modelo puede procesarlos de manera más eficiente.

// * Splitting documents.
// * El chunkSize y chunkOverlap deben ser ajustados según el tamaño de los docs.
// * Si son muy largos, se debe aumentar el chunkSize y disminuir el chunkOverlap.
// * Si son muy cortos, se debe disminuir el chunkSize y aumentar el chunkOverlap.
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const main = async () => {
  const docs = await loader.load();
  saveOutput("docs", docs);

  const splittedDocs = await textSplitter.splitDocuments(docs);
  saveOutput("splittedDocs", splittedDocs);

  // Create the vector store first
  const addedDocs = await chromaVectorStore.addDocuments(splittedDocs);
  saveOutput("addedDocs", addedDocs);

  // Then use the chroma instance directly
  const retriever = chromaVectorStore.asRetriever();
  saveOutput("retriever", retriever);

  const queryResult = await retriever.invoke("What is the powerhouse of the cell?");
  saveOutput("queryResult", queryResult);
};

main().catch(console.error);
