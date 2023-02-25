import Database from "better-sqlite3";
import { unlink } from "fs/promises";
import { resolve } from "path";
import {
  CreateCredentialData,
  CreateCredentialUsageData,
  CreateDeviceData,
  CreateUserData,
  DBCredential,
  DBCredentialUsage,
  DBDevice,
  DBUser,
} from "../types";

export type User = {};

export type Device = {
  id: number;
};

const DB_PATH = resolve(`${__dirname}/../../data/data.db`);

export class DatabaseService {
  private static db = new Database(DB_PATH);

  static async createUser(data: CreateUserData): Promise<DBUser> {
    const stmt = this.db.prepare(
      "INSERT INTO User(firstName, lastName, backupMac, createdAt) VALUES(@firstName, @lastName, @backupMac, @createdAt)"
    );

    const info = stmt.run({
      ...data,
      createdAt: new Date().toISOString(),
      backupMac: data.backupMac ? data.backupMac : null,
    });

    const selectStmt = this.db.prepare("SELECT * FROM User WHERE id = ?");
    return selectStmt.get(info.lastInsertRowid);
  }

  static async getFirstUser(): Promise<DBUser> {
    const stmt = this.db.prepare("SELECT * FROM User LIMIT 1");
    return stmt.get();
  }

  static async createDevice(data: CreateDeviceData): Promise<DBDevice> {
    const stmt = this.db.prepare(
      "INSERT INTO Device(name, mac) VALUES(@name, @mac, @createdAt, @lastUsedAt)"
    );
    const info = stmt.run({
      ...data,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    });

    const selectStmt = this.db.prepare("SELECT * FROM Device WHERE id = ?");
    return selectStmt.get(info.lastInsertRowid);
  }

  static async getDeviceByMac(mac: string): Promise<DBDevice> {
    const stmt = this.db.prepare("SELECT * FROM Device WHERE mac = ?");
    return stmt.get(mac);
  }

  static async createCredential(
    data: CreateCredentialData
  ): Promise<DBCredential> {
    const stmt = this.db.prepare(
      "INSERT INTO Credential(domain, name, username, password, createdAt, updatedAt) VALUES(@domain, @name, @username, @password, @createdAt, @updatedAt)"
    );
    const info = stmt.run({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const selectStmt = this.db.prepare("SELECT * FROM Credential WHERE id = ?");
    const newRecord = selectStmt.get(info.lastInsertRowid);

    return {
      ...newRecord,
      password: "********",
    };
  }

  static async getCredentialsByDomain(domain: string): Promise<DBCredential> {
    const stmt = this.db.prepare("SELECT * FROM Credential WHERE domain = ?");
    return stmt.get(domain);
  }

  static async createCredentialUsage(
    data: CreateCredentialUsageData
  ): Promise<DBCredentialUsage> {
    const stmt = this.db.prepare(
      "INSERT INTO CredentialUsage(deviceId, credentialId, usedAt) VALUES(@deviceId, @credentialId, @usedAt)"
    );
    const info = stmt.run({
      ...data,
      usedAt: new Date().toISOString(),
    });

    const selectStmt = this.db.prepare(
      "SELECT * FROM CredentialUsage WHERE id = ?"
    );
    return selectStmt.get(info.lastInsertRowid);
  }

  static async initializeDb() {
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS User(id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, backupMac TEXT DEFAULT NULL, createdAt TEXT)"
    );

    this.db.exec(
      "CREATE TABLE IF NOT EXISTS Credential(id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT, name TEXT, username TEXT, password TEXT, createdAt TEXT, updatedAt TEXT)"
    );

    this.db.exec(
      "CREATE TABLE IF NOT EXISTS Device(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, mac TEXT, createdAt TEXT, lastUsedAt TEXT)"
    );

    this.db.exec(
      "CREATE TABLE IF NOT EXISTS CredentialUsage(id INTEGER PRIMARY KEY AUTOINCREMENT, deviceId INTEGER, credentialId INTEGER, usedAt TEXT)"
    );
  }

  static async resetDb() {
    await unlink(DB_PATH);
    this.db = new Database(DB_PATH);
    await this.initializeDb();
  }
}
