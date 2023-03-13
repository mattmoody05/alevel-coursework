import type { PageServerLoad, PageServerLoadEvent } from './$types';

export const load: PageServerLoad = async ({ cookies }: PageServerLoadEvent) => {
	// Deletes the cookie that holds the user's accountId
	cookies.delete('token');

	// Returns data so that it can be used in the HTML template
	return { success: true };
};
