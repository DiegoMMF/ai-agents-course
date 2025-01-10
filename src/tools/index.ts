import { z } from "zod";
import { SqlDatabase } from "langchain/sql_db";
import { DataSource } from "typeorm";
import { saveOutput } from "../rag/utils";
import { createDatabase } from "./db";
import { chatGroq } from "../models/models";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Annotation } from "@langchain/langgraph";
import { QuerySqlTool } from "langchain/tools/sql";

// Chains are compositions of predictable steps. In LangGraph, we can represent a
// chain via simple sequence of nodes. Let’s create a sequence of steps that:
// - given a question,
// - converts the question into a SQL query;
// - executes the query;
// - uses the result to answer the original question.

// Annotations are used to define the structure of the state, which is the data
// that will be passed between nodes. And it is used to validate the data.

const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  query: Annotation<string>,
  result: Annotation<string>,
  answer: Annotation<string>,
});

const queryDatabase = async () => {
  // First, we need to create the database (if it doesn't exist)
  await createDatabase();

  // Then, we need to connect to the database using TypeORM
  const appDataSource = new DataSource({
    type: "sqlite",
    database: "./src/tools/db/chinook.db",
  });

  // Then, we need to connect to the database using LangChain's SqlDatabase class,
  // which represents a SQL database in LangChain framework. It will be used to
  // execute the SQL queries, and to get the table information:
  // - dialect: the database dialect
  // - top_k: the number of results to return
  // - table_info: the table information
  // - input: the user input
  const db = await SqlDatabase.fromDataSourceParams({ appDataSource });

  // We can test the connection to the database by running a query
  const vanillaSqlQueryResult = await db.run("SELECT * FROM Artist LIMIT 10;");
  saveOutput("vanillaSqlQueryResult", vanillaSqlQueryResult, "./src/tools/output/");

  // We already have a tool to execute SQL queries, we also could create a new one to
  // get the table information.
  const tableInfo = await db.getTableInfo();
  saveOutput("tableInfo", tableInfo, "./src/tools/output/");

  // Now, we need to create a prompt to convert the user input to a SQL query.
  // To reliably obtain SQL queries (absent markdown formatting and explanations or
  // clarifications), we will make use of LangChain’s structured output abstraction.

  // To save time and get more precise results, we will pull a prompt from the
  // Prompt Hub (https://smith.langchain.com/hub) to instruct the model.
  const queryPromptTemplateFromHub = await pull<ChatPromptTemplate>(
    "langchain-ai/sql-query-system-prompt"
  );
  saveOutput(
    "queryPromptTemplateFromHub",
    queryPromptTemplateFromHub.promptMessages[0].lc_kwargs.prompt.template,
    "./src/tools/output/"
  );

  // The prompt includes several parameters we will need to populate, such as the SQL
  // dialect and table schemas. LangChain’s SqlDatabase object includes methods to
  // help with this. Our writeQuery step will just populate these parameters and
  // prompt a model to generate the SQL query:
  const queryOutputRule = z.object({
    query: z.string().describe("Syntactically valid SQL query."),
  });

  // We will use the chatGroq model to generate the SQL query according to the
  // required structured output defined above.
  const llmWithStructuredQuery = chatGroq.withStructuredOutput(queryOutputRule);

  // We now create a function that will take user's input and generate the SQL query.
  const writeQuery = async (state: typeof InputStateAnnotation.State) => {
    const promptValue = await queryPromptTemplateFromHub.invoke({
      dialect: db.appDataSourceOptions.type, // dialect: "sqlite",
      top_k: 10, // meaning the top 10 results will be returned
      table_info: tableInfo, // information about the tables
      input: state.question, // the user input
    });
    const { query } = await llmWithStructuredQuery.invoke(promptValue);
    return { query };
  };

  const writeQueryResult = await writeQuery({
    question: "How many Employees are there?",
  });
  saveOutput("writeQueryResult", writeQueryResult, "./src/tools/output/");

  // This is the most dangerous part of creating a SQL chain. Consider carefully
  // if it is OK to run automated queries over your data. Minimize the database
  // connection permissions as much as possible. Consider adding a human approval
  // step to you chains before query execution.
  const executeQuery = async (state: typeof StateAnnotation.State) => {
    // We take a SQL database as a parameter and create one query SQL tool instance.
    const executeQueryTool = new QuerySqlTool(db);
    // We apply the structured query returned by writeQuery to our tool.
    return { result: await executeQueryTool.invoke(state.query) };
  };

  const executedQuerySqlTool = await executeQuery({
    question: "",
    query: "SELECT COUNT(*) AS EmployeeCount FROM Employee;",
    result: "",
    answer: "",
  });
  saveOutput("executedQuerySqlTool", executedQuerySqlTool, "./src/tools/output/");

  // Finally, our last step generates an answer that is non-sql user friendly to
  // the question given the information pulled from the database:
  const generateAnswer = async (state: typeof StateAnnotation.State) => {
    const promptValue =
      "Given the following user question, corresponding SQL query, " +
      "and SQL result, answer the user question.\n\n" +
      `Question: ${state.question}\n` +
      `SQL Query: ${state.query}\n` +
      `SQL Result: ${state.result}\n`;
    const response = await chatGroq.invoke(promptValue);
    return { answer: response.content };
  };
  
  // Let´s test the chain with three different questions:
  const finalAnswerOne = await generateAnswer({
    question: "How many albums has Aerosmith?",
    query: "",
    result: "",
    answer: "",
  });
  saveOutput("finalAnswerOne", finalAnswerOne, "./src/tools/output/");

  const finalAnswerTwo = await generateAnswer({
    question: "Which genre has the most albums?",
    query: "",
    result: "",
    answer: "",
  });
  saveOutput("finalAnswerTwo", finalAnswerTwo, "./src/tools/output/");

  const finalAnswerThree = await generateAnswer({
    question: "Which year was the first album released?",
    query: "",
    result: "",
    answer: "",
  });
  saveOutput("finalAnswerThree", finalAnswerThree, "./src/tools/output/");
};

queryDatabase();
