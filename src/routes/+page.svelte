<script lang="ts">
	import { Button, LinkButton } from '$lib/components/button';
</script>

<Button style="secondary" on:click={() => console.log('Hello world')}>Standard button</Button>
<LinkButton style="secondary" href="#">Link button</LinkButton>
