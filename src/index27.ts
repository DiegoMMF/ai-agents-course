import dotenv from "dotenv";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { FireworksEmbeddings } from "@langchain/community/embeddings/fireworks";
import { TextLoader } from "langchain/document_loaders/fs/text";

dotenv.config();

const pdfLoader = new PDFLoader("assets/poem_forever_add_ever.pdf");
const txtLoader = new TextLoader("assets/poem_forever_add_ever.txt");

const embeddings = new FireworksEmbeddings({
  modelName: "nomic-ai/nomic-embed-text-v1.5",
});

const vectorStore = new FaissStore(embeddings, {});

const main = async () => {
  const myPdf = await pdfLoader.load();

  await vectorStore.addDocuments(myPdf, { ids: ["1"] });

  const myTxt = await txtLoader.load();

  await vectorStore.addDocuments(myTxt, { ids: ["2"] });

  const similaritySearchResults = await vectorStore.similaritySearch("Ojos", 2);

  for (const doc of similaritySearchResults) {
    console.log(
      `* ${doc.pageContent.slice(0, 100)} [${JSON.stringify(doc.metadata, null)}]`
    );
  }
};

main().catch(console.error);

/* Terminal output:

* «forever ‘add’ ever»
siento un hijo un hilo un frío...
me arrimé al fuego para recordarnos -s(ó/o)lo [{"source":"assets/poem_forever_add_ever.pdf","pdf":{"version":"1.10.100","info":{"PDFFormatVersion":"1.7","IsAcroFormPresent":false,"IsXFAPresent":false,"Creator":"Writer","Producer":"LibreOffice 24.2","CreationDate":"D:20241017072011-03'00'"},"metadata":null,"totalPages":1},"loc":{"pageNumber":1}}]

* «forever ‘add’ ever»
siento un hijo un hilo un frío…
me arrimé al fuego para recordarnos -s(ó/o)lo [{"source":"assets/poem_forever_add_ever.txt"}]
*/
