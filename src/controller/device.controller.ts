import { Request, Response } from "express";
import { readFile, unlink, writeFile } from "fs/promises";
import { DB_PATH, FP_PATH, WALLET_BACKUP_KEY_PATH } from "../constants";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";
import { EncryptionUtil } from "../util/EncryptionUtil";
import { CredentialUtil } from "../util/CredentialUtil";
import { DBCredential } from "../types";

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
      const credentials = await DatabaseService.getCredentials();

      const decryptedCredentials = await Promise.all(
        credentials.map(async (c) => {
          const decryptedCredential = await CredentialUtil.decryptCredential(c);
          return {
            ...decryptedCredential,
          };
        })
      );

      const key = await this.getKey();

      const encryptedData = EncryptionUtil.encrypt(
        key,
        JSON.stringify(decryptedCredentials)
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
      const decryptedData = EncryptionUtil.decrypt(req.body.walletKey, data);
      const parsedData = JSON.parse(decryptedData) as DBCredential[];

      for (const credential of parsedData) {
        const encryptedData = await CredentialUtil.encryptCredential(
          credential
        );
        await DatabaseService.createCredential(encryptedData);
      }

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
