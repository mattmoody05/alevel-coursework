<script lang="ts">
	import { SmallAlert } from '$lib/components/alert';
	import { Button } from '$lib/components/button';
	import { NumericUpDown, Textbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	// Will run when the page is rendered
	onMount(() => {
		// Hides the validation error alert after 10 seconds
		if (form?.message !== undefined) {
			setTimeout(() => {
				// @ts-ignore
				form.message = undefined;
			}, 10000);
		}
	});
</script>

<svelte:head>
	<title>View session</title>
</svelte:head>

{#if form?.message !== undefined}
	<div transition:fade>
		<SmallAlert body={form?.message} title="Validation error" style="error" />
	</div>
{/if}

<h3 class="font-bold text-xl">View session details</h3>
<form class="flex flex-col gap-2 my-2" method="POST" action="?/updateSession">
	<div class="flex items-center gap-2">
		<div class="font-bold">Selected child:</div>
		<div
			class="px-2 py-1 {stringToColour(
				data.childData.firstName
			)} text-white rounded-lg max-w-max mr-2"
		>
			{data.childData.firstName}
		</div>
	</div>
	<Textbox name="date" value={data.sessionData.date} labelText="Date" />
	<Textbox name="startTime" value={data.sessionData.startTime} labelText="Start time" />
	<NumericUpDown
		name="length"
		value={String(data.sessionData.length / 60)}
		labelText="Session length"
	/>
	<Button style="submit">Update session</Button>
</form>
<form method="POST" action="?/cancelSession">
	<Button style="danger">Cancel session</Button>
</form>
