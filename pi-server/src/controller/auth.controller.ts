import { Request, Response } from "express";
import { DatabaseService, User } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";

export class AuthController {
  static async register(req: Request, res: Response) {
    await FingerprintService.register();

    const data = req.body as User;
    const dbData = await DatabaseService.createUser(data);

    return res.json(dbData);
  }

  static async login(req: Request, res: Response) {
    const data = await FingerprintService.login();

    return res.json({
      data,
    });
  }
}
