import { spawn } from "child_process";
import { copyFile } from "fs/promises";
import { ExecutionService } from "./ExecutionService";

const SCRIPT_PATH = "/usr/share/doc/python3-fingerprint/examples";

const REGISTER_SCRIPT = `${SCRIPT_PATH}/example_enroll.py`;
const DOWNLOAD_SCRIPT = `${SCRIPT_PATH}/example_downloadimage.py`;
const SCAN_SCRIPT = `${SCRIPT_PATH}/example_search.py`;
const REGISTER_SUCCESS_MSG = "enrolled successfully";
const SCAN_SUCCESS_MSG = "Found template at position";

export class FingerprintService {
  static async register() {
    let scanData = "";

    while (!scanData.includes(REGISTER_SUCCESS_MSG)) {
      try {
        await ExecutionService.execute({
          scriptPath: REGISTER_SCRIPT,
          callbacks: {
            onData: (params) => {
              console.log(params.data.toString());
              if (params.data.toString().includes(REGISTER_SUCCESS_MSG)) {
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

  static async login() {
    let loginData = "";

    while (!loginData.includes(SCAN_SUCCESS_MSG)) {
      try {
        await ExecutionService.execute({
          scriptPath: SCAN_SCRIPT,
          callbacks: {
            onData: (params) => {
              console.log(params.data.toString());
              if (params.data.toString().includes(SCAN_SUCCESS_MSG)) {
                console.log("done");
                loginData = params.data.toString();
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
                loginData = params.data.toString();
            },
          },
        });

        console.log("scanData is", loginData);
      } catch {}
    }

    return {
      scanData: loginData,
    };
  }
}
