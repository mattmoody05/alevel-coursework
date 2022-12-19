import { getAccountId } from '$lib/util/cookies';
import { getAccount } from '$lib/util/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const accountId = getAccountId(event.cookies);
	if (accountId !== undefined) {
		const accountData = await getAccount(accountId);
		if (accountData !== undefined) {
			event.locals.account = accountData;
			event.locals.isAdmin = accountData.isAdmin;
		}
	}

	const response = await resolve(event);
	return response;
};
