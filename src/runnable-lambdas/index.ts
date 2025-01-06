import { RunnableLambda } from "@langchain/core/runnables";
import { writeFileSync } from "fs";

const firstLambda = new RunnableLambda({ func: (x: number) => x + 1 });

const secondLambda = new RunnableLambda({ func: (x: number) => x * 2 });

const sequence = firstLambda.pipe(secondLambda);

const main = async () =>
  writeFileSync(
    `${__dirname}/response.txt`,
    "La salida de la cadena es: " +
      JSON.stringify(await sequence.invoke(10), null, 2) +
      "\n",
    { flag: "a" }
  );

main().catch(console.error);
