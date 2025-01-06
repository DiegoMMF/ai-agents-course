import {
  TrimMessagesFields,
  BaseMessage,
  trimMessages,
} from "@langchain/core/messages";
import { chatGroq } from "../models";
import { msgs } from "./messages";

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
 *
 * @constant
 * @type {object}
 * @property {number} maxTokens - The maximum number of tokens allowed.
 * @property {string} strategy - The strategy to use for trimming messages. Possible values are "first" or "last".
 * @property {function} tokenCounter - A function to count the number of tokens in a message.
 * @property {boolean} includeSystem - Whether to include system messages in the trimming process.
 */
export const trimmer: object = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: chatGroq.getNumTokens,
  includeSystem: true,
});

/**
 * Retrieves trimmed messages based on the specified options.
 *
 * @returns {Promise<BaseMessage[]>} A promise that resolves to an array of trimmed messages.
 */
export const getTrimmedMessages: () => Promise<BaseMessage[]> = async (): Promise<
  BaseMessage[]
> =>
  await trimMessages(msgs, {
    maxTokens: 45,
    strategy: "last",
    tokenCounter: chatGroq.getNumTokens,
  });
