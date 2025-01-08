Adaptación a TypeScript del Curso de Agentes AI de Platzi: https://platzi.com/cursos/agentes-ai/

Para iniciar, descargar el ZIP o clonar el repo y escribir en la terminal: "npm i"

Se debe crear un archivo llamado ".env" en la carpeta raíz y agregársele la "GOOGLE_API_KEY=..."

---

## Parte 1

### Ejercicios

- [Chat History from User Input](./src/partOneExercises/chat-history-from-user-input/index.ts)
- [Simple LLM App with LCEL](./src/partOneExercises/simple-llm-app-with-lcel/index.ts)
- [Pinecone Embeddings Indexing](./src/partOneExercises/pinecone-embeddings-indexing/index.ts)
- [Pinecone Embeddings Delete Index](./src/partOneExercises/pinecone-embeddings-delete-index/index.ts)
- [JSON Parser Stream](./src/partOneExercises/json-parser-stream/index.ts)
- [Inference Embeddings](./src/partOneExercises/inference-embeddings/index.ts)
- [In Memory Chat Message History](./src/partOneExercises/in-memory-chat-message-history/index.ts)
- [Few Shot Prompt Templates](./src/partOneExercises/few-shot-prompt-templates/index.ts)
- Entre otros...

---

## Parte 2

- [RAG](./src/rag/index.ts)

### RAG - Procedimiento

1. Cargar documentos: `DirectoryLoader`

El objetivo es cargar los documentos de un directorio y guardarlos en un formato que
pueda ser leído por el modelo.

2. Splitter de documentos: `RecursiveCharacterTextSplitter`

El objetivo es dividir los documentos en chunks de texto que puedan ser leídos por el 
modelo de manera eficiente.

3. Crear embeddings: `HuggingFaceInferenceEmbeddings`

El objetivo es crear embeddings para los chunks de texto. Este embedding es un array 
de floats que representa el documento en un espacio vectorial.

4. Crear vector store: `ChromaDB`

El objetivo es crear un vector store para los embeddings. Este vector store es una 
estructura de datos que permite almacenar los embeddings y buscarlos de manera 
eficiente.

5. Crear modelo de RAG: `RetrievalAugmentedGeneration`

El objetivo es crear un modelo de RAG.

6. Crear agente de RAG: `createRetrievalAgent`

