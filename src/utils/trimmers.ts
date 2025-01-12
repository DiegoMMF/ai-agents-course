import {
  TrimMessagesFields,
  BaseMessage,
  trimMessages,
} from "@langchain/core/messages";
import { chatGroq } from "./models";
import { msgs } from "./messages";
import { Runnable } from "@langchain/core/runnables";

/**
 * Configuration options for trimming messages.
 *
 * @property {number} maxTokens - The maximum number of tokens allowed.
 * @property {"first" | "last"} strategy - The strategy to use for trimming messages.
 *                                         "first" removes messages from the beginning,
 *                                         "last" removes messages from the end.
 * @property {boolean} includeSystem - Whether to include system messages in the trimming process.
 * @property {(messages: BaseMessage[]) => number} tokenCounter - A function to count the total number of tokens
 *                                                                in the provided messages.
 */
export const trimOptions: TrimMessagesFields = {
  maxTokens: 100,
  strategy: "last",
  includeSystem: true,
  tokenCounter: (messages: BaseMessage[]) => {
    return messages.reduce((acc, message) => acc + message.content.length, 0);
  },
};

/**
 * Trims messages based on the provided options.
 * * DECLARATIVE USE OF TRIMMER
 *
 * @constant
 * @type {object}
 * @property {number} maxTokens - The maximum number of tokens allowed.
 * @property {string} strategy - The strategy to use for trimming messages. Possible values are "first" or "last".
 * @property {function} tokenCounter - A function to count the number of tokens in a message.
 * @property {boolean} includeSystem - Whether to include system messages in the trimming process.
 */
export const trimmer: Runnable<BaseMessage[], BaseMessage[]> = trimMessages({
  maxTokens: 50,
  strategy: "last",
  tokenCounter: chatGroq.getNumTokens,
  includeSystem: false,
  allowPartial: true,
  startOn: "human",
});

/**
 * Retrieves trimmed messages based on the specified options.
 * * IMPERATIVE USE OF TRIMMER
 *
 * @returns {Promise<BaseMessage[]>} A promise that resolves to an array of trimmed messages.
 */
export const getTrimmedMessages: () => Promise<BaseMessage[]> = async (): Promise<
  BaseMessage[]
> =>
  await trimMessages(msgs, {
    maxTokens: 50, // 45 tokens is the max number of tokens that can be sent to the model
    strategy: "last", // trim the last message
    tokenCounter: chatGroq.getNumTokens, // token counting function
    includeSystem: false, // don't include assistant messages in the trimmed messages
    allowPartial: true, // allow partial messages to be returned, meaning the last message will be cut off
    startOn: "human", // start trimming from the human message
  });
