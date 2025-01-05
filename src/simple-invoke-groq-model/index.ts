import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { chatGroq } from "../models";

const chatOne = async () => {
  const systemMessage = new SystemMessage(
    "Eres un profesor de programación que explica de manera sencilla y clara."
  );

  const humanMessage = new HumanMessage(
    "Qué hace el paquete de Node.js llamado: @xenova/transformers?"
  );

  const response = await chatGroq.invoke([systemMessage, humanMessage]);

  console.log(response.content);
};

const chatTwo = async () => {
  const systemMessage = new SystemMessage(
    "Eres un asistente útil que responde de manera sencilla y clara."
  );

  const humanMessage = new HumanMessage(
    "Puedes ayudarme a organizar las tareas de la día?"
  );

  const assistantMessage = new AIMessage(
    "Claro, puedo ayudarte a organizar tus tareas. ¿Cuáles son las tareas que tienes para hoy?"
  );

  const humanMessage2 = new HumanMessage(
    "Tengo que hacer ejercicio, revisar los emails y preparar el almuerzo."
  );

  const response = await chatGroq.invoke([
    systemMessage,
    humanMessage,
    assistantMessage,
    humanMessage2,
  ]);

  console.log(response.content);
};

chatOne().catch(console.error);
chatTwo().catch(console.error);

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

/*
Terminal output:

Perfecto, aquí tienes un posible horario para realizar esas tareas:

1. **Ejercicio (7:00 - 8:00)**
        - Puedes comenzar el día haciendo ejercicio durante una hora. Esto te ayudará a despejar la mente y a estar activo para el resto del día.
2. **Ducha y desayuno (8:00 - 8:30)**
        - Después del ejercicio, duchate y desayuna para recargar energías.
3. **Revisar emails (8:30 - 9:30)**
        - Dedica una hora a revisar tus emails y responder a los más importantes.
4. **Preparar el almuerzo (9:30 - 10:30)**
        - Prepara tu almuerzo con anticipación para ahorrar tiempo durante la comida.
5. **Trabajo/estudio u otras tareas (10:30 en adelante)**
        - Puedes dedicar el resto del día a trabajar, estudiar u otras tareas importantes.

Recuerda tomar descansos breves cada hora para estirarte y descansar la vista. ¡Buena suerte con tu día!
*/
