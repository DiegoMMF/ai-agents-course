import fs from "fs/promises";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { writeFileSync } from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

// Si la lectura del PDF falla, podríamos agrandar la librería con "npm i pdfjs-dist"

const webPdfLoader = async () => {
  // Read the file as a buffer
  const localBuffer = await fs.readFile("assets/poem_forever_add_ever.pdf");

  // Traer el PDF de una URL
  const urls = [
    "https://arxiv.org/pdf/2306.06031v1.pdf",
    "https://arxiv.org/pdf/2306.12156v1.pdf",
    "https://arxiv.org/pdf/2306.14289v1.pdf",
    "https://arxiv.org/pdf/2305.10973v1.pdf",
    "https://arxiv.org/pdf/2306.13643v1.pdf",
  ];
  const webBuffer = await fetch(urls[0]).then((res) => res.arrayBuffer());

  // Create a Blob from the buffer
  const firstPdfBlob = new Blob([localBuffer], { type: "application/pdf" });
  const secondPdfBlob = new Blob([webBuffer], { type: "application/pdf" });

  const loader = new WebPDFLoader(firstPdfBlob, {
    /* PDFs come in many varieties, which makes reading them a challenge. The loader 
    parses individual text elements and joins them together with a space by default, 
    but if you are seeing excessive spaces, this may not be the desired behavior. In 
    that case, you can override the separator with an empty string like this: */
    parsedItemSeparator: "",
    /* If you want to split the document into multiple documents, you can set the splitPages 
    option to true. This will split the document into multiple documents, each containing 
    one page of the original document. */
    // splitPages: true,
    /* If you want to use a specific version of pdf.js, you can set the pdfjs option to 
      the version you want to use. This will use the specified version of pdf.js. */
    // pdfjs: () => import("pdfjs-dist/build/pdf.js"),
  });

  const loader2 = new WebPDFLoader(secondPdfBlob, {
    parsedItemSeparator: "",
    splitPages: true,
  });

  const docs = await loader.load();
  const docs2 = await loader2.load();
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(docs[0], null, 2));
  writeFileSync(`${__dirname}/response2.json`, JSON.stringify(docs2[0], null, 2));
};

const localPdfLoader = async () => {
  const loader = new PDFLoader("assets/poem_forever_add_ever.pdf");
  const docs = await loader.load();
  writeFileSync(`${__dirname}/response3.json`, JSON.stringify(docs[0], null, 2));
};

const txtLoader = async () => {
  const loader = new TextLoader("assets/poem_forever_add_ever.txt");
  const docs = await loader.load();
  writeFileSync(`${__dirname}/response4.json`, JSON.stringify(docs[0], null, 2));
};

const csvLoader = async () => {
  const loader = new CSVLoader("assets/ideas_de_negocio.csv");
  const docs = await loader.load();
  writeFileSync(`${__dirname}/response5.json`, JSON.stringify(docs[0], null, 2));
};

webPdfLoader();
localPdfLoader();
txtLoader();
csvLoader();
