import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type CeramicFinish = 'basalt' | 'ivory' | 'copper';
export type LightingMood = 'dusk' | 'mist' | 'noir';

interface ThreeDSceneProps {
  scrollProgress?: number;
  reducedMotion?: boolean;
}

// Pre-allocated math helpers at module scope to prevent GC in render loop
const _targetPointer = new THREE.Vector2(0, 0);
const _currentPointer = new THREE.Vector2(0, 0);
const _bgParallaxOffset = new THREE.Vector2(0, 0);

function createStudioEnvironmentScene(): THREE.Scene {
  const envScene = new THREE.Scene();
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  const topLight = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color: 0xfff5e4 }),
  );
  topLight.position.set(0, 5, 0);
  topLight.scale.set(6, 0.2, 6);
  envScene.add(topLight);

  const warmSide = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color: 0xd88c5a }),
  );
  warmSide.position.set(5, 1, 2);
  warmSide.scale.set(0.2, 4, 4);
  envScene.add(warmSide);

  const coolSide = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color: 0x8ea398 }),
  );
  coolSide.position.set(-5, 1, -2);
  coolSide.scale.set(0.2, 4, 4);
  envScene.add(coolSide);

  return envScene;
}

function createLatteArtTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const cx = 256;
    const cy = 256;
    const grad = ctx.createRadialGradient(cx, cy, 12, cx, cy, 250);
    grad.addColorStop(0, '#DFB489');
    grad.addColorStop(0.5, '#A4663A');
    grad.addColorStop(0.85, '#5C3319');
    grad.addColorStop(1, '#32190A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Subtle crema micro-bubbles
    ctx.fillStyle = 'rgba(242, 235, 221, 0.14)';
    for (let i = 0; i < 160; i++) {
      const angle = (i * 137.5 * Math.PI) / 180;
      const dist = 40 + ((i * 19) % 195);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      ctx.beginPath();
      ctx.arc(x, y, 1 + (i % 2) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rosetta milk foam leaf motif
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#F6F0E6';
    for (let i = -3; i <= 3; i++) {
      const yOffset = i * 24;
      const spread = (4 - Math.abs(i)) * 22;
      ctx.beginPath();
      ctx.ellipse(-spread * 0.45, yOffset, spread, 12, -0.35, 0, Math.PI * 2);
      ctx.ellipse(spread * 0.45, yOffset, spread, 12, 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
    // Top heart crown
    ctx.beginPath();
    ctx.arc(-18, -96, 22, 0, Math.PI * 2);
    ctx.arc(18, -96, 22, 0, Math.PI * 2);
    ctx.moveTo(-38, -90);
    ctx.lineTo(0, -42);
    ctx.lineTo(38, -90);
    ctx.fill();

    // Central pull-through stem
    ctx.strokeStyle = '#7A4624';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -115);
    ctx.lineTo(0, 110);
    ctx.stroke();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createCeramicSpeckleTexture(
  baseHex: string,
  speckleHex: string,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = speckleHex;
    ctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 6) {
      ctx.globalAlpha = 0.04 + (y % 18) * 0.002;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.fillStyle = speckleHex;
    for (let i = 0; i < 420; i++) {
      const x = (((Math.sin(i * 12.9898) * 43758.5453) % 1) + 1) % 1 * 512;
      const y = (((Math.cos(i * 78.233) * 23421.631) % 1) + 1) % 1 * 512;
      const r = (i % 3) * 0.7 + 0.6;
      ctx.globalAlpha = 0.22 + (i % 5) * 0.06;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.32)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createGlowParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(250, 249, 246, 1)');
    grad.addColorStop(0.35, 'rgba(184, 117, 77, 0.65)');
    grad.addColorStop(1, 'rgba(184, 117, 77, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const ThreeDScene: React.FC<ThreeDSceneProps> = ({
  scrollProgress = 0,
  reducedMotion = false,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const [finish, setFinish] = useState<CeramicFinish>('basalt');
  const [mood, setMood] = useState<LightingMood>('dusk');
  const [explodedView, setExplodedView] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const stateRef = useRef({
    finish: 'basalt' as CeramicFinish,
    mood: 'dusk' as LightingMood,
    explodedView: false,
    scrollProgress: 0,
    reducedMotion: false,
    inViewport: true,
  });

  useEffect(() => {
    stateRef.current.finish = finish;
    stateRef.current.mood = mood;
    stateRef.current.explodedView = explodedView;
    stateRef.current.scrollProgress = scrollProgress;
    stateRef.current.reducedMotion = reducedMotion;
  }, [finish, mood, explodedView, scrollProgress, reducedMotion]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let isSoftwareGl = false;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      const gl = renderer.getContext();
      if (!gl) {
        setWebglSupported(false);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param) || '');
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglSupported(false);
      return;
    }

    let frameId = 0;
    let isDisposed = false;

    try {
      const width = container.clientWidth || 640;
      const height = container.clientHeight || 560;
      const isCompactScreen = width < 560;

      renderer.setSize(width, height);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, isCompactScreen ? 1.5 : 2),
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        setWebglSupported(false);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

      // 2. Scene, Camera & Studio RoomEnvironment
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(0, 1.48, isCompactScreen ? 7.0 : 6.15);
      camera.lookAt(0, 0.12, 0);

      let envTexture: THREE.Texture | null = null;
      try {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = createStudioEnvironmentScene();
        envTexture = pmremGenerator.fromScene(envScene, 0.04).texture;
        scene.environment = envTexture;
        pmremGenerator.dispose();
      } catch {
        // Fallback if PMREM fails on specific mobile/integrated GPUs
      }

      const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);

      // 3. Balanced Studio Lighting Rig + Pointer-Reactive Specular Highlight Light
      const hemiLight = new THREE.HemisphereLight(0xf2ebdd, 0x171918, 0.95);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xffdfc2, 2.65);
      keyLight.position.set(4.2, 6.5, 4.5);
      keyLight.castShadow = !isSoftwareGl;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 18;
      const d = 3.2;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
      scene.add(keyLight);

      const copperRimLight = new THREE.DirectionalLight(0xb8754d, 2.3);
      copperRimLight.position.set(-4.8, 3.2, -3.6);
      scene.add(copperRimLight);

      const fillLight = new THREE.DirectionalLight(0x9ab0a6, 0.85);
      fillLight.position.set(-3.2, -1.5, 3.5);
      scene.add(fillLight);

      const pointerSpecLight = new THREE.PointLight(0xf2ebdd, 1.35, 9, 1.6);
      pointerSpecLight.position.set(1.8, 2.6, 2.8);
      scene.add(pointerSpecLight);

      // 4. Procedural Textures & PBR Materials
      const basaltTex = createCeramicSpeckleTexture('#222423', '#111211', maxAnisotropy);
      const ivoryTex = createCeramicSpeckleTexture('#ECE4D4', '#B8AA96', maxAnisotropy);
      const copperTex = createCeramicSpeckleTexture('#7E492B', '#3E2212', maxAnisotropy);
      const latteTex = createLatteArtTexture(maxAnisotropy);
      const shadowTex = createContactShadowTexture();
      const particleTex = createGlowParticleTexture();

      const cupMaterial = new THREE.MeshPhysicalMaterial({
        map: basaltTex,
        roughness: 0.26,
        metalness: 0.08,
        clearcoat: 0.72,
        clearcoatRoughness: 0.18,
      });

      const saucerMaterial = new THREE.MeshStandardMaterial({
        map: basaltTex,
        roughness: 0.54,
        metalness: 0.06,
      });

      const copperAccentMat = new THREE.MeshPhysicalMaterial({
        color: 0xb8754d,
        roughness: 0.18,
        metalness: 0.94,
        clearcoat: 0.45,
      });

      const cremaMaterial = new THREE.MeshStandardMaterial({
        map: latteTex,
        roughness: 0.28,
        metalness: 0.03,
      });

      const beanMaterial = new THREE.MeshStandardMaterial({
        color: 0x3b2214,
        roughness: 0.38,
        metalness: 0.09,
      });

      // 5. Composite Hero Group with Multilayer Parallax Hierarchy
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      const coreCupParallaxGroup = new THREE.Group();
      rootGroup.add(coreCupParallaxGroup);

      // Part 1: Handcrafted Ceramic Cup Body (LatheGeometry)
      const cupPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.62, 0.0),
        new THREE.Vector2(0.68, 0.08),
        new THREE.Vector2(0.86, 0.35),
        new THREE.Vector2(1.02, 0.85),
        new THREE.Vector2(1.08, 1.32),
        new THREE.Vector2(1.04, 1.36),
        new THREE.Vector2(0.98, 1.32),
        new THREE.Vector2(0.91, 0.85),
        new THREE.Vector2(0.75, 0.35),
        new THREE.Vector2(0.55, 0.12),
        new THREE.Vector2(0.0, 0.12),
      ];
      const cupGeo = new THREE.LatheGeometry(cupPoints, 48);
      cupGeo.computeVertexNormals();
      const cupMesh = new THREE.Mesh(cupGeo, cupMaterial);
      cupMesh.castShadow = !isSoftwareGl;
      cupMesh.receiveShadow = !isSoftwareGl;

      // Part 2: Burnt Copper Rim Band on Cup Lip
      const rimBandGeo = new THREE.TorusGeometry(1.04, 0.032, 16, 48);
      rimBandGeo.rotateX(Math.PI / 2);
      const rimBandMesh = new THREE.Mesh(rimBandGeo, copperAccentMat);
      rimBandMesh.position.y = 1.34;

      // Part 3: Ergonomic Sculpted Cup Handle (TubeGeometry)
      const handleCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.98, 1.12, 0),
        new THREE.Vector3(1.42, 1.16, 0),
        new THREE.Vector3(1.52, 0.72, 0),
        new THREE.Vector3(1.28, 0.36, 0),
        new THREE.Vector3(0.82, 0.32, 0),
      ]);
      const handleGeo = new THREE.TubeGeometry(handleCurve, 32, 0.085, 16, false);
      const handleMesh = new THREE.Mesh(handleGeo, cupMaterial);
      handleMesh.castShadow = !isSoftwareGl;

      const cupAssembly = new THREE.Group();
      cupAssembly.add(cupMesh, rimBandMesh, handleMesh);
      coreCupParallaxGroup.add(cupAssembly);

      // Part 4: Espresso Crema & Rosetta Latte Art Surface
      const cremaGeo = new THREE.CircleGeometry(0.96, 48);
      cremaGeo.rotateX(-Math.PI / 2);
      const cremaMesh = new THREE.Mesh(cremaGeo, cremaMaterial);
      cremaMesh.position.y = 1.18;
      coreCupParallaxGroup.add(cremaMesh);

      // Part 5: Hand-Turned Volcanic Stone Saucer (LatheGeometry)
      const saucerPoints: THREE.Vector2[] = [
        new THREE.Vector2(0.0, -0.18),
        new THREE.Vector2(0.95, -0.18),
        new THREE.Vector2(1.12, -0.12),
        new THREE.Vector2(1.65, 0.02),
        new THREE.Vector2(1.74, 0.09),
        new THREE.Vector2(1.68, 0.13),
        new THREE.Vector2(1.55, 0.06),
        new THREE.Vector2(1.02, -0.06),
        new THREE.Vector2(0.68, -0.05),
        new THREE.Vector2(0.64, -0.08),
        new THREE.Vector2(0.0, -0.08),
      ];
      const saucerGeo = new THREE.LatheGeometry(saucerPoints, 48);
      saucerGeo.computeVertexNormals();
      const saucerMesh = new THREE.Mesh(saucerGeo, saucerMaterial);
      saucerMesh.receiveShadow = !isSoftwareGl;
      saucerMesh.castShadow = !isSoftwareGl;
      coreCupParallaxGroup.add(saucerMesh);

      // Part 6: Brushed Burnt-Copper Tasting Spoon on Saucer
      const spoonGroup = new THREE.Group();
      const spoonBowlGeo = new THREE.SphereGeometry(0.18, 24, 16);
      spoonBowlGeo.scale(1.35, 0.28, 0.85);
      const spoonBowl = new THREE.Mesh(spoonBowlGeo, copperAccentMat);
      const spoonStemGeo = new THREE.CylinderGeometry(0.022, 0.035, 1.15, 12);
      spoonStemGeo.rotateZ(Math.PI / 2);
      const spoonStem = new THREE.Mesh(spoonStemGeo, copperAccentMat);
      spoonStem.position.set(0.68, 0.02, 0);
      spoonGroup.add(spoonBowl, spoonStem);
      spoonGroup.position.set(-0.25, 0.02, 1.12);
      spoonGroup.rotation.y = 0.32;
      spoonGroup.rotation.z = 0.05;
      coreCupParallaxGroup.add(spoonGroup);

      // Part 7: Geometric Burnt Copper Orbital Rings
      const orbitRingsGroup = new THREE.Group();
      const outerRingGeo = new THREE.TorusGeometry(2.26, 0.012, 12, 96);
      const outerRing = new THREE.Mesh(outerRingGeo, copperAccentMat);
      outerRing.rotation.x = Math.PI * 0.42;
      outerRing.rotation.y = 0.22;

      const innerRingGeo = new THREE.TorusGeometry(1.88, 0.009, 12, 80);
      const innerRing = new THREE.Mesh(innerRingGeo, copperAccentMat);
      innerRing.rotation.x = -Math.PI * 0.36;
      innerRing.rotation.z = 0.4;

      orbitRingsGroup.add(outerRing, innerRing);
      orbitRingsGroup.position.y = 0.55;
      rootGroup.add(orbitRingsGroup);

      // Part 8: Orbiting Sculpted Coffee Beans
      const beansGroup = new THREE.Group();
      const beanItemGroups: {
        mesh: THREE.Group;
        radius: number;
        speed: number;
        angle: number;
        yOffset: number;
      }[] = [];

      const baseBeanShellGeo = new THREE.SphereGeometry(0.11, 18, 14);
      baseBeanShellGeo.scale(1.38, 0.78, 0.95);
      const creaseGeo = new THREE.BoxGeometry(0.26, 0.03, 0.03);
      const creaseMat = new THREE.MeshBasicMaterial({ color: 0x160c06 });

      for (let i = 0; i < 5; i++) {
        const singleBean = new THREE.Group();
        const shell = new THREE.Mesh(baseBeanShellGeo, beanMaterial);
        const crease = new THREE.Mesh(creaseGeo, creaseMat);
        crease.position.y = 0.065;
        singleBean.add(shell, crease);

        const angle = (i / 5) * Math.PI * 2;
        const radius = 1.95 + (i % 2) * 0.32;
        const yOffset = 0.35 + (i - 2) * 0.25;
        singleBean.position.set(
          Math.cos(angle) * radius,
          yOffset,
          Math.sin(angle) * radius,
        );
        singleBean.rotation.set(i * 0.7, i * 1.1, i * 0.4);
        beansGroup.add(singleBean);
        beanItemGroups.push({
          mesh: singleBean,
          radius,
          speed: 0.26 + i * 0.045,
          angle,
          yOffset,
        });
      }
      rootGroup.add(beansGroup);

      // Part 9: Volumetric-Style Rising Coffee Steam Ribbons
      const steamGroup = new THREE.Group();
      const steamRibbonMeshes: { mesh: THREE.Mesh; phase: number; baseOffset: number }[] = [];
      const steamBaseMat = new THREE.MeshBasicMaterial({
        color: 0xf2ebdd,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      });

      for (let s = 0; s < 4; s++) {
        const pts: THREE.Vector3[] = [];
        for (let j = 0; j <= 12; j++) {
          const t = j / 12;
          pts.push(
            new THREE.Vector3(
              Math.sin(t * Math.PI * 2 + s * 1.3) * 0.14 + (s - 1.5) * 0.16,
              1.32 + t * 1.55,
              Math.cos(t * Math.PI * 1.6 + s) * 0.11,
            ),
          );
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const ribbonGeo = new THREE.TubeGeometry(curve, 24, 0.042 * (1 - s * 0.12), 8, false);
        const ribbonMesh = new THREE.Mesh(ribbonGeo, steamBaseMat.clone());
        steamGroup.add(ribbonMesh);
        steamRibbonMeshes.push({
          mesh: ribbonMesh,
          phase: s * 1.6,
          baseOffset: (s - 1.5) * 0.06,
        });
      }
      coreCupParallaxGroup.add(steamGroup);

      // Part 10: Subtle Glowing Aroma Micro-Particles
      const particleCount = isSoftwareGl || isCompactScreen ? 10 : 18;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const theta = (i / particleCount) * Math.PI * 2;
        const r = 0.65 + (i % 5) * 0.36;
        particlePositions[i * 3] = Math.cos(theta) * r;
        particlePositions[i * 3 + 1] = 0.2 + (i % 7) * 0.32;
        particlePositions[i * 3 + 2] = Math.sin(theta) * r;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        map: particleTex,
        size: 0.16,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const aromaPoints = new THREE.Points(particleGeo, particleMat);
      rootGroup.add(aromaPoints);

      // Contact Shadow Grounding Plane
      const contactShadowGeo = new THREE.PlaneGeometry(4.4, 4.4);
      contactShadowGeo.rotateX(-Math.PI / 2);
      const contactShadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
      });
      const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
      contactShadow.position.y = -0.52;
      scene.add(contactShadow);

      rootGroup.position.set(0, -0.32, 0);
      rootGroup.rotation.set(0.14, -0.45, 0);

      // 6. Viewport IntersectionObserver to pause WebGL when off-screen
      let intersectionObserver: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== 'undefined' && wrapperRef.current) {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            if (entries[0]) {
              stateRef.current.inViewport = entries[0].isIntersecting;
            }
          },
          { threshold: 0.02 },
        );
        intersectionObserver.observe(wrapperRef.current);
      }

      // 7. Pointer Parallax Listener
      const handlePointerMove = (e: PointerEvent) => {
        if (stateRef.current.reducedMotion) return;
        const rect = container.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
        const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;
        _targetPointer.set(
          THREE.MathUtils.clamp(nx, -1, 1),
          THREE.MathUtils.clamp(ny, -1, 1),
        );
      };

      const handlePointerLeave = () => {
        _targetPointer.set(0, 0);
      };

      container.addEventListener('pointermove', handlePointerMove, { passive: true });
      container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

      // 8. Resize Handling
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || 640;
        const h = container.clientHeight || 560;
        camera.aspect = w / Math.max(h, 1);
        camera.position.z = w < 520 ? 7.05 : 6.15;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
      handleResize();

      // 9. Paced Animation Loop
      const clock = new THREE.Clock();
      let appliedFinish: CeramicFinish = 'basalt';
      let appliedMood: LightingMood = 'dusk';

      const activeRenderer = renderer;

      function afterDraw(cb: () => void) {
        if (isDisposed) return;
        frameId = window.setTimeout(cb, 80);
      }

      function tick() {
        if (isDisposed) return;

        if (!stateRef.current.inViewport) {
          frameId = window.setTimeout(tick, 180);
          return;
        }

        try {
          const delta = Math.min(clock.getDelta(), 0.1);
          const elapsed = clock.getElapsedTime();
          const {
            finish: curFinish,
            mood: curMood,
            explodedView: isExploded,
            scrollProgress: scrollProg,
            reducedMotion: isReduced,
          } = stateRef.current;

          if (curFinish !== appliedFinish) {
            appliedFinish = curFinish;
            if (curFinish === 'basalt') {
              cupMaterial.map = basaltTex;
              saucerMaterial.map = basaltTex;
              cupMaterial.roughness = 0.26;
              cupMaterial.metalness = 0.08;
            } else if (curFinish === 'ivory') {
              cupMaterial.map = ivoryTex;
              saucerMaterial.map = ivoryTex;
              cupMaterial.roughness = 0.18;
              cupMaterial.metalness = 0.04;
            } else {
              cupMaterial.map = copperTex;
              saucerMaterial.map = basaltTex;
              cupMaterial.roughness = 0.22;
              cupMaterial.metalness = 0.55;
            }
            cupMaterial.needsUpdate = true;
            saucerMaterial.needsUpdate = true;
          }

          if (curMood !== appliedMood) {
            appliedMood = curMood;
            if (curMood === 'dusk') {
              keyLight.color.setHex(0xffdfc2);
              keyLight.intensity = 2.65;
              copperRimLight.color.setHex(0xb8754d);
              copperRimLight.intensity = 2.3;
            } else if (curMood === 'mist') {
              keyLight.color.setHex(0xfaf9f6);
              keyLight.intensity = 2.95;
              copperRimLight.color.setHex(0x8fa89b);
              copperRimLight.intensity = 1.85;
            } else {
              keyLight.color.setHex(0xd99b6c);
              keyLight.intensity = 1.95;
              copperRimLight.color.setHex(0xb8754d);
              copperRimLight.intensity = 3.15;
            }
          }

          _currentPointer.x = THREE.MathUtils.damp(_currentPointer.x, _targetPointer.x, 4.2, delta);
          _currentPointer.y = THREE.MathUtils.damp(_currentPointer.y, _targetPointer.y, 4.2, delta);

          if (bgLayerRef.current && !isReduced) {
            _bgParallaxOffset.x = _currentPointer.x * -14;
            _bgParallaxOffset.y = _currentPointer.y * -10;
            bgLayerRef.current.style.transform = `translate3d(${_bgParallaxOffset.x.toFixed(1)}px, ${_bgParallaxOffset.y.toFixed(1)}px, 0)`;
          }

          pointerSpecLight.position.x = 1.8 + _currentPointer.x * 2.2;
          pointerSpecLight.position.y = 2.4 - _currentPointer.y * 1.4;

          const idleSpin = isReduced ? 0 : elapsed * 0.16;
          const floatY = isReduced ? 0 : Math.sin(elapsed * 1.35) * 0.065;

          rootGroup.position.y = THREE.MathUtils.damp(
            rootGroup.position.y,
            -0.32 + floatY - scrollProg * 0.28,
            5,
            delta,
          );
          rootGroup.rotation.x = 0.15 + _currentPointer.y * 0.18 + scrollProg * 0.24;
          rootGroup.rotation.y = -0.45 + idleSpin + _currentPointer.x * 0.34 + scrollProg * 0.68;

          coreCupParallaxGroup.position.x = _currentPointer.x * 0.08;
          coreCupParallaxGroup.rotation.z = -_currentPointer.x * 0.06;

          const targetCupY = isExploded ? 0.52 : 0.0;
          const targetCremaY = isExploded ? 2.05 : 1.18;
          const targetSaucerY = isExploded ? -0.45 : 0.0;
          const targetSpoonZ = isExploded ? 1.55 : 1.12;

          cupAssembly.position.y = THREE.MathUtils.damp(
            cupAssembly.position.y,
            targetCupY,
            5,
            delta,
          );
          cremaMesh.position.y = THREE.MathUtils.damp(
            cremaMesh.position.y,
            targetCremaY,
            5,
            delta,
          );
          saucerMesh.position.y = THREE.MathUtils.damp(
            saucerMesh.position.y,
            targetSaucerY,
            5,
            delta,
          );
          spoonGroup.position.z = THREE.MathUtils.damp(
            spoonGroup.position.z,
            targetSpoonZ,
            5,
            delta,
          );

          if (!isReduced) {
            cremaMesh.rotation.y = Math.sin(elapsed * 0.5) * 0.06;

            orbitRingsGroup.rotation.y = -elapsed * 0.12 + _currentPointer.x * 0.22;
            orbitRingsGroup.rotation.x = _currentPointer.y * 0.16;
            orbitRingsGroup.rotation.z = Math.sin(elapsed * 0.5) * 0.08;

            beansGroup.position.x = _currentPointer.x * -0.16;
            beansGroup.position.y = _currentPointer.y * 0.12;
            for (let i = 0; i < beanItemGroups.length; i++) {
              const b = beanItemGroups[i];
              const a = b.angle + elapsed * b.speed;
              const r = isExploded ? b.radius * 1.18 : b.radius;
              b.mesh.position.set(
                Math.cos(a) * r,
                b.yOffset + Math.sin(elapsed * 1.6 + i) * 0.09,
                Math.sin(a) * r,
              );
              b.mesh.rotation.x += delta * 0.42;
              b.mesh.rotation.y += delta * 0.55;
            }

            for (let s = 0; s < steamRibbonMeshes.length; s++) {
              const item = steamRibbonMeshes[s];
              const cycle = (elapsed * 0.24 + s * 0.25) % 1;
              item.mesh.position.x =
                item.baseOffset + Math.sin(elapsed * 1.7 + item.phase) * 0.05;
              item.mesh.position.y = cycle * 0.38;
              item.mesh.rotation.y = Math.sin(elapsed * 0.9 + item.phase) * 0.15;
              const mat = item.mesh.material as THREE.MeshBasicMaterial;
              mat.opacity = 0.06 + Math.sin(cycle * Math.PI) * 0.16;
            }

            const posAttr = particleGeo.getAttribute('position') as THREE.BufferAttribute;
            for (let i = 0; i < particleCount; i++) {
              let py = posAttr.getY(i) + delta * 0.18;
              if (py > 2.65) py = 0.15;
              posAttr.setY(i, py);
            }
            posAttr.needsUpdate = true;
            aromaPoints.rotation.y = elapsed * 0.08 + _currentPointer.x * -0.2;
          }

          activeRenderer.render(scene, camera);
        } catch {
          // Ignore transient frame render errors
        }

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      }

      tick();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        intersectionObserver?.disconnect();
        window.removeEventListener('resize', handleResize);
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerleave', handlePointerLeave);
        activeRenderer.domElement.removeEventListener('webglcontextlost', handleContextLost);

        scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const m = obj as THREE.Mesh;
            m.geometry?.dispose();
            if (Array.isArray(m.material)) {
              m.material.forEach((mat) => mat.dispose());
            } else {
              m.material?.dispose();
            }
          }
        });
        particleGeo.dispose();
        particleMat.dispose();
        basaltTex.dispose();
        ivoryTex.dispose();
        copperTex.dispose();
        latteTex.dispose();
        shadowTex.dispose();
        particleTex.dispose();
        envTexture?.dispose();
        activeRenderer.dispose();
      };
    } catch {
      setWebglSupported(false);
      return () => {
        isDisposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        renderer?.dispose();
      };
    }
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-full w-full select-none">
      {/* Multilayer Background Aura & Malang Highland Topographic Ring */}
      <div
        ref={bgLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-transform duration-150 ease-out will-change-transform"
      >
        <div className="h-[340px] w-[340px] rounded-full bg-[#B8754D]/14 blur-3xl sm:h-[440px] sm:w-[440px]" />
        <svg
          className="absolute h-[88%] w-[88%] max-w-[520px] text-[#F2EBDD]/[0.07]"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="185"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="4 6"
          />
          <circle cx="200" cy="200" r="145" stroke="currentColor" strokeWidth="0.75" />
          <circle
            cx="200"
            cy="200"
            r="105"
            stroke="#B8754D"
            strokeOpacity="0.22"
            strokeWidth="0.75"
          />
          <path
            d="M30 280 Q 110 235, 175 260 T 310 225 T 380 265"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* Dedicated Ref Container for WebGL Canvas */}
      {webglSupported ? (
        <div
          ref={canvasMountRef}
          className="relative z-10 h-[380px] w-full cursor-grab active:cursor-grabbing sm:h-[460px] lg:h-[560px]"
          aria-label="Visual 3D interaktif cangkir kopi keramik vulkanik khas Malang dengan orbit biji kopi"
          role="img"
        />
      ) : (
        /* Graceful Static 3D-Styled SVG Fallback if WebGL is unsupported */
        <div
          className="relative z-10 flex h-[380px] w-full flex-col items-center justify-center p-6 sm:h-[460px] lg:h-[560px]"
          role="img"
          aria-label="Ilustrasi cangkir kopi spesialti Malang"
        >
          <svg className="h-64 w-64 text-[#F2EBDD]" viewBox="0 0 240 240" fill="none">
            <ellipse
              cx="120"
              cy="182"
              rx="78"
              ry="18"
              fill="#232524"
              stroke="#B8754D"
              strokeWidth="1.5"
            />
            <path
              d="M68 96 H172 L158 164 C154 176 140 180 120 180 C100 180 86 176 82 164 Z"
              fill="#1E201F"
              stroke="#B8754D"
              strokeWidth="2"
            />
            <path
              d="M170 108 H188 C198 108 202 128 190 140 C182 148 168 148 162 148"
              stroke="#B8754D"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <ellipse
              cx="120"
              cy="96"
              rx="52"
              ry="12"
              fill="#8C5330"
              stroke="#F2EBDD"
              strokeWidth="1"
            />
            <path
              d="M104 72 Q96 52 108 36 M122 68 Q130 48 118 30 M138 74 Q146 56 134 40"
              stroke="#F2EBDD"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />
          </svg>
          <p className="mt-3 font-mono-tabular text-xs text-[#F2EBDD]/60">
            MODE VISUAL STATIS · WEBGL FALLBACK AKTIF
          </p>
        </div>
      )}

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div className="relative z-20 mx-auto flex max-w-md flex-col items-center px-4">
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="mb-1.5 inline-flex items-center gap-1.5 rounded-t-md border border-b-0 border-[#F2EBDD]/15 bg-[#171918] px-3 py-1 font-mono-tabular text-[11px] text-[#F2EBDD]/75 transition-colors hover:text-[#FAF9F6] focus-visible:outline-2 focus-visible:outline-[#B8754D]"
          aria-expanded={!dockCollapsed}
        >
          <span>{dockCollapsed ? '▴ Tampilkan Studio 3D' : '▾ Sembunyikan Kontrol 3D'}</span>
        </button>

        {!dockCollapsed && (
          <div className="flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border border-[#F2EBDD]/15 bg-[#1B1D1C] px-3.5 py-2.5 shadow-xl">
            {/* Material Finish Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-mono-tabular text-[10px] tracking-wider text-[#F2EBDD]/55 uppercase">
                Keramik:
              </span>
              {(
                [
                  { id: 'basalt', label: 'Basalt', hex: '#262826' },
                  { id: 'ivory', label: 'Ivory', hex: '#E8DFCE' },
                  { id: 'copper', label: 'Copper', hex: '#9E5B36' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFinish(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    finish === item.id
                      ? 'bg-[#B8754D] text-[#FAF9F6]'
                      : 'text-[#F2EBDD]/75 hover:bg-[#272A28] hover:text-[#FAF9F6]'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/25"
                    style={{ backgroundColor: item.hex }}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Lighting & Exploded View Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setMood((m) => (m === 'dusk' ? 'mist' : m === 'mist' ? 'noir' : 'dusk'))
                }
                className="rounded border border-[#F2EBDD]/15 bg-[#232624] px-2.5 py-1 text-xs font-medium text-[#F2EBDD]/85 whitespace-nowrap shrink-0 transition-colors hover:border-[#B8754D] hover:text-[#FAF9F6]"
                title="Ubah suasana pencahayaan studio 3D"
              >
                Cahaya: {mood === 'dusk' ? 'Senja' : mood === 'mist' ? 'Kabut Pagi' : 'Roastery'}
              </button>

              <button
                type="button"
                onClick={() => setExplodedView((v) => !v)}
                className={`rounded border px-2.5 py-1 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  explodedView
                    ? 'border-[#B8754D] bg-[#B8754D]/20 text-[#F2EBDD]'
                    : 'border-[#F2EBDD]/15 bg-[#232624] text-[#F2EBDD]/80 hover:text-[#FAF9F6]'
                }`}
              >
                {explodedView ? 'Satukan Objek' : 'Detail Lapisan'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
