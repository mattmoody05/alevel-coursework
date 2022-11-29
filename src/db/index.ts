import { Database } from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
	return open({
		filename: 'src/db/main.db',
		driver: Database
	});
}
