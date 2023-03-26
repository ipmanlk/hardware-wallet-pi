import { FP_PATH } from "../constants";
import { CredentialData } from "../types";
import { CommonUtil } from "./CommonUtil";
import { EncryptionUtil } from "./EncryptionUtil";

export class CredentialUtil {
  static async encryptCredential(credential: CredentialData) {
    const key = await this.getKey();

    return {
      ...credential,
      username: EncryptionUtil.encrypt(key, credential.username),
      password: EncryptionUtil.encrypt(key, credential.password),
    };
  }

  static async decryptCredential(encryptedCredential: CredentialData) {
    const key = await this.getKey();

    return {
      ...encryptedCredential,
      username: EncryptionUtil.decrypt(key, encryptedCredential.username),
      password: EncryptionUtil.decrypt(key, encryptedCredential.password),
    };
  }

  private static getKey() {
    return CommonUtil.getImageHash(FP_PATH);
  }
}
