<script lang="ts">
	import { stringToColour } from '$lib/util/ui';

	export let childName: string;
	export let date: string;
	export let absenceCharge: boolean;
	export let sessionId: string;
	export let reason: string | undefined;
</script>

<a href="/absence/view/{sessionId}">
	<div class="grid grid-cols-3 lg:grid-cols-5 p-2 bg-gray-100 border-gray-300 border rounded-xl">
		<div>
			<div class="px-2 py-1 {stringToColour(childName)} text-white rounded-lg max-w-max mr-2">
				{childName}
			</div>
		</div>
		<div class="flex items-center">{date}</div>
		<div class="flex items-center">{reason}</div>
		<div class="hidden lg:flex items-center">{absenceCharge ? 'Yes' : 'No'}</div>
		<div class="hidden lg:flex justify-end">
			<a href="/absence/view/{sessionId}">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 py-1 px-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
