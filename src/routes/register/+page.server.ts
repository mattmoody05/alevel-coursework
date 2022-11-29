import type { Actions, RequestEvent } from './$types';
import { openDb } from '../../db/index';
import type { account, parent } from '$lib/util/types';
import { error } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export const actions: Actions = {
	default: async ({ request }: RequestEvent) => {
		const data = await request.formData();

		const db = await openDb();

		const accounts: account | undefined = await db.get(
			'SELECT * FROM account WHERE username = ?',
			data.get('username')
		);

		// check that username is not already taken
		if (accounts !== undefined) {
			throw error(400, 'user with that username already exists');
		}

		// @ts-ignore
		const passwordHash = await bcrypt.hash(data.get('password'), 10);

		const accountId: string = uuidv4();
		const parentId: string = uuidv4();

		// create account record
		await db.run(
			'INSERT INTO account VALUES (?, ?, ?, FALSE, ?)',
			accountId,
			data.get('username'),
			passwordHash,
			parentId
		);

		// create parent record
		await db.run(
			'INSERT INTO parent VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
			parentId,
			data.get('firstName'),
			data.get('lastName'),
			data.get('mobileNumber'),
			data.get('email'),
			data.get('dateOfBirth'),
			data.get('houseNumber'),
			data.get('postcode'),
			accountId
		);

		// get the parent data from the database
		const parentData: parent | undefined = await db.get(
			'SELECT * FROM parent WHERE parentId = ?',
			parentId
		);

		// return the parent data back to client
		return { success: true, parentData };
	}
};
