<script lang="ts">
	import { LinkButton } from '$lib/components/button';
</script>

<svelte:head><title>Invocing centre</title></svelte:head>

<div class="flex flex-col gap-4">
	<LinkButton style="secondary" href="/invoicing/create">Create invoice</LinkButton>
	<LinkButton style="secondary" href="/invoicing/issue">Issue invoice</LinkButton>
	<LinkButton style="secondary" href="/invoicing/view">View invoices</LinkButton>
</div>
