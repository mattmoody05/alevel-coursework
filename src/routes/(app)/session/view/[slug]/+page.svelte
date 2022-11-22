<script lang="ts">
	import { Button } from '$lib/components/button';

	import { Listbox, NumericUpDown, Textbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';

	import { Alert } from '$lib/components/alert';

	function cancelSession() {
		showAlert();
	}

	function showAlert() {
		// getParentList()
		showConfirmAlert = true;
	}

	function hideAlert() {
		showConfirmAlert = false;
	}

	let showConfirmAlert: boolean = false;
</script>

<svelte:head>
	<title>View session</title>
</svelte:head>

<h3 class="font-bold text-xl">View session details</h3>
<div class="flex flex-col gap-2 mt-2">
	<div class="flex items-center gap-2">
		<div class="font-bold">Selected child:</div>
		<div class="px-2 py-1 {stringToColour('Matthew')} text-white rounded-lg max-w-max mr-2">
			Matthew
		</div>
	</div>
	<Textbox labelText="Date" />
	<Textbox labelText="Start time" />
	<NumericUpDown labelText="Session length" />
	<Button>Update session</Button>
	<Button style="danger" on:click={cancelSession}>Cancel session</Button>
</div>

{#if showConfirmAlert}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="flex items-center justify-center top-0 left-0 absolute h-screen w-screen bg-black bg-opacity-80"
		on:click={hideAlert}
	>
		<Alert
			title="Please confirm"
			body="Are you sure that you want to cancel this session, if somebody books at the same time, you may not be able to rebook"
			buttonText="Confirm"
			secondaryButtonText="Do not cancel"
			on:primary-click={() => console.log('x')}
		/>
	</div>
{/if}
