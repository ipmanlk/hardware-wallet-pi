import { Request, Response } from "express";
import { DatabaseService } from "../service/DatabaseService";
import { CreateCredentialData } from "../types";
import { CredentialUtil } from "../util/CredentialUtil";

export class CredentialsController {
  static async createCredential(req: Request, res: Response) {
    const data = req.body as CreateCredentialData;
    const encryptedData = await CredentialUtil.encryptCredential(data);
    const dbCredential = await DatabaseService.createCredential(encryptedData);

    return res.json({ data: dbCredential });
  }

  static async getCredentialByDomain(req: Request, res: Response) {
    const dbCredential = await DatabaseService.getCredentialsByDomain(
      req.query.domain as string
    );

    let decryptedCredentials;

    if (dbCredential) {
      decryptedCredentials = CredentialUtil.decryptCredential(dbCredential);
    }

    return res.json({ found: !!dbCredential, data: decryptedCredentials });
  }

  static async getCredentials(req: Request, res: Response) {
    const dbCredentials = await DatabaseService.getCredentials();

    return res.json({
      data: dbCredentials.map((c) => {
        const decryptedCredential = CredentialUtil.decryptCredential(c);
        return {
          ...decryptedCredential,
          password: "********",
        };
      }),
    });
  }

  static async deleteCredential(req: Request, res: Response) {
    const id = +req.params.id;
    await DatabaseService.deleteCredentialById(id);
    return res.json({ message: "Credential deleted" });
  }
}
