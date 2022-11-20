<script lang="ts">
	import { UrgentNotificationCardView } from '$lib/components/notifications';
</script>

<h3 class="font-bold text-xl">View notifications</h3>
<div class="grid lg:grid-cols-2 gap-2">
	<div class="flex flex-col gap-1">
		<span class="text-sm">10/11/22</span>
		<UrgentNotificationCardView
			title="Test"
			content="test test test test test  test test  test test  test test  test test  test test "
		/>
	</div>
	<div class="flex flex-col gap-1">
		<span class="text-sm">10/10/22</span>
		<UrgentNotificationCardView
			title="Test"
			content="test test test test test  test test  test test  test test  test test  test test "
		/>
	</div>
	<div class="flex flex-col gap-1">
		<span class="text-sm">01/09/22</span>
		<UrgentNotificationCardView
			title="Test"
			content="test test test test test  test test  test test  test test  test test  test test "
		/>
	</div>
</div>
