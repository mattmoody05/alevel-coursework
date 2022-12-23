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

export function getDateFromLocaleString(localeString: string): Date {
	const splitString = localeString.split('/');
	const date = new Date(Number(splitString[2]), Number(splitString[1]) - 1, Number(splitString[0]));
	return date;
}
