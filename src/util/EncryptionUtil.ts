import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export class EncryptionUtil {
  static encrypt(key: string, data: string) {
    const algorithm = "aes-128-cbc";
    const paddedKey = key.padEnd(16, " ").slice(0, 16);
    const iv = randomBytes(16);
    const cipher = createCipheriv(algorithm, Buffer.from(paddedKey), iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  }

  static decrypt(key: string, data: string) {
    const algorithm = "aes-128-cbc";
    const paddedKey = key.padEnd(16, " ").slice(0, 16);
    const parts = data.split(":");
    const iv = Buffer.from(parts.shift() as string, "hex");
    const decipher = createDecipheriv(algorithm, Buffer.from(paddedKey), iv);
    let decrypted = decipher.update(parts.join(":"), "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
