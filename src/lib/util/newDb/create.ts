import { openDb } from '../../../db';
import { Account, Parent } from './classes';
import type { AccountTable, ParentTable } from './tables';

export async function createParent(parentData: ParentTable): Promise<Parent> {
	const parent = new Parent(parentData);

	const db = await openDb();
	await db.run(
		'INSERT INTO parent VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		parent.parentId,
		parent.firstName,
		parent.lastName,
		parent.phoneNumber,
		parent.emailAddress,
		parent.dateOfBirth,
		parent.houseNumber,
		parent.postcode,
		parent.accountId
	);

	return parent;
}

export async function createAccount(accountData: AccountTable): Promise<Account> {
	const account = new Account(accountData);

	const db = await openDb();
	await db.run(
		'INSERT INTO account VALUES (?, ?, ?, ?, ?)',
		account.accountId,
		account.username,
		account.password,
		account.isAdmin,
		account.parentId
	);

	return account;
}
