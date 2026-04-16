<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import ArrowDownIcon from '../icons/ArrowDownIcon.svelte';
	import ArrowUpIcon from '../icons/ArrowUpIcon.svelte';
	import SearchIcon from '../icons/SearchIcon.svelte';

	type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc';
	type SortType = 'date' | 'title';
	type SortDirection = 'asc' | 'desc';
	type DropdownKey = 'client' | 'author' | 'tag' | 'sort' | null;

	interface FilterState {
		searchQuery: string;
		selectedClientName: string;
		selectedAuthor: string;
		selectedTag: string;
		sortOption: SortOption;
	}

	interface FilterOptions {
		clientNameOptions: string[];
		authorOptions: string[];
		tagOptions: string[];
		clientNameCountMap: Record<string, number>;
		authorCountMap: Record<string, number>;
		tagCountMap: Record<string, number>;
		totalWorksCount: number;
	}

	interface FilterActions {
		onSearchQueryChange: (value: string) => void;
		onClientNameChange: (value: string) => void;
		onAuthorChange: (value: string) => void;
		onTagChange: (value: string) => void;
		onSortOptionChange: (value: SortOption) => void;
		onResetFilters: () => void;
	}

	interface Props {
		state: FilterState;
		options: FilterOptions;
		actions: FilterActions;
	}

	let { state: filterState, options: filterOptions, actions: filterActions }: Props = $props();

	let isExpanded = $state<boolean>(false);
	let openDropdown = $state<DropdownKey>(null);
	let rootElement = $state<HTMLElement>();

	const currentSortType = $derived<SortType>(
		filterState.sortOption.startsWith('date') ? 'date' : 'title'
	);
	const currentSortDirection = $derived<SortDirection>(
		filterState.sortOption.endsWith('asc') ? 'asc' : 'desc'
	);
	const isSortAsc = $derived(currentSortDirection === 'asc');
	const sortLabel = $derived(currentSortType === 'date' ? '日付順' : '名前順');

	function getSortOption(type: SortType, direction: SortDirection): SortOption {
		if (type === 'date') {
			return direction === 'asc' ? 'date-asc' : 'date-desc';
		}

		return direction === 'asc' ? 'title-asc' : 'title-desc';
	}

	function handleSearchInput(event: Event) {
		const input = event.currentTarget;
		if (!(input instanceof HTMLInputElement)) return;
		filterActions.onSearchQueryChange(input.value);
	}

	function toggleExpanded() {
		isExpanded = !isExpanded;
		if (isExpanded === false) {
			openDropdown = null;
		}
	}

	function toggleDropdown(key: Exclude<DropdownKey, null>) {
		if (openDropdown === key) {
			openDropdown = null;
			return;
		}

		openDropdown = key;
	}

	function selectClientName(value: string) {
		filterActions.onClientNameChange(value);
		openDropdown = null;
	}

	function selectAuthor(value: string) {
		filterActions.onAuthorChange(value);
		openDropdown = null;
	}

	function selectTag(value: string) {
		filterActions.onTagChange(value);
		openDropdown = null;
	}

	function selectSortType(type: SortType) {
		if (currentSortType === type) {
			const nextDirection: SortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
			filterActions.onSortOptionChange(getSortOption(type, nextDirection));
		} else {
			filterActions.onSortOptionChange(getSortOption(type, 'desc'));
		}

		openDropdown = null;
	}

	function handleResetClick() {
		filterActions.onResetFilters();
		openDropdown = null;
	}

	function handleDocumentClick(event: MouseEvent) {
		if (!rootElement) return;
		if (!(event.target instanceof Node)) return;
		if (rootElement.contains(event.target)) return;

		openDropdown = null;
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;

		openDropdown = null;
	}

	function handleDropdownWheel(event: WheelEvent) {
		const menuElement = event.currentTarget;
		if (!(menuElement instanceof HTMLElement)) return;

		if (menuElement.scrollHeight <= menuElement.clientHeight) {
			event.preventDefault();
			return;
		}

		const isScrollingUp = event.deltaY < 0;
		const isScrollingDown = event.deltaY > 0;
		const isAtTop = menuElement.scrollTop <= 0;
		const isAtBottom =
			menuElement.scrollTop + menuElement.clientHeight >= menuElement.scrollHeight - 1;

		if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
			event.preventDefault();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleDocumentClick);
		document.addEventListener('keydown', handleDocumentKeydown);

		return () => {
			document.removeEventListener('click', handleDocumentClick);
			document.removeEventListener('keydown', handleDocumentKeydown);
		};
	});
</script>

<section class="works-filter" aria-label="作品の検索と絞り込み" bind:this={rootElement}>
	<div class="toolbar-row">
		<button
			type="button"
			class="toggle-button"
			onclick={toggleExpanded}
			aria-label={isExpanded ? '検索パネルを閉じる' : '検索パネルを開く'}
			aria-expanded={isExpanded}
		>
			<span class="toggle-icon" aria-hidden="true">
				{#if isExpanded}
					<ArrowUpIcon width={16} height={16} />
				{:else}
					<SearchIcon width={16} height={16} />
				{/if}
			</span>
		</button>

		<div class="toolbar-actions">
			<div class="dropdown" class:is-open={openDropdown === 'sort'}>
				<button
					type="button"
					class="dropdown-trigger sort-trigger"
					onclick={() => toggleDropdown('sort')}
					aria-expanded={openDropdown === 'sort'}
				>
					<span class="trigger-label">並び替え</span>
					<span class="trigger-value">{sortLabel}</span>
					{#if isSortAsc}
						<span class="sort-icon" aria-hidden="true">
							<ArrowUpIcon width={14} height={14} />
						</span>
					{:else}
						<span class="sort-icon" aria-hidden="true">
							<ArrowDownIcon width={14} height={14} />
						</span>
					{/if}
				</button>
				{#if openDropdown === 'sort'}
					<div
						class="dropdown-menu"
						role="listbox"
						aria-label="並び替えの種類"
						onwheel={handleDropdownWheel}
						transition:slide={{ duration: 100 }}
					>
						<button
							type="button"
							class="dropdown-option"
							class:is-selected={currentSortType === 'date'}
							onclick={() => selectSortType('date')}
						>
							<span>日付順</span>
							{#if currentSortType === 'date'}
								{#if isSortAsc}
									<span class="sort-indicator" aria-hidden="true">
										<ArrowUpIcon width={14} height={14} />
									</span>
								{:else}
									<span class="sort-indicator" aria-hidden="true">
										<ArrowDownIcon width={14} height={14} />
									</span>
								{/if}
							{/if}
						</button>
						<button
							type="button"
							class="dropdown-option"
							class:is-selected={currentSortType === 'title'}
							onclick={() => selectSortType('title')}
						>
							<span>名前順</span>
							{#if currentSortType === 'title'}
								{#if isSortAsc}
									<span class="sort-indicator" aria-hidden="true">
										<ArrowUpIcon width={14} height={14} />
									</span>
								{:else}
									<span class="sort-indicator" aria-hidden="true">
										<ArrowDownIcon width={14} height={14} />
									</span>
								{/if}
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if isExpanded}
		<div class="expanded-panel" transition:slide={{ duration: 200 }}>
			<div class="filters-main">
				<div class="field search-field">
					<label for="works-search-input">タイトル</label>
					<input
						id="works-search-input"
						type="search"
						placeholder="タイトルを入力"
						value={filterState.searchQuery}
						oninput={handleSearchInput}
					/>
				</div>

				<div class="field">
					<label for="works-client-trigger">クライアント</label>
					<div class="dropdown" class:is-open={openDropdown === 'client'}>
						<button
							type="button"
							id="works-client-trigger"
							class="dropdown-trigger"
							onclick={() => toggleDropdown('client')}
							aria-expanded={openDropdown === 'client'}
						>
							<span class="trigger-value">
								{filterState.selectedClientName.length > 0
									? filterState.selectedClientName
									: 'すべて'}
							</span>
							<span class="chevron">▾</span>
						</button>
						{#if openDropdown === 'client'}
							<div
								class="dropdown-menu"
								role="listbox"
								aria-label="クライアント選択"
								onwheel={handleDropdownWheel}
								transition:slide={{ duration: 100 }}
							>
								<button
									type="button"
									class="dropdown-option"
									class:is-selected={filterState.selectedClientName.length === 0}
									onclick={() => selectClientName('')}
								>
									<span>すべて</span>
									<span class="option-count">{filterOptions.totalWorksCount}</span>
								</button>
								{#each filterOptions.clientNameOptions as option}
									<button
										type="button"
										class="dropdown-option"
										class:is-selected={filterState.selectedClientName === option}
										onclick={() => selectClientName(option)}
									>
										<span>{option}</span>
										<span class="option-count">{filterOptions.clientNameCountMap[option] ?? 0}</span
										>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="field">
					<label for="works-author-trigger">製作者</label>
					<div class="dropdown" class:is-open={openDropdown === 'author'}>
						<button
							type="button"
							id="works-author-trigger"
							class="dropdown-trigger"
							onclick={() => toggleDropdown('author')}
							aria-expanded={openDropdown === 'author'}
						>
							<span class="trigger-value"
								>{filterState.selectedAuthor.length > 0
									? filterState.selectedAuthor
									: 'すべて'}</span
							>
							<span class="chevron">▾</span>
						</button>
						{#if openDropdown === 'author'}
							<div
								class="dropdown-menu"
								role="listbox"
								aria-label="製作者選択"
								onwheel={handleDropdownWheel}
								transition:slide={{ duration: 100 }}
							>
								<button
									type="button"
									class="dropdown-option"
									class:is-selected={filterState.selectedAuthor.length === 0}
									onclick={() => selectAuthor('')}
								>
									<span>すべて</span>
									<span class="option-count">{filterOptions.totalWorksCount}</span>
								</button>
								{#each filterOptions.authorOptions as option}
									<button
										type="button"
										class="dropdown-option"
										class:is-selected={filterState.selectedAuthor === option}
										onclick={() => selectAuthor(option)}
									>
										<span>{option}</span>
										<span class="option-count">{filterOptions.authorCountMap[option] ?? 0}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="field">
					<label for="works-tag-trigger">タグ</label>
					<div class="dropdown" class:is-open={openDropdown === 'tag'}>
						<button
							type="button"
							id="works-tag-trigger"
							class="dropdown-trigger"
							onclick={() => toggleDropdown('tag')}
							aria-expanded={openDropdown === 'tag'}
						>
							<span class="trigger-value"
								>{filterState.selectedTag.length > 0 ? filterState.selectedTag : 'すべて'}</span
							>
							<span class="chevron">▾</span>
						</button>
						{#if openDropdown === 'tag'}
							<div
								class="dropdown-menu"
								role="listbox"
								aria-label="タグ選択"
								onwheel={handleDropdownWheel}
								transition:slide={{ duration: 100 }}
							>
								<button
									type="button"
									class="dropdown-option"
									class:is-selected={filterState.selectedTag.length === 0}
									onclick={() => selectTag('')}
								>
									<span>すべて</span>
									<span class="option-count">{filterOptions.totalWorksCount}</span>
								</button>
								{#each filterOptions.tagOptions as option}
									<button
										type="button"
										class="dropdown-option"
										class:is-selected={filterState.selectedTag === option}
										onclick={() => selectTag(option)}
									>
										<span>{option}</span>
										<span class="option-count">{filterOptions.tagCountMap[option] ?? 0}</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<div class="field reset-field">
					<button type="button" class="reset-button" onclick={handleResetClick}
						>条件をリセット</button
					>
				</div>
			</div>
		</div>
	{/if}
</section>

<style lang="scss">
	.works-filter {
		width: 100%;
		box-sizing: border-box;
	}

	.toolbar-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.65rem;
		flex-wrap: nowrap;
	}

	.toggle-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 2.15rem;
		width: 2.15rem;
		padding: 0;
		border: 1px solid rgba($color-accent, 0.4);
		border-radius: 8px;
		background: rgba($color-secondary, 0.66);
		color: $text-color;
		cursor: pointer;
	}

	.toggle-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: rgba($text-color, 0.9);
	}

	.toolbar-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}

	.reset-button {
		height: 2.15rem;
		padding: 0 0.7rem;
		border: 1px solid rgba($text-color, 0.2);
		border-radius: 8px;
		background: rgba($color-secondary, 0.62);
		color: rgba($text-color, 0.92);
		font-size: 0.8rem;
		cursor: pointer;
		white-space: nowrap;

		&:hover {
			border: 1px solid rgba($text-color, 0.35);
			transition: border-color 0.2s ease;
		}
	}

	.filters-main {
		display: grid;
		grid-template-columns: minmax(220px, 2fr) repeat(3, minmax(150px, 1fr)) auto;
		gap: 0.55rem;
		margin-top: 0.45rem;
	}

	.reset-field {
		justify-self: end;
		align-self: end;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.28rem;

		label {
			font-size: 0.69rem;
			letter-spacing: 0.06em;
			color: rgba($text-color, 0.76);
			text-transform: uppercase;
			margin-left: 0.7rem;
			@include font-montserrat(400);
		}
	}

	.search-field input,
	.dropdown-trigger {
		height: 2.2rem;
		padding: 0 0.65rem;
		border-radius: 8px;
		border: 1px solid rgba($color-accent, 0.35);
		background: rgba($color-secondary, 0.8);
		color: $text-color;
		font-size: 0.84rem;
		line-height: 1.2;
		box-sizing: border-box;
	}

	.search-field input {
		width: 100%;
		outline: none;

		&:focus {
			border-color: rgba($color-accent, 0.85);
		}

		&::placeholder {
			color: rgba($text-color, 0.56);
		}
	}

	.dropdown {
		position: relative;
	}

	.dropdown-trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		transition: border-color 0.18s ease;
	}

	.dropdown.is-open .dropdown-trigger {
		border-color: rgba($color-accent, 0.9);
	}

	.sort-trigger {
		width: auto;
		min-width: 168px;
		gap: 0.55rem;
	}

	.trigger-label {
		font-size: 0.74rem;
		color: rgba($text-color, 0.72);
	}

	.trigger-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sort-icon,
	.sort-indicator {
		flex: 0 0 auto;
		color: rgba($text-color, 0.75);
	}

	.chevron {
		color: rgba($text-color, 0.65);
		font-size: 0.72rem;
		margin-left: 0.45rem;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.25rem);
		left: 0;
		right: 0;
		max-height: 260px;
		overflow: auto;
		overscroll-behavior: contain;
		padding: 0.3rem;
		border-radius: 8px;
		border: 1px solid rgba($color-accent, 0.35);
		background: rgba(#181414, 0.96);
		box-shadow: 0 8px 20px rgba(black, 0.35);
		z-index: 20;
	}

	.dropdown-option {
		width: 100%;
		padding: 0.45rem 0.5rem;
		border-radius: 6px;
		border: none;
		background: transparent;
		color: $text-color;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.83rem;
		text-align: left;

		&:hover {
			background: rgba($color-accent, 0.18);
		}

		&.is-selected {
			background: rgba($color-accent, 0.32);
		}
	}

	.option-count {
		margin-left: auto;
		font-size: 0.75rem;
		color: rgba($text-color, 0.75);
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 1200px) {
		.toolbar-row {
			flex-direction: row;
			align-items: center;
		}

		.toolbar-actions {
			margin-left: auto;
			justify-content: flex-end;
			min-width: 0;
		}

		.filters-main {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.search-field {
			grid-column: 1 / -1;
		}

		.reset-field {
			grid-column: 2;
		}
	}

	@media (max-width: 640px) {
		.works-filter {
			padding: 0.45rem;
		}

		.toolbar-row {
			align-items: center;
		}

		.sort-trigger {
			min-width: 0;
			width: 100%;
		}

		.dropdown {
			flex: 1;
			min-width: 0;
		}

		.filters-main {
			grid-template-columns: 1fr;
		}

		.reset-field {
			grid-column: 1;
			padding-top: 0.5rem;
		}

		.reset-field .reset-button {
			width: 100%;
		}
	}
</style>
