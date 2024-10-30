import {
  RecursiveCharacterTextSplitter,
  TokenTextSplitter,
} from "@langchain/textsplitters";
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

const tokenSplitter = new TokenTextSplitter({ chunkSize: 10, chunkOverlap: 0 });

(async () => {
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: text }),
  ]);

  // console.log(docOutput.slice(0, 3));

  const jsDocs = await jsSplitter.createDocuments([JS_CODE]);

  // console.log(jsDocs);

  const tokensFromText = await tokenSplitter.splitText(text);

  console.log(tokensFromText);
})();

/* Terminal Output

[
  'Some other considerations include:\n\n- Do you',
  ' deploy your backend and frontend together, or separately',
  '?\n- Do you deploy your backend co-',
  'located with your database, or separately?\n',
  '\n**Production Support:** As you move your',
  " LangChains into production, we'd love to",
  ' offer more hands-on support.\nFill out',
  ' [this form](https://airtable.com',
  '/appwQzlErAS2qiP',
  '0L/shrGtGaVBVAz',
  '7NcV2) to share more about',
  " what you're building, and our team will get",
  ' in touch.\n\n## Deployment Options\n',
  '\nSee below for a list of deployment options for',
  " your LangChain app. If you don't see",
  ' your preferred option, please get in touch and we',
  ' can add it to this list.'
]
*/
