import { createHash } from "crypto";
import { readFile } from "fs/promises";

export class CommonUtil {
  static async getImageHash(filePath: string) {
    const image = await readFile(filePath);
    const hash = createHash("sha1");
    hash.update(image);
    return hash.digest("hex");
  }

  static getRandomString(length: number = 10) {
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
}
