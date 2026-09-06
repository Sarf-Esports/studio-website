<script lang="ts">
	import { onMount } from 'svelte';
	import type { RebacchiScene } from './scene';

	let canvas: HTMLCanvasElement;
	let scene: RebacchiScene | undefined;
	let ready = $state(false);
	let paused = $state(false);
	let reducedMotion = $state(false);

	onMount(() => {
		let disposed = false;
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updatePreference = () => {
			reducedMotion = preference.matches;
			paused = preference.matches;
			scene?.setPaused(paused);
		};
		updatePreference();
		preference.addEventListener('change', updatePreference);
		// Keep the server-rendered poster visible while Three.js and the GLB load.
		void import('./scene')
			.then(({ createRebacchiScene }) => {
				if (disposed) return;
				scene = createRebacchiScene(
					canvas,
					() => {
						ready = true;
					},
					() => {
						ready = false;
					}
				);
				scene.setPaused(paused);
			})
			.catch(() => {
				ready = false;
			});
		return () => {
			disposed = true;
			preference.removeEventListener('change', updatePreference);
			scene?.dispose();
		};
	});

	function toggleMotion() {
		paused = !paused;
		scene?.setPaused(paused);
	}
</script>

<div class="rebacchi" class:ready>
	<div class="viewport">
		<img
			class="poster"
			src="/models/rebacchi-poster.svg"
			alt="白い体に笑った目、頭にしずくを浮かべた、ればっちくん"
			width="370"
			height="355"
			aria-hidden={ready}
		/>
		<canvas
			bind:this={canvas}
			class="canvas"
			role="group"
			aria-label="ればっちくんの3Dモデル。左右ドラッグ、左右の矢印キーで回転、Homeキーで正面に戻ります。"
			aria-hidden={!ready}
			tabindex={ready ? 0 : -1}
		></canvas>
	</div>
	<div class="scene-footer">
		<span class="character-name"><span class="dot"></span>ればっちくん</span>
		{#if ready}
			<div class="controls" role="group" aria-label="モデルの操作">
				<button onclick={() => scene?.turn(-1)} aria-label="左に回す" title="左に回す">←</button>
				<button class="reset" onclick={() => scene?.reset()} title="正面に戻す">正面へ</button>
				<button onclick={() => scene?.turn(1)} aria-label="右に回す" title="右に回す">→</button>
				{#if !reducedMotion}
					<button
						class="motion"
						onclick={toggleMotion}
						aria-label={paused ? 'アニメーションを再生' : 'アニメーションを一時停止'}
					>
						{#if paused}<span aria-hidden="true">▷</span>{:else}<span aria-hidden="true">Ⅱ</span
							>{/if}
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.rebacchi {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 380px;
	}
	.viewport {
		position: absolute;
		inset: 0 0 50px;
	}
	.poster {
		position: absolute;
		width: 73%;
		height: 80%;
		object-fit: contain;
		inset: 7% 13.5% auto;
		filter: drop-shadow(0 24px 24px #070b2860);
	}
	.canvas {
		display: block;
		width: 100%;
		height: 100%;
		opacity: 0;
		touch-action: pan-y;
		cursor: grab;
		border-radius: 12px;
		&:active {
			cursor: grabbing;
		}
	}
	.ready {
		.poster {
			visibility: hidden;
		}
		.canvas {
			opacity: 1;
		}
	}
	.scene-footer {
		position: absolute;
		inset: auto 28px 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		min-height: 44px;
	}
	.character-name {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		letter-spacing: 0.1em;
		white-space: nowrap;
		color: #bec5e1;
	}
	.dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #b2c6ff;
		box-shadow: 0 0 9px #7997ff;
	}
	.controls {
		display: flex;
		align-items: center;
	}
	button {
		min-width: 44px;
		min-height: 44px;
		padding: 0 8px;
		border: 0;
		border-radius: 50%;
		background: transparent;
		color: #c5ccea;
		font: inherit;
		font-size: 16px;
		cursor: pointer;
		transition: background 150ms ease;
		&:hover {
			background: #afbfff18;
		}
	}
	.reset {
		font-size: 10px;
		white-space: nowrap;
	}
	.motion {
		margin-left: 4px;
		border: 1px solid #a9b8f02b;
	}
	@include sp {
		.rebacchi {
			min-height: 350px;
		}
		.scene-footer {
			inset: auto 12px 10px;
		}
		.character-name {
			font-size: 10px;
			letter-spacing: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		button {
			transition: none;
		}
	}
</style>
