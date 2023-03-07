import { openDb } from '../../../db';
import { getDateFromLocaleString } from '../date';
import { getSessionsOnDate } from '../newDb';
import {
	Account,
	Expense,
	Invoice,
	Parent,
	Session,
	ShortNoticeNotification,
	Survey,
	TimeOffPeriod
} from './classes';
import type {
	AccountTable,
	ExpenseTable,
	InvoiceTable,
	ParentTable,
	SessionTable,
	ShortNoticeNotificationTable,
	SurveyTable,
	TimeOffPeriodTable
} from './tables';

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

export async function createSurvey(surveyData: SurveyTable): Promise<Survey> {
	const survey = new Survey(surveyData);

	const db = await openDb();
	await db.run(
		'INSERT INTO survey VALUES (?, ?, ?, ?, ?, ?, ?)',
		surveyData.surveyId,
		surveyData.title,
		surveyData.description,
		surveyData.consentForm,
		surveyData.anonymous,
		surveyData.numberOfQuestions,
		surveyData.dateCreated
	);

	return survey;
}

export async function createShortNoticeNotification(
	notificationData: ShortNoticeNotificationTable
): Promise<ShortNoticeNotification> {
	const notification = new ShortNoticeNotification(notificationData);

	const db = await openDb();
	await db.run(
		'INSERT INTO shortNoticeNotification VALUES (?, ?, ?)',
		notification.notificationId,
		notification.message,
		notification.dateCreated
	);

	return notification;
}

export async function createExpense(expenseData: ExpenseTable): Promise<Expense> {
	const expense = new Expense(expenseData);

	const db = await openDb();
	await db.run(
		'INSERT INTO expense VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		expenseData.expenseId,
		expenseData.name,
		expenseData.cost,
		expenseData.date,
		expenseData.type,
		expenseData.supportingDocs,
		expenseData.chargeToParents,
		expenseData.dateRecorded,
		expenseData.invoiceId
	);

	return expense;
}

export async function createTimeOffPeriod(timeOffPeriodData: TimeOffPeriodTable) {
	const timeOffPeriod = new TimeOffPeriod(timeOffPeriodData);

	const db = await openDb();
	await db.run(
		'INSERT INTO timeOffPeriod VALUES (?, ?, ?, ?, ?)',
		timeOffPeriod.timeOffPeriodId,
		timeOffPeriod.dateRecorded,
		timeOffPeriod.startDate,
		timeOffPeriod.endDate,
		timeOffPeriod.cancelSessions
	);

	let cancelledSessions: Session[] = [];

	if (timeOffPeriodData.cancelSessions === true) {
		const formattedStartDate = getDateFromLocaleString(timeOffPeriod.startDate);
		const formattedEndDate = getDateFromLocaleString(timeOffPeriod.endDate);
		let currentDate = formattedStartDate;
		do {
			const sessions = await getSessionsOnDate(currentDate.toLocaleDateString('en-GB'));
			for (let i = 0; i < sessions.length; i++) {
				const currentSession = sessions[i];

				cancelledSessions = [...cancelledSessions, currentSession];

				await currentSession.sendDeletionEmail();
				await currentSession.deleteFromDatabase();
			}

			// Increment day by 1
			currentDate = new Date(currentDate.getTime() + 86400000);
		} while (currentDate <= formattedEndDate);
	}

	return { timeOffPeriod, cancelledSessions };
}
