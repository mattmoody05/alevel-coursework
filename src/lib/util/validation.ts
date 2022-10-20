// A function used to check that an email address is valid
// Takes one string argument - the email address to be check
// Returns a boolean value - true if the email address is valid, false if not
export function validateEmailAddress(emailAddress: string): boolean {
    
    // Checks that @ and . characters are present within the email address
    if ((emailAddress.includes("@") && emailAddress.includes(".")) === false) {
        return false;
    }

    // Checks that the last . character in the email address is after the @ character
    // Validates that the domain includes a . character 
    else if ((emailAddress.indexOf("@") < emailAddress.lastIndexOf(".")) === false) {
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