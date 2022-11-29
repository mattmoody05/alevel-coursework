export function setCookie(cookieName: string, cookieValue: string) {
	document.cookie = `${cookieName}=${cookieValue}; path=/`;
}

export function removeCookie(cookieName: string) {
	document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie(cookieName: string): string {
	const name = `${cookieName}=`;
	const decodedCookie = decodeURIComponent(document.cookie);
	const ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return '';
}
