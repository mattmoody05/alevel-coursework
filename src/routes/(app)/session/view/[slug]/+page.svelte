<script lang="ts">
	import { Button } from '$lib/components/button';

	import { NumericUpDown, Textbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>View session</title>
</svelte:head>

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
	<NumericUpDown name="length" value={data.sessionData.length / 60} labelText="Session length" />
	<Button style="submit">Update session</Button>
</form>
<form method="POST" action="?/cancelSession">
	<Button style="danger">Cancel session</Button>
</form>
