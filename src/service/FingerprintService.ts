import { copyFile } from "fs/promises";
import {
  REGISTER_SUCCESS_MSG,
  REGISTER_SCRIPT,
  DOWNLOAD_SCRIPT,
  ORIGINAL_FP_PATH,
  SCAN_SUCCESS_MSG,
  SCAN_SCRIPT,
  DELETE_SCRIPT,
} from "../constants";
import { ExecutionService } from "./ExecutionService";

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

        await copyFile(ORIGINAL_FP_PATH, `${__dirname}/../../data/data.bmp`);
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

  static async deleteAll() {
    try {
      await ExecutionService.execute({
        scriptPath: DELETE_SCRIPT,
        callbacks: {
          onData: (params) => {
            console.log(params.data.toString());
          },
          onError: (params) => {
            params.reject(params.data);
          },
          onClose: (params) => {
            params.resolve(params.data);
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  }
}
