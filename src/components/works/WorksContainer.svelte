<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Work } from '../../types';
	import { WORKS } from '../../data';
	import { queryWorks } from '../../utils';
	import TabNavigation from './TabNavigation.svelte';
	import WorksList from './WorksList.svelte';
	import WorkModal from './WorkModal.svelte';

	type TabType = 'all' | keyof WORKS;

	const TAB_ORDER: TabType[] = ['all', 'video', 'music', 'design', 'service'];

	let activeTab = $state<TabType>('all');
	let selectedWork = $state<Work | null>(null);
	let previousTabIndex = $state<number>(0);

	function initializeTabFromURL() {
		if (typeof window === 'undefined') return;
		
		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab') as TabType;
		
		if (tabParam && TAB_ORDER.includes(tabParam)) {
			activeTab = tabParam;
		}
	}

	function updateURL(tabId: TabType) {
		if (typeof window === 'undefined') return;
		
		const url = new URL(window.location.href);
		
		if (tabId === 'all') {
			url.searchParams.delete('tab');
		} else {
			url.searchParams.set('tab', tabId);
		}
		
		window.history.replaceState({}, '', url.toString());
	}

	onMount(() => {
		initializeTabFromURL();
	});

	const currentTabIndex = $derived(TAB_ORDER.indexOf(activeTab));
	const slideDirection = $derived(currentTabIndex < previousTabIndex ? -300 : 300);

	function getAllWorks(): Work[] {
		return Object.values(WORKS).flat();
	}

	const filteredWorks = $derived.by((): Work[] => {
		if (activeTab === 'all') {
			return getAllWorks();
		}

		const categoryWorks: Work[] = WORKS[activeTab] || [];

		// デザインタブの場合、videoの動画+サムネイル作品も追加
		if (activeTab === 'design') {
			const videoWithThumbnailWorks = queryWorks({
				category: 'video',
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

		// musicタブの場合、videoの動画+BGM作品も追加
		if (activeTab === 'music') {
			const videoWithBGMWorks = queryWorks({
				category: 'video',
				tags: ['動画編集', 'BGM']
			}).filter(
				(work) =>
					work.assets.some((asset) => asset.type === 'video') &&
					work.assets.some((asset) => asset.type === 'music')
			);

			const workMap = new Map<string, Work>();

			// 動画BGMを優先
			videoWithBGMWorks.forEach((work) => {
				// 既にfilterしてるから必ず存在する
				const audioAsset = work.assets.find((asset) => asset.type === 'music')!;
				const key = `${audioAsset.title}`; // 同じ曲名はない前提, workの日付が異なるためタイトルのみで判別
				workMap.set(key, work);
			});

			categoryWorks.forEach((work) => {
				const key = `${work.title}`;
				if (!workMap.has(key)) {
					workMap.set(key, work);
				}
			});

			return Array.from(workMap.values());
		}

		return categoryWorks;
	});

	function handleTabChange(tabId: TabType) {
		previousTabIndex = currentTabIndex; // 現在のインデックスを前のインデックスとして保存
		activeTab = tabId;
		updateURL(tabId);
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
		{#key activeTab}
			<div 
				in:fly={{ x: slideDirection, duration: 200, delay: 100 }} 
				out:fly={{ x: -slideDirection, duration: 150 }}
			>
				<WorksList works={filteredWorks} onWorkClick={handleWorkClick} />
			</div>
		{/key}
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
			padding-bottom: calc(1.5rem + var(--mobile-control-height, 75px));
		}
	}

	@media (max-width: 480px) {
		.works-container {
			padding: 1rem 0.5rem;
			max-width: 100vw;
			padding-bottom: calc(1rem + var(--mobile-control-height, 75px));
		}
	}
</style>
