<script lang="ts">
	interface Props {
		width?: string | number;
		height?: string | number;
		class?: string;
	}

	let { width = 16, height = 16, class: className }: Props = $props();
</script>

<!--
	Search icon (search)
	Based on Lucide Icons
	https://lucide.dev/icons/search
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
	class={className}
>
	<path d="m21 21-4.34-4.34" />
	<circle cx="11" cy="11" r="8" />
</svg>
