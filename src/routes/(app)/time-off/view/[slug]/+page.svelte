<script>
	import { Button } from '$lib/components/button';
</script>

<svelte:head>
	<title>View time off period</title>
</svelte:head>

<div class="flex flex-col gap-2">
	<h3 class="font-bold text-xl">View time off period</h3>
	<div class=""><span class="font-bold">Start date: </span><span>10/11/22</span></div>
	<div class=""><span class="font-bold">End date: </span><span>12/11/22</span></div>
	<div class=""><span class="font-bold">Cancel sessions? </span><span>Yes</span></div>
	<Button style="danger">Remove time off period</Button>
</div>
