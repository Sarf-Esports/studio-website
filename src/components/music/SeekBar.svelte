<script lang="ts">
	import type { Track } from '../../types/music';

	interface Props {
		currentTime: number;
		duration: number;
		currentTrack: Track | null;
		onSeek: (time: number) => void;
	}
	const { currentTime, duration, currentTrack, onSeek }: Props = $props();

	function formatTime(seconds: number): string {
		if (!isFinite(seconds)) return '0:00';

		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleSeekInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const seekTime = (parseFloat(target.value) / 100) * duration;
		onSeek(seekTime);
	}

	const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div class="seek-container">
	<span class="time current-time">{formatTime(currentTime)}</span>
	<input
		type="range"
		class="seek-bar"
		class:disabled={!currentTrack}
		min="0"
		max="100"
		value={progress}
		oninput={handleSeekInput}
		aria-label="シークバー"
		disabled={!currentTrack}
		style="background: linear-gradient(to right, var(--seekbar-progress-color) 0%, var(--seekbar-progress-color) {progress}%, var(--seekbar-track-color) {progress}%, var(--seekbar-track-color) 100%)"
	/>
	<span class="time total-time">{formatTime(duration)}</span>
</div>

<style lang="scss">
	.seek-container {
		display: flex;
		align-items: center;
		gap: 12px;

		// CSS変数でシークバーのスタイルを一元管理
		--seekbar-height: 4px;
		--seekbar-track-color: rgba(246, 233, 233, 0.2);
		--seekbar-progress-color: #e16428;
		--seekbar-thumb-size: 12px;
		--seekbar-thumb-color: #e16428;
		--seekbar-border-radius: 2px;
		--seekbar-disabled-track-color: rgba(246, 233, 233, 0.1);
		--seekbar-disabled-thumb-color: rgba(246, 233, 233, 0.3);

		// モバイル用CSS変数
		@media (hover: none) and (pointer: coarse) {
			--seekbar-thumb-size: 16px;
		}

		.time {
			font-size: 12px;
			color: rgba(246, 233, 233, 0.7);
			min-width: 35px;
			text-align: center;
		}

		.seek-bar {
			flex: 1;
			height: var(--seekbar-height);
			border-radius: var(--seekbar-border-radius);
			outline: none;
			cursor: pointer;
			-webkit-appearance: none;
			appearance: none;

			// WebKit系ブラウザ（Chrome, Safari等）のトラック部分 - 透明にして背景を見せる
			&::-webkit-slider-track {
				height: var(--seekbar-height);
				background: transparent;
				border-radius: var(--seekbar-border-radius);
			}

			// WebKit系ブラウザの進行部分 - 透明にして背景を見せる
			&::-webkit-slider-runnable-track {
				height: var(--seekbar-height);
				background: transparent;
				border-radius: var(--seekbar-border-radius);
			}

			// Mozilla系ブラウザ（Firefox）のトラック部分
			&::-moz-range-track {
				height: var(--seekbar-height);
				background: var(--seekbar-track-color);
				border-radius: var(--seekbar-border-radius);
				border: none;
			}

			// Mozilla系ブラウザの進行部分
			&::-moz-range-progress {
				height: var(--seekbar-height);
				background: var(--seekbar-progress-color);
				border-radius: var(--seekbar-border-radius);
			}

			&::-webkit-slider-thumb {
				appearance: none;
				width: var(--seekbar-thumb-size);
				height: var(--seekbar-thumb-size);
				background: var(--seekbar-thumb-color);
				border-radius: 50%;
				cursor: pointer;
				margin-top: calc((var(--seekbar-height) - var(--seekbar-thumb-size)) / 2);

				// モバイルで当たり判定を大きくする（見た目は変えない）
				@media (hover: none) and (pointer: coarse) {
					// 透明なボーダーで当たり判定を拡大
					border: 2px solid transparent;
					background-clip: content-box;
				}
			}

			&::-moz-range-thumb {
				width: var(--seekbar-thumb-size);
				height: var(--seekbar-thumb-size);
				background: var(--seekbar-thumb-color);
				border-radius: 50%;
				border: none;
				cursor: pointer;

				// モバイルで当たり判定を大きくする（見た目は変えない）
				@media (hover: none) and (pointer: coarse) {
					// 透明なボーダーで当たり判定を拡大
					border: 2px solid transparent;
					background-clip: content-box;
				}
			}

			&.disabled {
				cursor: not-allowed;
				background: var(--seekbar-disabled-track-color);

				&::-webkit-slider-thumb,
				&::-moz-range-thumb {
					background: var(--seekbar-disabled-thumb-color);
				}
			}
		}
	}
</style>
