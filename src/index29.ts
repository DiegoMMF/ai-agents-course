import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 10,
  chunkOverlap: 1,
});

(async () => {
  const output = await splitter.createDocuments([text]);

  console.log(output.slice(0, 3));
})();

/* Terminal Output

[
  Document {
    pageContent: 'Hi.',
    metadata: { loc: [Object] },
    id: undefined
  },
  Document {
    pageContent: "I'm",
    metadata: { loc: [Object] },
    id: undefined
  },
  Document {
    pageContent: 'Harrison.',
    metadata: { loc: [Object] },
    id: undefined
  }
]
*/