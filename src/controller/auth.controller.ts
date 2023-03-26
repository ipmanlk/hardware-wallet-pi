import { Request, Response } from "express";
import { writeFile } from "fs/promises";
import { WALLET_BACKUP_KEY_PATH } from "../constants";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";
import { InitialRegistrationData } from "../types";
import { CommonUtil } from "../util/CommonUtil";

export class AuthController {
  static async getDeviceStatus(req: Request, res: Response) {
    const dbUser = await DatabaseService.getFirstUser();

    return res.json({
      data: {
        registered: !!dbUser,
      },
    });
  }

  static async register(req: Request, res: Response) {
    const existingUser = await DatabaseService.getFirstUser();

    if (existingUser) {
      res.json({
        error: true,
        message: "Device is already registered",
      });
      return;
    }

    await FingerprintService.register();

    const data = req.body as InitialRegistrationData;
    const dbUser = await DatabaseService.createUser(data.user);

    const backupKey = CommonUtil.getRandomString();
    const walletKey = backupKey.slice(0, 5);
    const clientKey = backupKey.slice(5);

    await writeFile(WALLET_BACKUP_KEY_PATH, walletKey, "utf-8");

    return res.json({
      data: {
        ...dbUser,
        walletKey,
        clientKey,
      },
    });
  }

  static async login(req: Request, res: Response) {
    const dbUser = await DatabaseService.getFirstUser();

    if (!dbUser) {
      res.json({
        error: true,
        message: "Device is not registered",
      });
      return;
    }

    await FingerprintService.login();

    return res.json({
      data: dbUser,
    });
  }
}
