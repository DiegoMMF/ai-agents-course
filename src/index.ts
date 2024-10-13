import dotenv from "dotenv";
import { model } from "./model/model";
import { messages } from "./messages/messages";
import { BaseMessage, trimMessages } from "@langchain/core/messages";

dotenv.config();

// Imperative use of trimMessages
const getTrimmedMessages: () => Promise<BaseMessage[]> = async () =>
  await trimMessages(messages, {
    maxTokens: 50,
    strategy: "last",
    tokenCounter: model.getNumTokens,
    includeSystem: false,
    allowPartial: true,
    startOn: "human",
  });

// Declarative use of trimMessages
const trimmer = trimMessages({
  maxTokens: 50,
  strategy: "last",
  tokenCounter: model.getNumTokens,
  includeSystem: false,
  allowPartial: true,
  startOn: "human",
});

const main = async () => {
  // Imperative use of trimmer
  // const trimmedMessages = await getTrimmedMessages();
  // console.log(
  //   trimmedMessages
  //     .map((x) => JSON.stringify({ role: x.getType(), content: x.content }, null, 2))
  //     .join("\n\n")
  // );

  // Declarative use of trimmer
  const chain = await trimmer.pipe(model).invoke(messages);
  console.log(chain.content);
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
