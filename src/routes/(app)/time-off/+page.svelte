<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Time off centre</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<LinkButton style="secondary" href="/time-off/view">View time off periods</LinkButton>
	<LinkButton style="secondary" href="/time-off/book">Book time off period</LinkButton>
</div>
