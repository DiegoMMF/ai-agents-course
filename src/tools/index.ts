import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { saveOutput } from "../rag/utils";
import { createDatabase } from "./db";

const type = "sqlite";
const database = "./src/tools/db/chinook.db";


const queryDatabase = async () => {
  await createDatabase();

  const appDataSource = new DataSource({ type, database });
  
  const db = await SqlDatabase.fromDataSourceParams({ appDataSource });

  const queryResult = await db.run("SELECT * FROM Artist LIMIT 10;");
  saveOutput("queryResult", queryResult, "./src/tools/output/");
};

queryDatabase();
