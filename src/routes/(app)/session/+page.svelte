<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head>
	<title>Session centre</title>
</svelte:head>

<div class="flex gap-4 flex-col">
	<LinkButton style="secondary" href="/session/book">Book session</LinkButton>
	<LinkButton style="secondary" href="/session/view">View sessions</LinkButton>
	<LinkButton style="secondary" href="/session/check-availability">Check availability</LinkButton>
</div>
