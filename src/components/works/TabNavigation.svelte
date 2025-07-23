<script lang="ts">
	import { WORKS } from '../../data';

	interface Props {
		activeTab: TabType;
		onTabChange: (tab: TabType) => void;
	}

	let { activeTab, onTabChange }: Props = $props();

	type TabType = 'all' | keyof WORKS;

	const tabs = ['all', ...Object.keys(WORKS)] as TabType[];

	function handleTabClick(tabId: TabType) {
		onTabChange(tabId);
	}
</script>

<nav class="tab-navigation">
	<div class="tab-container">
		{#each tabs as tab}
			<button
				class="tab-button"
				class:is-active={activeTab === tab}
				onclick={() => handleTabClick(tab)}
			>
				{tab.toUpperCase()}
			</button>
		{/each}
	</div>
	<hr />
</nav>

<style lang="scss">
	.tab-navigation {
		width: 100%;
		margin-bottom: 2rem;
		text-align: center;
	}

	.tab-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		gap: 0;
	}

	.tab-button {
		font-size: 1rem;
		color: inherit;
		padding: 1rem 1.5rem;
		background: none;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		position: relative;
		@include font-montserrat(800);

		&:hover {
			background: rgba($color-accent, 0.1);
		}

		&:focus {
			outline: none;
			box-shadow: inset 0 0 0 2px rgba($color-accent, 0.5);
		}
	}

	.is-active {
		color: $color-primary;

		&,
		&:hover {
			background: $color-accent;
		}

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 2px;
			background: $color-accent;
		}

		&:focus {
			outline: $color-accent solid 2px;
		}
	}

	hr {
		margin: 0 auto;
		width: calc(100% - 2rem);
		border: none;
		border-top: 1px solid $color-accent;
	}

	@media (max-width: 768px) {
		.tab-container {
			gap: 0.5rem;
		}

		.tab-button {
			padding: 0.75rem 1rem;
			font-size: 0.9rem;
			flex: none;
			min-width: calc(50% - 0.25rem);
		}

		hr {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.tab-button {
			min-width: 100%;
			padding: 0.875rem 1rem;
			font-size: 0.85rem;
		}
	}
</style>
