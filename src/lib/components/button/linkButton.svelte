<script lang="ts">
	export let style: 'primary' | 'secondary' | 'danger' = 'primary';
	export let href: string;

	let styleClasses = '';

	// Changing the styling of the button based on the style type selected
	if (style === 'primary') {
		styleClasses =
			'bg-gray-900 hover:bg-gray-700 text-white font-bold p-3 rounded-xl w-full text-center';
	} else if (style === 'secondary') {
		styleClasses = 'opacity-50 underline';
	} else if (style === 'danger') {
		styleClasses = 'bg-red-700 hover:bg-red-600 text-white font-bold p-3 rounded-xl w-full';
	}
</script>

<a {href}>
	<div class="min-w-max {styleClasses}">
		<slot />
	</div>
</a>
