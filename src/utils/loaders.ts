import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

export const cheerioLoader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/overview"
);
