// As classes interact with database to fetch and write data, they can only be used on the server

import { openDb } from '../../../db/index';
import type {
	AccountTable,
	ChildTable,
	ExpenseTable,
	InvoiceTable,
	ParentTable,
	RecurringSessionRequestTable,
	SessionTable,
	ShortNoticeNotifcationIssueTable,
	ShortNoticeNotificationTable,
	SurveyIssueTable,
	SurveyQuestionTable,
	SurveyTable,
	TimeOffPeriodTable,
	TwoWayMessageTable
} from '$lib/util/newDb/tables';

export class Admin {
	async getChildren(): Promise<Child[]> {
		const db = await openDb();
		const children: ChildTable[] = await db.all('SELECT * FROM child');
		return children.map((child) => new Child(child));
	}

	async getSessions(): Promise<Session[]> {
		const db = await openDb();
		const sessions: SessionTable[] = await db.all('SELECT * FROM session');
		return sessions.map((session) => new Session(session));
	}

	async getNotifications(): Promise<ShortNoticeNotification[]> {
		const db = await openDb();
		const notifications: ShortNoticeNotificationTable[] = await db.all(
			'SELECT * FROM shortNoticeNotification'
		);
		return notifications.map((notification) => new ShortNoticeNotification(notification));
	}
	async getParents(): Promise<Parent[]> {
		const db = await openDb();
		const parents: ParentTable[] = await db.all('SELECT * FROM parent');
		return parents.map((parent) => new Parent(parent));
	}
}

export class Account {
	accountId: string;
	username: string;
	password: string;
	isAdmin: boolean;
	parentId?: string;

	constructor(accountData: AccountTable) {
		this.accountId = accountData.accountId;
		this.username = accountData.username;
		this.password = accountData.password;
		this.isAdmin = accountData.isAdmin;
		this.parentId = accountData.parentId;
	}
}

export class Session {
	sessionId: string;
	date: string;
	startTime: string;
	length: number;
	dateBooked: string;
	absent: boolean;
	absenceCharge: boolean;
	absenceReason?: string;
	absenceAdditionalInformation?: string;
	absenceKeepSession: boolean;
	isRecurring: boolean;
	childId: string;
	invoiceId?: string;

	constructor(sessionData: SessionTable) {
		this.sessionId = sessionData.sessionId;
		this.date = sessionData.date;
		this.startTime = sessionData.startTime;
		this.length = sessionData.length;
		this.dateBooked = sessionData.dateBooked;
		this.absent = sessionData.absent;
		this.absenceCharge = sessionData.absenceCharge;
		this.absenceReason = sessionData.absenceReason;
		this.absenceAdditionalInformation = sessionData.absenceAdditionalInformation;
		this.absenceKeepSession = sessionData.absenceKeepSession;
		this.isRecurring = sessionData.isRecurring;
		this.childId = sessionData.childId;
		this.invoiceId = sessionData.invoiceId;
	}

	getData(): SessionTable {
		return { ...this };
	}
}

export class Expense {
	expenseId: string;
	name: string;
	cost: number;
	date: string;
	type: string;
	supportingDocs: string;
	chargeToParents: boolean;
	dateRecorded: string;
	invoiceId?: string;

	constructor(expenseData: ExpenseTable) {
		this.expenseId = expenseData.expenseId;
		this.name = expenseData.name;
		this.cost = expenseData.cost;
		this.date = expenseData.date;
		this.type = expenseData.type;
		this.supportingDocs = expenseData.supportingDocs;
		this.chargeToParents = expenseData.chargeToParents;
		this.dateRecorded = expenseData.dateRecorded;
		this.invoiceId = expenseData.invoiceId;
	}

	getData(): ExpenseTable {
		return { ...this };
	}
}

export class RecurringSessionRequest {
	recurringSessionId: string;
	approved: boolean;
	recurringBasis: string;
	mondaySelected: boolean;
	mondayStartTime?: string;
	mondayEndTime?: string;
	tuesdaySelected: boolean;
	tuesdayStartTime?: string;
	tuesdayEndTime?: string;
	wednesdaySelected: boolean;
	wednesdayStartTime?: string;
	wednesdayEndTime?: string;
	thursdaySelected: boolean;
	thursdayStartTime?: string;
	thursdayEndTime?: string;
	fridaySelected: boolean;
	fridayStartTime?: string;
	fridayEndTime?: string;
	dateRequestSubmitted: string;
	dateApproved?: string;
	childId: string;

	constructor(recurringSessionRequestData: RecurringSessionRequestTable) {
		this.recurringSessionId = recurringSessionRequestData.recurringSessionId;
		this.approved = recurringSessionRequestData.approved;
		this.recurringBasis = recurringSessionRequestData.recurringBasis;
		this.mondaySelected = recurringSessionRequestData.mondaySelected;
		this.mondayStartTime = recurringSessionRequestData.mondayStartTime;
		this.mondayEndTime = recurringSessionRequestData.mondayEndTime;
		this.tuesdaySelected = recurringSessionRequestData.tuesdaySelected;
		this.tuesdayStartTime = recurringSessionRequestData.tuesdayStartTime;
		this.tuesdayEndTime = recurringSessionRequestData.tuesdayEndTime;
		this.wednesdaySelected = recurringSessionRequestData.wednesdaySelected;
		this.wednesdayStartTime = recurringSessionRequestData.wednesdayStartTime;
		this.wednesdayEndTime = recurringSessionRequestData.wednesdayEndTime;
		this.thursdaySelected = recurringSessionRequestData.thursdaySelected;
		this.thursdayStartTime = recurringSessionRequestData.thursdayStartTime;
		this.thursdayEndTime = recurringSessionRequestData.thursdayEndTime;
		this.fridaySelected = recurringSessionRequestData.fridaySelected;
		this.fridayStartTime = recurringSessionRequestData.fridayStartTime;
		this.fridayEndTime = recurringSessionRequestData.fridayEndTime;
		this.dateRequestSubmitted = recurringSessionRequestData.dateRequestSubmitted;
		this.dateApproved = recurringSessionRequestData.dateApproved;
		this.childId = recurringSessionRequestData.childId;
	}

	getData(): RecurringSessionRequestTable {
		return { ...this };
	}
}

export class TwoWayMessage {
	messageId: string;
	messageContent: string;
	fromOwner: boolean;
	dateSent: string;
	parentId: string;

	constructor(twoWayMessageData: TwoWayMessageTable) {
		this.messageId = twoWayMessageData.messageId;
		this.messageContent = twoWayMessageData.messageContent;
		this.fromOwner = twoWayMessageData.fromOwner;
		this.dateSent = twoWayMessageData.dateSent;
		this.parentId = twoWayMessageData.parentId;
	}

	getData(): TwoWayMessageTable {
		return { ...this };
	}
}

export class Child {
	childId: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	educationName?: string;
	educationType: string;
	additionalNeedDesc?: string;
	additionalNeedType: string;
	parentId: string;

	constructor(childData: ChildTable) {
		this.childId = childData.childId;
		this.firstName = childData.firstName;
		this.lastName = childData.lastName;
		this.dateOfBirth = childData.dateOfBirth;
		this.educationName = childData.educationName;
		this.educationType = childData.educationType;
		this.additionalNeedDesc = childData.additionalNeedDesc;
		this.additionalNeedType = childData.additionalNeedType;
		this.parentId = childData.parentId;
	}

	async getSessions(): Promise<Session[]> {
		const db = await openDb();

		const databaseData: SessionTable[] = await db.all(
			'SELECT * FROM session WHERE childId = ?',
			this.childId
		);

		let sessions: Session[] = [];
		for (let i = 0; i < databaseData.length; i++) {
			const currentData = databaseData[i];
			const currentSession = new Session(currentData);
			sessions = [...sessions, currentSession];
		}
		return sessions;
	}

	getData(): ChildTable {
		return { ...this };
	}
}

export class Invoice {
	invoiceId: string;
	dateGenerated: string;
	dateIssued: string;
	dateDue: string;
	startDate: string;
	endDate: string;
	includeExpenses: boolean;
	additionalChargeName?: string;
	additionalChargeAmount?: number;
	discountName?: string;
	discountAmount?: number;
	message?: string;
	total: number;
	paymentStatus: string;
	parentId: string;
	childId: string;

	constructor(invoiceData: InvoiceTable) {
		this.invoiceId = invoiceData.invoiceId;
		this.dateGenerated = invoiceData.dateGenerated;
		this.dateIssued = invoiceData.dateIssued;
		this.dateDue = invoiceData.dateDue;
		this.startDate = invoiceData.startDate;
		this.endDate = invoiceData.endDate;
		this.includeExpenses = invoiceData.includeExpenses;
		this.additionalChargeName = invoiceData.additionalChargeName;
		this.additionalChargeAmount = invoiceData.additionalChargeAmount;
		this.discountName = invoiceData.discountName;
		this.discountAmount = invoiceData.discountAmount;
		this.message = invoiceData.message;
		this.total = invoiceData.total;
		this.paymentStatus = invoiceData.paymentStatus;
		this.parentId = invoiceData.parentId;
		this.childId = invoiceData.childId;
	}

	getData(): InvoiceTable {
		return { ...this };
	}
}

export class TimeOffPeriod {
	timeOffPeriodId: string;
	dateRecorded: string;
	startDate: string;
	endDate: string;
	cancelSessions: boolean;

	constructor(timeOffPeriodData: TimeOffPeriodTable) {
		this.timeOffPeriodId = timeOffPeriodData.timeOffPeriodId;
		this.dateRecorded = timeOffPeriodData.dateRecorded;
		this.startDate = timeOffPeriodData.startDate;
		this.endDate = timeOffPeriodData.endDate;
		this.cancelSessions = timeOffPeriodData.cancelSessions;
	}

	getData(): TimeOffPeriodTable {
		return { ...this };
	}
}

export class Survey {
	surveyId: string;
	title: string;
	description?: string;
	consentForm: boolean;
	anonymous: boolean;
	numberOfQuestions: number;
	dateCreated: string;

	constructor(surveyData: SurveyTable) {
		this.surveyId = surveyData.surveyId;
		this.title = surveyData.title;
		this.description = surveyData.description;
		this.consentForm = surveyData.consentForm;
		this.anonymous = surveyData.anonymous;
		this.numberOfQuestions = surveyData.numberOfQuestions;
		this.dateCreated = surveyData.dateCreated;
	}

	getData(): SurveyTable {
		return { ...this };
	}
}

export class SurveyQuestion {
	surveyQuestionId: string;
	prompt: string;
	dateCreated: string;
	surveyId: string;

	constructor(surveyQuestionData: SurveyQuestionTable) {
		this.surveyQuestionId = surveyQuestionData.surveyQuestionId;
		this.prompt = surveyQuestionData.prompt;
		this.dateCreated = surveyQuestionData.dateCreated;
		this.surveyId = surveyQuestionData.surveyId;
	}

	getData(): SurveyQuestionTable {
		return { ...this };
	}
}

export class SurveyIssue {
	surveyIssueId: string;
	dateIssued: string;
	surveyId: string;
	parentId: string;

	constructor(surveyIssueData: SurveyIssueTable) {
		this.surveyIssueId = surveyIssueData.surveyIssueId;
		this.dateIssued = surveyIssueData.dateIssued;
		this.surveyId = surveyIssueData.surveyId;
		this.parentId = surveyIssueData.parentId;
	}

	getData(): SurveyIssueTable {
		return { ...this };
	}
}

export class ShortNoticeNotification {
	notificationId: string;
	message: string;
	dateCreated: string;

	constructor(shortNoticeNotificationData: ShortNoticeNotificationTable) {
		this.notificationId = shortNoticeNotificationData.notificationId;
		this.message = shortNoticeNotificationData.message;
		this.dateCreated = shortNoticeNotificationData.dateCreated;
	}

	getData(): ShortNoticeNotificationTable {
		return { ...this };
	}
}

export class Parent {
	parentId: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	emailAddress: string;
	dateOfBirth: string;
	houseNumber: string;
	postcode: string;
	accountId: string;

	constructor(parentData: ParentTable) {
		this.parentId = parentData.parentId;
		this.firstName = parentData.firstName;
		this.lastName = parentData.lastName;
		this.phoneNumber = parentData.phoneNumber;
		this.emailAddress = parentData.emailAddress;
		this.dateOfBirth = parentData.dateOfBirth;
		this.houseNumber = parentData.houseNumber;
		this.postcode = parentData.postcode;
		this.accountId = parentData.accountId;
	}

	async getAccount(): Promise<Account | undefined> {
		const db = await openDb();
		const databaseData: AccountTable | undefined = await db.get(
			'SELECT * FROM account WHERE accountId = ?',
			this.accountId
		);
		if (databaseData !== undefined) {
			return new Account(databaseData);
		} else {
			return undefined;
		}
	}
	async getChildren(): Promise<Child[]> {
		const db = await openDb();
		const children: ChildTable[] = await db.all(
			'SELECT * FROM child WHERE parentId = ?',
			this.parentId
		);
		return children.map((child) => new Child(child));
	}
	async getSessions(): Promise<Session[]> {
		const children = await this.getChildren();
		let sessions: Session[] = [];
		for (let i = 0; i < children.length; i++) {
			const currentChild = children[i];
			const currentSessions = await currentChild.getSessions();
			for (let j = 0; j < currentSessions.length; j++) {
				const currentSession = currentSessions[j];
				sessions = [...sessions, currentSession];
			}
		}
		return sessions;
	}

	async getNotifications(): Promise<ShortNoticeNotification[]> {
		const db = await openDb();
		const issues: ShortNoticeNotifcationIssueTable[] = await db.all(
			'SELECT * FROM shortNoticeNotificationIssue WHERE parentId = ?',
			this.parentId
		);
		let notifications: ShortNoticeNotification[] = [];
		for (let index = 0; index < issues.length; index++) {
			const currentIssue = issues[index];
			const notification: ShortNoticeNotificationTable | undefined = await db.get(
				'SELECT * FROM shortNoticeNotification WHERE notificationId = ?',
				currentIssue.notificationId
			);
			if (notification !== undefined) {
				const notificationObj = new ShortNoticeNotification(notification);
				notifications = [...notifications, notificationObj];
			}
		}
		return notifications;
	}

	getData(): ParentTable {
		return { ...this };
	}
}
