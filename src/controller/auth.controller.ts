import { Request, Response } from "express";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";
import { InitialRegistrationData } from "../types";

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

    return res.json({ data: dbUser });
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
