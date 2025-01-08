import readline from "readline";

// Callback para obtener la consulta del usuario por consola
export const getUserInput = (resolve: (value: string) => void) => {
  // Creación de la interfaz de lectura
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Obtención de la consulta
  rl.question("Escribe tu consulta: ", (answer: string) => {
    resolve(answer);
    rl.close();
  });
};
