// A function that checks if the contents of a string is numeric
// Takes on string argument - the string to check
// Returns a boolean value - true if the string is numeric, false if not
function isNumber(str: string): boolean {
	// Checks that the str parameter is of the string data type
	if (typeof str !== 'string') {
		return false;
	}

	// Checks if the string only contains spaces
	if (str.trim() === '') {
		return false;
	}

	// Checks if the string's contents is a number
	// Casts to integer in order to check
	if (Number.isNaN(Number(str))) {
		return false;
	}

	// All checks have been passed and therefore the string contains only numbers
	return true;
}

// A function used to check that an email address is valid
// Takes one string argument - the email address to check
// Returns a boolean value - true if the email address is valid, false if not
export function validateEmailAddress(emailAddress: string): boolean {
	// Checks that @ and . characters are present within the email address
	if ((emailAddress.includes('@') && emailAddress.includes('.')) === false) {
		return false;
	}

	// Checks that the last . character in the email address is after the @ character
	// Validates that the domain includes a . character
	else if (emailAddress.indexOf('@') < emailAddress.lastIndexOf('.') === false) {
		return false;
	}

	// Checks that the minimum length of the email is 5 characters
	else if (emailAddress.length < 5) {
		return false;
	}

	// Will return true if no checks have determined that the email is invalid
	// The email is valid
	return true;
}

// A function used to check that a date is following
// Takes one string argument - the email address to check
// Returns a boolean value - true if the date is valid, false if not
export function validateDate(date: string): boolean {
	// Date must follow DD/MM/YYYY format

	// Checks that the date string has the correct number of characters
	if (date.length !== 10) {
		return false;
	}

	// Checks that the forward slash characters are in the correct place within the date string
	else if ((date[2] === '/' && date[5] === '/') === false) {
		return false;
	}

	// Checks that the remaining characters of the date are numbers
	else if (
		(isNumber(date.substring(0, 2)) &&
			isNumber(date.substring(3, 5)) &&
			isNumber(date.substring(6, 10))) === false
	) {
		return false;
	}

	// Extracts the day, month and year from the date string and places them in seperate variables
	const day: number = Number(date.substring(0, 2));
	const month: number = Number(date.substring(3, 5));
	const year: number = Number(date.substring(6, 10));

	// An array that contains the number of days in each month of the year
	const daysInMonth: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Checks whether the input year is a leap year
	// If the input year is a leap year, the daysInMonth array is adjusted to reflect this
	// The number of days in February is changed to 29
	if ((0 === year % 4 && 0 !== year % 100) || 0 === year % 400) {
		daysInMonth[1] = 29;
	}

	// Checks that the month input is valid (between 0 and 13)
	if ((0 < month && month < 13) === false) {
		return false;
	}

	// Checks that the day that they have input is valid for the month that has been input
	// E.G there cannot be a 31st day of February
	else if ((0 < day && day <= daysInMonth[month]) === false) {
		return false;
	}

	// Checks that the year input is within a reasonable range (between 0 and 3000)
	else if ((0 < year && year < 3000) === false) {
		return false;
	}

	// Will return true if no checks have determined that the date is invalid
	// The date is valid
	return true;
}

export function presenceCheck(str: string) {
	if (str === '') {
		return false;
	} else {
		return true;
	}
}

export function validatePhoneNumber(phoneNumber: string): boolean {
	if (phoneNumber.length !== 11) {
		return false;
	}

	return true;
}

export function doubleKeyCheck(valueOne: string, valueTwo: string): boolean {
	if (valueOne !== valueTwo) {
		return false;
	}

	return true;
}

export function validatePostcode(postcode: string): boolean {
	return true;
}

export function validateTime(time: string) {
	if (time.length !== 5) {
		return false;
	}

	let hours = time.substring(0, 2);
	let mins = time.substring(3, 5);

	if ((isNumber(hours) === true && isNumber(mins) === true) === false) {
		return false;
	} else if (Number(hours) > 24 || Number(hours) < 0) {
		return false;
	} else if (Number(mins) > 59 || Number(mins) < 0) {
		return false;
	} else if (time[2] !== ':') {
		return false;
	} else {
		return true;
	}
}
