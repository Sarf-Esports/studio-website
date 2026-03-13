<script lang="ts">
	import Audio from './Audio.svelte';
	import type { Asset, ImageSource } from '../../types';
	import { getYouTubeEmbedUrl } from '../../utils';
	import ExternalLinkIcon from '../icons/ExternalLinkIcon.svelte';

	interface Props {
		asset: Asset;
	}

	let { asset }: Props = $props();

	const TWEET_EMBED_DELAY = 300;

	function getImgUrlFromSrc(src: ImageSource) {
		return typeof src === 'string' ? src : src.src;
	}

	function getAssetUrl(asset: Asset): string {
		if (asset.type === 'image') {
			return getImgUrlFromSrc(asset.src);
		}
		if (asset.type === 'video' || asset.type === 'music') {
			return asset.src;
		}
		if (asset.type === 'website' || asset.type === 'external') {
			return asset.url;
		}
		if (asset.type === 'tweet') {
			return asset.tweetUrl;
		}
		return '';
	}

	let twitterScriptLoaded = $state(false);
	let twitterWidgets: any = $state(null);

	function loadTwitterScript() {
		if (twitterScriptLoaded || typeof window === 'undefined') return Promise.resolve();

		return new Promise<void>((resolve) => {
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://platform.twitter.com/widgets.js';
			script.onload = () => {
				twitterScriptLoaded = true;
				twitterWidgets = (window as any).twttr;
				resolve();
			};
			script.onerror = () => {
				console.error('Failed to load Twitter widgets script');
				resolve();
			};
			document.head.appendChild(script);
		});
	}

	function extractTweetId(url: string): string | null {
		const match = url.match(/\/status\/(\d+)/);
		return match ? match[1] : null;
	}

	async function createTweetEmbed(element: HTMLElement, tweetUrl: string) {
		if (!twitterWidgets) {
			await loadTwitterScript();
			if (!twitterWidgets) return;
		}

		const tweetId = extractTweetId(tweetUrl);
		if (!tweetId) return;

		element.innerHTML = '';

		try {
			await twitterWidgets.widgets.createTweet(tweetId, element, {
				theme: 'dark',
				conversation: 'none',
				cards: 'visible',
				align: 'center',
				width: '100%'
			});
		} catch (error) {
			console.error('Failed to create tweet embed:', error);
			element.innerHTML = `<a href="${tweetUrl}" target="_blank" rel="noopener noreferrer" style="color: #1da1f2; text-decoration: none; display: block; text-align: center; padding: 2rem;">ツイートを見る</a>`;
		}
	}

	function createTweetEmbedAction(element: HTMLElement, tweetUrl: string) {
		// モーダルが完全に開かれてから実行
		let timeoutId = setTimeout(async () => {
			await createTweetEmbed(element, tweetUrl);
		}, TWEET_EMBED_DELAY);

		return {
			update(newTweetUrl: string) {
				if (newTweetUrl !== tweetUrl) {
					clearTimeout(timeoutId);
					timeoutId = setTimeout(async () => {
						await createTweetEmbed(element, newTweetUrl);
					}, TWEET_EMBED_DELAY);
				}
			},
			destroy() {
				clearTimeout(timeoutId);
			}
		};
	}
</script>

<div class="asset-item">
	{#if asset.type === 'image'}
		<div class="asset-image">
			<div class="asset-header">
				<span class="asset-type-chip image">Image</span>
			</div>
			<img src={getAssetUrl(asset)} alt={asset.caption} />
			{#if asset.caption}
				<p class="asset-caption">{asset.caption}</p>
			{/if}
		</div>
	{:else if asset.type === 'video'}
		<div class="asset-video">
			<div class="asset-header">
				<span class="asset-type-chip video">Video</span>
				<h4 class="asset-title">{asset.title}</h4>
			</div>
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
			<div class="asset-header">
				<span class="asset-type-chip music">Music</span>
				<h4 class="asset-title">{asset.title}</h4>
			</div>
			<Audio src={asset.src} title={asset.title} />
		</div>
	{:else if asset.type === 'website'}
		<div class="asset-website">
			<div class="asset-header">
				<span class="asset-type-chip website">Website</span>
				<h4 class="asset-title">{asset.title}</h4>
			</div>
			{#if asset.thumbnail !== undefined}
				<img src={getImgUrlFromSrc(asset.thumbnail)} alt="" />
			{/if}
			<a href={asset.url} target="_blank" rel="noopener noreferrer" class="asset-link">
				サイトを見る
				<ExternalLinkIcon />
			</a>
		</div>
	{:else if asset.type === 'external'}
		<div class="asset-external">
			<div class="asset-header">
				<span class="asset-type-chip external">External</span>
			</div>
			<a href={asset.url} target="_blank" rel="noopener noreferrer" class="asset-link">
				{asset.title ?? '外部リンク'}
				<ExternalLinkIcon />
			</a>
		</div>
	{:else if asset.type === 'tweet'}
		<div class="asset-tweet">
			<div class="asset-header">
				<span class="asset-type-chip tweet">Tweet</span>
			</div>
			<div class="tweet-embed-container" use:createTweetEmbedAction={asset.tweetUrl}>
				<!-- Twitter埋め込みがここに表示される -->
				<div class="tweet-loading">
					<p>ツイートを読み込み中...</p>
					<a href={asset.tweetUrl} target="_blank" rel="noopener noreferrer"> ツイートを見る </a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	$color-status-image: #10b981;
	$color-status-video: #f59e0b;
	$color-status-music: #8b5cf6;
	$color-status-website: #3b82f6;
	$color-status-external: #6b7280;
	$color-status-external-text: #9ca3af;
	$color-status-tweet: #1da1f2;

	.asset-item {
		background: rgba(white, 0.02);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid rgba(white, 0.05);
	}

	.asset-title {
		font-size: 1rem;
		font-weight: 900;
		color: white;
		margin: 0;
	}

	.asset-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.asset-type-chip {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.2;

		&.image {
			background: rgba($color-status-image, 0.2);
			color: $color-status-image;
			border: 1px solid rgba($color-status-image, 0.3);
		}

		&.video {
			background: rgba($color-status-video, 0.2);
			color: $color-status-video;
			border: 1px solid rgba($color-status-video, 0.3);
		}

		&.music {
			background: rgba($color-status-music, 0.2);
			color: $color-status-music;
			border: 1px solid rgba($color-status-music, 0.3);
		}

		&.website {
			background: rgba($color-status-website, 0.2);
			color: $color-status-website;
			border: 1px solid rgba($color-status-website, 0.3);
		}

		&.external {
			background: rgba($color-status-external, 0.2);
			color: $color-status-external-text;
			border: 1px solid rgba($color-status-external, 0.3);
		}

		&.tweet {
			background: rgba($color-status-tweet, 0.2);
			color: $color-status-tweet;
			border: 1px solid rgba($color-status-tweet, 0.3);
		}
	}

	.asset-image,
	.asset-website {
		img {
			width: 100%;
			height: auto;
			border-radius: 8px;
			margin-bottom: 0.75rem;
		}
	}

	.asset-caption {
		font-size: 0.8rem;
		color: rgba(white, 0.5);
		margin: 0;
		line-height: 1.3;
		text-align: center;
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

	.asset-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: rgba($color-accent, 0.9);
		text-decoration: none;
		font-weight: 400;
		padding: 0.5rem 1rem;
		border: 1px solid rgba($color-accent, 0.3);
		border-radius: 6px;
		transition: all 0.2s ease;

		&:hover {
			background: rgba($color-accent, 0.1);
			border-color: rgba($color-accent, 0.5);
		}
	}

	.asset-tweet {
		.tweet-embed-container {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			min-height: 200px;
			text-align: center;

			:global(.twitter-tweet) {
				margin: 0 auto !important;
				max-width: 550px !important;
				width: 100% !important;
				border-radius: 12px !important;
			}

			.tweet-loading {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.75rem;
				color: rgba(white, 0.6);

				p {
					margin: 0;
					font-size: 0.9rem;
				}

				a {
					color: $color-status-tweet;
					text-decoration: none;
					font-size: 0.9rem;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
	}

	@media (max-width: 768px) {
		.asset-title {
			font-size: 0.9rem;
		}

		.asset-header {
			gap: 0.5rem;
			margin-bottom: 0.75rem;
		}

		.asset-type-chip {
			font-size: 0.65rem;
			padding: 0.2rem 0.6rem;
		}

		.asset-caption {
			font-size: 0.7rem;
			line-height: 1;
		}

		.asset-item {
			padding: 1rem;
		}

		.asset-tweet {
			.tweet-embed-container {
				min-height: 150px;

				.tweet-loading {
					font-size: 0.8rem;
				}

				:global(.twitter-tweet) {
					max-width: 100% !important;
					width: 100% !important;
				}
			}
		}
	}

	@media (max-width: 480px) {
		.asset-tweet {
			.tweet-embed-container {
				min-height: 120px;

				.tweet-loading {
					font-size: 0.75rem;
				}

				:global(.twitter-tweet) {
					max-width: 100% !important;
					width: 100% !important;
				}
			}
		}
	}
</style>
