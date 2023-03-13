<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button, LinkButton } from '$lib/components/button';
	import { Textbox } from '$lib/components/input';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { ActionData } from './$types';

	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hides validation error message after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				form.message = undefined;
			}, 10000);
		}
	});
</script>

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

{#if form?.success === true}
	<main>
		<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
			<div class="h-full flex justify-center flex-col gap-2 m-8">
				<h1 class="font-bold text-3xl">Password reset successful</h1>
				<p class="opacity-50">You can now use your new password to login to the system</p>

				<LinkButton style="secondary" href="/login">Go to login</LinkButton>
			</div>
			<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
		</div>
	</main>
{:else}
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
					<Button style="submit">Submit</Button>
					<LinkButton style="secondary" href="/login">
						Remember your password? Go to login
					</LinkButton>
				</form>
			</div>
			<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
		</div>
	</main>
{/if}
