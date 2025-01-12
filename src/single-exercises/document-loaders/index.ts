import fs from "fs/promises";
import { writeFileSync } from "fs";
import {
  csvLoader,
  pdfLoader,
  txtLoader,
  webPdfloader,
  splittedPagesWebPdfLoader,
} from "../../utils/loaders";

// Traer el PDF de una URL
const urls = [
  "https://arxiv.org/pdf/2306.06031v1.pdf",
  "https://arxiv.org/pdf/2306.12156v1.pdf",
  "https://arxiv.org/pdf/2306.14289v1.pdf",
  "https://arxiv.org/pdf/2305.10973v1.pdf",
  "https://arxiv.org/pdf/2306.13643v1.pdf",
];

// Si la lectura del PDF falla, podríamos agrandar la librería con "npm i pdfjs-dist"

const pdfWebLoaderFromLocal = async () => {
  // Read the file as a buffer
  const localBuffer = await fs.readFile("assets/poem_forever_add_ever.pdf");
  // Create a Blob from the buffer
  const pdfBlob = new Blob([localBuffer], { type: "application/pdf" });
  // Load the PDF
  const docs = await webPdfloader(pdfBlob).load();
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(docs[0], null, 2));
};

const webLoaderFromWeb = async () => {
  const webBuffer = await fetch(urls[0]).then((res) => res.arrayBuffer());
  const pdfBlob = new Blob([webBuffer], { type: "application/pdf" });
  const docs2 = await splittedPagesWebPdfLoader(pdfBlob).load();
  writeFileSync(`${__dirname}/response2.json`, JSON.stringify(docs2[0], null, 2));
};

const loaderForPdfs = async () => {
  const docs = await pdfLoader.load();
  writeFileSync(`${__dirname}/response3.json`, JSON.stringify(docs[0], null, 2));
};

const loaderForTexts = async () => {
  const docs = await txtLoader.load();
  writeFileSync(`${__dirname}/response4.json`, JSON.stringify(docs[0], null, 2));
};

const loaderForCsvs = async () => {
  const docs = await csvLoader.load();
  writeFileSync(`${__dirname}/response5.json`, JSON.stringify(docs[0], null, 2));
};

pdfWebLoaderFromLocal();
webLoaderFromWeb();
loaderForPdfs();
loaderForTexts();
loaderForCsvs();
