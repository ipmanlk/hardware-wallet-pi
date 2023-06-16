import { Request, Response } from "express";
import { DatabaseService } from "../service/DatabaseService";
import { CreateCredentialData, DBCredential } from "../types";
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
      decryptedCredentials = await CredentialUtil.decryptCredential(
        dbCredential
      );

      await DatabaseService.updateCredentialExposedStatus(
        dbCredential.id,
        req.body.mac
      );
    }

    return res.json({ found: !!dbCredential, data: decryptedCredentials });
  }

  static async getCredentialById(req: Request, res: Response) {
    const id = +req.params.id;
    const dbCredential = await DatabaseService.getCredentialById(
      id,
      req.body.mac
    );

    let decryptedCredential;

    if (dbCredential) {
      decryptedCredential = await CredentialUtil.decryptCredential(
        dbCredential
      );
    }

    return res.json({ found: !!dbCredential, data: decryptedCredential });
  }

  static async getCredentials(req: Request, res: Response) {
    const dbCredentials = await DatabaseService.getCredentials();

    return res.json({
      data: await Promise.all(
        dbCredentials.map(async (c) => {
          const decryptedCredential = await CredentialUtil.decryptCredential(c);
          return {
            ...decryptedCredential,
            password: "********",
          };
        })
      ),
    });
  }

  static async deleteCredential(req: Request, res: Response) {
    const id = +req.params.id;
    await DatabaseService.deleteCredentialById(id);
    return res.json({ message: "Credential deleted" });
  }

  static async patchCredential(req: Request, res: Response) {
    const id = +req.params.id;
    const dbCredential = (await DatabaseService.getCredentialById(
      id,
      req.body.mac
    )) as CreateCredentialData;

    await DatabaseService.deleteCredentialById(id);

    const decryptedCredential = await CredentialUtil.decryptCredential(
      dbCredential
    );

    //@ts-ignore
    delete dbCredential.id;

    const encryptedData = await CredentialUtil.encryptCredential(
      decryptedCredential
    );

    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const newDbCredential = await DatabaseService.createCredential({
      ...encryptedData,
      createdAt: fourMonthsAgo.toISOString(),
      updatedAt: fourMonthsAgo.toISOString(),
    });

    return res.json({ data: newDbCredential });
  }

  static async updateCredential(req: Request, res: Response) {
    const dbCredential = (await DatabaseService.getCredentialsByDomain(
      req.body.domain
    )) as CreateCredentialData;

    //@ts-ignore
    await DatabaseService.deleteCredentialById(dbCredential.id);

    const decryptedCredential = await CredentialUtil.decryptCredential(
      dbCredential
    );

    //@ts-ignore
    delete dbCredential.id;

    const encryptedData = await CredentialUtil.encryptCredential({
      ...decryptedCredential,
      password: req.body.password,
    });

    const newDbCredential = await DatabaseService.createCredential({
      ...encryptedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return res.json({ data: newDbCredential });
  }
}
