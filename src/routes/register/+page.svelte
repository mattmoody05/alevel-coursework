<script lang="ts">
	import { Textbox, ValidationMessage } from '$lib/components/input';
	import { LinkButton, Button } from '$lib/components/button';
	import {
		doubleKeyCheck,
		presenceCheck,
		validateDate,
		validateEmailAddress,
		validatePhoneNumber,
		validatePostcode
	} from '$lib/util/validation';

	let firstName: string;
	let lastName: string;
	let dateOfBirth: string;
	let email: string;
	let mobileNumber: string;
	let username: string;
	let password: string;
	let confirmPassword: string;
	let houseNumber: string;
	let postcode: string;

	let firstNameValid: boolean = true;
	let lastNameValid: boolean = true;
	let dateOfBirthValid: boolean = true;
	let emailValid: boolean = true;
	let mobileNumberValid: boolean = true;
	let usernameValid: boolean = true;
	let passwordValid: boolean = true;
	let confirmPasswordValid: boolean = true;
	let houseNumberValid: boolean = true;
	let postcodeValid: boolean = true;

	function processDetails() {
		firstNameValid = presenceCheck(firstName);
		lastNameValid = presenceCheck(lastName);
		dateOfBirthValid = validateDate(dateOfBirth);
		emailValid = validateEmailAddress(email);
		mobileNumberValid = validatePhoneNumber(mobileNumber);
		usernameValid = presenceCheck(username);
		passwordValid = presenceCheck(password);
		confirmPasswordValid = doubleKeyCheck(password, confirmPassword);
		houseNumberValid = presenceCheck(houseNumber);
		postcodeValid = validatePostcode(postcode);
		let allValid =
			firstNameValid &&
			lastNameValid &&
			dateOfBirthValid &&
			emailValid &&
			mobileNumberValid &&
			usernameValid &&
			passwordValid &&
			confirmPasswordValid &&
			houseNumberValid &&
			postcodeValid;

		if (allValid) {
			alert('All details valid');
		}
	}
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<main class="m-8">
	<h1 class="font-extrabold text-3xl mb-4">Register</h1>
	<div class="detail-inputs grid grid-cols-1 md:grid-cols-2 w-full gap-8">
		<div class="detail-section w-full" id="personal-details">
			<h3 class="font-bold text-xl">Personal details</h3>
			<div class="flex flex-col gap-2 mt-2">
				<Textbox labelText="First name" placeholderText="Jon" bind:value={firstName} />
				{#if !firstNameValid}
					<ValidationMessage>This field cannot be left blank</ValidationMessage>
				{/if}

				<Textbox labelText="Last name" placeholderText="Doe" bind:value={lastName} />
				{#if !lastNameValid}
					<ValidationMessage>This field cannot be left blank</ValidationMessage>
				{/if}

				<Textbox labelText="Date of birth" placeholderText="DD/MM/YYYY" bind:value={dateOfBirth} />
				{#if !dateOfBirthValid}
					<ValidationMessage>This field must follow the DD/MM/YYYY format</ValidationMessage>
				{/if}

				<Textbox labelText="Email" placeholderText="email@domain.com" bind:value={email} />
				{#if !emailValid}
					<ValidationMessage>Please enter a valid email address</ValidationMessage>
				{/if}

				<Textbox
					labelText="Mobile number"
					placeholderText="07532165789"
					bind:value={mobileNumber}
				/>
				{#if !mobileNumberValid}
					<ValidationMessage>Please enter a valid UK phone number</ValidationMessage>
				{/if}
			</div>
		</div>
		<div class="detail-section w-full" id="address">
			<h3 class="font-bold text-xl">Address</h3>
			<div class="flex flex-col gap-2 mt-2">
				<Textbox labelText="House number" placeholderText="11" bind:value={houseNumber} />
				{#if !houseNumberValid}
					<ValidationMessage>This field cannot be left blank</ValidationMessage>
				{/if}

				<Textbox labelText="Postcode" placeholderText="AB12 3CD" bind:value={postcode} />
				{#if !postcodeValid}
					<ValidationMessage>Please enter a valid UK postcode</ValidationMessage>
				{/if}
			</div>
		</div>
		<div class="detail-section w-full" id="login-details">
			<h3 class="font-bold text-xl">Login details</h3>
			<div class="flex flex-col gap-2 mt-2">
				<Textbox labelText="Username" placeholderText="jdoe" bind:value={username} />
				{#if !usernameValid}
					<ValidationMessage>This field cannot be left blank</ValidationMessage>
				{/if}

				<Textbox labelText="Password" placeholderText="" isPassword={true} bind:value={password} />
				{#if !passwordValid}
					<ValidationMessage>This field cannot be left blank</ValidationMessage>
				{/if}

				<Textbox
					labelText="Confirm password"
					placeholderText=""
					isPassword={true}
					bind:value={confirmPassword}
				/>
				{#if !confirmPasswordValid}
					<ValidationMessage>Passwords do not match</ValidationMessage>
				{/if}
			</div>
		</div>
		<div class="detail-section w-full flex flex-col justify-end gap-2" id="buttons">
			<LinkButton style="secondary" href="/login">Already have an account? Login here</LinkButton>
			<Button on:click={processDetails}>Submit</Button>
		</div>
	</div>
</main>
