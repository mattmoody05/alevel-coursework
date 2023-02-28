<script lang="ts">
	import { Textbox } from '$lib/components/input';
	import { Button, LinkButton } from '$lib/components/button';
	import type { ActionData } from './$types';
	import { ValidationMessage } from '$lib/components/input';
	import { enhance } from '$app/forms';

	export let form: ActionData;
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
				<form class="flex flex-col gap-2" method="POST" action="?/login" id="loginForm" use:enhance>
					<Textbox name="username" labelText="Username" value={form?.data.username} />
					<Textbox name="password" labelText="Password" isPassword={true} />
					{#if form?.message !== undefined}
						<ValidationMessage>
							{form.message}
						</ValidationMessage>
					{/if}
					<Button style="submit">Login</Button>
				</form>
				<LinkButton href="/register" style="secondary">
					Don't have an account? Register here
				</LinkButton>
				<LinkButton href="/forgot-password" style="secondary">
					Forgot your password? Reset it here
				</LinkButton>
			</div>
		</div>
		<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
	</div>
</main>
