<script lang="ts">
	import { Button } from '$lib/components/button';
	import { Checkbox, Toggle } from '$lib/components/checkbox';
	import type { PageData } from './$types';

	export let data: PageData;

	const absenceReportId: string = data.absenceReportId;
</script>

<h3 class="font-bold text-xl">View absence report</h3>

<div class="flex flex-col gap-4">
	<div class="grid lg:grid-cols-2 gap-4 mt-2">
		<div class="flex flex-col bg-gray-100 border-gray-300 border p-4 rounded-xl">
			<div>
				<span class="font-bold">Child:</span> Matthew
			</div>
			<div>
				<span class="font-bold">Start date:</span> 10/11/22
			</div>
			<div>
				<span class="font-bold">End date:</span> 12/11/22
			</div>
			<div>
				<span class="font-bold">Reason:</span> COVID
			</div>
			<div>
				<span class="font-bold">Date submitted:</span> 10/11/22
			</div>
		</div>
		<div class="bg-gray-100 border-gray-300 border p-4 rounded-xl">
			<span class="font-bold">Additional information: </span> Lorem ipsum dolor sit amet consectetur
			adipisicing elit. Optio commodi officia ducimus mollitia cupiditate, harum fugiat quidem tempore,
			enim accusamus odio maxime necessitatibus aliquam delectus reiciendis iusto! Sed esse qui aspernatur
			possimus eveniet eaque amet ipsam atque voluptatibus sint nostrum voluptates odit reiciendis explicabo
			perspiciatis in enim laudantium, nam doloribus.
		</div>
	</div>
	<div class="flex flex-col gap-2 bg-gray-100 border-gray-300 border p-4 rounded-xl">
		<Checkbox labelText="Charge sessions" />
		<Checkbox labelText="Keep sessions" />
	</div>
	<Button>Update</Button>
</div>
