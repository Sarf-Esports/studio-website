<script lang="ts">
	import { Canvas, T } from "@threlte/core";
	import {
		GLTF,
		OrbitControls
	} from "@threlte/extras";

	import { Vector3 } from "three";

	const LIGHT_POS = new Vector3(-1, 8, 20);
	const LIGHT_COL = 0xff8000;

	const GLTF_LIST = [
		'/models/REVATI-Studio-3D-logo.glb',
		'/models/Revati-kun.glb'
	];
</script>

<div class="logo-container">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 45]} fov={4.3}>
			<OrbitControls enableZoom enableDamping autoRotate target.y={0.5} />
		</T.PerspectiveCamera>

		<T.DirectionalLight
			position={LIGHT_POS.toArray()}
			intensity={25}
			color={LIGHT_COL}
		/>
		<T.DirectionalLight
			position={LIGHT_POS.negate().toArray()}
			intensity={3.5}
			color={LIGHT_COL}
		/>

		<GLTF
			url={GLTF_LIST[0]}
			position={[-0.25, 0.5, 0]}
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
