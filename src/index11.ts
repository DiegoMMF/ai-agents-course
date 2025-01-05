
import { chatGroq } from "./models";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const template = `Return a JSON object with a single key named "answer" that answers the following question: {question}.
Do not wrap the JSON output in markdown blocks.`;

const jsonPrompt = ChatPromptTemplate.fromTemplate(template);
const jsonParser = new JsonOutputParser();
const jsonChain = jsonPrompt.pipe(chatGroq).pipe(jsonParser);

const main = async () => {
  const stream = await jsonChain.stream({
    question: "Who invented the microscope?",
  });

  for await (const chunk of stream) console.log(chunk);
};

main().catch(console.error);

/*
Terminal output:

{ answer: '' }
{ answer: 'The' }
{ answer: 'The invention' }
{ answer: 'The invention of' }
{ answer: 'The invention of the' }
{ answer: 'The invention of the micro' }
{ answer: 'The invention of the microscope' }
{ answer: 'The invention of the microscope is' }
{ answer: 'The invention of the microscope is attributed' }
{ answer: 'The invention of the microscope is attributed to' }
{ answer: 'The invention of the microscope is attributed to Zach' }
{ answer: 'The invention of the microscope is attributed to Zachari' }
{
  answer: 'The invention of the microscope is attributed to Zacharias'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias J'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Jans'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen,'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spect'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker,'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late 1'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late 16'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late 16th'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late 16th century'
}
{
  answer: 'The invention of the microscope is attributed to Zacharias Janssen, a Dutch spectacle maker, in the late 16th century.'
}
*/
