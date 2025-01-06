// import { model } from "./model/model";
// import { RunnableWithMessageHistory } from "@langchain/core/runnables";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { trimmer } from "./messages/trimOptions";
// import { dummyGetSessionHistory, store } from "./messages/inMemoryChatHistory";
// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
// Or, in web environments:
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// const blob = new Blob(); // e.g. from a file input
// const loader = new WebPDFLoader(blob);


const pdfLoader = new PDFLoader("assets/poem_forever_add_ever.pdf");
const txtLoader = new TextLoader("assets/poem_forever_add_ever.txt");


// const chain = trimmer.pipe(model);

// const sessionId = "myCurrentSession";

// const chatHistory = dummyGetSessionHistory(sessionId);

// const chainWithHistory = new RunnableWithMessageHistory({
//   runnable: chain,
//   getMessageHistory: dummyGetSessionHistory,
// });

// const promptTemplate = ChatPromptTemplate.fromMessages([
//   new SystemMessage("You're a good assistant."),
//   new MessagesPlaceholder("history"),
//   new HumanMessage("What is my name?"),
// ]);

const main = async () => {
  const myPdf = await pdfLoader.load();
  const myTxt = await txtLoader.load();
  
  console.log({ myPdf, myTxt });

  // await chatHistory.addMessages([
  //   new HumanMessage("Hello, how are you? My name is Diego"),
  //   new AIMessage("Hi. I'm here and ready to help you. How can I assist you today?"),
  // ]);

  // const result = await chainWithHistory.invoke(
  //   [new HumanMessage("What is my name?")],
  //   { configurable: { sessionId } }
  // );

  // console.log({ resltContent: result.content, chatHistory: store[sessionId] });
};

main().catch(console.error);

/* Terminal output:

{
  myPdf: [
    Document {
      pageContent: '«forever ‘add’ ever»\n' +
        'siento un hijo un hilo un frío...\n' +
        'me arrimé al fuego para recordarnos -s(ó/o)lo- que soy el universo\n' +
        'y que siento un hilo frío que llega desde lejos y me sale de adentro\n' +
        'como la vida\n' +
        'que se afina\n' +
        'cada día\n' +
        'pero que se ensancha para adentro y para siempre\n' +
        'siento un río frío que me encanta pero como que el río nada en mí\n' +
        '(y no al revés)\n' +
        'gajes de lograr lo que uno quiere y cuando no, lo que necesita\n' +
        'creo que el Universo me quiere más que a nadie\n' +
        'creo que el Universo te puso en mi vida porque me quiere más que a nadie\n' +
        'te merezco?\n' +
        'Seguro.\n' +
        '(soy el Universo)\n' +
        'a pesar de mis dedos como colmillos\n' +
        'a pesar de mis caricias de acero\n' +
        'a pesar de mis miedos\n' +
        'a pesar de quemar tantas naves tanto maldito invierno\n' +
        'a pesar del fuego\n' +
        'a pesar del miedo\n' +
        '(que no conozco)\n' +
        '(que no tengo)\n' +
        'pero que siento\n' +
        'te merezco?\n' +
        'Seguro.\n' +
        'merezco tus flores, tus miradas, tu acento, tu aire desnudo desechando mi \n' +
        'intelecto,\n' +
        'toda tu incomprensible incomprensión\n' +
        'que amo (y que no entiendo)\n' +
        'te merezco.\n' +
        'pero no por mí:\n' +
        'Porque el Universo merece estar más despierto.\n' +
        'Diego M. Maldini Freyre',
      metadata: [Object],
      id: undefined
    }
  ],
  myTxt: [
    Document {
      pageContent: '«forever ‘add’ ever»\n' +
        '\n' +
        'siento un hijo un hilo un frío…\n' +
        'me arrimé al fuego para recordarnos -s(ó/o)lo- que soy el universo\n' +
        'y que siento un hilo frío que llega desde lejos y me sale de adentro\n' +
        'como la vida\n' +
        'que se afina\n' +
        'cada día\n' +
        'pero que se ensancha para adentro y para siempre\n' +
        'siento un río frío que me encanta pero como que el río nada en mí\n' +
        '(y no al revés)\n' +
        'gajes de lograr lo que uno quiere y cuando no, lo que necesita\n' +
        'creo que el Universo me quiere más que a nadie\n' +
        'creo que el Universo te puso en mi vida porque me quiere más que a nadie\n' +
        'te merezco?\n' +
        'Seguro.\n' +
        '(soy el Universo)\n' +
        'a pesar de mis dedos como colmillos\n' +
        'a pesar de mis caricias de acero\n' +
        'a pesar de mis miedos\n' +
        'a pesar de quemar tantas naves tanto maldito invierno\n' +
        'a pesar del fuego\n' +
        'a pesar del miedo\n' +
        '(que no conozco)\n' +
        '(que no tengo)\n' +
        'pero que siento\n' +
        'te merezco?\n' +
        'Seguro.\n' +
        'merezco tus flores, tus miradas, tu acento, tu aire desnudo desechando mi intelecto,\n' +
        'toda tu incomprensible incomprensión\n' +
        'que amo (y que no entiendo)\n' +
        'te merezco.\n' +
        'pero no por mí:\n' +
        'Porque el Universo merece estar más despierto.\n' +
        '\n' +
        'Diego M. Maldini Freyre',
      metadata: [Object],
      id: undefined
    }
  ]
}
*/
