import dotenv from "dotenv";
import { RunnableLambda } from "@langchain/core/runnables";

dotenv.config();

const firstLambda = new RunnableLambda({ func: (x: number) => x + 1 });

const secondLambda = new RunnableLambda({ func: (x: number) => x * 2 });

const sequence = firstLambda.pipe(secondLambda);

const main = async () => console.log(await sequence.invoke(10));

main().catch(console.error);

// Terminal output: 22
