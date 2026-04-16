<script lang="ts">
	interface Props {
		width?: string | number;
		height?: string | number;
		class?: string;
	}

	let { width = 16, height = 16, class: className }: Props = $props();
</script>

<!--
	Arrow up icon (arrow-up)
	Based on Lucide Icons
	https://lucide.dev/icons/arrow-up
	Copyright (c) 2013-2022 Lucide Contributors
	under the ISC License: https://github.com/lucide-icons/lucide/blob/main/LICENSE
-->
<svg
	xmlns="http://www.w3.org/2000/svg"
	{width}
	{height}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}><path d="m5 12 7-7 7 7" /><path d="M12 19V5" /></svg
>
