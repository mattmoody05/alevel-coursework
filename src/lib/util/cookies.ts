import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

// If specified, fetches the accountId from the request
// The accountId is housed in a JSON Web Token which is stored inside cookies
// Cookies are sent alongside every request to the server
export function getAccountId(cookiesObj: Cookies): string | undefined {
	const token: string | undefined = cookiesObj.get('token');
	if (token !== undefined) {
		const jwtPayload = jwt.decode(token) as { accountId: string };
		const accountId = jwtPayload['accountId'];
		return accountId;
	}
	return undefined;
}
