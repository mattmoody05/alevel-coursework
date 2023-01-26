import { openDb } from '../../../db';
import { Account, Admin, Parent, Session } from './classes';
import type { AccountTable, ParentTable, SessionTable } from './tables';

export async function getParent(accountId: string): Promise<Parent | undefined> {
	const db = await openDb();
	const parentData: ParentTable | undefined = await db.get(
		'SELECT * FROM parent WHERE accountId = ?',
		accountId
	);
	if (parentData !== undefined) {
		return new Parent(parentData);
	} else {
		return undefined;
	}
}

export async function getAccount(accountId: string): Promise<Account | undefined> {
	const db = await openDb();
	const accountData: AccountTable | undefined = await db.get(
		'SELECT * FROM account WHERE accountId = ?',
		accountId
	);
	if (accountData !== undefined) {
		return new Account(accountData);
	} else {
		return undefined;
	}
}

export function getAdmin(accountId: string): Admin {
	const admin = new Admin(accountId);
	return admin;
}

export async function getSession(sessionId: string): Promise<Session | undefined> {
	const db = await openDb();
	const sessionData: SessionTable | undefined = await db.get(
		'SELECT * FROM session WHERE sessionId = ?',
		sessionId
	);
	if (sessionData !== undefined) {
		return new Session(sessionData);
	} else {
		return undefined;
	}
}
