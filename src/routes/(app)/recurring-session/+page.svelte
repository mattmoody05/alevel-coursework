<script>
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Recurring session centre</title>
</svelte:head>

<div class="flex gap-4 flex-col">
	<LinkButton style="secondary" href="/recurring-session/request"
		>Create recurring session</LinkButton
	>
	<LinkButton style="secondary" href="/recurring-session/view">View recurring sessions</LinkButton>
</div>
