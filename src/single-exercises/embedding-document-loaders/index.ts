import { writeFileSync } from "fs";
import { langChainDocuments } from "./documents";
import { faissVectorStore } from "../../utils/vectorStores";
import { pdfLoader, txtLoader } from "../../utils/loaders";
import { csvLoader } from "../../utils/loaders";

const main = async () => {
  // Add the documents to the vector store
  await faissVectorStore.addDocuments(langChainDocuments, {
    ids: ["1", "2", "3", "4"],
  });

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
  await faissVectorStore.addDocuments(processedDocuments);

  const myPdf = await pdfLoader.load();

  await faissVectorStore.addDocuments(myPdf, { ids: ["1"] });

  const myTxt = await txtLoader.load();

  await faissVectorStore.addDocuments(myTxt, { ids: ["2"] });

  // Search for the documents in the vector store
  const response0 = await faissVectorStore.similaritySearch("biology", 2);

  // Save the vector store to a file
  writeFileSync(`${__dirname}/response0.json`, JSON.stringify(response0, null, 2));

  // Realizar una búsqueda de similitud
  const query = "¿Cuáles son las ideas de negocio más innovadoras?";

  const response1 = await faissVectorStore.similaritySearch(query, 5);
  writeFileSync(`${__dirname}/response1.json`, JSON.stringify(response1, null, 2));

  const response2 = await faissVectorStore.similaritySearch("exam", 2);
  writeFileSync(`${__dirname}/response2.json`, JSON.stringify(response2, null, 2));

  const response3 = await faissVectorStore.similaritySearch("forever add ever", 2);
  writeFileSync(`${__dirname}/response3.json`, JSON.stringify(response3, null, 2));
};

main().catch(console.error);
