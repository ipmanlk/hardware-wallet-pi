import Database from "better-sqlite3";
import { resolve } from "path";
const db = new Database(resolve(`${__dirname}/../../data/data.db`));

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  backupMac: string;
};

export class DatabaseService {
  static async createUser(user: User) {
    const stmt = db.prepare(
      "INSERT INTO User(firstName, lastName, backupMac) VALUES(@firstName, @lastName, @backupMac)"
    );
    const info = stmt.run(user);

    const selectStmt = db.prepare("SELECT * FROM User WHERE id = ?");
    return selectStmt.get(info.lastInsertRowid);
  }

  static async initializeDb() {
    db.exec(
      "CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, backupMac TEXT)"
    );

    db.exec(
      "CREATE TABLE IF NOT EXISTS Credential(id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT, name TEXT, username TEXT, password TEXT, createdAt TEXT, updatedAt TEXT)"
    );

    db.exec(
      "CREATE TABLE IF NOT EXISTS Device(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mac TEXT, createdAt TEXT, lastUsedAt TEXT)"
    );

    db.exec(
      "CREATE TABLE IF NOT EXISTS CredentialUsage(id INTEGER PRIMARY KEY AUTOINCREMENT, deviceId INTEGER, credentialId INTEGER, usedAt TEXT)"
    );
  }
}
