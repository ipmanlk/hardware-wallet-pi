import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { FP_PATH, WALLET_BACKUP_KEY_PATH } from "../constants";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";

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
}
