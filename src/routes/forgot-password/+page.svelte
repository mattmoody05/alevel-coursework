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
		// Hides the success alert after 5 seconds
		if (form?.success) {
			setTimeout(() => {
				form.success = false;
			}, 5000);
		}
	});
</script>

{#if form?.success}
	<div transition:fade>
		<!-- Will not say whether an account has been found or not - otherwise could be used to find what emails 
		are reigstered to the system0 -->
		<SmallAlert
			style="success"
			body="If an account is associated with that email address, a password reset email has been sent. Please check your inbox"
			title="Success"
		/>
	</div>
{/if}

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
				<LinkButton style="secondary" href="/login">Remember your password? Go to login</LinkButton>
				<LinkButton style="secondary" href="/admin-forgot-password">
					Admin? Reset your password here
				</LinkButton>
			</form>
		</div>
		<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
	</div>
</main>
