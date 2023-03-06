<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button, LinkButton } from '$lib/components/button';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import type { ActionData } from './$types';

	export let form: ActionData;

	onMount(() => {
		if (form?.success) {
			setTimeout(() => {
				// @ts-ignore
				form.success = false;
			}, 5000);
		}
	});
</script>

{#if form?.success}
	<div transition:fade>
		<SmallAlert
			style="success"
			body="An email has been sent to the specified admin backup email address. Please use the link specified within it to reset the admin password. "
			title="Success"
		/>
	</div>
{/if}

<main>
	<div class="grid grid-cols-1 md:grid-cols-2 h-screen">
		<div class="h-full flex justify-center flex-col gap-2 m-8">
			<h1 class="font-bold text-3xl">Admin - Forgot password</h1>
			<p class="opacity-50">
				Click the button below to send an email to the specified admin backup email address to reset
				your password
			</p>

			<form class="flex flex-col gap-2" action="?/requestReset" method="POST">
				<Button style="submit">Request admin password reset</Button>
				<LinkButton style="secondary" href="/login">Remember your password? Go to login</LinkButton>
			</form>
		</div>
		<div class="w-full h-full bg-gradient-to-br from-blue-500 to-blue-200 hidden md:block" />
	</div>
</main>
