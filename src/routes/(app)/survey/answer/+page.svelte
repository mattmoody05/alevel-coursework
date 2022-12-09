<script>
	import { FilterButton, SortButton } from '$lib/components/filters';
	import { SurveySummary } from '$lib/components/summaries';
</script>

<svelte:head>
	<title>Select survey</title>
</svelte:head>

<h3 class="font-bold text-xl">Select survey</h3>
<div class="flex gap-2 my-2">
	<FilterButton />
	<SortButton />
</div>
<div class="grid text-sm opacity-50 grid-cols-3 lg:grid-cols-5 my-2">
	<div>Name</div>
	<div>Consent form</div>
	<div class="hidden lg:block">Number of questions</div>
	<div>Status</div>
</div>
<SurveySummary />
