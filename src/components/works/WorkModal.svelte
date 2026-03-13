<script lang="ts">
	import type { Work } from '../../types';
	import WorkAsset from './WorkAsset.svelte';

	interface Props {
		work: Work | null;
		onClose: () => void;
	}

	let { work, onClose }: Props = $props();
	let dialog = $state<HTMLDialogElement>();

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

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
							<span class="meta-value"
								>{work.authors
									.map((a) => (typeof a === 'string' ? a : `${a.name} (${a.role})`))
									.join(', ')}</span
							>
						</div>
					{/if}

					{#if work.tags.length > 0}
						<div class="work-tags">
							<span class="meta-label">タグ:</span>
							<div class="tags-list">
								{#each work.tags as tag}
									<span class="tag">{tag}</span>
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
		max-height: 90vh;
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

	.tag {
		background: rgba($color-accent, 0.3);
		color: rgba($color-accent, 1);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		border: 1px solid rgba($color-accent, 0.5);
		backdrop-filter: blur(5px);
		white-space: nowrap;
		text-shadow: 0 1px 2px rgba(black, 0.8);
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
	}
</style>
