import { readFileSync, existsSync } from "fs";
import path from "path";
import sqlite3 from "sqlite3";
import { saveOutput } from "../../../rag/utils";

sqlite3.verbose();

export const createDatabase = async () => {
  const dbPath = path.resolve(__dirname, "./chinook.db");
  const scriptPath = path.resolve(__dirname, "./chinook.sql");

  // Verificar si la base de datos ya existe
  if (existsSync(dbPath)) {
    console.log("La base de datos ya existe.");
    return;
  }

  // Leer el script SQL
  const sqlScript = readFileSync(scriptPath, "utf-8");

  // Crear y conectar a la base de datos
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error al conectar a SQLite:", err);
    } else {
      console.log("Base de datos creada correctamente.");
    }
  });

  // Ejecutar el script SQL
  db.exec(sqlScript, (err) => {
    if (err) {
      console.error("Error al ejecutar el script SQL:", err);
    } else {
      console.log("Script SQL ejecutado correctamente.");
    }

    db.close(); // Cerrar la conexión
  });

  saveOutput("db", db, "./src/tools/output/");
};
