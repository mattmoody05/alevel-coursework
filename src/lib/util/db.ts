import type {
	account,
	child,
	expense,
	invoice,
	parent,
	session,
	shortNoticeNotifcation,
	shortNoticeNotifcationIssue,
	twoWayMessage
} from './types';
import { openDb } from '../../db/index';
import { v4 as uuidv4 } from 'uuid';
import { HOURLY_RATE } from '$env/static/private';

export async function getParent(
	id: string,
	idType: 'account' | 'parent'
): Promise<parent | undefined> {
	const db = await openDb();
	const parentData: parent | undefined = await db.get(
		`SELECT * FROM parent WHERE ${idType}Id = ?`,
		id
	);

	return parentData;
}

export async function getAccount(accountId: string): Promise<account | undefined> {
	const db = await openDb();
	const accountData: account | undefined = await db.get(
		'SELECT * FROM account WHERE accountId = ?',
		accountId
	);
	return accountData;
}

export async function getChild(childId: string): Promise<child | undefined> {
	const db = await openDb();
	const childData: child | undefined = await db.get(
		'SELECT * FROM child WHERE childId = ?',
		childId
	);
	return childData;
}

export async function getMessages(parentId: string): Promise<twoWayMessage[] | undefined> {
	const db = await openDb();

	const messages: twoWayMessage[] | undefined = await db.all(
		'SELECT * FROM twoWayMessage WHERE parentId = ?',
		parentId
	);

	return messages;
}

export async function sendMessage(
	messageContent: string,
	parentId: string,
	fromOwner: boolean
): Promise<twoWayMessage> {
	const db = await openDb();
	const date = new Date();

	const message: twoWayMessage = {
		messageId: uuidv4(),
		dateSent: date.toLocaleDateString('en-GB'),
		fromOwner,
		messageContent,
		parentId
	};

	await db.run(
		'INSERT INTO twoWayMessage VALUES (?, ?, ?, ?, ?)',
		message.messageId,
		message.messageContent,
		message.fromOwner,
		message.dateSent,
		message.parentId
	);

	return message;
}

export async function getAllParents(): Promise<parent[]> {
	const db = await openDb();
	return await db.all('SELECT * FROM parent');
}

export async function writeShortNoticeNoitification(
	messageContent: string
): Promise<shortNoticeNotifcation> {
	const db = await openDb();
	const notificationId = uuidv4();
	const date = new Date();
	const dateString = date.toLocaleDateString('en-GB');
	await db.run(
		'INSERT INTO shortNoticeNotification VALUES (?, ?, ?)',
		notificationId,
		messageContent,
		dateString
	);
	const notification: shortNoticeNotifcation = {
		notificationId,
		message: messageContent,
		dateCreated: dateString
	};

	return notification;
}

export async function issueShortNoticeNotification(
	notificationId: string,
	allParents: boolean,
	parents: parent[]
): Promise<shortNoticeNotifcationIssue[]> {
	const db = await openDb();

	if (allParents) {
		const dbParents: parent[] | undefined = await db.all('SELECT * FROM parent');
		if (dbParents !== undefined) {
			parents = dbParents;
		}
	}

	const date = new Date();
	const dateIssued = date.toLocaleDateString('en-GB');

	let notificationIssues: shortNoticeNotifcationIssue[] = [];

	parents.forEach(async (parent) => {
		const notificationIssueId: string = uuidv4();
		notificationIssues.push({
			notificationIssueId,
			allParents,
			dateIssued,
			parentId: parent.parentId,
			notificationId
		});
		await db.run(
			'INSERT INTO shortNoticeNotificationIssue VALUES (?, ?, ?, ?, ?)',
			notificationIssueId,
			allParents,
			dateIssued,
			parent.parentId,
			notificationId
		);
	});
	return notificationIssues;
}

export async function getShortNoticeNotifications(
	parentId: string
): Promise<shortNoticeNotifcation[] | undefined> {
	const db = await openDb();

	const notificationIssues: shortNoticeNotifcationIssue[] | undefined = await db.all(
		'SELECT * FROM shortNoticeNotificationIssue WHERE parentId = ?',
		parentId
	);

	let notifications: shortNoticeNotifcation[] = [];

	if (notificationIssues !== undefined) {
		for (let index = 0; index < notificationIssues.length; index++) {
			const issue = notificationIssues[index];
			const notification: shortNoticeNotifcation | undefined = await db.get(
				'SELECT * FROM shortNoticeNotification WHERE notificationId = ?',
				issue.notificationId
			);
			if (notification !== undefined) {
				notifications = [...notifications, notification];
			}
		}
		if (notifications.length > 0) {
			return notifications;
		}
	}

	return undefined;
}

export async function getChildren(parentId: string): Promise<child[] | undefined> {
	const db = await openDb();

	const children: child[] | undefined = await db.all(
		'SELECT * FROM child WHERE parentId = ?',
		parentId
	);

	return children;
}

export async function createSingleSession(
	childId: string,
	date: string,
	startTime: string,
	length: number
): Promise<session> {
	const currentDate = new Date();

	const createdSession: session = {
		sessionId: uuidv4(),
		childId: childId,
		date: date,
		startTime: startTime,
		length: length,
		absenceCharge: false,
		absent: false,
		dateBooked: currentDate.toLocaleDateString('en-GB'),
		isRecurring: false,
		invoiceId: undefined
	};

	const db = await openDb();

	await db.run(
		'INSERT INTO session VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		createdSession.sessionId,
		createdSession.date,
		createdSession.startTime,
		createdSession.length,
		createdSession.dateBooked,
		createdSession.absent,
		createdSession.absenceCharge,
		createdSession.isRecurring,
		createdSession.childId,
		null
	);

	return createdSession;
}

export async function getChildSessions(childId: string): Promise<session[] | undefined> {
	const db = await openDb();

	const sessions: session[] | undefined = await db.all(
		'SELECT * FROM session WHERE childId = ?',
		childId
	);

	return sessions;
}

export async function getSession(sessionId: string): Promise<session | undefined> {
	const db = await openDb();

	const sessionData: session | undefined = await db.get(
		'SELECT * FROM session WHERE sessionId = ?',
		sessionId
	);

	return sessionData;
}

export async function deleteSession(sessionId: string) {
	const db = await openDb();
	db.run('DELETE FROM session WHERE sessionId = ?', sessionId);
}

export async function updateSession(
	sessionId: string,
	startTime: string,
	date: string,
	length: number
) {
	const db = await openDb();

	await db.run(
		'UPDATE session SET startTime = ?, date = ?, length = ? WHERE sessionId = ?',
		startTime,
		date,
		length * 60,
		sessionId
	);

	const updatedSession: session | undefined = await getSession(sessionId);

	return { updatedSession };
}

export async function getAllParentSessions(parentId: string): Promise<session[] | undefined> {
	// const parentData = await getParent(parentId, 'parent');
	const children = await getChildren(parentId);
	if (children !== undefined) {
		let sessions: session[] = [];
		for (let i = 0; i < children.length; i++) {
			const currentChild: child = children[i];
			const currentChildSessions = await getChildSessions(currentChild.childId);
			if (currentChildSessions !== undefined) {
				for (let j = 0; j < currentChildSessions.length; j++) {
					const currentChildSession = currentChildSessions[j];
					sessions = [...sessions, currentChildSession];
				}
			} else {
				return undefined;
			}
		}
		return sessions;
	}
	return undefined;
}

export async function createExpense(
	expenseName: string,
	date: string,
	cost: number,
	type: string,
	chargeToParents: boolean,
	supportingDocs: string
): Promise<expense> {
	const currentDate = new Date();

	const createdExpense: expense = {
		expenseId: uuidv4(),
		chargeToParents: chargeToParents,
		cost: cost,
		date: date,
		dateRecorded: currentDate.toLocaleDateString('en-GB'),
		name: expenseName,
		supportingDocs: supportingDocs,
		type: type
	};

	const db = await openDb();

	await db.run(
		'INSERT INTO expense VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
		createdExpense.expenseId,
		createdExpense.name,
		createdExpense.cost,
		createdExpense.date,
		createdExpense.type,
		createdExpense.supportingDocs,
		createdExpense.chargeToParents,
		createdExpense.dateRecorded,
		null
	);

	return createdExpense;
}

export async function getExpense(expenseId: string): Promise<expense | undefined> {
	const db = await openDb();
	const expenseData: expense | undefined = await db.get(
		'SELECT * FROM expense WHERE expenseId = ?',
		expenseId
	);
	return expenseData;
}

export async function getAllExpenses(): Promise<expense[] | undefined> {
	const db = await openDb();
	const expenses: expense[] | undefined = await db.all('SELECT * FROM expense');
	return expenses;
}

export async function updateExpense(
	expenseId: string,
	expenseName: string,
	date: string,
	cost: number,
	type: string,
	chargeToParents: boolean,
	supportingDocs: string
) {
	const db = await openDb();

	const currentDate = new Date();

	await db.run(
		'UPDATE expense SET name = ?, cost = ?, date = ?, type = ?, supportingDocs = ?, chargeToParents = ?, dateRecorded = ? WHERE expenseId = ?',
		expenseName,
		cost,
		date,
		type,
		supportingDocs,
		chargeToParents,
		currentDate.toLocaleDateString('en-GB'),
		expenseId
	);
}

export async function deleteExpense(expenseId: string) {
	const db = await openDb();
	await db.run('DELETE FROM expense WHERE expenseId = ?', expenseId);
}

export async function getAllSessions(): Promise<session[] | undefined> {
	const db = await openDb();
	const sessions: session[] | undefined = await db.all('SELECT * FROM session');
	return sessions;
}

export async function getAllChildren(): Promise<child[] | undefined> {
	const db = await openDb();
	const children: child[] | undefined = await db.all('SELECT * FROM child');
	return children;
}

export async function generateInvoice(invoiceDetails: {
	childId: string;
	startDate: string;
	endDate: string;
	dateDue: string;
	includeExpenses: boolean;
	additionalChargeName?: string;
	additionalChargeAmount?: number;
	discountName?: string;
	discountAmount?: number;
	message?: string;
	parentId: string;
}) {
	// Fetch all sessions in period
	const sessionsInPeriod: session[] = await getSessionsInPeriod(
		invoiceDetails.childId,
		invoiceDetails.startDate,
		invoiceDetails.endDate
	);

	// Fetch all expenses in period if they are being charged
	let expensesInPeriod: expense[] = [];
	if (invoiceDetails.includeExpenses) {
		expensesInPeriod = await getExpensesInPeriod(
			invoiceDetails.childId,
			invoiceDetails.startDate,
			invoiceDetails.endDate
		);
	}

	// Calc total
	let total = 0;

	for (let index = 0; index < sessionsInPeriod.length; index++) {
		const currentSession: session = sessionsInPeriod[index];
		if (currentSession.absent) {
			if (currentSession.absenceCharge) {
				const sessionCost = currentSession.length * Number(HOURLY_RATE);
				total = total + sessionCost;
			}
		} else {
			const sessionCost = currentSession.length * Number(HOURLY_RATE);
			total = total + sessionCost;
		}
	}

	for (let index = 0; index < expensesInPeriod.length; index++) {
		const currentExpense: expense = expensesInPeriod[index];
		if (currentExpense.chargeToParents) {
			total = total + currentExpense.cost;
		}
	}

	const date = new Date();

	const generatedInvoice: invoice = {
		childId: invoiceDetails.childId,
		dateDue: invoiceDetails.dateDue,
		dateGenerated: date.toLocaleDateString('en-GB'),
		dateIssued: date.toLocaleDateString('en-GB'),
		endDate: invoiceDetails.endDate,
		startDate: invoiceDetails.startDate,
		includeExpenses: invoiceDetails.includeExpenses,
		invoiceId: uuidv4(),
		parentId: invoiceDetails.parentId,
		total: total,
		additionalChargeAmount: invoiceDetails.additionalChargeAmount,
		additionalChargeName: invoiceDetails.additionalChargeName,
		discountAmount: invoiceDetails.discountAmount,
		discountName: invoiceDetails.discountName,
		message: invoiceDetails.message
	};

	return generatedInvoice;
}

export async function writeInvoice(generatedInvoice: invoice) {
	const db = await openDb();
	await db.run(
		'INSERT INTO invoice VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		generatedInvoice.invoiceId,
		generatedInvoice.dateGenerated,
		generatedInvoice.dateIssued,
		generatedInvoice.dateDue,
		generatedInvoice.startDate,
		generatedInvoice.endDate,
		generatedInvoice.includeExpenses,
		generatedInvoice.additionalChargeName,
		generatedInvoice.additionalChargeAmount,
		generatedInvoice.discountName,
		generatedInvoice.discountAmount,
		generatedInvoice.message,
		generatedInvoice.total,
		generatedInvoice.parentId,
		generatedInvoice.childId
	);
}

export async function getSessionsInPeriod(
	childId: string,
	startDate: string,
	endDate: string
): Promise<session[]> {
	const db = await openDb();
	const formattedStartDate = new Date(startDate);
	const formattedEndDate = new Date(endDate);

	const sessions: session[] | undefined = await db.all(
		'SELECT * FROM session WHERE childId = ?',
		childId
	);
	let inPeriodSessions: session[] = [];

	if (sessions !== undefined) {
		for (let index = 0; index < sessions.length; index++) {
			const currentSession: session = sessions[index];
			const currentSessionDate = new Date(currentSession.date);

			// checks whether the session is the right date range
			if (formattedStartDate <= currentSessionDate && currentSessionDate <= formattedEndDate) {
				inPeriodSessions = [...inPeriodSessions, currentSession];
			}
		}
	}
	return inPeriodSessions;
}

export async function getExpensesInPeriod(
	childId: string,
	startDate: string,
	endDate: string
): Promise<expense[]> {
	const db = await openDb();
	const formattedStartDate = new Date(startDate);
	const formattedEndDate = new Date(endDate);

	const expenses: expense[] | undefined = await db.all(
		'SELECT * FROM expense WHERE childId = ?',
		childId
	);
	let inPeriodExpenses: expense[] = [];

	if (expenses !== undefined) {
		for (let index = 0; index < expenses.length; index++) {
			const currentExpense: expense = expenses[index];
			const currentExpenseDate = new Date(currentExpense.date);

			// checks whether the expense is the right date range
			if (formattedStartDate <= currentExpenseDate && currentExpenseDate <= formattedEndDate) {
				inPeriodExpenses = [...inPeriodExpenses, currentExpense];
			}
		}
	}

	return inPeriodExpenses;
}

export async function getLatestTwoWayMessage(parentId: string): Promise<twoWayMessage | undefined> {
	const messages = await getMessages(parentId);
	if (messages !== undefined) {
		const latestMessage = messages[messages.length - 1];
		return latestMessage;
	}
	return undefined;
}
