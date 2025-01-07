import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { fireworksEmbeddings } from "../db/embeddings";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { writeFileSync } from "fs";
import { langChainDocuments } from "./documents";

const pdfLoader = new PDFLoader("assets/CambridgeStartersPreparation.pdf");
const txtLoader = new TextLoader("assets/poem_forever_add_ever.txt");
const csvLoader = new CSVLoader("assets/ideas_de_negocio.csv");

// Create a vector store with the documents and embeddings
const vectorStore = new FaissStore(fireworksEmbeddings, {});

const main = async () => {
  // Add the documents to the vector store
  await vectorStore.addDocuments(langChainDocuments, { ids: ["1", "2", "3", "4"] });

  // Al cargar un CSV, se crea un array de objetos donde cada objeto es una fila del
  // CSV que es interpretada como un documento individual.
  const myCsv = await csvLoader.load();

  // Procesar cada documento para asignar el _id como id
  const processedDocuments = myCsv.map((doc) => {
    const content = doc.pageContent.split("\n");
    const idLine = content.find((line) => line.startsWith("_id:"));
    if (idLine) {
      const id = idLine.split(":")[1].trim();
      doc.id = id;
    }
    return doc;
  });

  // Agregar los documentos procesados al vector store
  await vectorStore.addDocuments(processedDocuments);

  const myPdf = await pdfLoader.load();

  await vectorStore.addDocuments(myPdf, { ids: ["1"] });

  const myTxt = await txtLoader.load();

  await vectorStore.addDocuments(myTxt, { ids: ["2"] });

  // Search for the documents in the vector store
  const response0 = await vectorStore.similaritySearch("biology", 2);

  // Save the vector store to a file
  writeFileSync(`${__dirname}/response0.json`, JSON.stringify(response0, null, 2));

  // Realizar una búsqueda de similitud
  const query = "¿Cuáles son las ideas de negocio más innovadoras?";

  const response1 = await vectorStore.similaritySearch(query, 5);
  writeFileSync(`${__dirname}/response1.json`, JSON.stringify(response1, null, 2));

  const response2 = await vectorStore.similaritySearch("exam", 2);
  writeFileSync(`${__dirname}/response2.json`, JSON.stringify(response2, null, 2));

  const response3 = await vectorStore.similaritySearch("forever add ever", 2);
  writeFileSync(`${__dirname}/response3.json`, JSON.stringify(response3, null, 2));
};

main().catch(console.error);
