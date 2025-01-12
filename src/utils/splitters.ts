import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from "langchain/text_splitter";

export const firstSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10,
  chunkOverlap: 1,
});

export const secondSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 1,
  separators: ["|", "##", ">", "-"],
});

export const thirdSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

export const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 60,
  chunkOverlap: 0,
});

export const tokenSplitter = new TokenTextSplitter({
  chunkSize: 10,
  chunkOverlap: 0,
});

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
