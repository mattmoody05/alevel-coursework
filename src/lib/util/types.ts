export type buttonStyle = 'primary' | 'secondary' | 'danger' | 'submit';

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

export type LowercaseDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export type LowercaseDaysWithWeekend =
	| 'sunday'
	| 'monday'
	| 'tuesday'
	| 'wednesday'
	| 'thursday'
	| 'friday'
	| 'saturday';
