import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getAdmin, getParent, type Child, type Session } from '$lib/util/db';

export const load: PageServerLoad = async ({ locals }: PageServerLoadEvent) => {
	const { account, isAdmin } = locals;

	if (account !== undefined) {
		let children: Child[] = [];
		let absentSessions: Session[] = [];
		if (isAdmin === true) {
			const admin = getAdmin();

			// Fetches all children from the database if the current user is an admin
			children = await admin.getChildren();
		} else {
			const parent = await getParent(account.accountId);
			if (parent !== undefined) {
				// Fetches the children belonging to the current parent who is logged in
				children = await parent.getChildren();
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
			const sessionsWithAbsence = await currentChild.getAbsentSessions();

			// Looping through all the absent sessions tha the child has
			for (let j = 0; j < sessionsWithAbsence.length; j++) {
				const currentSessionWithAbsence = sessionsWithAbsence[j];

				// Adds each absent session to the absent sessions array
				absentSessions = [...absentSessions, currentSessionWithAbsence];
			}
		}

		// Data is returned so that it can be used as part of the HTML template
		return {
			absentSessions: absentSessions.map((session) => session.getData()),
			children: children.map((child) => child.getData())
		};
	} else {
		// No user is currently logged in
		// User is redirected to the login page
		// 308: Permanent redirect code
		throw redirect(308, '/login');
	}
};
