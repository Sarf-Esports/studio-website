<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Work } from '../../types';
	import { WORKS } from '../../data';
	import { findWorkBySlug, getWorkSlug, queryWorks } from '../../utils';
	import TabNavigation from './TabNavigation.svelte';
	import WorksFilterBar, {
		type FilterActions,
		type FilterOptions,
		type FilterState,
		type SortMode
	} from './WorksFilterBar.svelte';
	import WorksList from './WorksList.svelte';
	import WorkModal from './WorkModal.svelte';

	type TabType = 'all' | keyof WORKS;

	interface Props {
		thumbnailUrlMap?: Record<string, string>;
	}

	let { thumbnailUrlMap = {} }: Props = $props();

	const TAB_ORDER: TabType[] = ['all', 'video', 'music', 'design', 'service'];

	let activeTab = $state<TabType>('all');
	let selectedWork = $state<Work | null>(null);
	let previousTabIndex = $state<number>(0);
	let searchQuery = $state<string>('');
	let selectedClientName = $state<string>('');
	let selectedAuthor = $state<string>('');
	let selectedTag = $state<string>('');
	let sortMode = $state<SortMode>('date-desc');
	let filterPanelExpandSignal = $state<number>(0);

	function updateURL(options: { tabId?: TabType; workSlug?: string | null }) {
		if (typeof window === 'undefined') return;

		const url = new URL(window.location.href);

		if ('tabId' in options && options.tabId !== undefined) {
			if (options.tabId === 'all') {
				url.searchParams.delete('tab');
			} else {
				url.searchParams.set('tab', options.tabId);
			}
		}

		if ('workSlug' in options) {
			if (typeof options.workSlug === 'string' && options.workSlug.length > 0) {
				url.searchParams.set('work', options.workSlug);
			} else {
				url.searchParams.delete('work');
			}
		}

		window.history.replaceState({}, '', url.toString());
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		const urlParams = new URLSearchParams(window.location.search);
		const tabParam = urlParams.get('tab') as TabType;
		const workParam = urlParams.get('work'); // slug

		if (tabParam && TAB_ORDER.includes(tabParam)) {
			activeTab = tabParam;
		}

		if (typeof workParam === 'string' && workParam.length > 0) {
			const resolvedWork = findWorkBySlug(workParam);

			if (resolvedWork !== null) {
				selectedWork = resolvedWork;
				updateURL({ workSlug: resolvedWork.slug });
			} else {
				updateURL({ workSlug: null });
			}
		}
	});

	const currentTabIndex = $derived(TAB_ORDER.indexOf(activeTab));
	const slideDirection = $derived(currentTabIndex < previousTabIndex ? -300 : 300);

	function getAllWorks(): Work[] {
		return Object.values(WORKS).flat();
	}

	function getAuthorName(author: Work['authors'][number]): string {
		return typeof author === 'string' ? author : author.name;
	}

	function sortWorks(works: Work[], mode: SortMode): Work[] {
		const sorted = works.slice();

		switch (mode) {
			case 'date-asc':
				sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
				break;
			case 'title-asc':
				sorted.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
				break;
			case 'title-desc':
				sorted.sort((a, b) => b.title.localeCompare(a.title, 'ja'));
				break;
			case 'date-desc':
			default:
				sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
		}

		return sorted;
	}

	const tabWorks = $derived.by((): Work[] => {
		let categoryWorks: Work[];

		if (activeTab === 'all') {
			categoryWorks = getAllWorks();
		} else {
			categoryWorks = WORKS[activeTab] ?? [];
		}

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

			categoryWorks = Array.from(workMap.values());
		}

		// musicタブの場合、videoの動画+BGM作品も追加
		if (activeTab === 'music') {
			const videoWithBGMWorks = queryWorks({
				category: 'video',
				tags: ['動画編集', 'BGM']
			}).filter((work) => work.assets.some((asset) => asset.type === 'music'));

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

			categoryWorks = Array.from(workMap.values());
		}

		return categoryWorks;
	});

	const clientNameCountMap = $derived.by((): Record<string, number> => {
		const clientNameCounts = new Map<string, number>();

		tabWorks.forEach((work) => {
			if (typeof work.clientName !== 'string' || work.clientName.length === 0) return;

			const currentCount = clientNameCounts.get(work.clientName) ?? 0;
			clientNameCounts.set(work.clientName, currentCount + 1);
		});

		return Object.fromEntries(clientNameCounts.entries());
	});

	const clientNameOptions = $derived.by((): string[] =>
		Object.keys(clientNameCountMap).sort((a, b) => a.localeCompare(b, 'ja'))
	);

	const authorCountMap = $derived.by((): Record<string, number> => {
		const authorCounts = new Map<string, number>();

		tabWorks.forEach((work) => {
			const uniqueWorkAuthors = new Set<string>();

			work.authors.forEach((author) => {
				uniqueWorkAuthors.add(getAuthorName(author));
			});

			uniqueWorkAuthors.forEach((authorName) => {
				const currentCount = authorCounts.get(authorName) ?? 0;
				authorCounts.set(authorName, currentCount + 1);
			});
		});

		return Object.fromEntries(authorCounts.entries());
	});

	const authorOptions = $derived.by((): string[] =>
		Object.keys(authorCountMap).sort((a, b) => a.localeCompare(b, 'ja'))
	);

	const tagCountMap = $derived.by((): Record<string, number> => {
		const tagCounts = new Map<string, number>();

		tabWorks.forEach((work) => {
			const uniqueWorkTags = new Set<string>(work.tags);

			uniqueWorkTags.forEach((tag) => {
				const currentCount = tagCounts.get(tag) ?? 0;
				tagCounts.set(tag, currentCount + 1);
			});
		});

		return Object.fromEntries(tagCounts.entries());
	});

	const tagOptions = $derived.by((): string[] =>
		Object.keys(tagCountMap).sort((a, b) => a.localeCompare(b, 'ja'))
	);

	const totalWorksCount = $derived(tabWorks.length);

	const filterState = $derived<FilterState>({
		searchQuery,
		selectedClientName,
		selectedAuthor,
		selectedTag,
		sortMode
	});

	const filterOptions = $derived<FilterOptions>({
		clientNameOptions,
		authorOptions,
		tagOptions,
		clientNameCountMap,
		authorCountMap,
		tagCountMap,
		totalWorksCount
	});

	const filterActions: FilterActions = {
		onSearchQueryChange: handleSearchQueryChange,
		onClientNameChange: handleClientNameChange,
		onAuthorChange: handleAuthorChange,
		onTagChange: handleTagChange,
		onSortModeChange: handleSortModeChange,
		onResetFilters: handleResetFilters
	};

	$effect(() => {
		const hasSelectedClient = clientNameOptions.includes(selectedClientName);
		if (selectedClientName.length > 0 && hasSelectedClient === false) {
			selectedClientName = '';
		}

		const hasSelectedAuthor = authorOptions.includes(selectedAuthor);
		if (selectedAuthor.length > 0 && hasSelectedAuthor === false) {
			selectedAuthor = '';
		}

		const hasSelectedTag = tagOptions.includes(selectedTag);
		if (selectedTag.length > 0 && hasSelectedTag === false) {
			selectedTag = '';
		}
	});

	const filteredWorks = $derived.by((): Work[] => {
		let results = tabWorks;

		const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
		if (normalizedSearchQuery.length > 0) {
			results = results.filter((work) =>
				work.title.toLocaleLowerCase().includes(normalizedSearchQuery)
			);
		}

		if (selectedClientName.length > 0) {
			results = results.filter((work) => work.clientName === selectedClientName);
		}

		if (selectedAuthor.length > 0) {
			results = results.filter((work) =>
				work.authors.some((author) => getAuthorName(author) === selectedAuthor)
			);
		}

		if (selectedTag.length > 0) {
			results = results.filter((work) => work.tags.includes(selectedTag));
		}

		return sortWorks(results, sortMode);
	});

	function handleTabChange(tabId: TabType) {
		previousTabIndex = currentTabIndex; // 現在のインデックスを前のインデックスとして保存
		activeTab = tabId;
		updateURL({ tabId });
	}

	function handleWorkClick(work: Work) {
		selectedWork = work;

		const workSlug = getWorkSlug(work);
		updateURL({ workSlug });
	}

	function handleCloseModal() {
		selectedWork = null;
		updateURL({ workSlug: null });
	}

	function handleSearchQueryChange(value: string) {
		searchQuery = value;
	}

	function handleClientNameChange(value: string) {
		selectedClientName = value;
	}

	function handleAuthorChange(value: string) {
		selectedAuthor = value;
	}

	function handleTagChange(value: string) {
		selectedTag = value;
	}

	function resetFilters() {
		searchQuery = '';
		selectedClientName = '';
		selectedAuthor = '';
		selectedTag = '';
	}

	function handleTagClickInModal(tag: string) {
		resetFilters();
		selectedTag = tag;
		selectedWork = null;
		filterPanelExpandSignal += 1;
		updateURL({ workSlug: null });
	}

	function handleAuthorClickInModal(authorName: string) {
		resetFilters();
		selectedAuthor = authorName;
		selectedWork = null;
		filterPanelExpandSignal += 1;
		updateURL({ workSlug: null });
	}

	function handleSortModeChange(value: SortMode) {
		sortMode = value;
	}

	function handleResetFilters() {
		resetFilters();
		sortMode = 'date-desc';
	}
</script>

<div class="works-container">
	<TabNavigation {activeTab} onTabChange={handleTabChange} />
	<WorksFilterBar
		state={filterState}
		options={filterOptions}
		actions={filterActions}
		expandSignal={filterPanelExpandSignal}
	/>

	<div class="works-content">
		{#key activeTab}
			<div
				in:fly={{ x: slideDirection, duration: 200, delay: 100 }}
				out:fly={{ x: -slideDirection, duration: 150 }}
			>
				<WorksList works={filteredWorks} onWorkClick={handleWorkClick} {thumbnailUrlMap} />
			</div>
		{/key}
	</div>
</div>

<WorkModal
	work={selectedWork}
	onClose={handleCloseModal}
	onTagClick={handleTagClickInModal}
	onAuthorClick={handleAuthorClickInModal}
/>

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
		margin-top: 1rem;
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
