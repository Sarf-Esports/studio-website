<script lang="ts">
	import { Canvas, T } from "@threlte/core";
	import {
		ContactShadows,
		GLTF,
		OrbitControls
	} from "@threlte/extras";
</script>

<div class="logo-container">
	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 0, 45]} fov={4.3}>
			<OrbitControls enableZoom enableDamping autoRotate target.y={0.5} />
		</T.PerspectiveCamera>

		<ContactShadows scale={10} blur={2} opacity={0.7} />

		<GLTF
			url="/models/REVATI-Studio-3D-logo.glb"
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
