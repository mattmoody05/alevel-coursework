<script lang="ts">
	import { Button, LinkButton } from '$lib/components/button';
</script>

<Button on:click={() => console.log('Hello world')}>Standard button</Button>
<LinkButton href="#">Link button</LinkButton>
