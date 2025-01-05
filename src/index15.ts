
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";


const firstLambda = new RunnableLambda({ func: (x: number) => x + 1 });

const secondLambda = new RunnableLambda({ func: (x: number) => x * 2 });

const thirdLambda = new RunnableLambda({ func: (x: number) => x * 5 });

const sequence = RunnableSequence.from([
  firstLambda,
  {
    secondLambda,
    thirdLambda,
  },
]);

const main = async () => console.log(await sequence.invoke(10));

main().catch(console.error);

/* Terminal output:

{ secondLambda: 22, thirdLambda: 55 }

*/