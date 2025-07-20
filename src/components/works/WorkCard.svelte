<script lang="ts">
	import type { Work, IconImage } from '../../types';
	import { extractYouTubeVideoId, getYouTubeThumbnail } from '../../utils';

	interface Props {
		work: Work;
		onClick: (work: Work) => void;
	}

	let { work, onClick }: Props = $props();

	function isIconImage(img: any): img is IconImage {
		return img && typeof img === 'object' && 'icon' in img && 'backgroundColor' in img;
	}

	function getThumbnailInfo(work: Work) {
		if (work.thumbnail) {
			if (isIconImage(work.thumbnail)) {
				return {
					src: typeof work.thumbnail.icon === 'string' ? work.thumbnail.icon : work.thumbnail.icon.src,
					isIcon: true,
					backgroundColor: work.thumbnail.backgroundColor,
					width: work.thumbnail.width,
					height: work.thumbnail.height
				};
			}
			return {
				src: typeof work.thumbnail === 'string' ? work.thumbnail : work.thumbnail.src,
				isIcon: false,
				backgroundColor: null,
				width: null,
				height: null
			};
		}

		// assetsの最初の要素のサムネイルを使用
		const firstAsset = work.assets[0];
		if (firstAsset && 'thumbnail' in firstAsset && firstAsset.thumbnail) {
			return {
				src: typeof firstAsset.thumbnail === 'string' ? firstAsset.thumbnail : firstAsset.thumbnail.src,
				isIcon: false,
				backgroundColor: null,
				width: null,
				height: null
			};
		}

		// 画像アセットがある場合はそれを使用
		const imageAsset = work.assets.find((asset) => asset.type === 'image');
		if (imageAsset && imageAsset.type === 'image') {
			return {
				src: typeof imageAsset.src === 'string' ? imageAsset.src : imageAsset.src.src,
				isIcon: false,
				backgroundColor: null,
				width: null,
				height: null
			};
		}

		// videoアセットがある場合、YouTubeサムネイルを試行
		const videoAsset = work.assets.find((asset) => asset.type === 'video');
		if (videoAsset && videoAsset.type === 'video') {
			const videoUrl = videoAsset.src;
			const videoId = extractYouTubeVideoId(videoUrl);
			if (videoId) {
				return {
					src: getYouTubeThumbnail(videoId),
					isIcon: false,
					backgroundColor: null,
					width: null,
					height: null
				};
			}
		}

		// フォールバック画像
		return {
			src: '/placeholder-image.jpg',
			isIcon: false,
			backgroundColor: null,
			width: null,
			height: null
		};
	}

	const thumbnailInfo = $derived(getThumbnailInfo(work));

	function handleClick() {
		onClick(work);
	}
</script>

<button class="work-card" onclick={handleClick} style={work.border ? `border: ${work.border}` : ''}>
	<div class="work-image">
		{#if thumbnailInfo.isIcon}
			<div 
				class="icon-thumbnail" 
				style="background-color: {thumbnailInfo.backgroundColor}"
			>
				<img 
					src={thumbnailInfo.src} 
					alt={work.title} 
					loading="lazy"
					style="width: {thumbnailInfo.width}; height: {thumbnailInfo.height};"
				/>
			</div>
		{:else}
			<img src={thumbnailInfo.src} alt={work.title} loading="lazy" />
		{/if}
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
</button>

<style lang="scss">
	.work-card {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.3s ease;
		aspect-ratio: 16/9;
		font: inherit;
		color: inherit;
		padding: 0;
		background: none;
		border: none;
		box-sizing: border-box;

		&:hover,
		&:focus {
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

	.icon-thumbnail {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
		position: relative;
		z-index: 1;

		img {
			object-fit: contain;
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
		z-index: 10;
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
		font-weight: 900;
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
		background: rgba($color-accent, 0.3);
		color: rgba($color-accent, 1);
		padding: 0.3rem 0.6rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 500;
		border: 1px solid rgba($color-accent, 0.5);
		backdrop-filter: blur(5px);
		white-space: nowrap;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
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
