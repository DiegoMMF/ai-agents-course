import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { writeFileSync } from "fs";
import { fireworksEmbeddings } from "../../db/embeddings";

const csvLoader = new CSVLoader("assets/ideas_de_negocio.csv");

const vectorStore = new FaissStore(fireworksEmbeddings, {});

const main = async () => {
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

  // Realizar una búsqueda de similitud
  const query = "¿Cuáles son las ideas de negocio más innovadoras?";
  const response = await vectorStore.similaritySearch(query, 5);

  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));
};

main().catch(console.error);
