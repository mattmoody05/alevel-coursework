import type { PageServerLoad, PageServerLoadEvent } from './$types';
import type { child, session } from '$lib/util/types';
import { getAllChildren, getChildren, getSessionsWithAbsence } from '$lib/util/db';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (account !== undefined) {
		let children: child[] = [];
		let absentSessions: session[] = [];
		if (isAdmin) {
			// Fetches all children from the database if the current user is an admin
			children = await getAllChildren();
		} else {
			if (account.parentId !== undefined) {
				// Fetches the children belonging to the current parent who is logged in
				children = await getChildren(account.parentId);
			} else {
				// The parentId field of the account record is undefined - therefore the account is not linked to a parent
				// 500: Internal server error code
				throw error(
					400,
					'There is no parent associated with the current account. If an admin account is being used, please switch to a parent account.'
				);
			}
		}

		// Looping through all the children that the current account has access to
		for (let i = 0; i < children.length; i++) {
			const currentChild = children[i];

			// Fetches all absent sessions that belong to the current child from the database
			const sessionsWithAbsence = await getSessionsWithAbsence(currentChild.childId);

			// Looping through all the absent sessions tha the child has
			for (let j = 0; j < sessionsWithAbsence.length; j++) {
				const currentSessionWithAbsence = sessionsWithAbsence[j];

				// Adds each absent session to the absent sessions array
				absentSessions = [...absentSessions, currentSessionWithAbsence];
			}
		}

		// Data is returned so that it can be used as part of the HTML template
		return { absentSessions, children };
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};
