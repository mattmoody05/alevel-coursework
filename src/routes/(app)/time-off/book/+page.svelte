<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';
	import { Textbox } from '$lib/components/input';
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

<svelte:head>
	<title>Book time off</title>
</svelte:head>

{#if form?.success}
	<div out:fade>
		<SmallAlert style="success" body="Time off period successfully created." title="Success" />
	</div>
{/if}

<h3 class="font-bold text-xl">Book time off</h3>
<form method="POST" class="flex flex-col gap-2 mt-2">
	<Textbox name="startDate" labelText="Start date" placeholderText="DD/MM/YYYY" />
	<Textbox name="endDate" labelText="End date" placeholderText="DD/MM/YYYY" />
	<div class="py-2">
		<Checkbox name="cancelSessions" labelText="Cancel sessions within time off period" />
	</div>
	<Button style="submit">Submit</Button>
</form>
