import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export function setCookie(cookieName: string, cookieValue: string) {
	document.cookie = `${cookieName}=${cookieValue}; path=/`;
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

export function getAccountId(cookiesObj: Cookies): string | undefined {
	const token: string | undefined = cookiesObj.get('token');
	if (token !== undefined) {
		// Cannot be sure that the accountId is provided as part of JWT, ts-ignore used for time being, needs to be fixed
		// @ts-ignore
		const jwtPayload: { accountId: string } = jwt.decode(token);
		const accountId = jwtPayload['accountId'];
		return accountId;
	}
	return undefined;
}
