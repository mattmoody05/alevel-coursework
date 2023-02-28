<script lang="ts">
	import { Button, LinkButton } from '$lib/components/button';
	import Textbox from '$lib/components/input/textbox.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	console.log(data.token);
</script>

{#if data.tokenSupplied === true}
	{#if data.tokenValid === true}
		<main>
			<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
				<div class="h-full flex justify-center flex-col gap-2 m-8">
					<h1 class="font-bold text-3xl">Password reset</h1>
					<p class="opacity-50">
						Please enter your new password in order to reset the password to your account.
					</p>

					<form class="flex flex-col gap-2" action="?/resetWithToken" method="POST">
						<Textbox name="password" labelText="Password" />
						<Textbox name="confirmPassword" labelText="Confirm password" />
						<input class="hidden" name="token" value={data.token} />
						<Button style="submit">Submit</Button>
						<LinkButton style="secondary" href="/login"
							>Remember your password? Go to login</LinkButton
						>
					</form>
				</div>
				<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
			</div>
		</main>
	{:else}
		token is not valid, dont bother
	{/if}
{:else}
	<main>
		<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
			<div class="h-full flex justify-center flex-col gap-2 m-8">
				<h1 class="font-bold text-3xl">Forgot password</h1>
				<p class="opacity-50">
					Please enter your email address and an email will be issed for you to reset your password.
				</p>

				<form class="flex flex-col gap-2" action="?/requestReset" method="POST">
					<Textbox name="emailAddress" labelText="Email address" />
					<Button style="submit">Submit</Button>
					<LinkButton style="secondary" href="/login"
						>Remember your password? Go to login</LinkButton
					>
				</form>
			</div>
			<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
		</div>
	</main>
{/if}
