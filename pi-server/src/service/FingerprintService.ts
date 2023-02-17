import { spawn } from "child_process";
import { copyFile } from "fs/promises";
import { ExecutionService } from "./ExecutionService";

const SCRIPT_PATH = "/usr/share/doc/python3-fingerprint/examples";

const REGISTER_SCRIPT = `${SCRIPT_PATH}/example_enroll.py`;
const DOWNLOAD_SCRIPT = `${SCRIPT_PATH}/example_downloadimage.py`;
const SCAN_SUCCESS_MSG = "enrolled successfully";

export class FingerprintService {
  static async register() {
    let scanData = "";

    while (!scanData.includes(SCAN_SUCCESS_MSG)) {
      try {
        await ExecutionService.execute({
          scriptPath: REGISTER_SCRIPT,
          callbacks: {
            onData: (params) => {
              console.log(params.data.toString());
              if (params.data.toString().includes(SCAN_SUCCESS_MSG)) {
                console.log("done");
                scanData = params.data.toString();
                params.script.kill();
                params.resolve(params.data);
              }
            },
            onError: (params) => {
              params.reject(params.data);
            },
            onClose: (params) => {
              params.resolve(params.data);
              if (params.data.toString()?.trim())
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
        // const filePath = "/tmp/fingerprint.bmp";
        // await copyFile(filePath, `/tmp/${scanData}.bmp`);

        console.log("scanData is", scanData);
      } catch {}
    }

    return {
      scanData,
    };
  }
}
