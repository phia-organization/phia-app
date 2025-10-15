import * as SQLite from "expo-sqlite";

export interface Measurement {
  id?: number;
  title: string;
  user: string;
  location: string;
  description: string;
  phInterval: string;
  date: string;
  phColor: string;
  phLevel: string;
  imageUri: string;
}

export const db = SQLite.openDatabaseSync("phia.db");

export const initDB = async () => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        user TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT,
        phInterval TEXT NOT NULL,
        date TEXT NOT NULL,
        phColor TEXT NOT NULL,
        phLevel TEXT NOT NULL,
        imageUri TEXT NOT NULL
      );`
    );
    console.log("Banco de dados inicializado com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
    throw error;
  }
};

export const addMeasurement = async (
  measurement: Measurement
): Promise<SQLite.SQLiteExecuteAsyncResult<unknown>> => {
  try {
    const statement = await db.prepareAsync(
      "INSERT INTO measurements (title, user, location, description, phInterval, date, phColor, phLevel, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const result = await statement.executeAsync(
      measurement.title,
      measurement.user,
      measurement.location,
      measurement.description,
      measurement.phInterval,
      measurement.date,
      measurement.phColor,
      measurement.phLevel,
      measurement.imageUri
    );
    return result;
  } catch (error) {
    console.error("Erro ao adicionar medição:", error);
    throw error;
  }
};

export const getAllMeasurements = async (): Promise<Measurement[]> => {
  try {
    const allRows = await db.getAllAsync<Measurement>(
      "SELECT * FROM measurements ORDER BY date DESC"
    );
    return allRows;
  } catch (error) {
    console.error("Erro ao buscar medições:", error);
    throw error;
  }
};

export const getLastMeasurement = async (): Promise<Measurement | null> => {
  try {
    const row = await db.getFirstAsync<Measurement>(
      "SELECT * FROM measurements ORDER BY date DESC"
    );
    return row;
  } catch (error) {
    console.error("Erro ao buscar medições:", error);
    throw error;
  }
};

export const deleteMeasurement = async (
  id: number
): Promise<SQLite.SQLiteExecuteAsyncResult<unknown>> => {
  try {
    const statement = await db.prepareAsync(
      "DELETE FROM measurements WHERE id = ?"
    );
    const result = await statement.executeAsync(id);
    return result;
  } catch (error) {
    console.error("Erro ao deletar medição:", error);
    throw error;
  }
};
