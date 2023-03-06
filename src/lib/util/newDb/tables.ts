export type AccountTable = {
	accountId: string;
	username: string;
	password: string;
	isAdmin: boolean;
	parentId?: string;
};

export type ParentTable = {
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

export type SessionTable = {
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

export type ExpenseTable = {
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

export type RecurringSessionRequestTable = {
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
};

export type SurveyTable = {
	surveyId: string;
	title: string;
	description?: string;
	consentForm: boolean;
	anonymous: boolean;
	numberOfQuestions: number;
	dateCreated: string;
};

export type SurveyResponseTable = {
	surveyResponseId: string;
	dateRecorded: string;
	parentId: string;
	surveyId: string;
	surveyQuestionId: string;
	surveyQuestionOptionId: string;
};

export type SurveyIssueTable = {
	surveyIssueId: string;
	dateIssued: string;
	surveyId: string;
	parentId: string;
};

export type SurveyQuestionTable = {
	surveyQuestionId: string;
	prompt: string;
	dateCreated: string;
	surveyId: string;
};

export type SurveyQuestionOptionTable = {
	surveyQuestionOptionId: string;
	prompt: string;
	dateCreated: string;
	surveyQuestionId: string;
};

export type ShortNoticeNotificationTable = {
	notificationId: string;
	message: string;
	dateCreated: string;
};

export type ShortNoticeNotifcationIssueTable = {
	notificationIssueId: string;
	allParents: boolean;
	dateIssued: string;
	parentId: string;
	notificationId: string;
};

export type TwoWayMessageTable = {
	messageId: string;
	messageContent: string;
	fromOwner: boolean;
	dateSent: string;
	parentId: string;
};

export type ChildTable = {
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

export type InvoiceTable = {
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

export type TimeOffPeriodTable = {
	timeOffPeriodId: string;
	dateRecorded: string;
	startDate: string;
	endDate: string;
	cancelSessions: boolean;
};
