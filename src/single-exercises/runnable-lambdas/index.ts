import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { writeFileSync } from "fs";

const firstLambda = new RunnableLambda({ func: (x: number) => x + 1 });

const secondLambda = new RunnableLambda({ func: (x: number) => x * 2 });

const thirdLambda = new RunnableLambda({ func: (x: number) => x * 5 });

const firstSequence = firstLambda.pipe(secondLambda);

/**
 * A sequence of runnable lambdas created from an array of lambdas.
 * The sequence includes `firstLambda`, `secondLambda`, and `thirdLambda`.
 * 
 * @constant {RunnableSequence} secondSequence - The sequence of lambdas.
 */
const secondSequence = RunnableSequence.from([
  firstLambda,
  {
    secondLambda,
    thirdLambda,
  },
]);

const main = async () => {
  const responseFirstSequence = await firstSequence.invoke(10);
  const responseSecondSequence = await secondSequence.invoke(10);

  writeFileSync(
    `${__dirname}/responseFirstSecuence.txt`,
    "La salida de la primera secuencia es: " +
      JSON.stringify(responseFirstSequence, null, 2) +
      "\n",
    { flag: "a" }
  );

  writeFileSync(
    `${__dirname}/responseSecondSecuence.txt`,
    "La salida de la segunda secuencia es: " +
      JSON.stringify(responseSecondSequence, null, 2) +
      "\n",
    { flag: "a" }
  );
};

main().catch(console.error);
