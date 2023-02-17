import Database from "better-sqlite3";
import { resolve } from "path";
const db = new Database(resolve(`${__dirname}/../../data/data.db`));

export type User = {
	id?: number;
	firstName: string;
	lastName: string;
	backupMac: string;
};

export class DatabaseService {
	static async createUser(user: User) {
		const stmt = db.prepare(
			"INSERT INTO User(firstName, lastName, backupMac) VALUES(@firstName, @lastName, @backupMac)"
		);

		stmt.run(user);
	}
}
