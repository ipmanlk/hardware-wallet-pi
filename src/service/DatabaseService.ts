import Database from "better-sqlite3";
import { unlink } from "fs/promises";
import { resolve } from "path";
import { DB_PATH } from "../constants";
import {
  CreateCredentialData,
  CreateCredentialUsageData,
  CreateDeviceData,
  CreateUserData,
  CredentialData,
  DBCredential,
  DBCredentialUsage,
  DBDevice,
  DBUser,
} from "../types";

export type User = {};

export type Device = {
  id: number;
};

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    });

    const selectStmt = this.db.prepare("SELECT * FROM Credential WHERE id = ?");
    const newRecord = selectStmt.get(info.lastInsertRowid);

    return {
      ...newRecord,
      password: "********",
    };
  }

  static async getCredentials(): Promise<DBCredential[]> {
    const stmt = this.db.prepare("SELECT * FROM Credential");
    return stmt.all()?.map((record) => ({
      ...record,
      status: this.getStatus(record),
    }));
  }

  static async getCredentialsByDomain(domain: string): Promise<DBCredential> {
    const stmt = this.db.prepare("SELECT * FROM Credential WHERE domain = ?");
    const record = stmt.get(domain);

    if (record) {
      return {
        ...record,
        status: this.getStatus(record),
      };
    }
    return record;
  }

  static async getCredentialById(id: number): Promise<DBCredential> {
    const stmt = this.db.prepare("SELECT * FROM Credential WHERE id = ?");
    const record = stmt.get(id);
    if (record) {
      return {
        ...record,
        status: this.getStatus(record),
      };
    }
    return record;
  }

  static deleteCredentialById(id: number) {
    const stmt = this.db.prepare("DELETE FROM Credential WHERE id = ?");
    stmt.run(id);
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

  private static getStatus(credential: DBCredential) {
    const updatedAt = new Date(credential.updatedAt);

    if (updatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 30 * 3) {
      return "expired";
    }

    return "active";
  }

  static async resetDb() {
    await unlink(DB_PATH);
    this.db = new Database(DB_PATH);
    await this.initializeDb();
  }

  static reloadDb() {
    this.db = new Database(DB_PATH);
  }
}
