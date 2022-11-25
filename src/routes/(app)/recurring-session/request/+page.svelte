<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox } from '$lib/components/checkbox';

	import { Listbox, Textbox } from '$lib/components/input';

	let recurringBasis: string = 'weekly';
	let showDaySelection: boolean = true;

	$: if (recurringBasis === 'weekly') {
		showDaySelection = true;
	} else {
		showDaySelection = false;
	}

	let mondaySelected: boolean;
	let mondayStartTime: string;
	let mondayFinishTime: string;
	let tuesdaySelected: boolean;
	let tuesdayStartTime: string;
	let tuesdayFinishTime: string;
	let wednesdaySelected: boolean;
	let wednesdayStartTime: string;
	let wednesdayFinishTime: string;
	let thursdaySelected: boolean;
	let thursdayStartTime: string;
	let thursdayFinishTime: string;
	let fridaySelected: boolean;
	let fridayStartTime: string;
	let fridayFinishTime: string;
</script>

<svelte:head>
	<title>Request recurring session</title>
</svelte:head>

<h3 class="font-bold text-xl">Request recurring session</h3>
<div class="flex flex-col gap-2 mt-2">
	<Listbox labelText="Select child">
		<option value="">Jon</option>
		<option value="">Matthew </option>
		<option value="">Kabir</option>
		<option value="">Ella</option>
	</Listbox>
	<Listbox labelText="Select reecurring basis" bind:value={recurringBasis}>
		<option value="weekly">Weekly</option>
		<option value="daily">Daily (Monday - Friday)</option>
	</Listbox>
	{#if showDaySelection}
		<div class="day-selection">
			<span class="text-sm">Select days</span>
			<div class="flex flex-col gap-2 mt-2">
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox labelText="Monday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox labelText="Tuesday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox labelText="Wednesday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox labelText="Thursday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox placeholderText="Finish time" />
						</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 items-center">
					<Checkbox labelText="Friday" />
					<div class="flex gap-2">
						<div class="w-full">
							<Textbox placeholderText="Start time" />
						</div>
						<div class="w-full">
							<Textbox placeholderText="Finish time" />
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<Button>Submit request</Button>
</div>
