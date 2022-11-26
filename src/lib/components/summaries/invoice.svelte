<script>
	import { stringToColour } from '$lib/util/ui';
</script>

<a href="/invoicing/view/idHere">
	<div class="bg-gray-100 border border-gray-300 p-2 grid grid-cols-3 lg:grid-cols-6 rounded-xl">
		<div class="px-2 py-1 {stringToColour('Matthew')} text-white rounded-lg max-w-max mr-2">
			Matthew
		</div>
		<div class="hidden lg:flex items-center">10/11/22</div>
		<div class="hidden lg:flex items-center">£100.71</div>
		<div class="flex items-center">31/11/22</div>
		<div class="px-2 py-1 bg-red-500 text-white rounded-lg max-w-max">Unpaid</div>
		<div class="hidden lg:flex justify-end">
			<a href="/invoicing/view/idHere">
				<div
					class="bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-700 py-1 px-2 min-w-max w-32 max-w-full flex items-center justify-center h-full"
				>
					View
				</div>
			</a>
		</div>
	</div>
</a>
