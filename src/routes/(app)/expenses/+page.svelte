<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Expense centre</title>
</svelte:head>

<div class="flex flex-col gap-4">
	<LinkButton style="secondary" href="/expenses/report">Report an expense</LinkButton>
	<LinkButton style="secondary" href="/expenses/view">View expenses</LinkButton>
</div>
