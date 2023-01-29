import { EncryptionUtil } from "../util/EncryptionUtil";

const key = "lala";

const encrypted = EncryptionUtil.encrypt(key, "hello world");
console.log("Encrypted", encrypted);

const decrypted = EncryptionUtil.decrypt(key, encrypted);
console.log("Decrypted", decrypted);
