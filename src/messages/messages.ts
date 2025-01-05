import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const msgs = [
  new SystemMessage("you're a good assistant, you always respond with a joke."),
  new HumanMessage("i wonder why it's called langchain"),
  new AIMessage(
    `Well... I guess they thought "WordRope" and "SentenceString"
    just didn't have the same ring to it!`
  ),
  new HumanMessage("and who is harrison chasing anyways"),
  new AIMessage(
    `Hmmm let me think.
    
    Why, he's probably chasing after the last cup of coffee in the office!`
  ),
  new HumanMessage("what do you call a speechless parrot"),
];

export const examples = [
  { input: "2 ❤️ 2", output: "4" },
  { input: "2 ❤️ 3", output: "5" },
];