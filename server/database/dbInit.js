import { getDb } from "./db.js";

export async function initializeDatabase() {

let db = await getDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS currencyHold (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        currency INTEGER NOT NULL,
        amount REAL NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (currency) REFERENCES currencies(id),
        UNIQUE(userId, currency)

    );

    CREATE TABLE IF NOT EXISTS currencies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        symbol TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS auth(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE,
        token TEXT
        );

    INSERT INTO currencies (name, code, symbol) VALUES
        ('US Dollar', 'USD', '$'),
        ('Euro', 'EUR', '€'),
        ('British Pound', 'GBP', '£')    
`);
    }