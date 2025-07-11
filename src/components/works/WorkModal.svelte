<script lang="ts">
  import type { Asset, Work } from '../../types';
  import { getYouTubeEmbedUrl } from '../../utils';

  interface Props {
    work: Work | null;
    onClose: () => void;
  }

  let { work, onClose }: Props = $props();
  let dialog = $state<HTMLDialogElement>();

  const isOpen = $derived(work !== null);

  // dialogの開閉を制御
  $effect(() => {
    if (dialog) {
      if (isOpen && work) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
      } else {
        dialog.close();
        document.body.style.overflow = '';
      }
    }

    return () => {
      if (dialog) {
        dialog.close();
        document.body.style.overflow = '';
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

  function getAssetUrl(asset: Asset): string {
    if (asset.type === 'image') {
      return typeof asset.src === 'string' ? asset.src : asset.src.src;
    }
    if (asset.type === 'video' || asset.type === 'music') {
      return asset.src;
    }
    if (asset.type === 'website' || asset.type === 'external') {
      return asset.url;
    }
    return '';
  }
</script>

{#if work}
  <dialog 
    bind:this={dialog} 
    onclose={handleDialogClose}
    onclick={handleDialogClick}
  >
    <div class="modal-content">
      <header class="modal-header">
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
      </header>

      <div class="modal-body">
        <div class="work-meta">
          <div class="work-date">
            <span class="meta-label">制作日:</span>
            <span class="meta-value">{formatDate(work.createdAt)}</span>
          </div>

          {#if work.authors.length > 0}
            <div class="work-authors">
              <span class="meta-label">制作者:</span>
              <span class="meta-value">{work.authors.join(', ')}</span>
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
            <div class="asset-item">
              {#if asset.type === 'image'}
                <div class="asset-image">
                  <img src={getAssetUrl(asset)} alt={asset.caption} />
                  {#if asset.caption}
                    <p class="asset-caption">{asset.caption}</p>
                  {/if}
                </div>
              {:else if asset.type === 'video'}
                <div class="asset-video">
                  <h4 class="asset-title">{asset.title}</h4>
                  <div class="video-container">
                    <iframe
                      src={getYouTubeEmbedUrl(asset.src)}
                      title={asset.title}
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              {:else if asset.type === 'music'}
                <div class="asset-music">
                  <h4 class="asset-title">{asset.title}</h4>
                  <audio controls>
                    <source src={asset.src} />
                  </audio>
                </div>
              {:else if asset.type === 'website'}
                <div class="asset-website">
                  <h4 class="asset-title">{asset.title}</h4>
                  <p class="asset-client">クライアント: {asset.clientName}</p>
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" class="asset-link">
                    サイトを見る
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              {:else if asset.type === 'external'}
                <div class="asset-external">
                  <a href={asset.url} target="_blank" rel="noopener noreferrer" class="asset-link">
                    外部リンクを開く
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              {/if}
            </div>
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
      background: rgba(0, 0, 0, 0.8);
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
    border: 1px solid rgba(255, 255, 255, 0.2);
    max-width: 850px;
    max-height: 90vh;
    max-height: 90dvh; /* Dynamic viewport height for mobile */
    width: 100%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    margin: 0;
    box-sizing: border-box;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .modal-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
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
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.9rem;
  }

  .meta-label {
    color: rgba(255, 255, 255, 0.6);
    margin-right: 0.75rem;
    min-width: 60px;
  }

  .meta-value {
    color: rgba(255, 255, 255, 0.9);
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: rgba($color-accent, 0.2);
    color: rgba($color-accent, 0.9);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba($color-accent, 0.3);
  }

  .work-assets {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .asset-item {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .asset-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0 0 1rem 0;
  }

  .asset-image {
    img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      margin-bottom: 0.75rem;
    }
  }

  .asset-caption {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    line-height: 1.3;
    text-align: center;
  }

  .asset-music audio {
    width: 100%;
    border-radius: 8px;
  }

  .video-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; // 16:9 aspect ratio
    overflow: hidden;
    border-radius: 8px;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }

  .asset-client {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 1rem 0;
  }

  .asset-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba($color-accent, 0.9);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border: 1px solid rgba($color-accent, 0.3);
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba($color-accent, 0.1);
      border-color: rgba($color-accent, 0.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  // レスポンシブ対応
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

    .modal-body {
      padding: 1.5rem;
    }

    .work-tags {
      flex-direction: column;
      align-items: flex-start;
    }

    .asset-title {
      font-size: 0.9rem;
    }

    .asset-caption {
      font-size: 0.7rem;
      line-height: 1;
    }

    .asset-item {
      padding: 1rem;
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
