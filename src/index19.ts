
import { chatGroq } from "./models";
import { messages } from "./messages/messages";
import { BaseMessage, trimMessages } from "@langchain/core/messages";


const getTrimmedMessages: () => Promise<BaseMessage[]> = async () =>
  await trimMessages(messages, {
    maxTokens: 50, // 45 tokens is the max number of tokens that can be sent to the model
    strategy: "last", // trim the last message
    tokenCounter: chatGroq.getNumTokens, // token counting function
    includeSystem: false, // don't include assistant messages in the trimmed messages
    allowPartial: true, // allow partial messages to be returned, meaning the last message will be cut off
    startOn: "human", // start trimming from the human message
  });

const main = async () => {
  const trimmedMessages = await getTrimmedMessages();
  console.log(
    trimmedMessages
      .map((x) =>
        JSON.stringify(
          {
            role: x.getType(),
            content: x.content,
          },
          null,
          2
        )
      )
      .join("\n\n")
  );
};

main().catch(console.error);

/* Terminal output:

{
  "role": "human",
  "content": "i wonder why it's called langchain"
}

{
  "role": "ai",
  "content": "Well... I guess they thought \"WordRope\" and \"SentenceString\"\n    just didn't have the same ring to it!"
}

{
  "role": "human",
  "content": "and who is harrison chasing anyways"
}

{
  "role": "ai",
  "content": "Hmmm let me think.\n    \n    Why, he's probably chasing after the last cup of coffee in the office!"
}

{
  "role": "human",
  "content": "what do you call a speechless parrot"
}
*/
