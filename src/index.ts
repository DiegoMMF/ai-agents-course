import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
});

const main = async () => {
  const systemMessage = new SystemMessage(
    "Eres un profesor de programación que explica de manera sencilla y clara."
  );

  const humanMessage = new HumanMessage(
    "Qué hace el paquete de Node.js llamado: @xenova/transformers?"
  );

  const response = await llm.invoke([systemMessage, humanMessage]);

  console.log(response.content);
};

main().catch(console.error);

/*
Terminal output:

Hola! Gracias por la confianza en mi como profesor de programación. ¡Me alegra poder ayudarte!

El paquete de Node.js llamado `@xenova/transformers` es una biblioteca que proporciona una interfaz fácil de usar para interactuar con el modelo de transformadores de Hugging Face. Los transformadores son una clase de algoritmos de aprendizaje profundo que han demostrado ser muy efectivos en una variedad de tareas de procesamiento de lenguaje natural (NLP), como traducción, resumen, clasificación de texto y generación de texto.

El paquete `@xenova/transformers` te permite cargar y utilizar modelos de transformadores preentrenados de Hugging Face directamente en tu aplicación de Node.js. Además, proporciona una serie de utilidades y opciones de configuración para ayudarte a personalizar el procesamiento del lenguaje natural en tu aplicación.

Algunas de las características clave del paquete `@xenova/transformers` incluyen:

* Soporte para una variedad de tareas de NLP, como clasificación de texto, extracción de entidades, traducción y generación de texto.
* Una interfaz fácil de usar para cargar y utilizar modelos de transformadores preentrenados de Hugging Face.
* Opciones de configuración flexibles para personalizar el procesamiento del lenguaje natural en tu aplicación.
* Una API de pipeline que te permite encadenar diferentes pasos de procesamiento de lenguaje natural en una sola llamada.

En resumen, el paquete `@xenova/transformers` es una biblioteca útil para cualquiera que desee agregar capacidades de procesamiento de lenguaje natural a su aplicación de Node.js. Con su interfaz fácil de usar y su soporte para una variedad de tareas de NLP, es una excelente opción para cualquiera que desee aprovechar la potencia de los transformadores en su código.
*/
