<script lang="ts">
	import { Textbox } from '$lib/components/input';
	import { Button, LinkButton } from '$lib/components/button';
	import { Alert } from '$lib/components/alert';
	import { goto } from '$app/navigation';

	import { presenceCheck } from '$lib/util/validation';
	import { onMount } from 'svelte';

	let username: string = '';
	let password: string = '';
	let loggedIn = false;

	let showIncorrectPasswordPopup: boolean = false;

	function checkCredentials() {
		if ((presenceCheck(username) && presenceCheck(password)) === false) {
			showIncorrectPasswordPopup = true;
		} else {
			localStorage.setItem('username', username);
			goto('/');
		}
	}

	onMount(() => {
		if (localStorage.getItem('username')) {
			loggedIn = true;
		}
	});
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<main>
	<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
		<div class="h-full flex justify-center flex-col">
			<div class="flex flex-col gap-2 m-8">
				{#if !loggedIn}
					<h1 class="font-bold text-3xl">Login</h1>
					<p class="opacity-50">Please enter your username and password to login to the system.</p>
					<Textbox labelText="Username" placeholderText="jdoe" bind:value={username} />
					<Textbox labelText="Password" isPassword={true} bind:value={password} />
					<Button on:click={checkCredentials}>Login</Button>
					<LinkButton href="/register" style="secondary">
						Don't have an account? Register here
					</LinkButton>
				{:else}
					<h1 class="font-bold text-3xl">👋 Welcome back {localStorage.getItem('username')}</h1>
					<div class="max-w-min">
						<Button on:click={() => (loggedIn = false)} style="secondary"
							>Not {localStorage.getItem('username')}? Login here</Button
						>
					</div>
					<div class="max-w-min">
						<LinkButton href="/" style="primary">
							<div class="flex gap-2 items-center">
								<span>Dashboard</span>
								<i class="fa-solid fa-arrow-right" />
							</div>
						</LinkButton>
					</div>
				{/if}
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
			body="The username or password that you have input is incorrect, or a field has been left blank. If you have forgotten your password, reset it using the link below."
			buttonText="Acknowledge"
			secondaryButtonText="Forgot your password?"
			on:secondary-click={() => goto('/forgot-password')}
			on:primary-click={() => (showIncorrectPasswordPopup = false)}
		/>
	</div>
{/if}
