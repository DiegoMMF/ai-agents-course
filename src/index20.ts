
import { chatGroq } from "./models";
import { msgs } from "./messages/messages";
import { BaseMessage, trimMessages } from "@langchain/core/messages";


// Imperative use of trimMessages
const getTrimmedMessages: () => Promise<BaseMessage[]> = async () =>
  await trimMessages(msgs, {
    maxTokens: 50,
    strategy: "last",
    tokenCounter: chatGroq.getNumTokens,
    includeSystem: false,
    allowPartial: true,
    startOn: "human",
  });

// Declarative use of trimMessages
const trimmer = trimMessages({
  maxTokens: 50,
  strategy: "last",
  tokenCounter: chatGroq.getNumTokens,
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
  const chain = await trimmer.pipe(chatGroq).invoke(msgs);
  console.log(chain.content);
};

main().catch(console.error);

/* Terminal output:

A "silent squawker" or a "mute mimic"!
    Quite an oxymoron, isn't it?
*/
