import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";
import dotenv from "dotenv";

dotenv.config();

// These are the examples that will be used to generate the response.
const examples = [
  { input: "2 ❤️ 2", output: "4" },
  { input: "2 ❤️ 3", output: "5" },
];

// This is a prompt template used to format each individual example.
const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "{input}"],
  ["ai", "{output}"],
]);

// This is a prompt template used to inject the examples into the prompt.
const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [], // no input variables
});

const main = async () => {
  // This is the final prompt that will be used to generate the response.
  const result = await fewShotPrompt.invoke({});

  // This is the response from the model.
  console.log(result.toChatMessages());
};

main().catch(console.error);

/*
Terminal output:

[
  HumanMessage {
    "content": "2 ❤️ 2",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "4",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  },
  HumanMessage {
    "content": "2 ❤️ 3",
    "additional_kwargs": {},
    "response_metadata": {}
  },
  AIMessage {
    "content": "5",
    "additional_kwargs": {},
    "response_metadata": {},
    "tool_calls": [],
    "invalid_tool_calls": []
  }
]
*/
