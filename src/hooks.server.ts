import { getAccountId } from '$lib/util/cookies';
import { getAccount } from '$lib/util/db';
import type { Handle } from '@sveltejs/kit';

// Will run every time a request is made to the server
export const handle: Handle = async ({ event, resolve }) => {
	// Initially the isAdmin locals variable is false
	event.locals.isAdmin = false;

	// Gets the accountId from the cookies in the request
	const accountId = getAccountId(event.cookies);

	if (accountId !== undefined) {
		// The accountId was successfully retrieved from the cookies
		const accountData = await getAccount(accountId);
		if (accountData !== undefined) {
			// There is an account associated with the accountId in the cookies
			// Setting locals variables which are accessible in every request
			event.locals.account = accountData;
			event.locals.isAdmin = accountData.isAdmin ? true : false;
		}
	} else {
		// The accountId could not be retrieved
		// Therefore there is no account for the request and the user is not logged in
		event.locals.account = undefined;
	}

	// Continues to the other server side code written for the request
	// E.G in +page.server.ts or +server.ts
	const response = await resolve(event);
	return response;
};
