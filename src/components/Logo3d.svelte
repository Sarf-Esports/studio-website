<script lang="ts">
	import { Canvas, T } from "@threlte/core";
	import {
		ContactShadows,
		GLTF,
		Grid,
		OrbitControls
	} from "@threlte/extras";
</script>

<Canvas>
	<T.PerspectiveCamera makeDefault position={[-10, 90, 25]} fov={3}>
		<OrbitControls enableZoom enableDamping autoRotate={true} target.y={0.5} />
	</T.PerspectiveCamera>

	<Grid />

	<!-- <ContactShadows scale={10} blur={2} opacity={0.7} /> -->

	<GLTF
		url="/models/REVATI-Studio-3D-logo.glb"
		position={[0, 0.5, 0]}
		scale={10}
	/>
</Canvas>