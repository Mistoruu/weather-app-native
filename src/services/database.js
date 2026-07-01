import * as SQLite from 'expo-sqlite';

const getDB = async () => {
  return await SQLite.openDatabaseAsync('weather_secure.db');
};

// Initialisation des tables (appelée au démarrage de l'app)
export const initDatabase = async () => {
  const db = await getDB();
  
  // Table pour l'historique des recherches
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT NOT NULL,
      country TEXT,
      temp INTEGER,
      condition TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table pour les favoris
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city_name TEXT UNIQUE NOT NULL,
      country TEXT
    );
  `);
};

//FONCTIONS POUR L'HISTORIQUE DES RECHERCHES 
export const addToHistory = async (city, country, temp, condition) => {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO history (city_name, country, temp, condition) VALUES (?, ?, ?, ?);',
    [city, country, temp, condition]
  );
};

export const getHistory = async () => {
  const db = await getDB();
  return await db.getAllAsync('SELECT * FROM history ORDER BY id DESC LIMIT 5;');
};

export const clearHistory = async () => {
  const db = await getDB();
  await db.runAsync('DELETE FROM history;');
};

// FONCTIONS POUR LES FAVORIS 

export const addToFavorites = async (city, country) => {
  const db = await getDB();
  try {
    await db.runAsync('INSERT INTO favorites (city_name, country) VALUES (?, ?);', [city, country]);
  } catch (e) {
    console.log("Déjà en favori");
  }
};

export const removeFromFavorites = async (city) => {
  const db = await getDB();
  await db.runAsync('DELETE FROM favorites WHERE city_name = ?;', [city]);
};

export const getFavorites = async () => {
  const db = await getDB();
  return await db.getAllAsync('SELECT * FROM favorites ORDER BY city_name ASC;');
};

export const isFavorite = async (city) => {
  const db = await getDB();
  const row = await db.getFirstAsync('SELECT id FROM favorites WHERE city_name = ?;', [city]);
  return row !== null;
};