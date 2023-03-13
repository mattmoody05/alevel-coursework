import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export function getAccountId(cookiesObj: Cookies): string | undefined {
	const token: string | undefined = cookiesObj.get('token');
	if (token !== undefined) {
		const jwtPayload = jwt.decode(token) as { accountId: string };
		const accountId = jwtPayload['accountId'];
		return accountId;
	}
	return undefined;
}
