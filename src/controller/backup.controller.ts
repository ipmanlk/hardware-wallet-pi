import { Request, Response } from "express";
import { readFile, writeFile } from "fs/promises";
import { DB_PATH, WALLET_BACKUP_KEY_PATH } from "../constants";
import { DatabaseService } from "../service/DatabaseService";
import { EncryptionUtil } from "../util/EncryptionUtil";

export class BackupController {
  static async getBackup(req: Request, res: Response) {
    try {
      const dbData = await readFile(DB_PATH, "utf-8");
      const key = await this.getKey();
      const encryptedData = EncryptionUtil.encrypt(key, dbData);

      return res.json({
        data: encryptedData,
      });
    } catch (e) {
      console.error(e);
      return res.json({
        error: true,
        message: "Failed to get backup",
      });
    }
  }

  static async restoreBackup(req: Request, res: Response) {
    try {
      const data = req.body.data;
      const key = await this.getKey();
      const decryptedData = EncryptionUtil.decrypt(key, data);

      await writeFile(DB_PATH, decryptedData, "utf-8");

      DatabaseService.reloadDb();

      return res.json({
        message: "Backup restored",
      });
    } catch (e) {
      console.error(e);
      return res.json({
        error: true,
        message: "Failed to restore backup",
      });
    }
  }

  private static getKey() {
    return readFile(WALLET_BACKUP_KEY_PATH, "utf-8");
  }
}
