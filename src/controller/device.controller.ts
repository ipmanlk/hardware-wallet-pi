import { Request, Response } from "express";
import { readFile, unlink, writeFile } from "fs/promises";
import { DB_PATH, FP_PATH, WALLET_BACKUP_KEY_PATH } from "../constants";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";
import { EncryptionUtil } from "../util/EncryptionUtil";

export class DeviceController {
  static async getDeviceStatus(req: Request, res: Response) {
    const dbUser = await DatabaseService.getFirstUser();

    return res.json({
      data: {
        registered: !!dbUser,
      },
    });
  }

  static async resetDevice(req: Request, res: Response) {
    try {
      await DatabaseService.resetDb();
      await FingerprintService.deleteAll();
      await unlink(FP_PATH);
      await unlink(WALLET_BACKUP_KEY_PATH);
      return res.json({ message: "Device reset" });
    } catch (e) {
      console.error(e);
      return res.json({ error: true, message: "Failed to reset device" });
    }
  }

  static async getBackup(req: Request, res: Response) {
    try {
      const dbData = await readFile(DB_PATH);
      const key = await this.getKey();

      const encryptedData = EncryptionUtil.encrypt(
        key,
        dbData.toString("base64")
      );

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
      const buffer = Buffer.from(decryptedData, "base64");

      await writeFile(DB_PATH, buffer);

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
