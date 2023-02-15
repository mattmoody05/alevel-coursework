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
import { v4 as uuidv4 } from 'uuid';
import { getDateFromLocaleString } from '../date';
import { Mailer } from '../email';
import type { RecurringSessionDayDetails } from '../types';
import {
	CHILDCARE_LIMIT_UNDER_EIGHTEEN_MONTHS,
	CHILDCARE_LIMIT_UNDER_EIGHT_YEARS,
	CHILDCARE_LIMIT_UNDER_FIVE_YEARS,
	CHILDCARE_LIMIT_UNDER_TWELVE_YEARS,
	RECURRING_BOOKING_EXPIRY
} from '$env/static/private';
import { differenceBetweenTimes } from '$lib/util/date';
import { getSessionsOnDate } from '../db';

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

	async getChild(): Promise<Child | undefined> {
		const db = await openDb();
		const childData: ChildTable | undefined = await db.get(
			'SELECT * FROM child WHERE childId = ?',
			this.childId
		);
		if (childData !== undefined) {
			return new Child(childData);
		} else {
			return undefined;
		}
	}

	getFinishTime(): string {
		const startTimeSplit: string[] = this.startTime.split(':');

		let startTimeHours = Number(startTimeSplit[0]);
		let startTimeMins = Number(startTimeSplit[1]);

		const lengthHours = Math.floor(this.length / 60);
		const lengthMins = this.length % 60;

		startTimeHours = startTimeHours + lengthHours;
		startTimeMins = startTimeMins + lengthMins;

		if (startTimeMins >= 60) {
			startTimeMins = startTimeMins - 60;
			startTimeHours = startTimeHours + 1;
		}

		return `${String(startTimeHours)}:${String(startTimeMins)}`;
	}

	getAvailabilityChecker() {
		const availabilityChecker = new AvailabilityChecker(this);
		return availabilityChecker;
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

	getAge(): number {
		const date = new Date();
		const formattedDateOfBirth = getDateFromLocaleString(this.dateOfBirth);

		let age: number = date.getFullYear() - formattedDateOfBirth.getFullYear();
		if (date.getMonth() < formattedDateOfBirth.getMonth()) {
			age = age - 1;
		} else if (date.getMonth() === formattedDateOfBirth.getMonth()) {
			if (date.getDay() < formattedDateOfBirth.getDay()) {
				age = age - 1;
			}
		}

		return age;
	}

	getAgeMonths(): number {
		const date = new Date();
		const formattedDateOfBirth = getDateFromLocaleString(this.dateOfBirth);
		let months = 0;
		do {
			months = months + 1;
			if (formattedDateOfBirth.getMonth() !== 12) {
				formattedDateOfBirth.setMonth(formattedDateOfBirth.getMonth() + 1);
			} else {
				formattedDateOfBirth.setFullYear(formattedDateOfBirth.getFullYear() + 1);
				formattedDateOfBirth.setMonth(1);
			}
		} while (formattedDateOfBirth < date);
		return months - 1;
	}

	async getRecurringSessionRequest(): Promise<RecurringSessionRequest | undefined> {
		const db = await openDb();
		const request: RecurringSessionRequestTable | undefined = await db.get(
			'SELECT * FROM recurringSessionRequest WHERE childId = ?',
			this.childId
		);
		if (request !== undefined) {
			return new RecurringSessionRequest(request);
		} else {
			return undefined;
		}
	}

	async hasRecurringSessionRequest(): Promise<boolean> {
		const recurringSessionRequest = await this.getRecurringSessionRequest();
		if (recurringSessionRequest === undefined) {
			return false;
		} else {
			return true;
		}
	}

	async createRecurringSessionRequest(
		recurringBasis: string,
		dayDetails: RecurringSessionDayDetails
	) {
		const db = await openDb();

		const date = new Date();

		await db.run(
			'INSERT INTO recurringSessionRequest VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			uuidv4(),
			false,
			recurringBasis,
			dayDetails.mondaySelected,
			dayDetails.mondayStartTime,
			dayDetails.mondayEndTime,
			dayDetails.tuesdaySelected,
			dayDetails.tuesdayStartTime,
			dayDetails.tuesdayEndTime,
			dayDetails.wednesdaySelected,
			dayDetails.wednesdayStartTime,
			dayDetails.wednesdayEndTime,
			dayDetails.thursdaySelected,
			dayDetails.thursdayStartTime,
			dayDetails.thursdayEndTime,
			dayDetails.fridaySelected,
			dayDetails.fridayStartTime,
			dayDetails.fridayEndTime,
			date.toLocaleDateString('en-GB'),
			null,
			this.childId
		);
	}

	async setRecurringSessionRequestStatus(approvalStatus: boolean) {
		const db = await openDb();
		await db.run(
			'UPDATE recurringSessionRequest SET approved = ? WHERE childId = ?',
			approvalStatus,
			this.childId
		);
	}

	async deleteRecurringSessionRequest() {
		const db = await openDb();
		await db.run('DELETE FROM recurringSessionRequest WHERE childId = ?', this.childId);
		await db.run('DELETE FROM session WHERE childId = ? and isRecurring = ?', this.childId, true);
	}

	async createRecurringSession() {
		const db = await openDb();

		const request = await this.getRecurringSessionRequest();
		if (request !== undefined) {
			type days =
				| 'sunday'
				| 'monday'
				| 'tuesday'
				| 'wednesday'
				| 'thursday'
				| 'friday'
				| 'saturday';
			const weekday: days[] = [
				'sunday',
				'monday',
				'tuesday',
				'wednesday',
				'thursday',
				'friday',
				'saturday'
			];
			const startDate = new Date();
			const endDate = getDateFromLocaleString(RECURRING_BOOKING_EXPIRY);
			let currentDate = startDate;
			do {
				const currentDay = weekday[currentDate.getDay()];
				if (currentDay !== 'saturday' && currentDay !== 'sunday') {
					// coming up as 1 or 0 instead of true or false, use strict equality when fixed
					if (request[`${currentDay}Selected`] == true) {
						const startTime = request[`${currentDay}StartTime`] as string;
						const endTime = request[`${currentDay}EndTime`] as string;
						const length = differenceBetweenTimes(startTime, endTime);

						await db.run(
							'INSERT INTO session VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
							uuidv4(),
							currentDate.toLocaleDateString('en-GB'),
							startTime,
							length,
							new Date().toLocaleDateString('en-GB'),
							false,
							false,
							null,
							null,
							false,
							true,
							this.childId,
							null
						);
					}
				}
				// Increment day by 1
				currentDate = new Date(currentDate.getTime() + 86400000);
			} while (currentDate <= endDate);
		}
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

	getMessageConversation(): MessageConversation {
		return new MessageConversation(this.parentId, false);
	}

	getMailer(): Mailer {
		return new Mailer(this.emailAddress);
	}

	sendEmail(options: { subject: string; body: string }) {
		const mailer = this.getMailer();
		mailer.sendEmail(options);
	}

	getData(): ParentTable {
		return { ...this };
	}
}

export class MessageConversation {
	parentId: string;
	isAdmin: boolean;

	constructor(parentId: string, isAdmin: boolean) {
		this.parentId = parentId;
		this.isAdmin = isAdmin;
	}

	async sendMessage(messageContent: string): Promise<TwoWayMessage> {
		const db = await openDb();
		const date = new Date();

		const message: TwoWayMessageTable = {
			messageId: uuidv4(),
			parentId: this.parentId,
			dateSent: date.toLocaleDateString('en-GB'),
			fromOwner: this.isAdmin,
			messageContent: messageContent
		};

		await db.run(
			'INSERT INTO twoWayMessage VALUES (?, ?, ?, ?, ?)',
			message.messageId,
			message.messageContent,
			message.fromOwner,
			message.dateSent,
			message.parentId
		);

		return new TwoWayMessage(message);
	}

	async getMessages(): Promise<TwoWayMessage[]> {
		const db = await openDb();

		const messages: TwoWayMessageTable[] = await db.all(
			'SELECT * FROM twoWayMessage WHERE parentId = ?',
			this.parentId
		);

		return messages.map((message) => new TwoWayMessage(message));
	}

	async getLatestMessage(): Promise<TwoWayMessage | undefined> {
		const allMessages = await this.getMessages();
		if (allMessages.length > 0) {
			const latestMessage = allMessages[allMessages.length - 1];
			return latestMessage;
		} else {
			return undefined;
		}
	}

	async getParent(): Promise<Parent | undefined> {
		const db = await openDb();
		const parentData: ParentTable | undefined = await db.get(
			'SELECT * FROM parent WHERE parentId = ?',
			this.parentId
		);
		if (parentData !== undefined) {
			return new Parent(parentData);
		} else {
			return undefined;
		}
	}
}

export class AvailabilityChecker {
	session: Session;

	constructor(session: Session) {
		this.session = session;
	}

	async checkTimeOffPeriods(): Promise<boolean> {
		const db = await openDb();
		const timeOffPeriods: TimeOffPeriodTable[] = await db.all('SELECT * FROM timeOffPeriod');
		const formattedSessionDate = getDateFromLocaleString(this.session.date);

		for (let i = 0; i < timeOffPeriods.length; i++) {
			const currentPeriod = timeOffPeriods[i];
			const formattedTimeOffStartDate = getDateFromLocaleString(currentPeriod.startDate);
			const formattedTimeOffEndDate = getDateFromLocaleString(currentPeriod.endDate);

			if (
				formattedSessionDate >= formattedTimeOffStartDate &&
				formattedSessionDate <= formattedTimeOffEndDate
			) {
				// session is inside time off period
				return false;
			}
		}
		return true;
	}

	getOverlappingSessions(sessionsOnDate: Session[]): Session[] {
		const proposedSessionStartTimeSplit = this.session.startTime.split(':');

		// the start time of the session in minutes from midnight
		const proposedSessionStartTime =
			Number(proposedSessionStartTimeSplit[0]) * 60 + Number(proposedSessionStartTimeSplit[1]);

		// the end time of the session in minutes from midnight
		const proposedSessionEndTime = proposedSessionStartTime + this.session.length;

		let overlappingSessions: Session[] = [];

		for (let i = 0; i < sessionsOnDate.length; i++) {
			const currentSession = sessionsOnDate[i];

			const currentSessionStartTimeSplit = currentSession.startTime.split(':');
			const currentSessionStartTime =
				Number(currentSessionStartTimeSplit[0]) * 60 + Number(currentSessionStartTimeSplit[1]);

			const currentSessionEndTime = currentSessionStartTime + currentSession.length;

			if (
				currentSessionStartTime >= proposedSessionStartTime ||
				currentSessionStartTime <= proposedSessionEndTime
			) {
				overlappingSessions = [...overlappingSessions, currentSession];
			} else if (
				currentSessionEndTime >= proposedSessionStartTime ||
				currentSessionEndTime <= proposedSessionEndTime
			) {
				overlappingSessions = [...overlappingSessions, currentSession];
			}
		}

		return overlappingSessions;
	}

	async checkChildcareLimits(): Promise<boolean> {
		const sessionsOnDate = await getSessionsOnDate(this.session.date);

		const existingSessions = this.getOverlappingSessions(
			sessionsOnDate.map((session) => new Session(session))
		);

		let underTwelveYears: number = 0;
		let underEightYears: number = 0;
		let underFiveYears: number = 0;
		let underEighteenMonths: number = 0;

		for (let i = 0; i < existingSessions.length; i++) {
			const currentSession = existingSessions[i];
			const currentChild = await currentSession.getChild();
			if (currentChild !== undefined) {
				const age = currentChild.getAge();
				if (age < 12) {
					underTwelveYears = underTwelveYears + 1;
					if (age < 8) {
						underEightYears = underEightYears + 1;
						if (age < 5) {
							underFiveYears = underFiveYears + 1;
							const ageMonths = currentChild.getAgeMonths();
							if (ageMonths < 18) {
								underEighteenMonths = underEighteenMonths + 1;
							}
						}
					}
				}
			}
		}

		const newChild = await this.session.getChild();
		if (newChild !== undefined) {
			const age = newChild.getAge();
			if (age < 12) {
				underTwelveYears = underTwelveYears + 1;
				if (age < 8) {
					underEightYears = underEightYears + 1;
					if (age < 5) {
						underFiveYears = underFiveYears + 1;
						const ageMonths = newChild.getAgeMonths();
						if (ageMonths < 18) {
							underEighteenMonths = underEighteenMonths + 1;
						}
					}
				}
			}
		}

		if (underTwelveYears > Number(CHILDCARE_LIMIT_UNDER_TWELVE_YEARS)) {
			return false;
		} else if (underEightYears > Number(CHILDCARE_LIMIT_UNDER_EIGHT_YEARS)) {
			return false;
		} else if (underFiveYears > Number(CHILDCARE_LIMIT_UNDER_FIVE_YEARS)) {
			return false;
		} else if (underEighteenMonths > Number(CHILDCARE_LIMIT_UNDER_EIGHTEEN_MONTHS)) {
			return false;
		} else {
			return true;
		}
	}
}
