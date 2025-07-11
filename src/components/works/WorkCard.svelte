<script lang="ts">
  import type { Work } from '../../types/work';
  import { extractYouTubeVideoId, getYouTubeThumbnail } from '../../utils/youtube';

  interface Props {
    work: Work;
    onClick: (work: Work) => void;
  }

  let { work, onClick }: Props = $props();

  // サムネイル画像を取得する関数
  function getThumbnail(work: Work): string {
    if (work.thumbnail) {
      return work.thumbnail;
    }

    // assetsの最初の要素のサムネイルを使用
    const firstAsset = work.assets[0];
    if (firstAsset && 'thumbnail' in firstAsset && firstAsset.thumbnail) {
      return typeof firstAsset.thumbnail === 'string'
        ? firstAsset.thumbnail
        : firstAsset.thumbnail.src;
    }

    // 画像アセットがある場合はそれを使用
    const imageAsset = work.assets.find((asset) => asset.type === 'image');
    if (imageAsset && imageAsset.type === 'image') {
      return typeof imageAsset.src === 'string' ? imageAsset.src : imageAsset.src.src;
    }

    // videoアセットがある場合、YouTubeサムネイルを試行
    const videoAsset = work.assets.find((asset) => asset.type === 'video');
    if (videoAsset && videoAsset.type === 'video') {
      const videoUrl = videoAsset.src;
      const videoId = extractYouTubeVideoId(videoUrl);
      if (videoId) {
        return getYouTubeThumbnail(videoId);
      }
    }

    // フォールバック画像
    return '/placeholder-image.jpg';
  }

  function handleClick() {
    onClick(work);
  }
</script>

<div
  class="work-card"
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
  tabindex="0"
  role="button"
>
  <div class="work-image">
    <img src={getThumbnail(work)} alt={work.title} loading="lazy" />
    <div class="work-overlay">
      <div class="work-overlay-content">
        <h3 class="work-title">{work.title}</h3>
        {#if work.tags.length > 0}
          <div class="work-tags">
            {#each work.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .work-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    aspect-ratio: 16/9;

    &:hover {
      transform: translateY(-4px);
      box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.4),
        0 0 20px rgba($color-accent, 0.2);

      .work-overlay {
        opacity: 1;
      }

      .work-image img {
        transform: scale(1.1);
        filter: blur(2px);
      }
    }

    &:focus {
      outline: none;
      box-shadow:
        0 0 0 2px rgba($color-accent, 0.5),
        0 10px 30px rgba(0, 0, 0, 0.3);
    }
  }

  .work-image {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  .work-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    padding: 1.5rem;
    text-align: center;
  }

  .work-overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .work-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .work-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .tag {
    background: rgba($color-accent, 0.2);
    color: rgba($color-accent, 1.0);
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba($color-accent, 0.4);
    backdrop-filter: blur(5px);
    white-space: nowrap;
  }

  @media (max-width: 1200px) {
    .work-title {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 768px) {
    .work-overlay {
      padding: 1rem;
    }

    .tag {
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .work-overlay {
      padding: 0.75rem;
    }

    .tag {
      font-size: 0.65rem;
      padding: 0.2rem 0.4rem;
    }
  }
</style>
