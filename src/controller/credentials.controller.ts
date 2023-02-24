import { Request, Response } from "express";
import { DatabaseService } from "../service/DatabaseService";
import { CreateCredentialData } from "../types";

export class CredentialsController {
  static async createCredential(req: Request, res: Response) {
    const data = req.body as CreateCredentialData;
    const dbCredential = await DatabaseService.createCredential(data);

    return res.json({ data: dbCredential });
  }

  static async getCredentialByDomain(req: Request, res: Response) {
    const dbCredentials = await DatabaseService.getCredentialsByDomain(
      req.query.domain as string
    );

    return res.json({ data: dbCredentials });
  }
}
