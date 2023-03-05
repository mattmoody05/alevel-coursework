export type buttonStyle = 'primary' | 'secondary' | 'danger' | 'submit';
export type route = {
	iconClass: string;
	name: string;
	url: string;
	adminOnly: boolean;
};

export type sessionSummary = {
	childName: string;
	time: string;
	date: string;
};

export type invoiceSummary = {
	amountDue: number;
	dueDate: string;
};

export type surveySummary = {
	surveyName: string;
	dateCreated: string;
};

export type urgentNotificationSummary = {
	notificationName: string;
	content: string;
};

export type messageSummary = {
	id: string;
	content: string;
	fromOwner: boolean;
};

export type parentSummary = {
	id: string;
	name: string;
};

export type account = {
	accountId: string;
	username: string;
	password: string;
	isAdmin: boolean;
	parentId?: string;
};

export type parent = {
	parentId: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	emailAddress: string;
	dateOfBirth: string;
	houseNumber: string;
	postcode: string;
	accountId: string;
};

export type session = {
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
};

export type expense = {
	expenseId: string;
	name: string;
	cost: number;
	date: string;
	type: string;
	supportingDocs: string;
	chargeToParents: boolean;
	dateRecorded: string;
	invoiceId?: string;
};

export type recurringSessionRequest = {
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
};

export type survey = {
	surveyId: string;
	title: string;
	description?: string;
	consentForm: boolean;
	anonymous: boolean;
	numberOfQuestions: number;
	dateCreated: string;
};

export type surveyResponse = {
	surveyResponseId: string;
	dateRecorded: string;
	parentId: string;
	surveyId: string;
	surveyQuestionId: string;
	surveyQuestionOptionId: string;
};

export type surveyIssue = {
	surveyIssueId: string;
	dateIssued: string;
	surveyId: string;
	parentId: string;
};

export type surveyQuestion = {
	surveyQuestionId: string;
	prompt: string;
	dateCreated: string;
	surveyId: string;
};

export type surveyQuestionOption = {
	surveyQuestionOptionId: string;
	prompt: string;
	dateCreated: string;
	surveyQuestionId: string;
};

export type shortNoticeNotifcation = {
	notificationId: string;
	message: string;
	dateCreated: string;
};

export type shortNoticeNotifcationIssue = {
	notificationIssueId: string;
	allParents: boolean;
	dateIssued: string;
	parentId: string;
	notificationId: string;
};

export type twoWayMessage = {
	messageId: string;
	messageContent: string;
	fromOwner: boolean;
	dateSent: string;
	parentId: string;
};

export type child = {
	childId: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	educationName?: string;
	educationType: string;
	additionalNeedDesc?: string;
	additionalNeedType: string;
	parentId: string;
};

export type invoice = {
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
};

export type expandedSurvey = {
	surveyId: string;
	title: string;
	description?: string;
	consentForm: boolean;
	anonymous: boolean;
	numberOfQuestions: number;
	dateCreated: string;
	questions: {
		surveyQuestionId: string;
		prompt: string;
		dateCreated: string;
		options: {
			surveyQuestionOptionId: string;
			prompt: string;
			dateCreated: string;
		}[];
	}[];
};

export type expandedSurveyQuestion = {
	surveyQuestionId: string;
	prompt: string;
	dateCreated: string;
	options: {
		surveyQuestionOptionId: string;
		prompt: string;
		dateCreated: string;
	}[];
	surveyId: string;
};

export type expandedSurveyWithResponses = {
	surveyId: string;
	title: string;
	description?: string;
	consentForm: boolean;
	anonymous: boolean;
	numberOfQuestions: number;
	dateCreated: string;
	questions: {
		surveyQuestionId: string;
		prompt: string;
		dateCreated: string;
		options: {
			surveyQuestionOptionId: string;
			prompt: string;
			dateCreated: string;
		}[];
		responses: {
			surveyResponseId: string;
			dateRecorded: string;
			parentId: string;
			surveyQuestionOption: {
				surveyQuestionOptionId: string;
				prompt: string;
				dateCreated: string;
			};
		}[];
	}[];
};

export type RecurringSessionDayDetails = {
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
};

export type timeOffPeriod = {
	timeOffPeriodId: string;
	dateRecorded: string;
	startDate: string;
	endDate: string;
	cancelSessions: boolean;
};

export type CapitalisedDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type LowercaseDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type LowercaseDaysWithWeekend =
	| 'sunday'
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday';
