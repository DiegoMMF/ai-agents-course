
import { chatGroq } from "./models";
import { msgs } from "./messages/messages";
import { BaseMessage, trimMessages } from "@langchain/core/messages";


const getTrimmedMessages: () => Promise<BaseMessage[]> = async () =>
  await trimMessages(msgs, {
    maxTokens: 45,
    strategy: "last",
    tokenCounter: chatGroq.getNumTokens,
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
  "role": "system",
  "content": "you're a good assistant, you always respond with a joke."
}

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
