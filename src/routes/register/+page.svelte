<script lang="ts">
	import { Textbox } from '$lib/components/input';
	import { LinkButton, Button } from '$lib/components/button';
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
				<Textbox labelText="First name" placeholderText="Jon" />
				<Textbox labelText="Last name" placeholderText="Doe" />
				<Textbox labelText="Date of birth" placeholderText="DD/MM/YYYY" />
				<Textbox labelText="Email" placeholderText="email@domain.com" />
				<Textbox labelText="Mobile number" placeholderText="07532 165789" />
			</div>
		</div>
		<div class="detail-section w-full" id="address">
			<h3 class="font-bold text-xl">Address</h3>
			<div class="flex flex-col gap-2 mt-2">
				<Textbox labelText="House number" placeholderText="11" />
				<Textbox labelText="Postcode" placeholderText="AB12 3CD" />
			</div>
		</div>
		<div class="detail-section w-full" id="login-details">
			<h3 class="font-bold text-xl">Login details</h3>
			<div class="flex flex-col gap-2 mt-2">
				<Textbox labelText="Username" placeholderText="jdoe" />
				<Textbox labelText="Password" placeholderText="" isPassword={true} />
				<Textbox labelText="Confirm password" placeholderText="" isPassword={true} />
			</div>
		</div>
		<div class="detail-section w-full flex flex-col justify-end gap-2" id="buttons">
			<LinkButton style="secondary" href="/login">Already have an account? Login here</LinkButton>
			<Button>Submit</Button>
		</div>
	</div>
</main>
