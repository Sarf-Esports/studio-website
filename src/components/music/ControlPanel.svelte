<script lang="ts">
	import type { Track } from '../../types/music';
	import TrackInfo from './TrackInfo.svelte';
	import PlaybackControls from './PlaybackControls.svelte';
	import SeekBar from './SeekBar.svelte';
	import MinimizeButton from './MinimizeButton.svelte';
	import MobileProgressBar from './MobileProgressBar.svelte';

	interface Props {
		currentTrack: Track | null;
		isMobile: boolean;
		isPlaying: boolean;
		currentTime: number;
		duration: number;
		onTogglePlay: () => void;
		onNext: () => void;
		onPrev: () => void;
		onSeek: (time: number) => void;
	}
	const {
		currentTrack,
		isMobile,
		isPlaying,
		currentTime,
		duration,
		onTogglePlay,
		onNext,
		onPrev,
		onSeek
	}: Props = $props();

	let isMinimized = $state(false);
	let isMobileExpanded = $state(false);

	function handleMinimize() {
		isMinimized = !isMinimized;
	}

	function handleMobileExpand() {
		isMobileExpanded = !isMobileExpanded;
		// console.log("Mobile panel state:", isMobileExpanded);

		// CSS変数で状態をグローバルに設定
		if (typeof document !== 'undefined') {
			document.documentElement.style.setProperty('--mobile-expanded', isMobileExpanded ? '1' : '0');

			// WaveVisualizerにリサイズを通知するカスタムイベントを発火
			const resizeEvent = new CustomEvent('wave-display-resize', {
				detail: { type: 'mobile-panel', expanded: isMobileExpanded, isMobile }
			});
			document.dispatchEvent(resizeEvent);
		}
	}
</script>

<!-- 最小化解除ボタン -->
{#if !isMobile && isMinimized}
	<MinimizeButton {isMinimized} onclick={handleMinimize} />
{/if}

{#if isMobile || !isMinimized}
	<div
		class="control-panel {isMobile ? 'mobile' : 'desktop'}"
		class:expanded={isMobile && isMobileExpanded}
		onclick={isMobile && !isMobileExpanded ? handleMobileExpand : undefined}
		onkeydown={(e) => e.key === 'Enter' && isMobile && !isMobileExpanded && handleMobileExpand()}
		tabindex="-1"
		role={isMobile && !isMobileExpanded ? 'button' : undefined}
		aria-label={isMobile && !isMobileExpanded ? 'expand control panel' : undefined}
		aria-expanded={isMobile ? isMobileExpanded : undefined}
	>
		<!-- 最小化ボタン(ControlPanelの中) -->
		{#if !isMobile && !isMinimized}
			<MinimizeButton {isMinimized} onclick={handleMinimize} />
		{/if}

		<!-- モバイル展開時の閉じるボタン -->
		{#if isMobile && isMobileExpanded}
			<button
				class="close-button"
				onclick={(e) => {
					e.stopPropagation();
					handleMobileExpand();
				}}
				aria-label="close expanded panel"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="currentColor"
					class="bi bi-chevron-down"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
					/>
				</svg>
			</button>
		{/if}

		<TrackInfo {currentTrack} {isMobile} {isMobileExpanded} />

		<PlaybackControls
			{currentTrack}
			{isPlaying}
			{isMobile}
			{isMobileExpanded}
			{onTogglePlay}
			{onNext}
			{onPrev}
		/>

		{#if !isMobile || isMobileExpanded}
			<SeekBar {currentTime} {duration} {currentTrack} {onSeek} />
		{/if}
	</div>
{/if}

{#if currentTrack && isMobile && !isMobileExpanded}
	<MobileProgressBar {currentTime} {duration} />
{/if}

<style lang="scss">
	.control-panel {
		background: rgba(38, 36, 36, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 24px;
		color: #f6e9e9;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		border: 1px solid rgba(225, 100, 40, 0.3);
		transition: all 0.3s ease;

		&.desktop {
			position: fixed;
			bottom: 20px;
			right: 20px;
			width: 360px;
			pointer-events: auto;
		}

		&.mobile {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 75px;
			max-height: 75px;
			pointer-events: auto;
			border-radius: 0;
			padding: 4px 16px;
			display: flex;
			align-items: center;
			gap: 12px;
			box-sizing: border-box;
			cursor: pointer;

			&.expanded {
				height: auto;
				max-height: none;
				padding: 24px 12px;
				border-radius: 12px 12px 0 0;
				flex-direction: column;
				align-items: stretch;
				cursor: default;
			}
		}
	}

	.close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		background: rgba(246, 233, 233, 0.1);
		border: 1px solid rgba(246, 233, 233, 0.2);
		color: rgba(246, 233, 233, 0.8);
		cursor: pointer;
		padding: 6px;
		border-radius: 6px;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		z-index: 1010;

		&:hover {
			color: #f6e9e9;
			background: rgba(246, 233, 233, 0.15);
			border-color: rgba(246, 233, 233, 0.3);
			transform: scale(1.05);
		}

		&:active {
			transform: scale(0.95);
		}

		svg {
			width: 20px;
			height: 20px;
		}
	}
</style>
