<script lang="ts">
	import type { Work } from '../../types';
	import { getWorkId } from '../../utils';
	import WorkCard from './WorkCard.svelte';

	interface Props {
		works: Work[];
		onWorkClick: (work: Work) => void;
		thumbnailUrlMap?: Record<string, string>;
	}

	let { works, onWorkClick, thumbnailUrlMap = {} }: Props = $props();

	const isEmpty = $derived(works.length === 0);
</script>

{#if isEmpty}
	<div class="empty-state">
		<div class="empty-content">
			<div class="empty-icon">📂</div>
			<h3 class="empty-title">作品がありません</h3>
		</div>
	</div>
{:else}
	<div class="works-grid">
		{#each works as work, index (getWorkId(work) + '-' + index)}
			<WorkCard
				{work}
				onClick={onWorkClick}
				optimizedThumbnailUrl={thumbnailUrlMap[getWorkId(work)]}
			/>
		{/each}
	</div>
{/if}

<style lang="scss">
	.works-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		padding: 2rem;
	}

	.empty-content {
		text-align: center;
		max-width: 400px;
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.empty-title {
		font-size: 1.5rem;
		font-weight: 900;
		color: white;
		margin: 0 0 0.75rem 0;
	}

	@media (max-width: 1200px) {
		.works-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.works-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1rem;
			padding: 0.5rem 0;
		}
	}

	@media (max-width: 480px) {
		.works-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 0.5rem 1rem;
		}

		.empty-state {
			min-height: 200px;
			padding: 1rem;
		}

		.empty-title {
			font-size: 1.25rem;
		}
	}
</style>
