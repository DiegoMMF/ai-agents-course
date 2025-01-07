import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { writeFileSync } from "fs";

const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10,
  chunkOverlap: 1,
});

(async () => {
  const response = await splitter.createDocuments([text]);

  writeFileSync(
    `${__dirname}/response.json`,
    JSON.stringify(response, null, 2)
  )
})();