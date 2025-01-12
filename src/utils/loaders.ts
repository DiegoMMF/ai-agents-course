import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";

export const cheerioLoader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/overview"
);

export const pdfLoader = new PDFLoader("assets/CambridgeStartersPreparation.pdf");

export const txtLoader = new TextLoader("assets/poem_forever_add_ever.txt");

export const csvLoader = new CSVLoader("assets/ideas_de_negocio.csv");

export const webPdfloader = (firstPdfBlob: Blob) =>
  new WebPDFLoader(firstPdfBlob, {
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

export const splittedPagesWebPdfLoader = (secondPdfBlob: Blob) =>
  new WebPDFLoader(secondPdfBlob, {
    parsedItemSeparator: "",
    splitPages: true,
  });

// Carga de documentos PDF a partir de un directorio.
export const directoryLoader = new DirectoryLoader("./src/rag/pdfs", {
  ".pdf": (path) => new PDFLoader(path),
});
