<script lang="ts">
	export let timeOffPeriodId: string;
	export let startDate: string;
	export let endDate: string;
	export let cancelSessions: boolean;
</script>

<a href="/time-off/view/{timeOffPeriodId}">
	<div class="grid grid-cols-3 lg:grid-cols-4 border bg-gray-100 border-gray-300 rounded-xl p-2">
		<div class="flex items-center">{startDate}</div>
		<div class="flex items-center">{endDate}</div>
		<div class="flex items-center">{cancelSessions ? 'Yes' : 'No'}</div>
		<div class="hidden lg:flex justify-end">
			<a href="/time-off/view/{timeOffPeriodId}">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 p-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
