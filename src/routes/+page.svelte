<script lang="ts">
	import { LinkButton } from '$lib/components/button';
	import Button from '$lib/components/button/button.svelte';
</script>

<div class="m-12 flex gap-1">
	<Button style="danger">Danger!</Button>
	<LinkButton href="#" style="danger">Danger!</LinkButton>
</div>
