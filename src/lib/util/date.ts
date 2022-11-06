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
    return `${day} ${hours}:${minutes}`
}