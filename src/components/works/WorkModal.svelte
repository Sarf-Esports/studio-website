<script lang="ts">
	import type { Work } from '../../types';
	import { getWorkSlug } from '../../utils';
	import WorkAsset from './WorkAsset.svelte';

	interface Props {
		work: Work | null;
		onClose: () => void;
		onTagClick: (tag: string) => void;
		onAuthorClick: (authorName: string) => void;
	}

	let { work, onClose, onTagClick, onAuthorClick }: Props = $props();
	let dialog = $state<HTMLDialogElement>();
	let isCopyTooltipVisible = $state(false);
	let copyTooltipTimer: ReturnType<typeof setTimeout> | undefined = undefined;

	const isOpen = $derived(work !== null);

	// dialogとbodyのスクロール制御
	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
			if (dialog) {
				dialog.showModal();
			}
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
			if (dialog) {
				dialog.close();
			}
		};
	});

	function handleDialogClose() {
		onClose();
	}

	function handleDialogClick(event: MouseEvent) {
		// backdrop（dialog要素自体）がクリックされた場合にモーダルを閉じる
		if (event.target === dialog) {
			onClose();
		}
	}

	async function handleCopyLink() {
		if (!work) return;

		const origin = window.location.origin;
		try {
			const slug = getWorkSlug(work);
			await navigator.clipboard.writeText(`${origin}/works/${slug}`);
		} catch {
			return;
		}

		isCopyTooltipVisible = true;

		if (copyTooltipTimer !== undefined) {
			clearTimeout(copyTooltipTimer);
		}

		copyTooltipTimer = setTimeout(() => {
			isCopyTooltipVisible = false;
			copyTooltipTimer = undefined;
		}, 1400);
	}

	$effect(() => {
		return () => {
			if (copyTooltipTimer !== undefined) {
				clearTimeout(copyTooltipTimer);
			}
		};
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleTagClick(tag: string) {
		onTagClick(tag);
	}

	function getAuthorName(author: Work['authors'][number]): string {
		return typeof author === 'string' ? author : author.name;
	}

	function getAuthorLabel(author: Work['authors'][number]): string {
		return typeof author === 'string' ? author : `${author.name} (${author.role})`;
	}

	function handleAuthorClick(author: Work['authors'][number]) {
		onAuthorClick(getAuthorName(author));
	}
</script>

{#if work}
	<dialog bind:this={dialog} onclose={handleDialogClose} onclick={handleDialogClick}>
		<div class="modal-content">
			<header class="modal-header">
				<div class="header-top">
					<h2 id="modal-title" class="modal-title">{work.title}</h2>
					<button class="modal-close" onclick={onClose} aria-label="モーダルを閉じる">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M18 6L6 18M6 6L18 18"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>
				{#if work.clientName}
					<p class="modal-client">{work.clientName}</p>
				{/if}
			</header>

			<div class="modal-body">
				<div class="work-meta">
					<div class="work-date">
						<span class="meta-label">公開日:</span>
						<span class="meta-value">{formatDate(work.createdAt)}</span>
					</div>

					{#if work.authors.length > 0}
						<div class="work-authors">
							<span class="meta-label">制作者:</span>
							<div class="authors-list meta-value">
								{#each work.authors as author, index}
									<button
										type="button"
										class="author-link"
										onclick={() => handleAuthorClick(author)}
										aria-label={`この制作者で絞り込む: ${getAuthorName(author)}`}
									>
										{getAuthorLabel(author)}
									</button>
									{#if index < work.authors.length - 1}
										<span class="author-separator">, </span>
									{/if}
								{/each}
							</div>
						</div>
					{/if}

					{#if work.tags.length > 0}
						<div class="work-tags">
							<span class="meta-label">タグ:</span>
							<div class="tags-list">
								{#each work.tags as tag}
									<button
										type="button"
										class="tag"
										onclick={() => handleTagClick(tag)}
										aria-label={`このタグで絞り込む: ${tag}`}
									>
										{tag}
									</button>
								{/each}
							</div>
						</div>
					{/if}
				</div>

				<div class="work-assets">
					{#each work.assets as asset}
						<WorkAsset {asset} />
					{/each}
				</div>
			</div>

			<footer class="modal-footer">
				<button
					type="button"
					class="copy-link"
					aria-label="ページリンクをコピー"
					onclick={handleCopyLink}
				>
					{#if isCopyTooltipVisible}
						<span class="copy-tooltip" role="status" aria-live="polite">コピーしました！</span>
					{/if}
					<!--
						Bootstrap Icons - Link 45deg
						https://icons.getbootstrap.com/icons/link-45deg
						Copyright (c) 2019 The Bootstrap Authors
						under the MIT License: https://github.com/twbs/icons/blob/main/LICENSE
					-->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="currentColor"
						class="bi bi-link-45deg"
						viewBox="0 0 16 16"
					>
						<path
							d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"
						/>
						<path
							d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"
						/>
					</svg>
				</button>
			</footer>
		</div>
	</dialog>
{/if}

<style lang="scss">
	dialog {
		background: transparent;
		border: none;
		padding: 2rem;
		max-width: none;
		max-height: none;
		width: 100%;
		height: 100%;
		margin: 0;
		box-sizing: border-box;

		&::backdrop {
			background: rgba(black, 0.8);
			backdrop-filter: blur(4px);
		}

		&[open] {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.modal-content {
		background: rgba(20, 20, 20, 0.95);
		border-radius: 16px;
		border: 1px solid rgba(white, 0.2);
		max-width: 850px;
		max-height: 90vh; // dvh非対応ブラウザ向けのフォールバック
		max-height: 90dvh;
		width: 100%;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(black, 0.5);
		display: flex;
		flex-direction: column;
		margin: 0;
		box-sizing: border-box;
	}

	.modal-header {
		display: flex;
		flex-direction: column;
		padding: 1.5rem 2rem;
		border-bottom: 1px solid rgba(white, 0.1);
		flex-shrink: 0;
	}

	.header-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.modal-title {
		font-size: 1.3rem;
		font-weight: 900;
		color: white;
		margin: 0;
	}

	.modal-client {
		font-size: 0.9rem;
		font-weight: 500;
		color: $color-muted;
		margin: 0;
		align-self: flex-start;
	}

	.modal-close {
		background: none;
		border: none;
		color: rgba(white, 0.7);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 8px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			color: white;
			background: rgba(white, 0.1);
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px rgba($color-accent, 0.5);
		}

		svg {
			display: block;
		}
	}

	.modal-body {
		padding: 2rem;
		overflow-y: auto;
		overflow-x: hidden;
		flex: 1;
		min-height: 0;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		padding: 0.7rem 2rem;
		border-top: 1px solid rgba(white, 0.1);
		flex-shrink: 0;
	}

	.copy-link {
		position: relative;
		background: none;
		border: none;
		color: rgba(white, 0.7);
		cursor: pointer;
		padding: 0.3rem;
		border-radius: 8px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			color: white;
			background: rgba(white, 0.1);
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 0 2px rgba($color-accent, 0.5);
		}

		svg {
			display: block;
		}
	}

	.copy-tooltip {
		position: absolute;
		right: calc(100% + 0.5rem);
		top: 50%;
		transform: translateY(-50%);
		padding: 0.3rem 0.55rem;
		border-radius: 6px;
		border: 1px solid rgba(white, 0.2);
		color: white;
		font-size: 0.75rem;
		line-height: 1;
		white-space: nowrap;
		pointer-events: none;
		animation: copy-tooltip-fade 1.4s ease forwards;
	}

	@keyframes copy-tooltip-fade {
		0% {
			opacity: 0;
			transform: translate(-0.2rem, -50%);
		}

		15% {
			opacity: 1;
			transform: translate(0, -50%);
		}

		80% {
			opacity: 1;
			transform: translate(0, -50%);
		}

		100% {
			opacity: 0;
			transform: translate(-0.1rem, -50%);
		}
	}

	.work-meta {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(white, 0.1);
	}

	.work-date,
	.work-authors {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
	}

	.work-tags {
		display: flex;
		align-items: center;
		font-size: 0.9rem;
	}

	.meta-label {
		color: rgba(white, 0.6);
		margin-right: 0.75rem;
		min-width: 60px;
		line-height: 1.5;
	}

	.meta-value {
		color: rgba(white, 0.9);
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.authors-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		align-items: center;
		line-height: 1.5;
	}

	.tag {
		appearance: none;
		background: rgba($color-accent, 0.3);
		color: rgba($color-accent, 1);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-family: inherit;
		font-weight: 500;
		border: 1px solid rgba($color-accent, 0.5);
		backdrop-filter: blur(5px);
		white-space: nowrap;
		text-shadow: 0 1px 2px rgba(black, 0.8);
		cursor: pointer;

		&:hover {
			background: rgba($color-accent, 0.42);
		}

		&:focus-visible {
			outline: none;
			box-shadow:
				0 0 0 2px rgba(white, 0.24),
				0 0 0 4px rgba($color-accent, 0.55);
		}
	}

	.author-link {
		all: unset;
		display: inline;
		color: rgba(white, 0.9);
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		line-height: inherit;
		text-align: left;

		cursor: pointer;

		&:hover {
			color: rgba(white, 0.75);
			text-decoration: underline;
			text-underline-offset: 0.1em;
		}

		&:focus-visible {
			outline: none;
			text-decoration: underline;
			text-underline-offset: 0.1em;
		}
	}

	.author-separator {
		color: rgba(white, 0.9);
		white-space: pre;
		margin-right: 0.4rem;
	}

	.work-assets {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		dialog {
			padding: 0.75rem;
			align-items: flex-start;
			padding-top: max(1rem, env(safe-area-inset-top));
		}

		.modal-content {
			max-height: 95vh;
			max-height: 95dvh;
			margin-top: 1rem;
			max-width: calc(100vw - 1.5rem);
		}

		.modal-header {
			padding: 1rem 1.5rem;
		}

		.modal-title {
			font-size: 1.1rem;
		}

		.modal-client {
			font-size: 0.8rem;
		}

		.modal-body {
			padding: 1.5rem;
		}

		.modal-footer {
			padding: 0.6rem 1rem;
		}

		.work-assets {
			gap: 1rem;
		}
	}

	@media (max-width: 480px) {
		dialog {
			padding: 0.5rem;
			align-items: flex-start;
			padding-top: max(1rem, env(safe-area-inset-top));
		}

		.modal-content {
			max-height: 98vh;
			max-height: 95dvh;
			margin-top: 0.5rem;
			max-width: calc(100vw - 1rem);
		}

		.modal-header {
			padding: 1rem;
		}

		.modal-body {
			padding: 1rem;
		}

		.modal-footer {
			padding: 0.5rem 1rem;
		}
	}
</style>
