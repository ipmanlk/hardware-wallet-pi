import { Request, Response } from "express";
import { DatabaseService } from "../service/DatabaseService";
import { FingerprintService } from "../service/FingerprintService";

export class DeviceController {
	static async resetDevice(req: Request, res: Response) {
		try {
			await DatabaseService.resetDb();
			await FingerprintService.deleteAll();
			return res.json({ message: "Device reset" });
		} catch (e) {
			console.error(e);
			return res.json({ error: true, message: "Failed to reset device" });
		}
	}
}
