<script lang="ts">
	import { Button } from '$lib/components/button';
	import { stringToColour } from '$lib/util/ui';
</script>

<svelte:head>
	<title>View recurring session</title>
</svelte:head>

<h3 class="font-bold text-xl">View recurring session</h3>
<div class="flex flex-col gap-2 mt-2">
	<div class="flex items-center gap-2">
		<div class="font-bold">Selected child:</div>
		<div class="px-2 py-1 {stringToColour('Matthew')} text-white rounded-lg max-w-max mr-2">
			Matthew
		</div>
	</div>
	<div>
		<span class="font-bold">Selected basis: </span>
		<span>Weekly</span>
	</div>
	<span class="font-bold">Days in recurring session booking:</span>
	<div class="bg-gray-100 border border-gray-300 rounded-xl p-2 grid grid-cols-2">
		<div><span class="font-bold">Day: </span> Monday</div>
		<div class="flex flex-col">
			<div><span class="font-bold">Start time: </span><span>11:00</span></div>
			<div><span class="font-bold">End time: </span><span>17:00</span></div>
		</div>
	</div>
	<div class="bg-gray-100 border border-gray-300 rounded-xl p-2 grid grid-cols-2">
		<div><span class="font-bold">Day: </span> Tuesday</div>
		<div class="flex flex-col">
			<div><span class="font-bold">Start time: </span><span>11:00</span></div>
			<div><span class="font-bold">End time: </span><span>17:00</span></div>
		</div>
	</div>
	<div class="bg-gray-100 border border-gray-300 rounded-xl p-2 grid grid-cols-2">
		<div><span class="font-bold">Day: </span> Friday</div>
		<div class="flex flex-col">
			<div><span class="font-bold">Start time: </span><span>11:00</span></div>
			<div><span class="font-bold">End time: </span><span>17:00</span></div>
		</div>
	</div>
	<Button style="danger">Cancel recurring session</Button>
</div>
