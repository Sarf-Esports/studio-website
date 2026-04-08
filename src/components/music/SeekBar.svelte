<script lang="ts">
	import Slider, { type SliderStyles } from './Slider.svelte';
	import type { Track } from '../../types/music';

	interface Props {
		currentTime: number;
		duration: number;
		currentTrack: Track | null;
		onSeek: (time: number) => void;
		styles?: SliderStyles;
	}
	const { currentTime, duration, currentTrack, onSeek, styles }: Props = $props();

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

	let progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div class="seek-container">
	<span class="time current-time">{formatTime(currentTime)}</span>
	<div class="slider-wrapper">
		<Slider
			value={progress}
			min={0}
			max={100}
			disabled={!currentTrack}
			oninput={handleSeekInput}
			ariaLabel="シークバー"
			{styles}
		/>
	</div>
	<span class="time total-time">{formatTime(duration)}</span>
</div>

<style lang="scss">
	.seek-container {
		display: flex;
		align-items: center;
		gap: 12px;

		.time {
			font-family: var(--font-montserrat), sans-serif;
			font-size: 12px;
			color: rgba($color-background, 0.7);
			min-width: 35px;
			text-align: center;
		}

		.slider-wrapper {
			flex: 1;
			display: flex;
			align-items: center;
		}
	}
</style>
