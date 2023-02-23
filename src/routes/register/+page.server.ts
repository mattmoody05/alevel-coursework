import type { Actions, RequestEvent } from './$types';
import { invalid } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { getAccountByUsername, createAccount, createParent } from '$lib/util/newDb';
import {
	presenceCheck,
	validateDate,
	validateEmailAddress,
	validatePhoneNumber,
	validatePostcode
} from '$lib/util/validation';

export const actions: Actions = {
	// Handles the user submitting the form to register for the system
	register: async ({ request }: RequestEvent) => {
		// Fetches data from the HTML form
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const dateOfBirth = data.get('dateOfBirth') as string;
		const emailAddress = data.get('email') as string;
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const houseNumber = data.get('houseNumber') as string;
		const phoneNumber = data.get('phoneNumber') as string;
		const postcode = data.get('postcode') as string;

		// Checks whether an account exists by fetching by the input username
		// If an account is found, an account object will be returned
		// If no account is found, undefined will be returned
		const account = await getAccountByUsername(username);

		if (account !== undefined) {
			// An account with the usernae input already exists
			// Returns a validation error
			// 400: Bad request code
			return invalid(400, {
				message: 'An account with that username already exists, please choose another username',
				data: {
					username,
					dateOfBirth,
					emailAddress,
					firstName,
					lastName,
					houseNumber,
					phoneNumber,
					postcode
				}
			});
		} else {
			// Data validation checks
			if (presenceCheck(username) === false) {
				// The username field was left empty
				// Username cannot be empty
				// 400: Bad request code
				return invalid(400, {
					message: 'You must specify a username for the account, this field cannot be blank',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (presenceCheck(password) === false) {
				// The password field was left empty
				// 400: Bad request code
				return invalid(400, {
					message: 'You must specify a password for the account, this field cannot be blank',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (presenceCheck(firstName) === false) {
				// The first name field was left empty
				// 400: Bad request code
				return invalid(400, {
					message:
						'You must specify a first name for the parent registering, this field cannot be blank',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (presenceCheck(lastName) === false) {
				// The last name field was left empty
				// 400: Bad request code
				return invalid(400, {
					message:
						'You must specify a last name for the parent registering, this field cannot be blank',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (validateEmailAddress(emailAddress) === false) {
				// The email address is not a valid one
				// 400: Bad request code
				return invalid(400, {
					message:
						'You must give a valid email address, please ensure that the one that you have used is valid',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (validateDate(dateOfBirth) === false) {
				// The data of birth input does not follow DD/MM/YYYY format, or is not valid in another way
				// 400: Bad request code
				return invalid(400, {
					message:
						'The date that you have input is not valid, please ensure that it follows the DD/MM/YYYY format',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (validatePhoneNumber(phoneNumber) === false) {
				// The phone number input is not valid
				// 400: Bad request code
				return invalid(400, {
					message:
						'The phone number that you have input is not valid, please ensure that it is a valid 11 digit UK phone number',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (presenceCheck(houseNumber)) {
				// The house number field was left empty
				// 400: Bad request code
				return invalid(400, {
					message:
						'You cannot leave the house number field empty, please ensure that you have entered a house number',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else if (validatePostcode(postcode) === false) {
				// The postcode is not valid
				// 400: Bad request code
				return invalid(400, {
					message:
						'The postcode that you have input is not valid, please ensure that you have entered a valid UK postcode',
					data: {
						username,
						dateOfBirth,
						emailAddress,
						firstName,
						lastName,
						houseNumber,
						phoneNumber,
						postcode
					}
				});
			} else {
				// All fields are valid, therefore the data can be stored in the database

				// @ts-ignore
				const passwordHash: string = await bcrypt.hash(password, 10);

				// Generates an ID for the parent being registered
				const parentId = uuidv4();

				// Creates an account in the database with the data from the HTML form
				const account = await createAccount({
					accountId: uuidv4(),
					username: username,
					password: passwordHash,
					isAdmin: false,
					parentId: parentId
				});

				// Creates a parent in the database with the data from the HTML form
				const parent = await createParent({
					parentId: parentId,
					accountId: account.accountId,
					dateOfBirth: dateOfBirth,
					emailAddress: emailAddress,
					firstName: firstName,
					lastName: lastName,
					houseNumber: houseNumber,
					phoneNumber: phoneNumber,
					postcode: postcode
				});

				// Returns data so that it can be used in the HTML template
				return { success: true, parentData: parent.getData() };
			}
		}
	}
};
