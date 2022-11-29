<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Listbox } from '$lib/components/input';
	import { stringToColour } from '$lib/util/ui';
</script>

<svelte:head>
	<title>View inoice</title>
</svelte:head>
<h3 class="font-bold text-xl">View invoice</h3>
<div class="flex flex-col gap-2">
	<div class="flex gap-2 items-center">
		<span class="font-bold">Child name: </span>
		<div class="py-1 px-2 {stringToColour('Matthew')} rounded-lg text-white">Matthew</div>
	</div>
	<div><span class="font-bold">Invoice ID: </span>idHere</div>
	<div><span class="font-bold">Date generated: </span>10/11/22</div>
	<div><span class="font-bold">Total payable: </span> £51.92</div>
	<div>
		<span class="font-bold">Invoice sheet: </span>
		<a class="underline" href="/invoicing/view/sheet/idHere">Click here to view</a>
	</div>
	<div>
		<span class="font-bold">Invoice message: </span>Lorem ipsum dolor sit amet consectetur
		adipisicing elit. Tempora alias neque atque repellat. Alias, eligendi voluptatum? Vero quis
		omnis molestias impedit cum quibusdam maxime inventore, voluptatibus ducimus tempora minima
		minus alias laudantium nihil dolorum facere perferendis earum ex, quia illum atque vel eius
		officia culpa? Ratione, enim.
	</div>
	<div />
	<Listbox labelText="Payment status">
		<option value="">Paid</option>
		<option value="">Unpaid</option>
		<option value="">Confirmed paid</option>
	</Listbox>
	<Button>Update payment status</Button>
</div>
