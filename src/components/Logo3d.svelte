<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { GLTF, OrbitControls } from '@threlte/extras';

	import { Vector3 } from 'three';

	export let modelUrl = '/models/REVATI-Studio-3D-logo.glb';
	export let positionY = 0.5;
	export let cameraFov = 4.3;
	export let lightColor = 0xff8000;
	export let autoRotateSpeed = 2.0;

	const LIGHT_POS = new Vector3(-1, 8, 20);
</script>

<div class="logo-container">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 45]} fov={cameraFov}>
			<OrbitControls enableZoom enableDamping autoRotate {autoRotateSpeed} target.y={0.5} />
		</T.PerspectiveCamera>

		<T.DirectionalLight position={LIGHT_POS.toArray()} intensity={25} color={lightColor} />
		<T.DirectionalLight
			position={LIGHT_POS.negate().toArray()}
			intensity={3.5}
			color={lightColor}
		/>

		<GLTF
			url={modelUrl}
			position={[-0.25, positionY, 0]}
			scale={10}
			rotation={[Math.PI * 0.5, 0, 0]}
		/>
	</Canvas>
</div>

<style lang="scss">
	.logo-container {
		width: 100%;
		height: 100%;
	}
</style>
