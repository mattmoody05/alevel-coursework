import type { Account } from '$lib/util/db';

declare global {
	declare namespace App {
		// The structure of the "locals" variables used throughout the application
		interface Locals {
			account?: Account;
			isAdmin: boolean;
		}
	}
}
