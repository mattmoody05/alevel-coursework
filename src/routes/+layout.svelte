<script>
	import { Menu } from '$lib/components/menu';

	import '../app.postcss';
</script>

<div class="flex p-4 w-screen h-screen">
	<Menu />
	<div class="ml-4 w-full overflow-y-scroll">
		<slot />
	</div>
</div>
