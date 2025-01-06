import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import type { Document } from "@langchain/core/documents";

// on Docker terminal
// docker pull chromadb/chroma
// docker run -p 8000:8000 chromadb/chroma

// on Docker Desktop
// pull image and run container (just follow the UI)

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
});

const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection", // collection name
  url: "http://0.0.0.0:8000", // Chroma URL
});

const document1: Document = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { source: "https://example.com" },
};

const document2: Document = {
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" },
};

const document3: Document = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { source: "https://example.com" },
};

const document4: Document = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" },
};

const documents = [document1, document2, document3, document4];

const main = async () => {
  const result = await vectorStore.addDocuments(documents, {
    ids: ["1", "2", "3", "4"],
  });

  console.log(result);

  await vectorStore.delete({ ids: ["3"] });

  const resultB = vectorStore;

  console.log(resultB);
};

main().catch(console.error);

/* Terminal output:

[ '1', '2', '3', '4' ]
Chroma {
  lc_serializable: false,
  lc_kwargs: { collectionName: 'a-test-collection', url: 'http://0.0.0.0:8000' },
  lc_namespace: [ 'langchain', 'vectorstores', 'chroma' ],
  embeddings: HuggingFaceInferenceEmbeddings {
    caller: AsyncCaller {
      maxConcurrency: Infinity,
      maxRetries: 6,
      onFailedAttempt: [Function: defaultFailedAttemptHandler],
      queue: [PQueue]
    },
    apiKey: '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',
    model: 'BAAI/bge-base-en-v1.5',
    endpointUrl: undefined,
    client: HfInference {
      accessToken: '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',
      defaultOptions: {}
    }
  },
  index: ChromaClient {
    tenant: 'default_tenant',
    database: 'default_database',
    authProvider: undefined,
    api: ApiApi {
      basePath: 'http://0.0.0.0:8000',
      fetch: [AsyncFunction: chromaFetch],
      configuration: [Configuration],
      options: {}
    },
    _adminClient: AdminClient {
      tenant: 'default_tenant',
      database: 'default_database',
      authProvider: undefined,
      api: [ApiApi]
    },
    _initPromise: Promise { undefined }
  },
  collection: Collection {
    name: 'a-test-collection',
    id: 'ed51bf0a-79a6-461d-8dde-10e6d7e62b4b',
    metadata: null,
    client: ChromaClient {
      tenant: 'default_tenant',
      database: 'default_database',
      authProvider: undefined,
      api: [ApiApi],
      _adminClient: [AdminClient],
      _initPromise: [Promise]
    },
    embeddingFunction: _DefaultEmbeddingFunction {
      model: 'Xenova/all-MiniLM-L6-v2',
      revision: 'main',
      quantized: false,
      progress_callback: null
    }
  },
  collectionName: 'a-test-collection',
  collectionMetadata: undefined,
  numDimensions: 768,
  clientParams: undefined,
  url: 'http://0.0.0.0:8000',
  filter: undefined
}
*/
