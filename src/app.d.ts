import type { account } from '$lib/util/types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			account?: account;
			isAdmin: boolean;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
