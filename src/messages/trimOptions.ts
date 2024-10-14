import {
  TrimMessagesFields,
  BaseMessage,
  trimMessages,
} from "@langchain/core/messages";
import { model } from "../model/model";

export const trimOptions: TrimMessagesFields = {
  maxTokens: 1000,
  strategy: "last",
  includeSystem: true,
  tokenCounter: (messages: BaseMessage[]) => {
    return messages.reduce((acc, message) => acc + message.content.length, 0);
  },
};

export const trimmer = trimMessages({
  maxTokens: 45,
  strategy: "last",
  tokenCounter: model.getNumTokens,
  includeSystem: true,
});
