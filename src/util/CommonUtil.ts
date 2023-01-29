import { createHash } from "crypto";
import { readFile } from "fs/promises";

export class CommonUtil {
  async getImageHash(filePath: string) {
    const image = await readFile(filePath);
    const hash = createHash("sha512");
    hash.update(image);
    return hash.digest("hex");
  }
}
