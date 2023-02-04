import { openDb } from '../../../db';
import {
	Account,
	Admin,
	Child,
	Expense,
	Invoice,
	Parent,
	RecurringSessionRequest,
	Session,
	ShortNoticeNotification,
	Survey,
	SurveyIssue,
	SurveyQuestion,
	TimeOffPeriod,
	TwoWayMessage
} from './classes';
import type {
	AccountTable,
	ChildTable,
	ExpenseTable,
	InvoiceTable,
	ParentTable,
	RecurringSessionRequestTable,
	SessionTable,
	SurveyIssueTable,
	SurveyQuestionTable,
	SurveyTable,
	TimeOffPeriodTable,
	TwoWayMessageTable
} from './tables';

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

export function getAdmin(): Admin {
	const admin = new Admin();
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

export async function getExpense(expenseId: string): Promise<Expense | undefined> {
	const db = await openDb();
	const expenseData: ExpenseTable | undefined = await db.get(
		'SELECT * FROM expense WHERE expenseId = ?',
		expenseId
	);
	if (expenseData !== undefined) {
		return new Expense(expenseData);
	} else {
		return undefined;
	}
}

export async function getRecurringSessionRequest(
	recurringSessionRequestId: string
): Promise<RecurringSessionRequest | undefined> {
	const db = await openDb();
	const recurringSessionRequestData: RecurringSessionRequestTable | undefined = await db.get(
		'SELECT * FROM expense WHERE expenseId = ?',
		recurringSessionRequestId
	);
	if (recurringSessionRequestData !== undefined) {
		return new RecurringSessionRequest(recurringSessionRequestData);
	} else {
		return undefined;
	}
}

export async function getTwoWayMessage(messageId: string): Promise<TwoWayMessage | undefined> {
	const db = await openDb();
	const messageData: TwoWayMessageTable | undefined = await db.get(
		'SELECT * FROM twoWayMessage WHERE messageId = ?',
		messageId
	);
	if (messageData !== undefined) {
		return new TwoWayMessage(messageData);
	} else {
		return undefined;
	}
}

export async function getInvoice(invoiceId: string): Promise<Invoice | undefined> {
	const db = await openDb();
	const invoiceData: InvoiceTable | undefined = await db.get(
		'SELECT * FROM invoice WHERE invoiceId = ?',
		invoiceId
	);
	if (invoiceData !== undefined) {
		return new Invoice(invoiceData);
	} else {
		return undefined;
	}
}

export async function getTimeOffPeriod(
	timeOffPeriodId: string
): Promise<TimeOffPeriod | undefined> {
	const db = await openDb();
	const timeOffData: TimeOffPeriodTable | undefined = await db.get(
		'SELECT * FROM timeOffPeriod where timeOffPeriodId = ?',
		timeOffPeriodId
	);
	if (timeOffData !== undefined) {
		return new TimeOffPeriod(timeOffData);
	} else {
		return undefined;
	}
}

export async function getSurvey(surveyId: string): Promise<Survey | undefined> {
	const db = await openDb();
	const surveyData: SurveyTable | undefined = await db.get(
		'SELECT * FROM survey WHERE surveyId = ?',
		surveyId
	);
	if (surveyData !== undefined) {
		return new Survey(surveyData);
	} else {
		return undefined;
	}
}

export async function getSurveyQuestion(
	surveyQuestionId: string
): Promise<SurveyQuestion | undefined> {
	const db = await openDb();
	const surveyQuestionData: SurveyQuestionTable | undefined = await db.get(
		'SELECT * FROM surveyQuestion WHERE surveyQuestionId = ?',
		surveyQuestionId
	);
	if (surveyQuestionData !== undefined) {
		return new SurveyQuestion(surveyQuestionData);
	} else {
		return undefined;
	}
}

export async function getSurveyIssue(surveyIssueId: string): Promise<SurveyIssue | undefined> {
	const db = await openDb();
	const surveyIssueData: SurveyIssueTable | undefined = await db.get(
		'SELECT * FROM surveyIssue WHERE surveyIssueId = ?',
		surveyIssueId
	);
	if (surveyIssueData !== undefined) {
		return new SurveyIssue(surveyIssueData);
	} else {
		return undefined;
	}
}

export async function getShortNoticeNotification(
	notificationId: string
): Promise<ShortNoticeNotification | undefined> {
	const db = await openDb();
	const notificationData = await db.get(
		'SELECT * FROM shortNoticeNotifcation WHERE notificationId = ?',
		notificationId
	);
	if (notificationData !== undefined) {
		return new ShortNoticeNotification(notificationData);
	} else {
		return undefined;
	}
}

export async function getChild(childId: string): Promise<Child | undefined> {
	const db = await openDb();

	const childData: ChildTable | undefined = await db.get(
		'SELECT * FROM child WHERE childId = ?',
		childId
	);

	if (childData !== undefined) {
		return new Child(childData);
	} else {
		return undefined;
	}
}
