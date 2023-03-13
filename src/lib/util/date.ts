// Gets the current date formatted in the way needed for the dashboard and main headers
export function getCustomDateString(): string {
	const date: Date = new Date();
	const hours: string = String(date.getHours());
	let minutes: string = String(date.getMinutes());
	const day: string = date.toLocaleDateString(undefined, {
		day: 'numeric',
		month: 'long',
		weekday: 'long'
	});
	if (minutes.length < 2) {
		minutes = `0${minutes}`;
	}
	return `${day} ${hours}:${minutes}`;
}

// Gets a date object from a date stored in the DD/MM/YYYY format
export function getDateFromLocaleString(localeString: string): Date {
	const splitString = localeString.split('/');
	const date = new Date(Number(splitString[2]), Number(splitString[1]) - 1, Number(splitString[0]));
	return date;
}

// Calculates the different between two times given in HH:MM format
export function differenceBetweenTimes(startTime: string, endTime: string) {
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
