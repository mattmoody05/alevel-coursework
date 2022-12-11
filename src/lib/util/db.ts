import type {
	account,
	child,
	parent,
	session,
	shortNoticeNotifcation,
	shortNoticeNotifcationIssue,
	twoWayMessage
} from './types';
import { openDb } from '../../db/index';
import { v4 as uuidv4 } from 'uuid';

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