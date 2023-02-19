<script lang="ts">
	import { Textbox } from '$lib/components/input';
	import { LinkButton, Button } from '$lib/components/button';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

{#if form?.success}
	<main>
		<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
			<div class="h-full flex justify-center flex-col">
				<div class="m-8 flex flex-col gap-2">
					<h1 class="font-bold text-3xl">Welcome {form.parentData?.firstName}!</h1>
					<p class="leading-5 opacity-50">
						Let's get you started by logging into the system. Click below to be taken to the login
						page.
					</p>
					<div class="min-w-max w-32 pt-2">
						<LinkButton href="/login">Login</LinkButton>
					</div>
				</div>
			</div>
			<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
		</div>
	</main>
{:else}
	<main class="m-8">
		<h1 class="font-extrabold text-3xl mb-4">Register parent & account</h1>
		<form action="?/register" method="POST" class="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
			<div class="detail-section w-full" id="personal-details">
				<h3 class="font-bold text-xl">Personal details</h3>
				<div class="flex flex-col gap-2 mt-2">
					<Textbox name="firstName" labelText="First name" placeholderText="Jon" />
					<Textbox name="lastName" labelText="Last name" placeholderText="Doe" />
					<Textbox name="dateOfBirth" labelText="Date of birth" placeholderText="DD/MM/YYYY" />
					<Textbox name="email" labelText="Email" placeholderText="email@domain.com" />
					<Textbox name="mobileNumber" labelText="Mobile number" placeholderText="07532165789" />
				</div>
			</div>
			<div class="detail-section w-full" id="address">
				<h3 class="font-bold text-xl">Address</h3>
				<div class="flex flex-col gap-2 mt-2">
					<Textbox name="houseNumber" labelText="House number" placeholderText="11" />
					<Textbox name="postcode" labelText="Postcode" placeholderText="AB12 3CD" />
				</div>
			</div>
			<div class="detail-section w-full" id="login-details">
				<h3 class="font-bold text-xl">Login details</h3>
				<div class="flex flex-col gap-2 mt-2">
					<Textbox name="username" labelText="Username" placeholderText="jdoe" />
					<Textbox name="password" labelText="Password" placeholderText="" isPassword={true} />
					<Textbox
						name="confirmPassword"
						labelText="Confirm password"
						placeholderText=""
						isPassword={true}
					/>
				</div>
			</div>
			<div class="detail-section w-full flex flex-col justify-end gap-2" id="buttons">
				<LinkButton style="secondary" href="/login">Already have an account? Login here</LinkButton>
				<Button style="submit">Submit</Button>
			</div>
		</form>
	</main>
{/if}
