import { spawn } from 'child_process';

const runScript = (scriptName: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const script = spawn('python', ['-u',`/usr/share/doc/python3-fingerprint/examples/${scriptName}`], {stdio: "pipe"});
		let stdout = "";

		script.stdout.on('data', (data: Buffer) => {
			stdout += data.toString();
			console.log(`stdout: ${data}`);
			if (data.toString().includes("enrolled successfully")) {
				script.kill();
				resolve(stdout);
			}
		});

		script.stderr.on('data', (data: Buffer) => {
			console.log(`stderr: ${data}`);
		});

		script.on('close', (code: number) => {
			if (code !== 0) {
				reject(new Error(`child process exited with code ${code}`));
			} else {
				resolve(stdout);
			}
		});
	});
};

(async function() {

	while(true) {
		try {
			await runScript("example_enroll.py");
			await runScript("example_downloadimage.py");
			break;
		} catch (e) {}

	}


})();

