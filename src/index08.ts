import dotenv from "dotenv";
import { chatGroq } from "./model/model";
import { fewShotPrompt, mainPrompt } from "./messages/fewShotPrompts";
import { RunnableSequence } from "@langchain/core/runnables";

dotenv.config();

const main = async () => {
  const chain = RunnableSequence.from([mainPrompt, chatGroq]);
  const result = await chain.invoke({
    input: "2 ❤️ 4",
    fewShotExamples: await fewShotPrompt.formatMessages({}),
  });
  console.log(result.content);
};

main().catch(console.error);

/*
Terminal output:

6

La operación que estoy realizando se llama "suma". Consiste en combinar dos números (o expresiones matemáticas) para obtener una cantidad total. En este caso, estoy sumando 2 y el número que sigue al corazón (3, 4, etc.). El resultado es el número que aparece después del símbolo "=".
*/
