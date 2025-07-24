<script lang="ts">
	interface Props {
		currentTime: number;
		duration: number;
	}
	const { currentTime, duration }: Props = $props();

	const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

<div class="mobile-progress-bar">
	<div class="progress-fill" style="width: {progress}%"></div>
</div>

<style lang="scss">
	.mobile-progress-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(54, 51, 51, 0.8);
		z-index: 1020;

		.progress-fill {
			height: 100%;
			background: #e16428;
			transition: width 0.1s ease;
			border-radius: 0 2px 2px 0;
		}
	}
</style>
