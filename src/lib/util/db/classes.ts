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
	SurveyQuestionOptionTable,
	SurveyQuestionTable,
	SurveyResponseTable,
	SurveyTable,
	TimeOffPeriodTable,
	TwoWayMessageTable
} from '$lib/util/db/tables';
import { v4 as uuidv4 } from 'uuid';
import { getDateFromLocaleString } from '../date';
import { Mailer } from '../email';
import type { LowercaseDaysWithWeekend, RecurringSessionDayDetails } from '../types';
import {
	CHILDCARE_LIMIT_UNDER_EIGHTEEN_MONTHS,
	CHILDCARE_LIMIT_UNDER_EIGHT_YEARS,
	CHILDCARE_LIMIT_UNDER_FIVE_YEARS,
	CHILDCARE_LIMIT_UNDER_TWELVE_YEARS,
	RECURRING_BOOKING_EXPIRY
} from '$env/static/private';
import { differenceBetweenTimes } from '$lib/util/date';
import bcrypt from 'bcrypt';
import { createSession } from './create';
import { getAdmin, getParent, getExpensesInPeriod, getSessionsOnDate } from './get';

export class Admin {
	// Sets the admin's password
	async setPassword(newPassword: string) {
		const passwordHash: string = await bcrypt.hash(newPassword, 10);
		const db = await openDb();
		await db.run('UPDATE account SET password = ? WHERE isAdmin = ?', passwordHash, true);
	}

	// Gets all expenses from the database
	async getExpenses(): Promise<Expense[]> {
		const db = await openDb();
		const expenses: ExpenseTable[] = await db.all('SELECT * FROM expense');
		return expenses.map((expense) => new Expense(expense));
	}

	// Gets all child records from the database
	async getChildren(): Promise<Child[]> {
		const db = await openDb();
		const children: ChildTable[] = await db.all('SELECT * FROM child');

		// Creates and returns an instance of the child class for each record from the database
		return children.map((child) => new Child(child));
	}

	// Gets all session records from the database
	async getSessions(): Promise<Session[]> {
		const db = await openDb();
		const sessions: SessionTable[] = await db.all('SELECT * FROM session');

		// Creates and returns an instance of the session class for each record from the database
		return sessions.map((session) => new Session(session));
	}

	// Gets all short notice notification records from the database
	async getNotifications(): Promise<ShortNoticeNotification[]> {
		const db = await openDb();
		const notifications: ShortNoticeNotificationTable[] = await db.all(
			'SELECT * FROM shortNoticeNotification'
		);

		// Creates and returns an instance of the short notice notification class for each record from the database
		return notifications.map((notification) => new ShortNoticeNotification(notification));
	}

	// Gets all parent records from the database
	async getParents(): Promise<Parent[]> {
		const db = await openDb();
		const parents: ParentTable[] = await db.all('SELECT * FROM parent');

		// Creates and returns an instance of the parent class for each record from the database
		return parents.map((parent) => new Parent(parent));
	}

	// Gets all session records from the database which are marked as absent
	async getAbsences(): Promise<Session[]> {
		const db = await openDb();
		const absentSessions: SessionTable[] = await db.all(
			'SELECT * FROM session WHERE absent = ?',
			true
		);

		// Creates and returns an instance of the session class for each record from the database
		return absentSessions.map((session) => new Session(session));
	}

	// Gets all survey records from the database
	async getSurveys(): Promise<Survey[]> {
		const db = await openDb();
		const surveys = await db.all('SELECT * FROM survey');

		// Creates and returns an instance of the survey class for each record from the database
		return surveys.map((survey) => new Survey(survey));
	}

	// Gets all invoice records from the database
	async getInvoices(): Promise<Invoice[]> {
		const db = await openDb();
		const invoices = await db.all('SELECT * FROM invoice');

		// Creates and returns an instance of the invoice class for each record from the database
		return invoices.map((invoice) => new Invoice(invoice));
	}

	// Gets all time off periods from the database
	async getTimeOffPeriods() {
		const db = await openDb();
		const timeOffPeriods: TimeOffPeriodTable[] = await db.all('SELECT * FROM timeOffPeriod');
		return timeOffPeriods.map((period) => new TimeOffPeriod(period));
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

	// Updates the password for the current account in the database
	async updatePassword(newPassword: string) {
		// Generates a hash of the password so that it is not stored in plain text in the database
		const passwordHash: string = await bcrypt.hash(newPassword, 10);

		this.password = passwordHash;

		const db = await openDb();
		await db.run(
			'UPDATE account SET password = ? WHERE accountId = ?',
			this.password,
			this.accountId
		);
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

	// Updates the absence status of the session
	async updateAbsenceStatus(chargeSession: boolean, keepSession: boolean) {
		const db = await openDb();
		await db.run(
			'UPDATE session SET absenceCharge = ?, absenceKeepSession = ? WHERE sessionId = ?',
			chargeSession,
			keepSession,
			this.sessionId
		);
	}

	getData(): SessionTable {
		return { ...this };
	}

	// Gets an instance of the child class for the child which the session belongs to
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

	// Calculates the finish time of the session
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

	// Gets an instance of the availability checker class for the session
	getAvailabilityChecker() {
		const availabilityChecker = new AvailabilityChecker(this);
		return availabilityChecker;
	}

	// Sends a booking confirmation email for the session
	async sendConfirmationEmail() {
		const child = await this.getChild();
		if (child !== undefined) {
			const parent = await child.getParent();
			if (parent !== undefined) {
				parent.sendEmail({
					subject: 'Session booking confirmation',
					htmlBody: `
						Hi ${parent.firstName}!
						<br> <br>
						This email is a confirmation that you have booked a new session with the details listed below.
						<br> <br>
						<b>Date:</b> ${this.date}
						<br>
						<b>Start time:</b> ${this.startTime}
						<br>
						<b>Length:</b> ${this.length / 60} hours
						<br>
						<b>Child:</b> ${child.firstName}
						<br> <br>
						If these details look wrong, modify your session <a href="http://localhost:5173/session/view/${
							this.sessionId
						}">here.</a>
						<br>
						Thank you
					`
				});
			}
		}
	}

	// Sends a deletion confirmation email for the session
	async sendDeletionEmail() {
		const child = await this.getChild();
		if (child !== undefined) {
			const parent = await child.getParent();
			if (parent !== undefined) {
				parent.sendEmail({
					subject: 'Session deletion notice ',
					htmlBody: `
						Hi ${parent.firstName}!
						<br> <br>
						This email is to say that the session with the following details has been deleted. 
						<br> <br>
						<b>Date:</b> ${this.date}
						<br>
						<b>Start time:</b> ${this.startTime}
						<br>
						<b>Length:</b> ${this.length / 60} hours
						<br>
						<b>Child:</b> ${child.firstName}
						<br> <br>
						This may be because of a time off period, if so you will have already had an email saying that one has been booked. 
						<br>
						Thank you
					`
				});
			}
		}
	}

	// Updates the date of the session in the database
	async setDate(date: string) {
		this.date = date;
		const db = await openDb();
		await db.run('UPDATE session SET date = ? WHERE sessionId = ?', date, this.sessionId);
	}

	// Updates the start time of the session in the database
	async setStartTime(startTime: string) {
		this.startTime = startTime;
		const db = await openDb();
		await db.run('UPDATE session SET startTime = ? WHERE sessionId = ?', startTime, this.sessionId);
	}

	// Updates the length of the session in the database
	async setLength(length: number) {
		this.length = length;
		const db = await openDb();
		await db.run('UPDATE session SET length = ? WHERE sessionId = ?', length, this.sessionId);
	}

	// Sends a confirmation email that the session has been edited
	async sendEditEmail() {
		const child = await this.getChild();
		if (child !== undefined) {
			const parent = await child.getParent();
			if (parent !== undefined) {
				parent.sendEmail({
					subject: 'Session edit confirmation',
					htmlBody: `
						Hi ${parent.firstName}!
						<br> <br>
						This email is a confirmation that you have edited an existing session, and the new details are below. 
						<br> <br>
						<b>Date:</b> ${this.date}
						<br>
						<b>Start time:</b> ${this.startTime}
						<br>
						<b>Length:</b> ${this.length / 60} hours
						<br>
						<b>Child:</b> ${child.firstName}
						<br> <br>
						If these details look wrong, modify your session <a href="http://localhost:5173/session/view/${
							this.sessionId
						}">here.</a>
						<br>
						Thank you
					`
				});
			}
		}
	}

	// Removes the session from the database
	async deleteFromDatabase() {
		const db = await openDb();
		await db.run('DELETE FROM session WHERE sessionId = ?', this.sessionId);
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

	// Updates the expense name in the database
	async setName(newName: string) {
		this.name = newName;
		const db = await openDb();
		await db.run('UPDATE expense SET name = ? WHERE expenseId = ?', newName, this.expenseId);
	}

	// Updates the expense date in the database
	async setDate(newDate: string) {
		this.date = newDate;
		const db = await openDb();
		await db.run('UPDATE expense SET date = ? WHERE expenseId = ?', newDate, this.expenseId);
	}

	// Updates the expense cost in the database
	async setCost(newCost: number) {
		this.cost = newCost;
		const db = await openDb();
		await db.run('UPDATE expense SET cost = ? WHERE expenseId = ?', newCost, this.expenseId);
	}

	// Updates the expense type in the databse
	async setType(newType: string) {
		this.type = newType;
		const db = await openDb();
		await db.run('UPDATE expense SET type = ? WHERE expenseId = ?', newType, this.expenseId);
	}

	// Updates the expense charge status in the database
	async setChargeStatus(newChargeStatus: boolean) {
		this.chargeToParents = newChargeStatus;
		const db = await openDb();
		await db.run(
			'UPDATE expense SET chargeToParents = ? WHERE expenseId = ?',
			newChargeStatus,
			this.expenseId
		);
	}

	// Updates the supporting docs of the invoice in the database
	async setSupportingDocsPath(newSupportingDocsPath: string) {
		this.supportingDocs = newSupportingDocsPath;
		const db = await openDb();
		await db.run(
			'UPDATE expense SET supportingDocs = ? WHERE expenseId = ?',
			newSupportingDocsPath,
			this.expenseId
		);
	}

	// Deletes the expense record from the database
	async deleteFromDatabase() {
		const db = await openDb();
		await db.run('DELETE FROM expense WHERE expenseId = ?', this.expenseId);
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
	decisionReason?: string;

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
		this.decisionReason = recurringSessionRequestData.decisionReason;
	}

	// Gets an instance of the child class for the child which the recurring session request belongs to
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

	// Deletes the recurring session request from the database
	async deleteFromDatabase() {
		const db = await openDb();
		await db.run(
			'DELETE FROM recurringSessionRequest WHERE recurringSessionId = ?',
			this.recurringSessionId
		);
	}

	// Sends a confirmation email to the parent which the recurring session request belongs to
	// Email can be to confirm a request, say it is approved, say it has been declined, or say that it has been cancelled
	async sendConfirmationEmail(type: 'confirm-request' | 'approve' | 'decline' | 'cancel') {
		const child = await this.getChild();
		if (child !== undefined) {
			const parent = await child.getParent();
			if (parent !== undefined) {
				if (type === 'confirm-request') {
					parent.sendEmail({
						subject: 'Recurring session request submitted',
						htmlBody: `
						Hi ${parent.firstName},
						<br><br>
						Your recurring session request has been submitted and will be reviewed by an admin soon.
						<br><br>
						Thank you	
					`
					});
				} else if (type === 'approve') {
					parent.sendEmail({
						subject: 'Recurring session request approved',
						htmlBody: `
						Hi ${parent.firstName},
						<br><br>
						Your recurring session request has been approved by an admin and the sessions requested within it have been booked. Manage your recurring session <a href="http://localhost:5173/recurring-session/view">here</a>
						<br><br>
						Thank you	
					`
					});
				} else if (type === 'decline') {
					parent.sendEmail({
						subject: 'Recurring session request submitted',
						htmlBody: `
						Hi ${parent.firstName},
						<br><br>
						Unfortunately your recurring session request has been declined by an admin. If you would like to request another click <a href="http://localhost:5173/recurring-session/request">here</a>
						<br><br>
						Thank you	
					`
					});
				} else if (type === 'cancel') {
					parent.sendEmail({
						subject: 'Recurring session request submitted',
						htmlBody: `
						Hi ${parent.firstName},
						<br><br>
						Your recurring session has been successfully cancelled. If you would like to request another click <a href="http://localhost:5173/recurring-session/request">here</a>
						<br><br>
						Thank you	
					`
					});
				}
			}
		}
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

	// Gets all the child's sessions within a specified period
	async getSessionsInPeriod(startDate: string, endDate: string): Promise<Session[]> {
		const formattedStartDate = getDateFromLocaleString(startDate);
		const formattedEndDate = getDateFromLocaleString(endDate);

		const db = await openDb();
		const sessionData: SessionTable[] = await db.all(
			'SELECT * FROM session WHERE childId = ?',
			this.childId
		);

		const sessions: Session[] = sessionData.map((session) => new Session(session));

		let inPeriodSessions: Session[] = [];

		for (let index = 0; index < sessions.length; index++) {
			const currentSession: Session = sessions[index];
			const currentSessionDate = getDateFromLocaleString(currentSession.date);

			// checks whether the session is the right date range
			if (formattedStartDate <= currentSessionDate && currentSessionDate <= formattedEndDate) {
				inPeriodSessions = [...inPeriodSessions, currentSession];
			}
		}

		return inPeriodSessions;
	}

	// Gets all the sessions that the child has from the database
	async getSessions(): Promise<Session[]> {
		const db = await openDb();
		const sessionData: SessionTable[] = await db.all(
			'SELECT * FROM session WHERE childId = ?',
			this.childId
		);

		// Returns an instance of the session class for each record returned from the database
		return sessionData.map((session) => new Session(session));
	}

	// Gets all the child's absent sessions
	async getAbsentSessions() {
		const db = await openDb();
		const sessionsWithAbsence: SessionTable[] = await db.all(
			'SELECT * FROM session WHERE childId = ? AND absent = ?',
			this.childId,
			true
		);
		return sessionsWithAbsence.map((session) => new Session(session));
	}

	// Calculates the child's age
	getAge(): number {
		const date = new Date();
		const formattedDateOfBirth = getDateFromLocaleString(this.dateOfBirth);
		let age = date.getFullYear() - formattedDateOfBirth.getFullYear();
		const monthDiff = date.getMonth() - formattedDateOfBirth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && date.getDate() < formattedDateOfBirth.getDate())) {
			age = age - 1;
		}
		return age;
	}

	// Calculates the child's age in months
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

	// Gets the child's recurring session request from the database if they have one
	async getRecurringSessionRequest(): Promise<RecurringSessionRequest | undefined> {
		const db = await openDb();
		const requestData: RecurringSessionRequestTable | undefined = await db.get(
			'SELECT * FROM recurringSessionRequest WHERE childId = ?',
			this.childId
		);
		if (requestData !== undefined) {
			return new RecurringSessionRequest(requestData);
		} else {
			return undefined;
		}
	}

	// Checks whether or not the child has a recurring session request
	async hasRecurringSessionRequest(): Promise<boolean> {
		const recurringSessionRequest = await this.getRecurringSessionRequest();
		if (recurringSessionRequest === undefined) {
			return false;
		} else {
			return true;
		}
	}

	// Creates a recurring session request in the database for the child
	async createRecurringSessionRequest(
		recurringBasis: string,
		dayDetails: RecurringSessionDayDetails
	) {
		const db = await openDb();

		const date = new Date();

		await db.run(
			'INSERT INTO recurringSessionRequest VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
			this.childId,
			null
		);
	}

	// Sets the status of the child's recurring session request in the database
	async setRecurringSessionRequestStatus(approvalStatus: boolean, reason: string) {
		const db = await openDb();
		await db.run(
			'UPDATE recurringSessionRequest SET approved = ? WHERE childId = ?',
			approvalStatus,
			this.childId
		);
	}

	// Deletes the child's recurring session request in the database, and any sessions booked under it
	async deleteRecurringSessionRequest() {
		const db = await openDb();
		await db.run('DELETE FROM recurringSessionRequest WHERE childId = ?', this.childId);
		await db.run('DELETE FROM session WHERE childId = ? and isRecurring = ?', this.childId, true);
	}

	// Creates the sessions specified in the recurring session request
	async createRecurringSession(
		bypassRegs?: boolean
	): Promise<{ success: true } | { success: false; clashes: Session[] } | undefined> {
		const db = await openDb();

		const request = await this.getRecurringSessionRequest();
		if (request !== undefined) {
			const weekday: LowercaseDaysWithWeekend[] = [
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
			let allowedSessions: Session[] = [];
			let clashingSessions: Session[] = [];
			do {
				const currentDay = weekday[currentDate.getDay()];
				if (currentDay !== 'saturday' && currentDay !== 'sunday') {
					// coming up as 1 or 0 instead of true or false, use strict equality when fixed
					if (request[`${currentDay}Selected`] == true) {
						const startTime = request[`${currentDay}StartTime`] as string;
						const endTime = request[`${currentDay}EndTime`] as string;
						const length = differenceBetweenTimes(startTime, endTime);

						const session = new Session({
							sessionId: uuidv4(),
							date: currentDate.toLocaleDateString('en-GB'),
							startTime: startTime,
							length: length,
							dateBooked: new Date().toLocaleDateString('en-GB'),
							absent: false,
							absenceCharge: false,
							absenceKeepSession: false,
							isRecurring: true,
							childId: this.childId
						});

						const availabilityChecker = new AvailabilityChecker(session);

						const sessionAllowed =
							bypassRegs ||
							((await availabilityChecker.checkChildcareLimits()) &&
								(await availabilityChecker.checkTimeOffPeriods()));

						if (sessionAllowed === true) {
							allowedSessions = [...allowedSessions, session];
						} else {
							clashingSessions = [...clashingSessions, session];
						}
					}
				}
				// Increment day by 1
				currentDate = new Date(currentDate.getTime() + 86400000);
			} while (currentDate <= endDate);

			if (clashingSessions.length > 0) {
				// sessions have clashed
				return { success: false, clashes: clashingSessions };
			} else {
				for (let i = 0; i < allowedSessions.length; i++) {
					const currentSession = allowedSessions[i];
					await createSession(currentSession.getData());
				}

				// all sessions are okay
				return { success: true };
			}
		}
	}

	// Gets the parent that the child belongs to
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

	// Creates an absence report for the child
	// Marks sessions within the specified time as absent
	async createAbsenceReport(
		startDate: string,
		endDate: string,
		reason: string,
		additionalInformation: string
	): Promise<Number> {
		const db = await openDb();

		const formattedStartDate = getDateFromLocaleString(startDate);
		const formattedEndDate = getDateFromLocaleString(endDate);

		let currentLoopDate = formattedStartDate;
		let sessionsAffected: number = 0;
		do {
			// checks that there is a session on the current loop date
			const sessionToMark: SessionTable | undefined = await db.get(
				'SELECT * FROM session WHERE childId = ? AND date = ?',
				this.childId,
				currentLoopDate.toLocaleDateString('en-GB')
			);

			if (sessionToMark !== undefined) {
				// if there is a session, update the session with the absense details
				await db.run(
					'UPDATE session SET absent = ?, absenceReason = ?, absenceAdditionalInformation = ? WHERE childId = ? AND date = ?',
					true,
					reason,
					additionalInformation,
					this.childId,
					currentLoopDate.toLocaleDateString('en-GB')
				);
				sessionsAffected = sessionsAffected + 1;
			}

			// 86400000 is 1 day in ms
			// increment day by 1
			currentLoopDate = new Date(currentLoopDate.getTime() + 86400000);
		} while (currentLoopDate <= formattedEndDate);
		return sessionsAffected;
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

	// Gets the parent that the invoice is issued to
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

	// Gets the child that the invoice is generated upon
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

	// Sends an email to the issued parent to notify them that they have a new invoice
	async sendConfirmationEmail() {
		const parent = await this.getParent();
		if (parent !== undefined) {
			const child = await this.getChild();
			if (child !== undefined) {
				const mailer = parent.getMailer();

				mailer.sendEmail({
					subject: 'New invoice issued',
					htmlBody: `
				Hi ${parent.firstName},
				<br><br>
				You have just been issued a new invoice for ${child.firstName}, please view it using the link below or via the dashboard.
				<br><br>
				<a href="http://localhost:5173/invoicing/view/${this.invoiceId}">View invoice</a>
				<br><br>
				Thank you
				`
				});
			}
		}
	}

	// Updates the payment status of the invoice in the database
	async updatePaymentStatus(newPaymentStatus: string) {
		const db = await openDb();
		await db.run(
			'UPDATE invoice SET paymentStatus = ? WHERE invoiceId = ?',
			newPaymentStatus,
			this.invoiceId
		);
	}

	// Gets all sessions that are part of the invoice
	async getSessions(): Promise<Session[]> {
		const child = await this.getChild();
		if (child !== undefined) {
			return child.getSessionsInPeriod(this.startDate, this.endDate);
		} else {
			return [];
		}
	}

	// Gets all expenses that are part of the invoice
	async getExpenses(): Promise<Expense[]> {
		if (this.includeExpenses) {
			return (await getExpensesInPeriod(this.startDate, this.endDate)).map(
				(expense) => new Expense(expense)
			);
		} else {
			return [];
		}
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

	// Sends an email to all parents notifying them that a time off period has been booked
	async sendConfirmationEmail() {
		const admin = getAdmin();
		const parents = await admin.getParents();
		for (let i = 0; i < parents.length; i++) {
			const currentParent = parents[i];
			await currentParent.sendEmail({
				subject: 'Time off period booked by business',
				htmlBody: `
				Hi ${currentParent.firstName},
				<br><br>
				The business has created a time off period between the dates of ${this.startDate} and ${
					this.endDate
				}. You will not be able to book any sessions within this time.
				<br>
${
	this.cancelSessions
		? 'Existing sessions within this period will be cancelled, so please arrange other childcare.'
		: 'Existing sessions within this period will <b>NOT</b> be cancelled. '
}
				<br><br>
				Thank you
				`
			});
		}
	}

	// Deletes the time off period from the database
	async deleteFromDatabase() {
		const db = await openDb();
		await db.run('DELETE FROM timeOffPeriod WHERE timeOffPeriodId = ?', this.timeOffPeriodId);
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

	// Issues the survey to the parent with the specified parentId
	async issue(parentId: string) {
		const date = new Date();

		const db = await openDb();
		await db.run(
			'INSERT INTO surveyIssue VALUES (?, ?, ?, ?)',
			uuidv4(),
			date.toLocaleDateString('en-GB'),
			this.surveyId,
			parentId
		);
	}

	// Gets all the questions that are part of the survey
	async getQuestions(): Promise<SurveyQuestion[]> {
		const db = await openDb();
		const questions: SurveyQuestion[] = await db.all(
			'SELECT * FROM surveyQuestion WHERE surveyId = ?',
			this.surveyId
		);
		return questions.map((question) => new SurveyQuestion(question));
	}

	// Adds a question to the survey and creates the relevant database entries
	async addQuestion(prompt: string): Promise<SurveyQuestion> {
		const date = new Date();
		const surveyQuestion = new SurveyQuestion({
			dateCreated: date.toLocaleDateString('en-GB'),
			prompt: prompt,
			surveyId: this.surveyId,
			surveyQuestionId: uuidv4()
		});
		const db = await openDb();
		await db.run(
			'INSERT INTO surveyQuestion VALUES (?, ?, ?, ?)',
			surveyQuestion.surveyQuestionId,
			surveyQuestion.prompt,
			surveyQuestion.dateCreated,
			surveyQuestion.surveyId
		);

		this.numberOfQuestions = this.numberOfQuestions + 1;

		await db.run(
			'UPDATE survey SET numberOfQuestions = ? WHERE surveyId = ?',
			this.numberOfQuestions,
			this.surveyId
		);

		return surveyQuestion;
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

	// Gets all the responses to the question from the database
	async getResponses(): Promise<SurveyResponseTable[]> {
		const db = await openDb();
		const responses: SurveyResponseTable[] = await db.all(
			'SELECT * FROM surveyResponse WHERE surveyQuestionId = ?',
			this.surveyQuestionId
		);
		return responses;
	}

	// Gets the survey which the question belongs to
	async getSurvey(): Promise<Survey | undefined> {
		const db = await openDb();
		const surveyData: SurveyTable | undefined = await db.get(
			'SELECT * FROM survey WHERE surveyId = ?',
			this.surveyId
		);
		if (surveyData !== undefined) {
			return new Survey(surveyData);
		} else {
			return undefined;
		}
	}

	// Adds an option to the question and creates the relevant entries in the database
	async addOption(prompt: string): Promise<SurveyQuestionOption> {
		const date = new Date();
		const surveyQuestionOption = new SurveyQuestionOption({
			dateCreated: date.toLocaleDateString('en-GB'),
			prompt: prompt,
			surveyQuestionId: this.surveyQuestionId,
			surveyQuestionOptionId: uuidv4()
		});

		const db = await openDb();
		await db.run(
			'INSERT INTO surveyQuestionOption VALUES (?, ?, ?, ?)',
			surveyQuestionOption.surveyQuestionOptionId,
			surveyQuestionOption.prompt,
			surveyQuestionOption.dateCreated,
			surveyQuestionOption.surveyQuestionId
		);

		return surveyQuestionOption;
	}

	// Gets all the question's options from the database
	async getOptions(): Promise<SurveyQuestionOption[]> {
		const db = await openDb();
		const optionData: SurveyQuestionOptionTable[] = await db.all(
			'SELECT * FROM surveyQuestionOption WHERE surveyQuestionId = ?',
			this.surveyQuestionId
		);
		return optionData.map((option) => new SurveyQuestionOption(option));
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

	// Gets the survey that the survey issue is for
	async getSurvey(): Promise<Survey | undefined> {
		const db = await openDb();
		const surveyData: SurveyTable | undefined = await db.get(
			'SELECT * FROM survey WHERE surveyId = ?',
			this.surveyId
		);
		if (surveyData !== undefined) {
			return new Survey(surveyData);
		} else {
			return undefined;
		}
	}

	getData(): SurveyIssueTable {
		return { ...this };
	}
}

export class SurveyQuestionOption {
	surveyQuestionOptionId: string;
	prompt: string;
	dateCreated: string;
	surveyQuestionId: string;

	constructor(surveyQuestionOptionData: SurveyQuestionOptionTable) {
		this.surveyQuestionOptionId = surveyQuestionOptionData.surveyQuestionOptionId;
		this.prompt = surveyQuestionOptionData.prompt;
		this.dateCreated = surveyQuestionOptionData.dateCreated;
		this.surveyQuestionId = surveyQuestionOptionData.surveyQuestionId;
	}

	// Gets the question that the option belongs to
	async getSurveyQuestion(): Promise<SurveyQuestion | undefined> {
		const db = await openDb();
		const surveyQuestionData: SurveyQuestionTable | undefined = await db.get(
			'SELECT * FROM surveyQuestion WHERE surveyQuestionId = ?',
			this.surveyQuestionId
		);
		if (surveyQuestionData !== undefined) {
			return new SurveyQuestion(surveyQuestionData);
		} else {
			return undefined;
		}
	}

	getData() {
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

	// Sends an email to all parents that the notification has been issued to
	// Notifies them that a new notification has been issued to them
	async sendConfirmationEmail() {
		const db = await openDb();
		const issues: ShortNoticeNotifcationIssueTable[] = await db.all(
			'SELECT * FROM shortNoticeNotificationIssue WHERE notificationId = ?',
			this.notificationId
		);

		for (let i = 0; i < issues.length; i++) {
			const currentIssue = issues[i];
			const currentParent = await getParent(currentIssue.parentId);
			if (currentParent !== undefined) {
				await currentParent.sendEmail({
					subject: 'New short notice notification issued',
					htmlBody: `Hi ${currentParent.firstName}
					<br><br>
					You have been issued a new short notice notification. It is listed below and is also accessible via the dashboard. 
					<br><br>
					<i>${this.message}</i>
					<br><br>
					Thank you
					`
				});
			}
		}
	}

	// Issues the notification to the parent with the specified parentId
	async issue(allParents: boolean, parentId: string) {
		const db = await openDb();
		await db.run(
			'INSERT INTO shortNoticeNotificationIssue VALUES (?, ?, ?, ?, ?)',
			uuidv4(),
			allParents,
			new Date().toLocaleDateString('en-GB'),
			parentId,
			this.notificationId
		);
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

	// Gets the account that the parent belongs to
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

	// Checks whether a parent has access to a certain session
	// False = They do not have access to it
	// True = They do have access to it
	async hasAccessToSession(sessionId: string) {
		const db = await openDb();
		const sessionChildId: { childId: string } | undefined = await db.get(
			'SELECT childId FROM session WHERE sessionId = ?',
			sessionId
		);

		if (sessionChildId !== undefined) {
			const parentChildrenId: { childId: string }[] = await db.all(
				'SELECT childId FROM child WHERE parentId = ?',
				this.parentId
			);

			for (let i = 0; i < parentChildrenId.length; i++) {
				const currentChildId = parentChildrenId[i];
				if (currentChildId.childId === sessionChildId.childId) {
					return true;
				}
			}
		}

		return false;
	}

	// Gets all children that belong to the parent
	async getChildren(): Promise<Child[]> {
		const db = await openDb();
		const children: ChildTable[] = await db.all(
			'SELECT * FROM child WHERE parentId = ?',
			this.parentId
		);
		return children.map((child) => new Child(child));
	}

	// Gets all sessions that the parent has booked
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

	// Gets all notifications that have been issued to the parent
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

	// Gets an instance of the two way message conversation class for the parent
	getMessageConversation(): MessageConversation {
		return new MessageConversation(this.parentId, false);
	}

	// Gets an instance of the mailer class for the parent
	getMailer(): Mailer {
		return new Mailer(this.emailAddress);
	}

	// Sends an email to the parent given a subject and HTML formatted body
	sendEmail(options: { subject: string; htmlBody: string }) {
		const mailer = this.getMailer();
		mailer.sendEmail(options);
	}

	// Gets all sessions that have been marked as absent that belong to the parent
	async getAbsences(): Promise<Session[]> {
		const db = await openDb();
		let absentSessions: SessionTable[] = [];
		const children = await this.getChildren();

		for (let i = 0; i < children.length; i++) {
			const currentChild = children[i];
			const currentAbsentSessions: SessionTable[] = await db.all(
				'SELECT * FROM session WHERE childId = ? AND absent = ?',
				currentChild.childId,
				true
			);
			absentSessions = [...absentSessions, ...currentAbsentSessions];
		}

		return absentSessions.map((session) => new Session(session));
	}

	// Gets all surveys that have been issued to the parent
	async getSurveys(): Promise<Survey[]> {
		const db = await openDb();
		const surveyIssues: SurveyIssueTable[] = await db.all(
			'SELECT * FROM surveyIssue WHERE parentId = ?',
			this.parentId
		);
		let surveys: Survey[] = [];

		for (let i = 0; i < surveyIssues.length; i++) {
			const currentIssue = new SurveyIssue(surveyIssues[i]);
			const currentSurvey = await currentIssue.getSurvey();
			if (currentSurvey !== undefined) {
				surveys = [...surveys, currentSurvey];
			}
		}

		return surveys;
	}

	// Gets all invoices that have been issued to the parent
	async getInvoices(): Promise<Invoice[]> {
		const db = await openDb();
		const invoices: InvoiceTable[] = await db.all(
			'SELECT * FROM invoice WHERE parentId = ?',
			this.parentId
		);
		return invoices.map((invoice) => new Invoice(invoice));
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

	// Sends a message from the current user to the chat
	// Adds the relevant entries in the databas
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

	// Gets all messages within the conversation
	async getMessages(): Promise<TwoWayMessage[]> {
		const db = await openDb();

		const messages: TwoWayMessageTable[] = await db.all(
			'SELECT * FROM twoWayMessage WHERE parentId = ?',
			this.parentId
		);

		return messages.map((message) => new TwoWayMessage(message));
	}

	// Gets the latest message from the conversation
	async getLatestMessage(): Promise<TwoWayMessage | undefined> {
		const allMessages = await this.getMessages();
		if (allMessages.length > 0) {
			const latestMessage = allMessages[allMessages.length - 1];
			return latestMessage;
		} else {
			return undefined;
		}
	}

	// Returns the parent that the message conversation is for
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

	// Checks whether the session interferes with a time off period
	// False = session not available
	// True = sesison is available
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
				return false;
			}
		}
		return true;
	}

	// Gets all sessions that overlap with the proposed one
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

	// Checks whether the session causes childcare limits to be exceeded
	// False = session is not available
	// True = session is available
	async checkChildcareLimits(): Promise<boolean> {
		const sessionsOnDate = await getSessionsOnDate(this.session.date);

		const existingSessions = this.getOverlappingSessions(sessionsOnDate);

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
			console.log(newChild.getAge());
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
