import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShaderMaterial,
  TorusGeometry,
  WebGLRenderer,
  type Material,
  type Object3D,
  type WebGLRenderTarget,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export interface RebacchiScene {
  dispose: () => void;
  setPaused: (paused: boolean) => void;
  turn: (direction: number) => void;
  reset: () => void;
}

function disposeObject(root: Object3D) {
  const materials = new Set<Material>();
  root.traverse((object) => {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      const list = Array.isArray(object.material)
        ? object.material
        : [object.material];
      for (const material of list) materials.add(material);
    }
  });
  for (const material of materials) material.dispose();
}

export function createRebacchiScene(
  canvas: HTMLCanvasElement,
  onReady: () => void,
  onError: () => void,
): RebacchiScene {
  const compact = window.matchMedia(
    "(max-width: 787px), (pointer: coarse)",
  ).matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, 0.1, 30);
  camera.position.set(0, 0.9, 7.5);
  camera.lookAt(0, 0.05, 0);
  const character = new Group();
  character.rotation.set(-0.06, -0.3, -0.06);
  scene.add(character);

  let environment: WebGLRenderTarget | null = null;
  let crest: Object3D | undefined;
  let disposed = false;
  let ready = false;
  let paused = reducedMotion.matches;
  let visible = true;
  let frame = 0;
  let lastFrame = 0;
  let lastRender = 0;
  let elapsed = 0;
  let azimuth = -0.3;
  let tilt = -0.06;
  let activePointer: number | null = null;
  let pointerX = 0;
  let pointerY = 0;
  let idleUntil = 0;
  const abort = new AbortController();

  // A small prefiltered studio environment, generated once. No HDR download.
  function createEnvironment() {
    const studio = new Scene();
    studio.background = new Color(0x4d536e);
    const softbox = (
      color: number,
      intensity: number,
      x: number,
      y: number,
      z: number,
      width: number,
      height: number,
    ) => {
      const panel = new Mesh(
        new PlaneGeometry(width, height),
        new MeshBasicMaterial({
          color: new Color(color).multiplyScalar(intensity),
          side: DoubleSide,
        }),
      );
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    };
    softbox(0xffffff, 5, -3, 4, 4, 4, 5);
    softbox(0x9cbbff, 4, 4, 1, 2, 1.5, 5);
    softbox(0x6d5cff, 3, -4, 0, -3, 3, 4);
    softbox(0xffd6ac, 2, 1, -3, 2, 5, 1);
    const generator = new PMREMGenerator(renderer);
    try {
      environment = generator.fromScene(studio, 0.06, 0.1, 30, { size: 128 });
      scene.environment = environment.texture;
      scene.environmentIntensity = 0.7;
    } finally {
      generator.dispose();
      disposeObject(studio);
    }
  }

  scene.add(new HemisphereLight(0xdde6ff, 0x25214e, 0.9));
  const key = new DirectionalLight(0xfff4e6, 2.6);
  key.position.set(-3, 5, 5);
  const rim = new DirectionalLight(0x8eacff, 4);
  rim.position.set(3, 1, -3);
  scene.add(key, rim);

  // Halo, floor light and soft contact shadow share a single transparent plane.
  const groundMaterial = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);
        float ring = (1.0 - smoothstep(0.003, 0.012, abs(r - 0.73))) * 0.42;
        float inner = (1.0 - smoothstep(0.002, 0.005, abs(r - 0.61))) * 0.16;
        float glow = exp(-r * r * 4.8) * 0.24;
        float shadow = exp(-dot(p * vec2(1.1, 1.8), p * vec2(1.1, 1.8)) * 12.0) * 0.7;
        float angle = atan(p.y, p.x);
        float sweep = pow(max(0.0, cos(angle - uTime * 0.35)), 18.0);
        float light = ring * (0.4 + sweep) + inner + glow;
        vec3 ringColor = mix(vec3(0.25, 0.30, 0.75), vec3(0.64, 0.77, 1.0), sweep);
        vec3 radiance = ringColor * ring * (0.4 + sweep) + vec3(0.25, 0.30, 0.75) * (inner + glow);
        gl_FragColor = vec4(radiance / max(light + shadow, 0.001), min(0.85, light + shadow));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
  const ground = new Mesh(new PlaneGeometry(4.9, 4.9), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  scene.add(ground);

  // A broken fine orbit gives depth cues without obscuring the face.
  const orbit = new Group();
  const orbitMaterial = new MeshBasicMaterial({
    color: 0x8b9de9,
    transparent: true,
    opacity: 0.24,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const arc = new Mesh(
    new TorusGeometry(2.15, 0.006, 4, 100, Math.PI * 1.38),
    orbitMaterial,
  );
  orbit.add(arc);
  orbit.rotation.set(0.48, -0.45, -0.3);
  orbit.position.z = -0.5;
  scene.add(orbit);
  const stars = new Group();
  const starGeometry = new BoxGeometry(0.035, 0.035, 0.035);
  const starMaterial = new MeshBasicMaterial({ color: 0xc7d5ff });
  for (const [x, y, z, scale] of [
    [-1.85, 1.13, -0.1, 1],
    [1.7, 0.9, 0.2, 0.6],
    [1.95, -0.63, -0.4, 1.25],
    [-1.6, -0.8, 0.5, 0.55],
  ]) {
    const star = new Mesh(starGeometry, starMaterial);
    star.position.set(x, y, z);
    star.scale.setScalar(scale);
    star.rotation.set(0.5, 0.4, Math.PI / 4);
    stars.add(star);
  }
  scene.add(stars);

  function render() {
    if (disposed || !ready) return;
    character.rotation.y = azimuth;
    character.rotation.x = tilt;
    renderer.render(scene, camera);
  }

  function canAnimate() {
    return (
      ready &&
      !disposed &&
      visible &&
      !document.hidden &&
      !paused &&
      !reducedMotion.matches
    );
  }

  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) return;
    frame = requestAnimationFrame(tick);
    const interval = 1000 / (compact ? 30 : 60);
    if (now - lastFrame < interval) return;
    const delta = Math.min((now - lastRender) / 1000, 0.05);
    lastRender = now;
    // Preserve the fractional frame interval so 30fps does not drift toward 20fps.
    lastFrame = now - ((now - lastFrame) % interval);
    elapsed += delta;
    if (activePointer === null && idleUntil < now) {
      // Linger near the smiling front, then reveal the metal edge and rear.
      azimuth += delta * (0.13 + 0.36 * (1 - Math.cos(azimuth)));
    }
    character.position.y = Math.sin(elapsed * 1.25) * 0.065;
    character.rotation.z = -0.06 + Math.sin(elapsed * 0.65) * 0.025;
    if (crest !== undefined)
      crest.position.y = Math.sin(elapsed * 1.25 + 0.55) * 0.035;
    orbit.rotation.z = -0.3 + Math.sin(elapsed * 0.18) * 0.1;
    stars.rotation.y = Math.sin(elapsed * 0.2) * 0.1;
    groundMaterial.uniforms.uTime.value = elapsed;
    render();
  }

  function syncAnimation() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastFrame = performance.now();
    lastRender = lastFrame;
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (width <= 0 || height <= 0 || disposed) return;
    const pixelBudget = compact ? 600_000 : 1_500_000;
    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        compact ? 1.5 : 2,
        Math.sqrt(pixelBudget / (width * height)),
      ),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = Math.max(7.5, 6.8 / camera.aspect);
    camera.updateProjectionMatrix();
    render();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  intersectionObserver.observe(canvas);
  document.addEventListener("visibilitychange", syncAnimation);
  reducedMotion.addEventListener("change", syncAnimation);

  function pointerDown(event: PointerEvent) {
    if (
      !ready ||
      !event.isPrimary ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    activePointer = event.pointerId;
    pointerX = event.clientX;
    pointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent) {
    if (activePointer !== event.pointerId) return;
    azimuth += (event.clientX - pointerX) * 0.009;
    tilt = Math.max(
      -0.35,
      Math.min(0.35, tilt + (event.clientY - pointerY) * 0.003),
    );
    pointerX = event.clientX;
    pointerY = event.clientY;
    render();
  }
  function pointerUp(event: PointerEvent) {
    if (activePointer !== event.pointerId) return;
    activePointer = null;
    idleUntil = performance.now() + 2500;
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  }
  function turn(direction: number) {
    azimuth += (direction * Math.PI) / 8;
    idleUntil = performance.now() + 2500;
    render();
  }
  function reset() {
    azimuth = -0.3;
    tilt = -0.06;
    idleUntil = performance.now() + 2500;
    render();
  }
  function keyDown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      turn(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      reset();
    }
  }
  function contextLost(event: Event) {
    event.preventDefault();
    dispose();
    onError();
  }
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointermove", pointerMove);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerUp);
  canvas.addEventListener("lostpointercapture", pointerUp);
  canvas.addEventListener("keydown", keyDown);
  canvas.addEventListener("webglcontextlost", contextLost);

  function dispose() {
    if (disposed) return;
    disposed = true;
    abort.abort();
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", syncAnimation);
    reducedMotion.removeEventListener("change", syncAnimation);
    canvas.removeEventListener("pointerdown", pointerDown);
    canvas.removeEventListener("pointermove", pointerMove);
    canvas.removeEventListener("pointerup", pointerUp);
    canvas.removeEventListener("pointercancel", pointerUp);
    canvas.removeEventListener("lostpointercapture", pointerUp);
    canvas.removeEventListener("keydown", keyDown);
    canvas.removeEventListener("webglcontextlost", contextLost);
    disposeObject(scene);
    environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  async function load() {
    try {
      resize();
      const response = await fetch("/models/rebacchi-porcelain.glb", {
        signal: abort.signal,
      });
      if (!response.ok) throw new Error(`Model response: ${response.status}`);
      const data = await response.arrayBuffer();
      if (disposed) return;
      const gltf = await new GLTFLoader().parseAsync(data, "");
      if (disposed) {
        disposeObject(gltf.scene);
        return;
      }
      character.add(gltf.scene);
      crest = gltf.scene.getObjectByName("Crest");
      createEnvironment();
      ready = true;
      render();
      onReady();
      syncAnimation();
    } catch (error) {
      if (disposed) return;
      console.warn("Rebacchi: using the static illustration.", error);
      dispose();
      onError();
    }
  }
  void load();

  return {
    dispose,
    turn,
    reset,
    setPaused(value: boolean) {
      paused = value;
      syncAnimation();
    },
  };
}
