import dotenv from "dotenv";
dotenv.config();

import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { chatGroq } from "./models";

const main = async () => {
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

main().catch(console.error);

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
