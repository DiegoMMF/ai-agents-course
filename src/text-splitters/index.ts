import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { writeFileSync } from "fs";
import { JS_CODE, textOne, textTwo } from "./texts";

const firstSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10,
  chunkOverlap: 1,
});

export const secondSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 1,
  separators: ["|", "##", ">", "-"],
});

export const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 60,
  chunkOverlap: 0,
});

const main = async () => {
  const response = await firstSplitter.createDocuments([textOne]);

  writeFileSync(`${__dirname}/response.json`, JSON.stringify(response, null, 2));

  const docOutput = await secondSplitter.splitDocuments([
    new Document({ pageContent: textTwo }),
  ]);

  writeFileSync(
    `${__dirname}/docOutput.json`,
    JSON.stringify(docOutput.slice(0, 3), null, 2)
  );

  const jsDocs = await jsSplitter.createDocuments([JS_CODE]);

  writeFileSync(`${__dirname}/jsDocs.json`, JSON.stringify(jsDocs, null, 2));

  const tokenSplitter = new TokenTextSplitter({ chunkSize: 10, chunkOverlap: 0 });

  const tokensFromText = await tokenSplitter.splitText(textTwo);

  writeFileSync(
    `${__dirname}/tokensFromText.json`,
    JSON.stringify(tokensFromText, null, 2)
  );
};

main().catch(console.error);
