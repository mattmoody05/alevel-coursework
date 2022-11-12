export type buttonStyle = 'primary' | 'secondary' | 'danger';
export type route = {
	iconClass: string;
	name: string;
	url: string;
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
export type absentReportSummary = {
	childName: string;
	startDate: string;
	endDate: string;
};

export type surveySummary = {
	surveyName: string;
	dueDate: string;
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
