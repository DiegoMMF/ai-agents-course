// import { model } from "./model/model";
// import { RunnableWithMessageHistory } from "@langchain/core/runnables";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { trimmer } from "./messages/trimOptions";
// import { dummyGetSessionHistory, store } from "./messages/inMemoryChatHIstory";
// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// Or, in web environments:
// import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
// const blob = new Blob(); // e.g. from a file input
// const loader = new WebPDFLoader(blob);


const loader = new PDFLoader("assets/lorem-ipsum.pdf");

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
  const docs = await loader.load();

  console.log({ docs });

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
  docs: [
    Document {
      pageContent: 'Test document PDF \n' +
        ' \n' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla est purus, ultrices in porttitor \n' +
        'in, accumsan non quam. Nam consectetur porttitor rhoncus. Curabitur eu est et leo feugiat \n' +
        'auctor vel quis lorem. Ut et ligula dolor, sit amet consequat lorem. Aliquam porta eros sed \n' +
        'velit imperdiet egestas. Maecenas tempus eros ut diam ullamcorper id dictum libero \n' +
        'tempor. Donec quis augue quis magna condimentum lobortis. Quisque imperdiet ipsum vel \n' +
        'magna viverra rutrum. Cras viverra molestie urna, vitae vestibulum turpis varius id. \n' +
        'Vestibulum mollis, arcu iaculis bibendum varius, velit sapien blandit metus, ac posuere lorem \n' +
        'nulla ac dolor. Maecenas urna \n' +
        'elit, tincidunt in dapibus nec, vehicula eu dui. Duis lacinia \n' +
        'fringilla massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur \n' +
        'ridiculus mus. Ut consequat ultricies est, non rhoncus mauris congue porta. Vivamus viverra \n' +
        'suscipit felis eget condimentum. Cum sociis natoque penatibus et magnis dis parturient \n' +
        'montes, nascetur ridiculus mus. Integer bibendum sagittis ligula, non faucibus nulla volutpat \n' +
        'vitae. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.  \n' +
        'In aliquet quam et velit bibendum accumsan. Cum sociis natoque penatibus et magnis dis \n' +
        'parturient montes, nascetur ridiculus mus. Vestibulum vitae ipsum nec arcu semper \n' +
        'adipiscing at ac lacus. \n' +
        'Praesent id pellentesque orci. Morbi congue viverra nisl nec rhoncus. \n' +
        'Integer mattis, ipsum a tincidunt commodo, lacus arcu elementum elit, at mollis eros ante ac \n' +
        'risus. In volutpat, ante at pretium ultricies, velit magna suscipit enim, aliquet blandit massa \n' +
        'orci nec lorem. Nulla facilisi. Duis eu vehicula arcu. Nulla facilisi. Maecenas\n' +
        ' pellentesque \n' +
        'volutpat felis, quis tristique ligula luctus vel. Sed nec mi eros. Integer augue enim, sollicitudin \n' +
        'ullamcorper mattis eget, aliquam in est. Morbi sollicitudin libero nec augue dignissim ut \n' +
        'consectetur dui volutpat. Nulla facilisi. Mauris egestas vestibulum neque cursus tincidunt. \n' +
        'Donec sit amet pulvinar orci.  \n' +
        'Quisque volutpat pharetra tincidunt. Fusce \n' +
        'sapien arcu, molestie eget varius egestas, \n' +
        'faucibus ac urna. Sed at nisi in velit egestas aliquam ut a felis. Aenean malesuada iaculis nisl, \n' +
        'ut tempor lacus egestas consequat. Nam nibh lectus, gravida sed egestas ut, feugiat quis \n' +
        'dolor. Donec eu leo enim, non laoreet ante. Morbi dictum tempor vulputate. Phasellus \n' +
        'ultricies\n' +
        ' risus vel augue sagittis euismod. Vivamus tincidunt placerat nisi in aliquam. Cras \n' +
        'quis mi ac nunc pretium aliquam. Aenean elementum erat ac metus commodo rhoncus. \n' +
        'Aliquam nulla augue, porta non sagittis quis, accumsan vitae sem. Phasellus id lectus tortor, \n' +
        'eget pulvinar augue. Etiam eget velit ac purus fringilla blandit. Donec odio odio, sagittis sed \n' +
        'iaculis sed, consectetur eget sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \n' +
        'Maecenas accumsan velit vel turpis rutrum in sodales diam placerat.  \n' +
        'Quisque luctus ullamcorper velit sit amet lobortis. Etiam ligula felis, vulputate quis rhoncus \n' +
        'nec, fermentum eget odio. Vivamus vel ipsum ac augue sodales mollis\n' +
        ' euismod nec tellus. \n' +
        'Fusce et augue rutrum nunc semper vehicula vel semper nisl. Nam laoreet euismod quam at \n' +
        'varius. Sed aliquet auctor nibh. Curabitur malesuada fermentum lacus vel accumsan. Duis \n' +
        'ornare scelerisque nulla, ac pulvinar ligula tempus sit amet. In placerat nulla ac ante \n' +
        'scelerisque posuere. Phasellus at ante felis. Sed hendrerit risus a metus posuere rutrum. \n' +
        'Phasellus eu augue dui. Proin in vestibulum ipsum. Aenean accumsan mollis sapien, ut \n' +
        'eleifend sem blandit at. Vivamus luctus mi eget lorem lobortis pharetra. Phasellus at tortor \n' +
        'quam, a volutpat purus. Etiam sollicitudin arcu vel elit bibendum et imperdiet risus tincidunt. \n' +
        'Etiam elit velit,\n' +
        ' posuere ut pulvinar ac, condimentum eget justo. Fusce a erat velit. Vivamus \n' +
        'imperdiet ultrices orci in hendrerit.  ',
      metadata: [Object],
      id: undefined
    }
  ]
}
*/
