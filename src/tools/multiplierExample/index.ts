import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Let's create a tool that multiplies two numbers.
const func = ({ a, b }: { a: number; b: number }): number => a * b;
const fields = {
  name: "multiply",
  description: "Multiply two numbers",
  schema: z.object({ a: z.number(), b: z.number() }),
};

const multiply = tool(func, fields);

// * LangChain has a few other ways to create tools; e.g., by sub-classing the
// * 'StructuredTool' class or by using 'StructuredTool'. These methods are shown in
// * the 'how to create custom tools' guide, but we generally recommend using the
// * 'tool' function for most cases.

multiply.invoke({ a: 2, b: 3 }).then((res) => console.log(res));
