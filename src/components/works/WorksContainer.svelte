<script lang="ts">
	import type { Work } from '../../types';
	import { WORKS } from '../../data';
	import { queryWorks } from '../../utils';
	import TabNavigation from './TabNavigation.svelte';
	import WorksList from './WorksList.svelte';
	import WorkModal from './WorkModal.svelte';

	type TabType = 'all' | keyof WORKS;

	let activeTab = $state<TabType>('all');
	let selectedWork = $state<Work | null>(null);

	function getAllWorks(): Work[] {
		return Object.values(WORKS).flat();
	}

	const filteredWorks = $derived.by((): Work[] => {
		if (activeTab === 'all') {
			return getAllWorks();
		}

		const categoryWorks: Work[] = WORKS[activeTab] || [];

		// デザインタブの場合、movieの動画+サムネイル作品も追加
		if (activeTab === 'design') {
			const videoWithThumbnailWorks = queryWorks({
				category: 'movie',
				tags: ['動画編集', 'サムネイル制作']
			}).filter(
				(work) =>
					work.assets.some((asset) => asset.type === 'video') &&
					work.assets.some((asset) => asset.type === 'image')
			);

			// svelteのeachでの重複防止
			const workMap = new Map<string, Work>();

			categoryWorks.forEach((work) => {
				const key = `${work.title}-${work.createdAt}`;
				workMap.set(key, work);
			});

			// 動画+サムネイル作品を追加（w/重複チェック）
			videoWithThumbnailWorks.forEach((work) => {
				const key = `${work.title}-${work.createdAt}`;
				if (!workMap.has(key)) {
					workMap.set(key, work);
				}
			});

			return Array.from(workMap.values());
		}

		return categoryWorks;
	});

	function handleTabChange(tabId: TabType) {
		activeTab = tabId;
	}

	function handleWorkClick(work: Work) {
		selectedWork = work;
	}

	function handleCloseModal() {
		selectedWork = null;
	}
</script>

<div class="works-container">
	<TabNavigation {activeTab} onTabChange={handleTabChange} />

	<div class="works-content">
		<WorksList works={filteredWorks} onWorkClick={handleWorkClick} />
	</div>
</div>

<WorkModal work={selectedWork} onClose={handleCloseModal} />

<style lang="scss">
	.works-container {
		width: 100%;
		max-width: 1500px;
		margin: 0 auto;
		padding: 2rem 1rem;
		overflow: hidden;
		box-sizing: border-box;
	}

	.works-content {
		margin-top: 2rem;
		width: 100%;
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.works-container {
			padding: 1.5rem 0.75rem;
			max-width: 100vw;
		}
	}

	@media (max-width: 480px) {
		.works-container {
			padding: 1rem 0.5rem;
			max-width: 100vw;
		}
	}
</style>
