import { ChildProcessWithoutNullStreams, spawn } from "child_process";

type CallbackParams = {
  data: Buffer;
  script: ChildProcessWithoutNullStreams;
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
};

type ExecuteParams = {
  scriptPath: string;
  callbacks: {
    onData: (params: CallbackParams) => void;
    onError: (params: CallbackParams) => void;
    onClose: (params: CallbackParams) => void;
  };
};

export class ExecutionService {
  static async execute({ scriptPath, callbacks }: ExecuteParams) {
    return new Promise((resolve, reject) => {
      const script = spawn("python", ["-u", scriptPath], { stdio: "pipe" });
      let stdout = "";

      script.stdout.on("data", (data: Buffer) => {
        stdout += data.toString();
        callbacks.onData({ data, script, resolve, reject });
      });

      script.stderr.on("data", (data: Buffer) => {
        callbacks.onError({ data, script, resolve, reject });
      });

      script.on("close", (code: number) => {
        if (code !== 0) {
          resolve(`Error: ${code} ${stdout}`);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}
