import dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

// Carga de documentos PDF a partir de un directorio.
export const directoryLoader = new DirectoryLoader("./src/rag/pdfs", {
  ".pdf": (path) => new PDFLoader(path),
});

// Instanciamos el modelo de embeddings de Hugging Face.
export const hfEmbeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

// Instanciamos el vector store de Chroma.
export const vectorStore = new Chroma(hfEmbeddings, {
  collectionName: "a-test-collection", // collection name
  url: "http://0.0.0.0:8000", // Chroma URL
});

// System prompt: se utiliza para que el modelo entienda el contexto de los
// documentos que se le proporcionan.
export const systemPrompt = `
    Eres un asistente solícito que devuelve información relevante sobre los documentos
    que se te proporcionan. Incluye emojis en tus respuestas para que sean más
    amigables y fáciles de entender.
    Tienes el siguiente contexto: {context}
  `;

// A diferencia del system prompt, este se utiliza para que el modelo entienda
// el historial de conversación y el contexto que se le proporciona.
export const contextualizedQSystemPrompt = `
    Responde según el historial de conversación y el contexto que se te proporciona.
    Si no tienes información relevante, simplemente responde con "No sé".
    Además, responde de manera profesional a la pregunta que se te hace.
  `;

// Contextualized prompt
// Adiferencia del prompt anterior, este se utiliza para que el modelo entienda
// el historial de conversación y el contexto que se le proporciona.
export const contextualizedQPrompt = ChatPromptTemplate.fromMessages([
  ["system", contextualizedQSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

// Prompt para la pregunta y respuesta
export const qaPrompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);
