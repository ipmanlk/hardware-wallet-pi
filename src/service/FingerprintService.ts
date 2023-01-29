import { spawn } from "child_process";
import { copyFile } from "fs/promises";
import { ExecutionService } from "./ExecutionService";

const SCRIPT_PATH = "/usr/share/doc/python3-fingerprint/examples";

const REGISTER_SCRIPT = `${SCRIPT_PATH}/example_enroll.py`;
const DOWNLOAD_SCRIPT = `${SCRIPT_PATH}/example_downloadimage.py`;

export class FingerprintService {
  static async register() {
    while (true) {
      try {
        let scanData = "";

        await ExecutionService.execute({
          scriptPath: REGISTER_SCRIPT,
          callbacks: {
            onData: (params) => {
              if (params.data.toString().includes("enrolled successfully")) {
                params.script.kill();
                params.resolve(params.data);
              }
            },
            onError: (params) => {
              params.reject(params.data);
            },
            onClose: (params) => {
              params.resolve(params.data);
              scanData = params.data.toString();
            },
          },
        });

        await ExecutionService.execute({
          scriptPath: DOWNLOAD_SCRIPT,
          callbacks: {
            onData: () => {},
            onError: () => {},
            onClose: (params) => {
              params.resolve(params.data);
            },
          },
        });

        // move and rename to position
        const filePath = "/tmp/fingerprint.bmp";
        await copyFile(filePath, `/tmp/${scanData}.bmp`);

        return scanData;
      } catch {}
    }
  }
}
