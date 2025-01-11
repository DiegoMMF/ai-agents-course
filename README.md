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

El objetivo es cargar los documentos a partir de un directorio y guardarlos en un
formato que pueda ser leído por el modelo.

Carga los documentos desde el directorio. Si un archivo es un directorio y recursive
es true, recorre recursivamente los subdirectorios y carga los documentos. Si un
archivo es un archivo, verifica si hay una función de carga correspondiente para la
extensión del archivo en el mapeo de loaders. Si hay, carga los documentos.

Es importante saber que cuando los documentos son más largos, debemos separarlos en
chunks. De esta manera, el modelo puede procesarlos de manera más eficiente.

2. Splitter de documentos: `RecursiveCharacterTextSplitter`

El objetivo es dividir los documentos en chunks de texto que puedan ser leídos y
procesados por el modelo de manera más eficiente.

El chunkSize y chunkOverlap deben ser ajustados según el tamaño de los docs. Si son
muy largos, se debe aumentar el chunkSize y disminuir el chunkOverlap. Si son muy
cortos, se debe disminuir el chunkSize y aumentar el chunkOverlap.

3. Crear embeddings: `HuggingFaceInferenceEmbeddings`

El objetivo es crear embeddings para los chunks de texto. Este embedding es un array
de floats que representa el documento en un espacio vectorial.

4. Crear vector store: `ChromaDB`

El objetivo es crear un vector store para los embeddings. Este vector store es una
estructura de datos que permite almacenar los embeddings y buscarlos de manera
eficiente. Para correr Chroma de forma localhay que levantar el servidor en Docker:

```
on Docker terminal
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

En Docker Desktop:

```
pull image and run container (just follow the UI)
```

5. Creamos un retriever: `VectorStoreRetriver`

El objetivo es crear un retriever a partir de la embedded data. Este retriever se
encarga de buscar la información relevante en la vector store.

6. Crear un retriever con historial de conversación: `createHistoryAwareRetriever`

El objetivo es crear un retriever con historial de conversación que recibe como
parámetro el retriever, el LLM y el prompt de reescritura de preguntas para afinar y
recalibrar la pregunta del usuario.

7. Crear una cadena de pregunta y respuesta: `createStuffDocumentsChain`

Se crea una cadena de pregunta y respuesta que recibe como parámetro el LLM y el
prompt de pregunta y respuesta.

8. Crear una cadena de RAG: `createRetrievalChain`

Se crea una cadena de RAG que recibe como parámetro el retriever y la cadena de
la cadena de pregunta y respuesta. Esta cadena se encarga de combinar el retriever
con la cadena de pregunta y respuesta para generar una respuesta más completa y
precisa.

## Parte 3

### Tools

Los Toolkits funcionan como una capa de integración entre el language model y los
sistemas externos. Cada Toolkit está diseñado para conectar a los LLMs con una
funcionalidad específica o un servicio externo. Cuando el modelo recibe una pregunta
o una tarea que requiere interacción con un sistema externo, el Toolkit actúa como
intermediario, permitiendo al agente ejecutar esa tarea de manera efectiva.

### [Key concepts](https://js.langchain.com/docs/concepts/tool_calling/#key-concepts)

1. **Tool Creation**: Use the tool function to create a tool. A tool is an association
   between a function and its schema.

2. **Tool Binding**: The tool needs to be connected to a model that supports tool
   calling. This gives the model awareness of the tool and the associated input schema
   required by the tool.

3. **Tool Calling**: When appropriate, the model can decide to call a tool and ensure its
   response conforms to the tool's input schema.

4. **Tool Execution**: The tool can be executed using the args provided by the model.

### Recommended usage

This pseudo-code illustrates the recommended workflow for using tool calling. Created tools are passed to .bindTools() method as a list. This model can be called, as usual. If a tool call is made, model's response will contain the tool call arguments. The tool call arguments can be passed directly to the tool.

```
// Tool creation
const tools = [myTool];

// Tool binding
const modelWithTools = model.bindTools(tools);

// Tool calling
const response = await modelWithTools.invoke(userInput);
```

#### En esencia, el proceso es el siguiente:

- Input del Usuario: El usuario ingresa una pregunta o tarea que puede requerir
  acceso a una base de datos, una API externa o incluso la ejecución de código.

- Consulta a través del Toolkit: El Toolkit interpreta la tarea, ejecuta las acciones
  necesarias (como una consulta SQL o una búsqueda en la web), y devuelve los
  resultados al language model.

- Generación de la Respuesta: El modelo procesa los datos obtenidos del Toolkit y
  genera una respuesta contextualizada y precisa, integrando la información externa.

#### SQL Tool

El objetivo es [crear un tool para ejecutar consultas SQL](https://js.langchain.com/docs/tutorials/sql_qa/#dealing-with-high-cardinality-columns) en cuatro pasos.

1. Recibir la pregunta del usuario en lenguaje natural. [InputStateAnnotation]
2. Transformar la pregunta en una consulta SQL. [writeQuery]
3. Ejecutar la consulta SQL. [executeQuery]
4. Transformar la respuesta SQL en una respuesta en lenguaje natural. [generateAnswer]

#### Orchestrating with LangGraph

Finally, we compile our application into a single _graph_ object. In this case, we
are just connecting the three steps into a single sequence.
