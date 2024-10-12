import { TrimMessagesFields, BaseMessage } from "@langchain/core/messages";

export const trimOptions: TrimMessagesFields = {
  maxTokens: 1000,
  strategy: "last",
  includeSystem: true,
  tokenCounter: (messages: BaseMessage[]) => {
    return messages.reduce((acc, message) => acc + message.content.length, 0);
  },
};
