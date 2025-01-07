import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { fireworksEmbeddings } from "../../db/embeddings";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { writeFileSync } from "fs";

const pdfLoader = new PDFLoader("assets/CambridgeStartersPreparation.pdf");
const txtLoader = new TextLoader("assets/poem_forever_add_ever.txt");

const vectorStore = new FaissStore(fireworksEmbeddings, {});

const main = async () => {
  const myPdf = await pdfLoader.load();

  await vectorStore.addDocuments(myPdf, { ids: ["1"] });

  const myTxt = await txtLoader.load();

  await vectorStore.addDocuments(myTxt, { ids: ["2"] });

  const response = await vectorStore.similaritySearch("exam", 2);

  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
};

main().catch(console.error);