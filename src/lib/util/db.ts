import type {
	account,
	child,
	expandedSurvey,
	expandedSurveyQuestion,
	expandedSurveyWithResponses,
	expense,
	invoice,
	parent,
	recurringSessionDayDetails,
	recurringSessionRequest,
	session,
	shortNoticeNotifcation,
	shortNoticeNotifcationIssue,
	survey,
	surveyIssue,
	surveyQuestion,
	surveyQuestionOption,
	surveyResponse,
	timeOffPeriod,
	twoWayMessage
} from './types';
import { openDb } from '../../db/index';
import { v4 as uuidv4 } from 'uuid';
import { HOURLY_RATE, RECURRING_BOOKING_EXPIRY } from '$env/static/private';
import { getDateFromLocaleString } from './date';

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

export async function getMessages(parentId: string): Promise<twoWayMessage[]> {
	const db = await openDb();

	const messages: twoWayMessage[] = await db.all(
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
	const parents: parent[] = await db.all('SELECT * FROM parent');
	return parents;
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
		const dbParents: parent[] = await db.all('SELECT * FROM parent');
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
): Promise<shortNoticeNotifcation[]> {
	const db = await openDb();

	const notificationIssues: shortNoticeNotifcationIssue[] = await db.all(
		'SELECT * FROM shortNoticeNotificationIssue WHERE parentId = ?',
		parentId
	);

	let notifications: shortNoticeNotifcation[] = [];

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
	return notifications;
}

export async function getChildren(parentId: string): Promise<child[]> {
	const db = await openDb();
	const children: child[] = await db.all('SELECT * FROM child WHERE parentId = ?', parentId);
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
		absenceKeepSession: true,
		dateBooked: currentDate.toLocaleDateString('en-GB'),
		isRecurring: false,
		invoiceId: undefined
	};

	const db = await openDb();

	await db.run(
		'INSERT INTO session VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
		createdSession.sessionId,
		createdSession.date,
		createdSession.startTime,
		createdSession.length,
		createdSession.dateBooked,
		createdSession.absent,
		createdSession.absenceCharge,
		null,
		null,
		true,
		createdSession.isRecurring,
		createdSession.childId,
		null
	);

	return createdSession;
}

export async function getChildSessions(childId: string): Promise<session[]> {
	const db = await openDb();

	const sessions: session[] = await db.all('SELECT * FROM session WHERE childId = ?', childId);

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

export async function getAllParentSessions(parentId: string): Promise<session[]> {
	const children = await getChildren(parentId);
	let sessions: session[] = [];
	for (let i = 0; i < children.length; i++) {
		const currentChild: child = children[i];
		const currentChildSessions = await getChildSessions(currentChild.childId);

		for (let j = 0; j < currentChildSessions.length; j++) {
			const currentChildSession = currentChildSessions[j];
			sessions = [...sessions, currentChildSession];
		}
	}
	return sessions;
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

export async function getAllExpenses(): Promise<expense[]> {
	const db = await openDb();
	const expenses: expense[] = await db.all('SELECT * FROM expense');
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

export async function getAllSessions(): Promise<session[]> {
	const db = await openDb();
	const sessions: session[] = await db.all('SELECT * FROM session');
	return sessions;
}

export async function getAllChildren(): Promise<child[]> {
	const db = await openDb();
	const children: child[] = await db.all('SELECT * FROM child');
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
		expensesInPeriod = await getExpensesInPeriod(invoiceDetails.startDate, invoiceDetails.endDate);
	}

	// Calc total
	let total = 0;

	for (let index = 0; index < sessionsInPeriod.length; index++) {
		const currentSession: session = sessionsInPeriod[index];
		if (currentSession.absent) {
			if (currentSession.absenceCharge) {
				const sessionCost = (currentSession.length / 60) * Number(HOURLY_RATE);
				total = total + sessionCost;
			}
		} else {
			const sessionCost = (currentSession.length / 60) * Number(HOURLY_RATE);
			total = total + sessionCost;
		}
	}

	for (let index = 0; index < expensesInPeriod.length; index++) {
		const currentExpense: expense = expensesInPeriod[index];
		if (currentExpense.chargeToParents) {
			total = total + currentExpense.cost;
		}
	}

	if (invoiceDetails.additionalChargeAmount !== undefined) {
		total = total + invoiceDetails.additionalChargeAmount;
	}

	if (invoiceDetails.discountAmount !== undefined) {
		total = total * ((100 - invoiceDetails.discountAmount) / 100);
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
		message: invoiceDetails.message,
		paymentStatus: 'Unpaid'
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
		generatedInvoice.paymentStatus,
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
	const formattedStartDate = getDateFromLocaleString(startDate);
	const formattedEndDate = getDateFromLocaleString(endDate);

	const sessions: session[] = await db.all('SELECT * FROM session WHERE childId = ?', childId);

	let inPeriodSessions: session[] = [];

	if (sessions !== undefined) {
		for (let index = 0; index < sessions.length; index++) {
			const currentSession: session = sessions[index];
			const currentSessionDate = getDateFromLocaleString(currentSession.date);

			// checks whether the session is the right date range
			if (formattedStartDate <= currentSessionDate && currentSessionDate <= formattedEndDate) {
				inPeriodSessions = [...inPeriodSessions, currentSession];
			}
		}
	}
	return inPeriodSessions;
}

export async function getExpensesInPeriod(startDate: string, endDate: string): Promise<expense[]> {
	const db = await openDb();
	const formattedStartDate = getDateFromLocaleString(startDate);
	const formattedEndDate = getDateFromLocaleString(endDate);

	const expenses: expense[] = await db.all('SELECT * FROM expense');

	let inPeriodExpenses: expense[] = [];

	if (expenses !== undefined) {
		for (let index = 0; index < expenses.length; index++) {
			const currentExpense: expense = expenses[index];
			const currentExpenseDate = getDateFromLocaleString(currentExpense.date);

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

export async function getAllShortNoticeNotifications(): Promise<shortNoticeNotifcation[]> {
	const db = await openDb();
	const notifications: shortNoticeNotifcation[] = await db.all(
		'SELECT * FROM shortNoticeNotification'
	);
	return notifications;
}

export async function writeSurvey(survey: expandedSurvey) {
	const db = await openDb();
	await db.run(
		'INSERT INTO survey VALUES (?, ?, ?, ?, ?, ?, ?)',
		survey.surveyId,
		survey.title,
		survey.description,
		survey.consentForm,
		survey.anonymous,
		survey.numberOfQuestions,
		survey.dateCreated
	);
	survey.questions.forEach(async (question) => {
		await db.run(
			'INSERT INTO surveyQuestion VALUES (?, ?, ?, ?)',
			question.surveyQuestionId,
			question.prompt,
			question.dateCreated,
			survey.surveyId
		);
		question.options.forEach(async (option) => {
			await db.run(
				'INSERT INTO surveyQuestionOption VALUES (?, ?, ?, ?)',
				option.surveyQuestionOptionId,
				option.prompt,
				option.dateCreated,
				question.surveyQuestionId
			);
		});
	});
}

export async function getAllSurveys(): Promise<survey[]> {
	const db = await openDb();
	const surveys: survey[] = await db.all('SELECT * FROM survey');
	return surveys;
}

export async function getSurvey(surveyId: string): Promise<survey | undefined> {
	const db = await openDb();
	const surveyData: survey | undefined = await db.get(
		'SELECT * FROM survey WHERE surveyId = ?',
		surveyId
	);
	return surveyData;
}

export async function getSurveys(parentId: string) {
	const db = await openDb();
	const issues: surveyIssue[] = await db.all(
		'SELECT * FROM surveyIssue WHERE parentId = ?',
		parentId
	);
	if (issues !== undefined) {
		let surveys: survey[] = [];
		for (let index = 0; index < issues.length; index++) {
			const currentSurveyIssue: surveyIssue = issues[index];
			const currentSurvey: survey | undefined = await getSurvey(currentSurveyIssue.surveyId);
			if (currentSurvey !== undefined) {
				surveys.push(currentSurvey);
			}
		}
		return surveys;
	}
	return undefined;
}

export async function getExpandedSurveys(parentId: string): Promise<expandedSurvey[]> {
	const db = await openDb();
	const issues: surveyIssue[] = await db.all(
		'SELECT * FROM surveyIssue WHERE parentId = ?',
		parentId
	);
	let surveys: expandedSurvey[] = [];
	for (let index = 0; index < issues.length; index++) {
		const currentSurveyIssue: surveyIssue = issues[index];
		const currentSurvey: expandedSurvey | undefined = await getExpandedSurvey(
			currentSurveyIssue.surveyId
		);
		if (currentSurvey !== undefined) {
			surveys.push(currentSurvey);
		}
	}
	return surveys;
}

export async function getSurveyQuestionOption(
	surveyQuestionOptionId: string
): Promise<surveyQuestionOption | undefined> {
	const db = await openDb();
	const surveyQuestionOptionData: surveyQuestionOption | undefined = await db.get(
		'SELECT * FROM surveyQuestionOption WHERE surveyQuestionOptionId = ?',
		surveyQuestionOptionId
	);
	return surveyQuestionOptionData;
}

export async function getSurveyQuestionOptions(
	surveyQuestionId: string
): Promise<surveyQuestionOption[]> {
	const db = await openDb();
	const surveyQuestionOptionData: surveyQuestionOption[] = await db.all(
		'SELECT * FROM surveyQuestionOption WHERE surveyQuestionId = ?',
		surveyQuestionId
	);
	return surveyQuestionOptionData;
}

export async function getSurveyQuestion(
	surveyQuestionId: string
): Promise<surveyQuestion | undefined> {
	const db = await openDb();
	const surveyQuestionData: surveyQuestion | undefined = await db.get(
		'SELECT * FROM surveyQuestion WHERE surveyQuestionId = ?',
		surveyQuestionId
	);
	return surveyQuestionData;
}

export async function getExpandedSurveyQuestion(
	surveyQuestionId: string
): Promise<expandedSurveyQuestion | undefined> {
	const surveyQuestionData = await getSurveyQuestion(surveyQuestionId);
	if (surveyQuestionData !== undefined) {
		const surveyQuestionOptions = await getSurveyQuestionOptions(
			surveyQuestionData.surveyQuestionId
		);
		let expandedQuestion: expandedSurveyQuestion = {
			surveyId: surveyQuestionData.surveyId,
			dateCreated: surveyQuestionData.dateCreated,
			prompt: surveyQuestionData.prompt,
			surveyQuestionId: surveyQuestionData.surveyQuestionId,
			options: []
		};
		if (surveyQuestionOptions !== undefined) {
			surveyQuestionOptions.forEach((option) => {
				expandedQuestion.options.push({
					dateCreated: option.dateCreated,
					prompt: option.prompt,
					surveyQuestionOptionId: option.surveyQuestionOptionId
				});
			});
			return expandedQuestion;
		}
		return undefined;
	}
	return undefined;
}

export async function getSurveyQuestions(surveyId: string): Promise<surveyQuestion[]> {
	const db = await openDb();
	const questions: surveyQuestion[] = await db.all(
		'SELECT * FROM surveyQuestion WHERE surveyId = ?',
		surveyId
	);
	return questions;
}

export async function getExpandedSurvey(surveyId: string): Promise<expandedSurvey | undefined> {
	const surveyData = await getSurvey(surveyId);
	if (surveyData !== undefined) {
		let expandedSurveyData: expandedSurvey = {
			anonymous: surveyData.anonymous,
			consentForm: surveyData.consentForm,
			dateCreated: surveyData.dateCreated,
			numberOfQuestions: surveyData.numberOfQuestions,
			questions: [],
			surveyId: surveyData.surveyId,
			title: surveyData.title,
			description: surveyData.description
		};
		const surveyQuestions: surveyQuestion[] = await getSurveyQuestions(surveyId);
		if (surveyQuestions !== undefined) {
			for (let index = 0; index < surveyQuestions.length; index++) {
				const question = surveyQuestions[index];
				const expandedQuestion = await getExpandedSurveyQuestion(question.surveyQuestionId);
				if (expandedQuestion !== undefined) {
					expandedSurveyData.questions = [
						...expandedSurveyData.questions,
						{
							dateCreated: question.dateCreated,
							options: expandedQuestion.options,
							prompt: question.prompt,
							surveyQuestionId: question.surveyQuestionId
						}
					];
				}
			}
			return expandedSurveyData;
		}
		return undefined;
	}
	return undefined;
}

export async function getSurveyResponse(
	surveyQuestionId: string,
	parentId: string
): Promise<surveyResponse | undefined> {
	const db = await openDb();
	const response: surveyResponse | undefined = await db.get(
		'SELECT * FROM surveyResponse WHERE surveyQuestionId = ? AND parentId = ?',
		surveyQuestionId,
		parentId
	);
	return response;
}

export async function writeSurveyResponse(
	parentId: string,
	surveyId: string,
	surveyQuestionId: string,
	surveyQuestionOptionId: string
): Promise<surveyResponse> {
	const date = new Date();

	const surveyResponseData: surveyResponse = {
		surveyResponseId: uuidv4(),
		dateRecorded: date.toLocaleDateString('en-GB'),
		parentId: parentId,
		surveyId: surveyId,
		surveyQuestionId: surveyQuestionId,
		surveyQuestionOptionId: surveyQuestionOptionId
	};

	const db = await openDb();

	await db.run(
		'INSERT INTO surveyResponse VALUES (?, ?, ?, ?, ?, ?)',
		surveyResponseData.surveyResponseId,
		surveyResponseData.dateRecorded,
		surveyResponseData.parentId,
		surveyResponseData.surveyId,
		surveyResponseData.surveyQuestionId,
		surveyResponseData.surveyQuestionOptionId
	);

	return surveyResponseData;
}

export async function updateSurveyResponse(
	surveyResponseId: string,
	newSurveyQuestionOptionId: string
) {
	const db = await openDb();
	await db.run(
		'UPDATE surveyResponse SET surveyQuestionOptionId = ? WHERE surveyResponseId = ?',
		newSurveyQuestionOptionId,
		surveyResponseId
	);
}

export async function checkSurveyResponseExists(surveyQuestionId: string, parentId: string) {
	const db = await openDb();
	const response = await db.get(
		'SELECT * FROM surveyResponse WHERE surveyQuestionId = ? AND parentId = ?',
		surveyQuestionId,
		parentId
	);
	if (response === undefined) {
		return false;
	}
	return true;
}

export async function getSurveyQuestionResponses(surveyQuestionId: string) {
	const db = await openDb();
	const responses: surveyResponse[] = await db.all(
		'SELECT * FROM surveyResponse WHERE surveyQuestionId = ?',
		surveyQuestionId
	);
	return responses;
}

export async function getExpandedSurveyWithResponses(surveyId: string) {
	const expandedSurveyData: expandedSurvey | undefined = await getExpandedSurvey(surveyId);
	if (expandedSurveyData !== undefined) {
		let expandedSurveyDataWithResponses: expandedSurveyWithResponses = {
			anonymous: expandedSurveyData.anonymous,
			consentForm: expandedSurveyData.consentForm,
			dateCreated: expandedSurveyData.dateCreated,
			numberOfQuestions: expandedSurveyData.numberOfQuestions,
			surveyId: expandedSurveyData.surveyId,
			title: expandedSurveyData.surveyId,
			description: expandedSurveyData.description,
			questions: []
		};
		for (let i = 0; i < expandedSurveyData.questions.length; i++) {
			const currentQuestion = expandedSurveyData.questions[i];
			const currentQuestionResponses = await getSurveyQuestionResponses(
				currentQuestion.surveyQuestionId
			);
			let formattedResponses: {
				surveyResponseId: string;
				dateRecorded: string;
				parentId: string;
				surveyQuestionOption: {
					surveyQuestionOptionId: string;
					prompt: string;
					dateCreated: string;
				};
			}[] = [];
			if (currentQuestionResponses !== undefined) {
				for (let j = 0; j < currentQuestionResponses.length; j++) {
					const currentResponse = currentQuestionResponses[j];
					const db = await openDb();
					const optionData: surveyQuestionOption | undefined = await db.get(
						'SELECT * FROM surveyQuestionOption WHERE surveyQuestionOptionId = ?',
						currentResponse.surveyQuestionOptionId
					);
					if (optionData !== undefined) {
						formattedResponses = [
							...formattedResponses,
							{
								dateRecorded: currentResponse.dateRecorded,
								parentId: currentResponse.parentId,
								surveyResponseId: currentResponse.surveyResponseId,
								surveyQuestionOption: {
									dateCreated: optionData.dateCreated,
									prompt: optionData.prompt,
									surveyQuestionOptionId: optionData.surveyQuestionOptionId
								}
							}
						];
					}
				}
			}
			expandedSurveyDataWithResponses.questions = [
				...expandedSurveyDataWithResponses.questions,
				{
					dateCreated: currentQuestion.dateCreated,
					options: currentQuestion.options,
					prompt: currentQuestion.prompt,
					surveyQuestionId: currentQuestion.surveyQuestionId,
					responses: formattedResponses
				}
			];
		}
		return expandedSurveyDataWithResponses;
	}
	return undefined;
}

export async function issueSurvey(surveyId: string, parentId: string): Promise<surveyIssue> {
	const db = await openDb();
	const date = new Date();
	const generatedSurveyIssue: surveyIssue = {
		surveyIssueId: uuidv4(),
		dateIssued: date.toLocaleDateString('en-GB'),
		surveyId: surveyId,
		parentId: parentId
	};

	await db.run(
		'INSERT INTO surveyIssue VALUES (?, ?, ?, ?)',
		generatedSurveyIssue.surveyIssueId,
		generatedSurveyIssue.dateIssued,
		generatedSurveyIssue.surveyId,
		generatedSurveyIssue.parentId
	);
	return generatedSurveyIssue;
}

export async function createAbsenceReport(
	childId: string,
	startDate: string,
	endDate: string,
	reason: string,
	additionalInformation: string
) {
	const db = await openDb();

	const formattedStartDate = getDateFromLocaleString(startDate);
	const formattedEndDate = getDateFromLocaleString(endDate);

	let currentLoopDate = formattedStartDate;
	let sessionsAffected: number = 0;
	do {
		// checks that there is a session on the current loop date
		const sessionToMark: session | undefined = await db.get(
			'SELECT * FROM session WHERE childId = ? AND date = ?',
			childId,
			currentLoopDate.toLocaleDateString('en-GB')
		);

		if (sessionToMark !== undefined) {
			// if there is a session, update the session with the absense details
			await db.run(
				'UPDATE session SET absent = ?, absenceReason = ?, absenceAdditionalInformation = ? WHERE childId = ? AND date = ?',
				true,
				reason,
				additionalInformation,
				childId,
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

export async function getSessionsWithAbsence(childId: string): Promise<session[]> {
	const db = await openDb();
	const sessionsWithAbsence: session[] = await db.all(
		'SELECT * FROM session WHERE childId = ? AND absent = ?',
		childId,
		true
	);
	return sessionsWithAbsence;
}

export async function updateAbsenceReport(
	sessionId: string,
	chargeSession: boolean,
	keepSession: boolean
) {
	const db = await openDb();

	await db.run(
		'UPDATE session SET absenceCharge = ?, absenceKeepSession = ? WHERE sessionId = ?',
		chargeSession,
		keepSession,
		sessionId
	);
}

export async function createRecurringSessionRequest(
	recurringBasis: string,
	dayDetails: recurringSessionDayDetails,
	childId: string
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
		childId
	);
}

export async function deleteRecurringSessionRequest(childId: string) {
	const db = await openDb();
	await db.run('DELETE FROM recurringSessionRequest WHERE childId = ?', childId);
	await db.run('DELETE FROM session WHERE childId = ? and isRecurring = ?', childId, true);
}

export async function getRecurringSessionRequest(childId: string) {
	const db = await openDb();

	const requests: recurringSessionRequest | undefined = await db.get(
		'SELECT * FROM recurringSessionRequest WHERE childId = ?',
		childId
	);

	return requests;
}

export async function childHasRecurringSessionRequest(childId: string): Promise<boolean> {
	const recurringSessionRequest = await getRecurringSessionRequest(childId);

	if (recurringSessionRequest === undefined) {
		return false;
	} else {
		return true;
	}
}

export async function setRecurringSessionRequestStatus(childId: string, approvalStatus: boolean) {
	const db = await openDb();
	await db.run(
		'UPDATE recurringSessionRequest SET approved = ? WHERE childId = ?',
		approvalStatus,
		childId
	);
}

function differenceBetweenTimes(startTime: string, endTime: string) {
	let minsDifference: number = 0;

	let startTimeHours: number = Number(startTime.split(':')[0]);
	const startTimeMins: number = Number(startTime.split(':')[1]);
	const endTimeHours: number = Number(endTime.split(':')[0]);
	const endTimeMins: number = Number(endTime.split(':')[1]);

	minsDifference = minsDifference + endTimeMins;
	minsDifference = minsDifference + 60 - startTimeMins;
	startTimeHours = startTimeHours + 1;
	minsDifference = minsDifference + (endTimeHours - startTimeHours) * 60;

	return minsDifference;
}

export async function createRecurringSession(childId: string) {
	const db = await openDb();

	const request = await getRecurringSessionRequest(childId);
	if (request !== undefined) {
		type days = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
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
						childId,
						null
					);
				}
			}
			// Increment day by 1
			currentDate = new Date(currentDate.getTime() + 86400000);
		} while (currentDate <= endDate);
	}
}

export async function createTimeOffPeriod(
	startDate: string,
	endDate: string,
	cancelSessions: boolean
) {
	const db = await openDb();
	const date = new Date();
	const timeOffPeriodData: timeOffPeriod = {
		timeOffPeriodId: uuidv4(),
		cancelSessions: cancelSessions,
		startDate: startDate,
		endDate: endDate,
		dateRecorded: date.toLocaleDateString('en-GB')
	};
	await db.run(
		'INSERT INTO timeOffPeriod VALUES (?, ?, ?, ?, ?)',
		timeOffPeriodData.timeOffPeriodId,
		timeOffPeriodData.dateRecorded,
		timeOffPeriodData.startDate,
		timeOffPeriodData.endDate,
		timeOffPeriodData.cancelSessions
	);

	if (cancelSessions === true) {
		const formattedStartDate = getDateFromLocaleString(startDate);
		const formattedEndDate = getDateFromLocaleString(endDate);
		let currentDate = formattedStartDate;
		do {
			const sessions = await getSessionsOnDate(currentDate.toLocaleDateString('en-GB'));

			for (let i = 0; i < sessions.length; i++) {
				const currentSession = sessions[i];
				await deleteSession(currentSession.sessionId);
			}

			// Increment day by 1
			currentDate = new Date(currentDate.getTime() + 86400000);
		} while (currentDate <= formattedEndDate);
	}

	return timeOffPeriodData;
}

export async function getSessionsOnDate(date: string) {
	const db = await openDb();
	const sessions: session[] = await db.all('SELECT * FROM session WHERE date = ?', date);
	return sessions;
}

export async function getTimeOffPeriods() {
	const db = await openDb();
	const periods: timeOffPeriod[] = await db.all('SELECT * FROM timeOffPeriod');
	return periods;
}

export async function getTimeOffPeriod(timeOffPeriodId: string) {
	const db = await openDb();
	const period: timeOffPeriod | undefined = await db.get(
		'SELECT * FROM timeOffPeriod WHERE timeOffPeriodId = ?',
		timeOffPeriodId
	);
	return period;
}

export async function deleteTimeOffPeriod(timeOffPeriodId: string) {
	const db = await openDb();
	await db.run('DELETE FROM timeOffPeriod WHERE timeOffPeriodId = ?', timeOffPeriodId);
}

export async function getInvoices(parentId: string): Promise<invoice[]> {
	const db = await openDb();
	const invoices: invoice[] = await db.all('SELECT * FROM invoice WHERE parentId = ?', parentId);
	return invoices;
}

export async function getInvoice(invoiceId: string): Promise<invoice | undefined> {
	const db = await openDb();
	const invoiceData: invoice | undefined = await db.get(
		'SELECT * FROM invoice WHERE invoiceId = ?',
		invoiceId
	);
	return invoiceData;
}

export async function updateInvoicePaymentStatus(invoiceId: string, newPaymentStatus: string) {
	const db = await openDb();
	await db.run(
		'UPDATE invoice SET paymentStatus = ? WHERE invoiceId = ?',
		newPaymentStatus,
		invoiceId
	);
}

export async function getAllInvoices(): Promise<invoice[]> {
	const db = await openDb();
	const invoices: invoice[] = await db.all('SELECT * FROM invoice');
	return invoices;
}

export async function parentHasAccessToSession(parentId: string, sessionId: string) {
	const db = await openDb();
	const sessionChildId: { childId: string } | undefined = await db.get(
		'SELECT childId FROM session WHERE sessionId = ?',
		sessionId
	);

	if (sessionChildId !== undefined) {
		const parentChildrenId: { childId: string }[] = await db.all(
			'SELECT childId FROM child WHERE parentId = ?',
			parentId
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
