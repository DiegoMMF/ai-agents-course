import { BaseMessage, TrimMessagesFields } from "@langchain/core/messages";
import { trimMessages } from "@langchain/core/messages";
import { messages } from "./messages/messages";
import dotenv from "dotenv";
import { chatGroq } from "./models";

dotenv.config();

const trimOptions: TrimMessagesFields = {
  maxTokens: 1000, // El mínimo debe dejar dentro al menos un mensaje, o arrojará error
  strategy: "last", // Mantiene los últimos mensajes dentro del límite de tokens
  includeSystem: true,
  tokenCounter: (messages: BaseMessage[]) => {
    return messages.reduce((acc, message) => acc + message.content.length, 0);
  },
};

const main = async () => {
  const trimmedMessages = await trimMessages(messages, trimOptions);

  const response = await chatGroq.invoke(trimmedMessages);

  console.log(response.content);
};

main().catch(console.error);

/*
Terminal output:

¡Claro que puedo ayudarte a organizar tus tareas del día! Aquí te propongo un horario para que puedas realizar tus actividades de manera eficiente:

1. **Ejercicio (7:00 - 8:00 am)**
Comienza el día con una rutina de ejercicios para activar tu cuerpo y mente. Puedes salir a correr, hacer yoga, o el entrenamiento que prefieras.

2. **Ducha y desayuno (8:00 - 8:45 am)**
Después de hacer ejercicio, date una ducha refrescante y prepara un desayuno nutritivo para recargar energías.

3. **Revisar emails (9:00 - 10:00 am)**
Dedica una hora a revisar y responder tus emails importantes. Trata de priorizar los mensajes y eliminar el spam.

4. **Tarea adicional (10:00 - 11:30 am)**
Si tienes alguna otra tarea pendiente, como trabajos o tareas del hogar, aprovecha este tiempo para avanzar en ellas.

5. **Preparar el almuerzo (11:30 am - 12:30 pm)**
Prepara un almuerzo saludable y balanceado. Puedes cocinar algo rápido y fácil, como ensaladas, sándwiches o sopas.

6. **Tiempo libre (12:30 - 1:30 pm)**
Después de preparar el almuerzo, tómate un tiempo libre para relajarte, leer un libro, ver una serie o simplemente descansar.

7. **Continuar con tareas pendientes (1:30 - 4:00 pm)**
Regresa a tus tareas pendientes y trata de completarlas antes de que termine el día.

8. **Actividades de ocio (4:00 pm en adelante)**
Reserva el resto del día para actividades de ocio, como ver películas, pasar tiempo con amigos o familia, o hacer algo que disfrutes.

Recuerda que este es solo un ejemplo de horario, y puedes ajustarlo a tus necesidades y preferencias. ¡Espero que te sea útil para organizar tus tareas del día!
*/
