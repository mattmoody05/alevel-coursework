import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

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
