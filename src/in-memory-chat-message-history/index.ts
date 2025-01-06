import { chatGroq } from "../models";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage } from "@langchain/core/messages";
import { writeFileSync } from "fs";
import { dummyGetSessionHistoryV1 as getMessageHistory } from "../messages/inMemoryChatMessageHistoriy";
import { trimmer } from "../messages/trimOptions";

const runnable = trimmer.pipe(chatGroq);

const chainWithHistory = new RunnableWithMessageHistory({
  runnable,
  getMessageHistory,
});

const main = async () => {
  const result = await chainWithHistory.invoke(
    [new HumanMessage("Hello, how are you?")],
    { configurable: { sessionId: "1" } }
  );
  writeFileSync(`${__dirname}/response.json`, JSON.stringify(result, null, 2));
};

main().catch(console.error);
