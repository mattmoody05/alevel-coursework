<script lang="ts">
	import { Textbox } from '$lib/components/input';
	import { Button, LinkButton } from '$lib/components/button';
	import { Alert } from '$lib/components/alert';
	import { goto } from '$app/navigation';

	let showIncorrectPasswordPopup: boolean = false;

	function checkCredentials() {
		showIncorrectPasswordPopup = true;
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
		<div class="h-full flex justify-center flex-col">
			<div class="flex flex-col gap-2 m-8">
				<h1 class="font-bold text-3xl">Login</h1>
				<p class="opacity-50">Please enter your username and password to login to the system.</p>
				<Textbox labelText="Username" placeholderText="jdoe" />
				<Textbox labelText="Password" isPassword={true} />
				<Button on:click={checkCredentials}>Login</Button>
				<LinkButton href="/register" style="secondary"
					>Don't have an account? Register here</LinkButton
				>
			</div>
		</div>
		<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
	</div>
</main>

{#if showIncorrectPasswordPopup}
	<div
		class="absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80 flex justify-center items-center"
	>
		<Alert
			title="❗Incorrect username or password"
			body="The username or password that you have input is incorrect. If you have forgotten your password, reset it using the link below."
			buttonText="Acknowledge"
			secondaryButtonText="Forgot your password?"
			on:secondary-click={() => goto('/forgot-password')}
			on:primary-click={() => (showIncorrectPasswordPopup = false)}
		/>
	</div>
{/if}
