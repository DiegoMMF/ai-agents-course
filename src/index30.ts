import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";

const text = `Some other considerations include:

- Do you deploy your backend and frontend together, or separately?
- Do you deploy your backend co-located with your database, or separately?

**Production Support:** As you move your LangChains into production, we'd love to offer more hands-on support.
Fill out [this form](https://airtable.com/appwQzlErAS2qiP0L/shrGtGaVBVAz7NcV2) to share more about what you're building, and our team will get in touch.

## Deployment Options

See below for a list of deployment options for your LangChain app. If you don't see your preferred option, please get in touch and we can add it to this list.`;

const JS_CODE = `
function helloWorld() {
  console.log("Hello, World!");
}

// Call the function
helloWorld();
`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 1,
  separators: ["|", "##", ">", "-"],
});

const jsSplitter = RecursiveCharacterTextSplitter.fromLanguage("js", {
  chunkSize: 60,
  chunkOverlap: 0,
});

(async () => {
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  console.log(docOutput.slice(0, 3));

  const jsDocs = await jsSplitter.createDocuments([JS_CODE]);

  console.log(jsDocs);
})();

/* Terminal Output

[
  Document {
    pageContent: 'Some other considerations include:',
    metadata: { loc: [Object] },
    id: undefined
  },
  Document {
    pageContent: '- Do you deploy your backend and frontend together',
    metadata: { loc: [Object] },
    id: undefined
  },
  Document {
    pageContent: 'r, or separately?',
    metadata: { loc: [Object] },
    id: undefined
  }
]
[
  Document {
    pageContent: 'function helloWorld() {\n  console.log("Hello, World!");\n}',
    metadata: { loc: [Object] },
    id: undefined
  },
  Document {
    pageContent: '// Call the function\nhelloWorld();',
    metadata: { loc: [Object] },
    id: undefined
  }
]
*/
