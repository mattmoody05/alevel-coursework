<script lang="ts">
	import { CardWrapper } from '$lib/components/dashboard/cards';
	export let absencesReported: number;
	export let absenceReports: { childName: string; date: string }[];
</script>

<CardWrapper title="Absences">
	<div class="flex flex-col">
		<span class="text-sm opacity-50">Absences reported</span>
		<span class="text-4xl font-bold">{String(absencesReported)}</span>
	</div>
	<div class="mt-4">
		<span>Absence reports</span>
		<div class="flex flex-col gap-2 mt-1">
			{#each absenceReports as absence}
				<div class="grid grid-cols-2 text-sm items-center">
					<div class="bg-violet-500 text-white rounded-lg px-2 py-1 max-w-max">
						{absence.childName}
					</div>
					<span class="opacity-50">{absence.date}</span>
				</div>
			{/each}
		</div>
	</div>
</CardWrapper>
