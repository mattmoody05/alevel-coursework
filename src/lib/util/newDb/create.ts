import { openDb } from '../../../db';
import { Account, Invoice, Parent, Session } from './classes';
import type { AccountTable, InvoiceTable, ParentTable, SessionTable } from './tables';

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

export async function createSession(sessionData: SessionTable): Promise<Session> {
	const session = new Session(sessionData);

	const db = await openDb();
	await db.run(
		'INSERT INTO session VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		session.sessionId,
		session.date,
		session.startTime,
		session.length,
		session.dateBooked,
		session.absent,
		session.absenceCharge,
		session.absenceReason,
		session.absenceAdditionalInformation,
		session.absenceKeepSession,
		session.isRecurring,
		session.childId,
		session.invoiceId
	);

	return session;
}

export async function createInvoice(invoiceData: InvoiceTable): Promise<Invoice> {
	const invoice = new Invoice(invoiceData);

	const db = await openDb();
	await db.run(
		'INSERT INTO invoice VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		invoiceData.invoiceId,
		invoiceData.dateGenerated,
		invoiceData.dateIssued,
		invoiceData.dateDue,
		invoiceData.startDate,
		invoiceData.endDate,
		invoiceData.includeExpenses,
		invoiceData.additionalChargeName,
		invoiceData.additionalChargeAmount,
		invoiceData.discountName,
		invoiceData.discountAmount,
		invoiceData.message,
		invoiceData.total,
		invoiceData.paymentStatus,
		invoiceData.parentId,
		invoiceData.childId
	);

	return invoice;
}
