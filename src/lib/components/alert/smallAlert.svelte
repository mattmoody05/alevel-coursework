<script lang="ts">
	import { fly } from 'svelte/transition';

	type alertStyle = 'success' | 'standard' | 'warn' | 'error';

	export let style: alertStyle = 'warn';
	export let title: string;
	export let body: string;

	let styleClasses: string = '';
	let iconClass: string = '';

	if (style === 'success') {
		styleClasses = 'bg-green-400 border-green-600';
	} else if (style === 'standard') {
		styleClasses = 'bg-gray-500 border-gray-700';
	} else if (style === 'warn') {
		styleClasses = 'bg-amber-500 border-amber-600';
	} else if (style === 'error') {
		styleClasses = 'bg-red-400 border-red-500';
	}

	if (style === 'standard') {
		iconClass = 'fa-note-sticky';
	} else if (style === 'success') {
		iconClass = 'fa-circle-check';
	} else if (style === 'warn') {
		iconClass = 'fa-triangle-exclamation';
	} else if (style === 'error') {
		iconClass = 'fa-bug';
	}
</script>

<div
	class="rounded-xl border {styleClasses} text-white absolute top-4 right-4 z-50 min-w-min w-96 p-3"
	in:fly
	out:fly
>
	<div class="flex items-center gap-4">
		<i class="fa-solid px-2 {iconClass}" />
		<div class="">
			<div class="font-bold">{title}</div>
			<div class="leading-5">
				{body}
			</div>
		</div>
	</div>
</div>
