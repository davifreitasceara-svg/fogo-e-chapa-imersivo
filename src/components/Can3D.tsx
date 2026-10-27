import React, { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

interface Can3DProps {
  drink: {
    name: string;
    color: string;
    logoText: string;
    subTitle: string;
    description: string;
    icon: string;
  }
  isCenter?: boolean;
  index?: number;
}

// Cache global de texturas 2D dos rótulos (geradas 1x com 0ms overhead durante o runtime)
const labelTextureCache = new Map<string, THREE.CanvasTexture>();

export function getCanLabelTexture(drink: any): THREE.CanvasTexture {
  if (labelTextureCache.has(drink.id)) {
    return labelTextureCache.get(drink.id)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Cor de fundo sólida da fruta/lata
  ctx.fillStyle = drink.color;
  ctx.fillRect(0, 0, 2048, 1024);

  // 2. Frisos metálicos sutis no topo
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
  ctx.fillRect(0, 0, 2048, 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.fillRect(0, 8, 2048, 6);

  const cx = 975; // Ponto focal frontal correspondente ao centro visível do cilindro 3D

  // 3. Bolhas cintilantes de condensação/refrigerante
  const bubbleDots = [
    { x: cx + 390, y: 220, r: 16, a: 0.75 },
    { x: cx + 450, y: 290, r: 11, a: 0.60 },
    { x: cx + 330, y: 390, r: 8, a: 0.50 },
    { x: cx - 410, y: 320, r: 12, a: 0.45 },
    { x: cx - 360, y: 410, r: 9, a: 0.40 },
  ];
  bubbleDots.forEach(b => {
    ctx.fillStyle = `rgba(253, 245, 230, ${b.a})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Ícone estilizado da fruta
  const iconY = 270;
  ctx.save();
  ctx.translate(cx, iconY);

  if (drink.icon === '🍓') {
    // Morango
    ctx.rotate(0.25);
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.ellipse(0, 0, 130, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#B91C1C';
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 140, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#B91C1C';
    [-45, -15, 18, 52].forEach(y => {
      const halfW = 85 - Math.abs(y) * 0.45;
      ctx.beginPath();
      ctx.roundRect(-halfW, y - 5, halfW * 2, 10, 5);
      ctx.fill();
    });

    ctx.rotate(-0.55);
    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(0, -170);
    ctx.lineTo(-45, -115);
    ctx.lineTo(45, -115);
    ctx.closePath();
    ctx.fill();
  } else if (drink.icon === '🥭') {
    // Manga
    ctx.rotate(0.25);
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.ellipse(0, 0, 130, 150, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#E65100';
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 140, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#E65100';
    [-45, -15, 18, 52].forEach(y => {
      const halfW = 85 - Math.abs(y) * 0.45;
      ctx.beginPath();
      ctx.roundRect(-halfW, y - 5, halfW * 2, 10, 5);
      ctx.fill();
    });

    ctx.rotate(-0.55);
    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(0, -170);
    ctx.lineTo(-40, -120);
    ctx.lineTo(40, -120);
    ctx.closePath();
    ctx.fill();
  } else if (drink.icon === '🍋') {
    // Limão
    ctx.rotate(-0.2);
    ctx.fillStyle = '#FFEB3B';
    ctx.beginPath();
    ctx.arc(0, 0, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#FBC02D';
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FBC02D';
    [-45, -15, 18, 52].forEach(y => {
      const halfW = 85 - Math.abs(y) * 0.45;
      ctx.beginPath();
      ctx.roundRect(-halfW, y - 5, halfW * 2, 10, 5);
      ctx.fill();
    });

    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(40, -140);
    ctx.lineTo(10, -100);
    ctx.lineTo(70, -100);
    ctx.closePath();
    ctx.fill();
  } else if (drink.icon === '🍊') {
    // Laranja
    ctx.rotate(0.1);
    ctx.fillStyle = '#FF9800';
    ctx.beginPath();
    ctx.arc(0, 0, 130, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#E65100';
    ctx.beginPath();
    ctx.arc(0, 0, 120, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#E65100';
    [-45, -15, 18, 52].forEach(y => {
      const halfW = 85 - Math.abs(y) * 0.45;
      ctx.beginPath();
      ctx.roundRect(-halfW, y - 5, halfW * 2, 10, 5);
      ctx.fill();
    });

    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(-30, -140);
    ctx.lineTo(-60, -100);
    ctx.lineTo(0, -100);
    ctx.closePath();
    ctx.fill();
  } else {
    // Uva
    ctx.rotate(0.25);
    ctx.fillStyle = '#A855F7';
    ctx.beginPath();
    ctx.ellipse(0, 0, 130, 145, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 18;
    ctx.strokeStyle = '#7E22CE';
    ctx.beginPath();
    ctx.ellipse(0, 0, 120, 135, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#7E22CE';
    [-45, -15, 18, 52].forEach(y => {
      const halfW = 85 - Math.abs(y) * 0.45;
      ctx.beginPath();
      ctx.roundRect(-halfW, y - 5, halfW * 2, 10, 5);
      ctx.fill();
    });

    ctx.fillStyle = '#4ADE80';
    ctx.beginPath();
    ctx.moveTo(0, -165);
    ctx.lineTo(-40, -115);
    ctx.lineTo(40, -115);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 5. Nome principal em alto relevo com brilho ("morango", "manga", etc.)
  const textY = 515;
  const nameFontSize = Math.round(Math.min(145, 800 / (drink.logoText.length || 7)));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${nameFontSize}px "Montserrat", "Arial Black", system-ui, sans-serif`;

  // Brilho / Emboss branco chanfrado
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fillText(drink.logoText, cx - 4, textY - 4);

  // Preenchimento marrom escuro principal com contorno nítido
  ctx.fillStyle = '#4A3219';
  ctx.strokeStyle = '#4A3219';
  ctx.lineWidth = 4;
  ctx.strokeText(drink.logoText, cx, textY);
  ctx.fillText(drink.logoText, cx, textY);

  // 6. Faixa creme inferior ("Bottom Cream Band")
  const bandTop = 716;
  ctx.fillStyle = '#FDF5E6';
  ctx.fillRect(0, bandTop, 2048, 1024 - bandTop);

  // Linhas de costura escuras
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, bandTop, 2048, 6);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 1018, 2048, 6);

  // 7. Subtítulo ("fogo e chapa")
  const subY = 795;
  ctx.font = 'bold 50px "Montserrat", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText(drink.subTitle, cx - 2, subY - 2);
  ctx.fillStyle = '#1A1A1A';
  ctx.fillText(drink.subTitle, cx, subY);

  // 8. Descrição do produto ("& frutas vermelhas · 330 ml")
  const descY = 880;
  ctx.font = 'bold 36px "Montserrat", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText(drink.description, cx - 2, descY - 2);
  ctx.fillStyle = '#1A1A1A';
  ctx.fillText(drink.description, cx, descY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  labelTextureCache.set(drink.id, texture);
  return texture;
}

// Gotículas de condensação na superfície da lata (efeito gelado e molhado)
function CanCondensation() {
  const beadsRef = useRef<THREE.InstancedMesh>(null);
  const count = 85;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!beadsRef.current) return;
    for (let i = 0; i < count; i++) {
      // Distribui na face frontal da lata (ângulo entre -PI*0.4 e +PI*0.4)
      const angle = (Math.random() - 0.5) * Math.PI * 0.85;
      const r = 1.018; // Logo acima da superfície metálica da lata
      const y = (Math.random() - 0.5) * 3.6; // De -1.8 a +1.8
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, angle, 0);
      const s = 0.016 + Math.random() * 0.024;
      // Gotícula levemente achatada na superfície
      dummy.scale.set(s, s * (1.1 + Math.random() * 0.5), s * 0.65);
      dummy.updateMatrix();
      beadsRef.current.setMatrixAt(i, dummy.matrix);
    }
    beadsRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={beadsRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.05}
        metalness={0.12}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  );
}

// --- SINGLETONS DE ALTA PERFORMANCE (ZERO RECOMPILAÇÃO / ZERO ALOCAÇÃO NO LOOP) ---
let sharedFlowTexture: THREE.CanvasTexture | null = null;
function getFlowTexture() {
  if (sharedFlowTexture) return sharedFlowTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 1024);

  for (let i = 0; i < 48; i++) {
    const y = (i / 48) * 1024;
    const waveGrad = ctx.createLinearGradient(0, y - 12, 0, y + 12);
    waveGrad.addColorStop(0, '#555555');
    waveGrad.addColorStop(0.5, '#cccccc');
    waveGrad.addColorStop(1, '#555555');
    ctx.strokeStyle = waveGrad;
    ctx.lineWidth = 7;
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 10) {
      const wave = Math.sin(x * 0.04 + i * 0.85) * 14 + Math.cos((y + x) * 0.025) * 8;
      if (x === 0) ctx.moveTo(x, y + wave);
      else ctx.lineTo(x, y + wave);
    }
    ctx.stroke();
  }

  for (let b = 0; b < 260; b++) {
    const bx = Math.random() * 512;
    const by = Math.random() * 1024;
    const br = 1.0 + Math.random() * 3.2;
    const bGrad = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 0, bx, by, br);
    bGrad.addColorStop(0, '#ffffff');
    bGrad.addColorStop(0.7, '#a0a0a0');
    bGrad.addColorStop(1, '#606060');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }

  sharedFlowTexture = new THREE.CanvasTexture(canvas);
  sharedFlowTexture.wrapS = THREE.RepeatWrapping;
  sharedFlowTexture.wrapT = THREE.RepeatWrapping;
  sharedFlowTexture.repeat.set(1, 3);
  return sharedFlowTexture;
}


let sharedSparkleTexture: THREE.CanvasTexture | null = null;
function getSparkleTexture() {
  if (sharedSparkleTexture) return sharedSparkleTexture;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const cx = 128;
  const cy = 128;

  const radGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 110);
  radGlow.addColorStop(0, 'rgba(255, 255, 255, 1)');
  radGlow.addColorStop(0.15, 'rgba(255, 255, 255, 0.9)');
  radGlow.addColorStop(0.35, 'rgba(220, 245, 255, 0.35)');
  radGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, 256, 256);

  const hGrad = ctx.createLinearGradient(0, cy, 256, cy);
  hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  hGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
  hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  hGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.7)');
  hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(8, cy);
  ctx.lineTo(cx, cy - 7);
  ctx.lineTo(248, cy);
  ctx.lineTo(cx, cy + 7);
  ctx.closePath();
  ctx.fill();

  const vGrad = ctx.createLinearGradient(cx, 0, cx, 256);
  vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  vGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.7)');
  vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  vGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.7)');
  vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.moveTo(cx, 8);
  ctx.lineTo(cx - 7, cy);
  ctx.lineTo(248, cy);
  ctx.lineTo(cx + 7, cy);
  ctx.closePath();
  ctx.fill();

  sharedSparkleTexture = new THREE.CanvasTexture(canvas);
  return sharedSparkleTexture;
}

let sharedCurves: {
  mainCurve: THREE.CatmullRomCurve3;
  secondaryCurve: THREE.CatmullRomCurve3;
  mainTubeGeo: THREE.TubeGeometry;
  secTubeGeo: THREE.TubeGeometry;
  coreTubeGeo: THREE.TubeGeometry;
  sparklePoints: Array<{ param: number; pos: THREE.Vector3; phase: number; scale: number }>;
} | null = null;

function getFluidCurves() {
  if (sharedCurves) return sharedCurves;

  const steps = 75;
  const turns = 2.35;
  const startY = -2.15;
  const endY = 2.38;
  const startAngle = -0.3; // Visível surgindo da base inferior da lata
  const mainPts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = startY + t * (endY - startY);
    const angle = startAngle + t * turns * Math.PI * 2;
    // Começa colado embaixo da lata (r=1.04) e expande organicamente ao subir (r=1.35)
    const r = 1.04 + Math.sin(t * Math.PI * 0.85) * 0.32 + Math.sin(t * Math.PI * 3.0) * 0.05;
    mainPts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const mCurve = new THREE.CatmullRomCurve3(mainPts, false, 'catmullrom', 0.5);

  const secSteps = 60;
  const secTurns = 2.45;
  const secStartY = -2.10;
  const secEndY = 2.45;
  const secStartAngle = startAngle - 0.45;
  const secPts: THREE.Vector3[] = [];
  for (let i = 0; i <= secSteps; i++) {
    const t = i / secSteps;
    const y = secStartY + t * (secEndY - secStartY);
    const angle = secStartAngle + t * secTurns * Math.PI * 2;
    const r = 1.08 + Math.sin(t * Math.PI * 0.85) * 0.36 + Math.cos(t * Math.PI * 2.5) * 0.06;
    secPts.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  const sCurve = new THREE.CatmullRomCurve3(secPts, false, 'catmullrom', 0.5);

  const sparkParams = [0.15, 0.32, 0.48, 0.65, 0.80, 0.94];
  const sPts = sparkParams.map((p, idx) => {
    const pt = mCurve.getPointAt(p);
    const dir = new THREE.Vector3(pt.x, 0, pt.z).normalize();
    return {
      param: p,
      pos: pt.clone().addScaledVector(dir, 0.14),
      phase: idx * 1.15,
      scale: 0.45 + (idx % 3) * 0.12
    };
  });

  // Geometrias persistentes (alocadas 1x no startup, ZERO garbage collection durante o scroll)
  const mTubeGeo = new THREE.TubeGeometry(mCurve, 70, 0.125, 12, false);
  const sTubeGeo = new THREE.TubeGeometry(sCurve, 45, 0.042, 8, false);
  const cTubeGeo = new THREE.TubeGeometry(mCurve, 35, 0.016, 6, false);

  sharedCurves = {
    mainCurve: mCurve,
    secondaryCurve: sCurve,
    mainTubeGeo: mTubeGeo,
    secTubeGeo: sTubeGeo,
    coreTubeGeo: cTubeGeo,
    sparklePoints: sPts
  };
  return sharedCurves;
}

let sharedJuiceFluidMaterial: THREE.MeshPhysicalMaterial | null = null;
function getJuiceFluidMaterial(initialColor: string) {
  if (sharedJuiceFluidMaterial) {
    sharedJuiceFluidMaterial.color.set(initialColor);
    sharedJuiceFluidMaterial.emissive.set(initialColor);
    sharedJuiceFluidMaterial.attenuationColor.set(initialColor);
    return sharedJuiceFluidMaterial;
  }

  const flowTex = getFlowTexture();
  const mat = new THREE.MeshPhysicalMaterial({
    color: initialColor,
    transmission: 0.70,
    opacity: 0.98,
    transparent: true,
    roughness: 0.0,
    metalness: 0.0,
    ior: 1.345,
    thickness: 1.1,
    specularIntensity: 3.2,
    specularColor: "#ffffff",
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    attenuationColor: initialColor,
    attenuationDistance: 0.65,
    emissive: initialColor,
    emissiveIntensity: 0.22,
    bumpMap: flowTex,
    bumpScale: 0.024,
    envMapIntensity: 2.8,
  });

  const uTime = { value: 0 };
  const uScroll = { value: 0 };
  const uClimb = { value: 0.18 };
  (mat as any).userData = { uTime, uScroll, uClimb };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms['uTime'] = uTime;
    shader.uniforms['uScroll'] = uScroll;
    shader.uniforms['uClimb'] = uClimb;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uScroll;
      uniform float uClimb;
      varying float vProgress;
      ${shader.vertexShader}
    `;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float progress = uv.x;
      vProgress = progress;

      // Distância até a ponta atual do jato em ascensão
      float headDist = uClimb - progress;

      // Taper suave da ponta em crescimento (formato de gota/onda fluida na crista)
      float headTaper = smoothstep(0.0, 0.12, headDist);
      // Taper suave no ponto de origem (de baixo da lata)
      float baseTaper = smoothstep(0.0, 0.05, progress);
      float fluidReach = headTaper * baseTaper;

      // Dinâmica de onda ascendente
      float flowSpeed = 6.2 + uScroll * 10.0;
      float surge = sin(position.y * 5.2 - uTime * flowSpeed) * 0.034;
      float capillary = sin(position.y * 14.0 - uTime * (flowSpeed * 1.6) + position.x * 6.0) * 0.016;
      float pulse = cos(position.x * 7.5 + position.z * 7.5 - uTime * 3.5) * 0.015;
      float fluidDisp = (surge + capillary + pulse) * fluidReach;

      // Afina suavemente a ponta do jato para zero na cabeça
      transformed += normal * (fluidDisp - (1.0 - headTaper) * 0.12);
      `
    );

    shader.fragmentShader = `
      uniform float uClimb;
      varying float vProgress;
      ${shader.fragmentShader}
    `;

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `void main() {
        if (vProgress > uClimb) discard;
      `
    );
  };

  sharedJuiceFluidMaterial = mat;
  return mat;
}

let sharedCoreFluidMaterial: THREE.MeshBasicMaterial | null = null;
function getCoreFluidMaterial() {
  if (sharedCoreFluidMaterial) return sharedCoreFluidMaterial;
  const mat = new THREE.MeshBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });

  const uClimb = (sharedJuiceFluidMaterial as any)?.userData?.uClimb || { value: 0.18 };
  (mat as any).userData = { uClimb };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms['uClimb'] = uClimb;
    shader.vertexShader = `
      varying float vProgress;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vProgress = uv.x;
      `
    );
    shader.fragmentShader = `
      uniform float uClimb;
      varying float vProgress;
      ${shader.fragmentShader}
    `;
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      `void main() {
        if (vProgress > uClimb) discard;
      `
    );
  };

  sharedCoreFluidMaterial = mat;
  return mat;
}

// Scratch vectors pré-alocados para ZERO Garbage Collection no useFrame
const _upVec = new THREE.Vector3(0, 1, 0);
const _pt = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _norm = new THREE.Vector3();
const _binorm = new THREE.Vector3();

const JuiceLiquidFlow = React.memo(function JuiceLiquidFlow({ 
  color, 
  scrollRef, 
  isDetail = false 
}: { 
  color: string, 
  scrollRef: React.MutableRefObject<number>, 
  isDetail: boolean 
}) {
  const rigRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const climbRef = useRef(0.18);
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const airborneDropsRef = useRef<THREE.InstancedMesh>(null);
  const sparklesRef = useRef<(THREE.Mesh | null)[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const flowTexture = useMemo(() => getFlowTexture(), []);
  const sparkleTexture = useMemo(() => getSparkleTexture(), []);
  const curves = useMemo(() => getFluidCurves(), []);
  const juiceFluidMaterial = useMemo(() => getJuiceFluidMaterial(color), []);
  const coreFluidMaterial = useMemo(() => getCoreFluidMaterial(), []);

  const airborneMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.35,
      roughness: 0.02,
      metalness: 0.05,
      transparent: true,
      opacity: 0.92,
    });
  }, []);

  // Atualiza cores dinamicamente sem NENHUMA recompilação de shader!
  useEffect(() => {
    if (juiceFluidMaterial) {
      juiceFluidMaterial.color.set(color);
      juiceFluidMaterial.emissive.set(color);
      juiceFluidMaterial.attenuationColor.set(color);
    }
    if (airborneMat) {
      airborneMat.color.set(color);
      airborneMat.emissive.set(color);
    }
  }, [color, juiceFluidMaterial, airborneMat]);

  const bubbleCount = 130;
  const bubbleData = useRef<Array<{ t: number, speed: number, offsetR: number, angle: number, size: number }>>([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < bubbleCount; i++) {
      data.push({
        t: Math.random(),
        speed: 0.22 + Math.random() * 0.40,
        offsetR: (Math.random() - 0.5) * 0.075,
        angle: Math.random() * Math.PI * 2,
        size: 0.011 + Math.random() * 0.018
      });
    }
    bubbleData.current = data;
  }, []);

  const dropCount = 42;
  const airDropData = useRef<Array<{ x: number, y: number, z: number, vy: number, speed: number, radius: number, angle: number, size: number }>>([]);
  useEffect(() => {
    const data = [];
    for (let i = 0; i < dropCount; i++) {
      const radius = 1.35 + Math.random() * 0.65;
      const angle = (Math.random() - 0.5) * Math.PI * 2;
      data.push({
        x: Math.cos(angle) * radius,
        y: -2.0 + Math.random() * 4.2,
        z: Math.sin(angle) * radius,
        vy: 1.0 + Math.random() * 2.0,
        speed: 1.0 + Math.random() * 1.8,
        radius,
        angle,
        size: 0.024 + Math.random() * 0.038
      });
    }
    airDropData.current = data;
  }, []);

  useFrame((state, delta) => {
    if (!rigRef.current || !groupRef.current) return;

    const detailScroll = scrollRef.current;

    // SURGE DE BAIXO DA LATA E SOBE COM A ROLAGEM DANDO A VOLTA
    const targetClimb = isDetail 
      ? THREE.MathUtils.lerp(0.18, 1.0, Math.min(1.0, detailScroll * 1.08)) 
      : 0.04;
    climbRef.current = THREE.MathUtils.damp(climbRef.current, targetClimb, 5.0, delta);
    const currentClimb = climbRef.current;

    // Escala suave: no carrossel fica 0.0001 (GPU shader pre-compilado ativo desde o frame 1)
    const targetScale = isDetail ? (1.0 + detailScroll * 0.05) : 0.0001;
    const currentScale = THREE.MathUtils.damp(rigRef.current.scale.x, targetScale, 7, delta);
    rigRef.current.scale.setScalar(currentScale);

    // CRÍTICO: visible SEMPRE true para que os shaders fiquem 100% compilados na GPU desde o frame 1!
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      rigRef.current.visible = false;
      return;
    }

    rigRef.current.visible = true;

    // Acompanha a lata protagonista em sincronia absoluta: posicionada à esquerda da foto do copo!
    const targetX = isDetail ? (-1.40 + detailScroll * 0.55) : 0;
    const targetY = isDetail ? (-0.36 - Math.sin(detailScroll * Math.PI) * 0.08) : -0.2;
    // Mais perto da câmera quando virar para trás
    const targetZ = isDetail ? (detailScroll * 0.90) : 0.0;

    // Inclinação para trás e virado verticalmente para a direita no rig idêntico ao da lata
    const targetRotX = isDetail ? -detailScroll * 0.44 : 0;
    const targetRotZ = isDetail ? -detailScroll * 0.28 : 0;

    rigRef.current.position.x = THREE.MathUtils.damp(rigRef.current.position.x, targetX, 5, delta);
    rigRef.current.position.y = THREE.MathUtils.damp(rigRef.current.position.y, targetY, 5, delta);
    rigRef.current.position.z = THREE.MathUtils.damp(rigRef.current.position.z, targetZ, 5, delta);

    rigRef.current.rotation.x = THREE.MathUtils.damp(rigRef.current.rotation.x, targetRotX, 5, delta);
    rigRef.current.rotation.z = THREE.MathUtils.damp(rigRef.current.rotation.z, targetRotZ, 5, delta);

    if (currentScale < 0.02) return; // Pula cálculos pesados de partículas quando invisível no carrossel

    const scrollMultiplier = 1.0 + detailScroll * 4.5;
    const time = state.clock.elapsedTime;

    if ((juiceFluidMaterial as any).userData?.uTime) {
      (juiceFluidMaterial as any).userData.uTime.value = time;
      (juiceFluidMaterial as any).userData.uScroll.value = detailScroll;
      (juiceFluidMaterial as any).userData.uClimb.value = currentClimb;
    }
    if ((coreFluidMaterial as any).userData?.uClimb) {
      (coreFluidMaterial as any).userData.uClimb.value = currentClimb;
    }

    // Fluxo contínuo rolando de baixo para cima
    flowTexture.offset.y += delta * (3.6 + detailScroll * 7.5);
    flowTexture.offset.x += delta * 0.12;

    // Ao rolar para baixo, vai dando a volta ao redor da lata
    groupRef.current.rotation.y = detailScroll * Math.PI * 1.6 + time * 0.28;

    // 1. Bolhas subindo na espiral do fluxo até a altura atual do líquido
    if (bubblesRef.current && bubbleData.current.length > 0) {
      bubbleData.current.forEach((b, i) => {
        b.t = (b.t + delta * b.speed * scrollMultiplier) % 1.0;

        // Se a bolha estiver acima da cabeça do líquido em ascensão, esconde
        if (b.t > currentClimb) {
          dummy.position.set(0, -100, 0);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          bubblesRef.current!.setMatrixAt(i, dummy.matrix);
          return;
        }

        curves.mainCurve.getPointAt(b.t, _pt);
        curves.mainCurve.getTangentAt(b.t, _tangent);
        _norm.crossVectors(_tangent, _upVec).normalize();
        _binorm.crossVectors(_tangent, _norm).normalize();
        
        _pt.addScaledVector(_norm, Math.cos(b.angle) * b.offsetR)
           .addScaledVector(_binorm, Math.sin(b.angle) * b.offsetR);

        dummy.position.copy(_pt);
        dummy.scale.setScalar(b.size);
        dummy.updateMatrix();
        bubblesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      bubblesRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Estrelas de brilho e glints (aparecem conforme o líquido sobe e atinge cada ponto)
    sparklesRef.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const sp = curves.sparklePoints[idx];
      if (!sp) return;

      if (sp.param > currentClimb) {
        mesh.scale.set(0, 0, 0);
        return;
      }

      mesh.quaternion.copy(state.camera.quaternion);
      const pulse = Math.sin(time * 4.5 + sp.phase);
      const s = sp.scale * (0.85 + pulse * 0.35);
      mesh.scale.set(s, s, 1);
    });

    // 3. Gotas voadoras efervescentes subindo com o vórtice em volta da lata
    const currentMaxY = -2.15 + currentClimb * 4.53;
    if (airborneDropsRef.current && airDropData.current.length > 0) {
      airDropData.current.forEach((drop, i) => {
        drop.vy += delta * (3.5 + detailScroll * 5.0);
        drop.y += delta * (drop.vy + drop.speed);
        drop.angle += delta * (1.8 + detailScroll * 2.5);
        const dynamicRadius = drop.radius + Math.sin(drop.y * 3.0 + time * 3.5) * 0.08;
        drop.x = Math.cos(drop.angle) * dynamicRadius;
        drop.z = Math.sin(drop.angle) * dynamicRadius;

        // Ao atingir a altura atual do líquido, ressurge na base embaixo da lata
        if (drop.y > currentMaxY) {
          drop.y = -2.15 - Math.random() * 0.25;
          drop.vy = 0.5 + Math.random() * 1.2;
          drop.angle = (Math.random() - 0.5) * Math.PI * 2;
          drop.radius = 1.15 + Math.random() * 0.45;
        }

        dummy.position.set(drop.x, drop.y, drop.z);
        const stretchY = Math.min(1.85, 1.0 + drop.vy * 0.14);
        const squishXZ = 1.0 / Math.sqrt(stretchY);
        dummy.scale.set(drop.size * squishXZ, drop.size * stretchY, drop.size * squishXZ);
        dummy.updateMatrix();
        airborneDropsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      airborneDropsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rigRef}>
      <group ref={groupRef}>
        {/* Iluminação de Estúdio Otimizada: Key Light + Fill Light */}
        <pointLight position={[2.2, 1.8, 2.5]} intensity={4.5} color="#ffffff" distance={6} />
        <pointLight position={[-1.5, 0.5, 2.0]} intensity={3.5} color={color} distance={5} />

        {/* Condensação de gotículas na lata protagonista */}
        <CanCondensation />

        {/* 1. Jato principal do suco translúcido e ondulante subindo ao redor da lata */}
        <mesh material={juiceFluidMaterial} geometry={curves.mainTubeGeo} />

        {/* 2. Fita satélite secundária de respingo */}
        <mesh material={juiceFluidMaterial} geometry={curves.secTubeGeo} />

        {/* 3. Filamento óptico central de luz líquida */}
        <mesh geometry={curves.coreTubeGeo} material={coreFluidMaterial} />

        {/* 4. Micro-bolhas efervescentes no interior do fluxo */}
        <instancedMesh ref={bubblesRef} geometry={canGeometries.bubbleSphere} material={canMaterials.bubble} args={[undefined, undefined, bubbleCount]} />

        {/* 5. Estrelas de reflexo reluzente */}
        {curves.sparklePoints.map((sp, idx) => (
          <mesh
            key={idx}
            ref={(el) => { if (el) sparklesRef.current[idx] = el; }}
            position={sp.pos}
            geometry={canGeometries.sparklePlane}
          >
            <meshBasicMaterial
              map={sparkleTexture}
              transparent
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              opacity={0.95}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* 6. Gotas voadoras aerotransportadas subindo em espiral */}
        <instancedMesh ref={airborneDropsRef} geometry={canGeometries.dropSphere} material={airborneMat} args={[undefined, undefined, dropCount]} />
      </group>
    </group>
  );
});

// --- SINGLETON GEOMETRIES & MATERIALS PARA TODAS AS 5 LATAS ---
// Alocadas 1x no startup da GPU: ZERO Garbage Collection e ZERO queda de FPS ao trocar de lata!
const canGeometries = {
  body: new THREE.CylinderGeometry(1, 1, 4.0, 48),
  topBevel: new THREE.CylinderGeometry(0.88, 1.0, 0.3, 36),
  topRim: new THREE.TorusGeometry(0.87, 0.04, 16, 36),
  topLid: new THREE.CylinderGeometry(0.86, 0.86, 0.05, 36),
  tabRing: new THREE.TorusGeometry(0.12, 0.02, 12, 24),
  tabBody: new THREE.BoxGeometry(0.12, 0.015, 0.3),
  tabRivet: new THREE.CircleGeometry(0.08, 16),
  bottomBevel: new THREE.TorusGeometry(0.95, 0.05, 16, 36),
  bottomRim: new THREE.TorusGeometry(0.9, 0.03, 12, 36),
  bottomBase: new THREE.CylinderGeometry(0.9, 0.9, 0.05, 36),
  bubbleSphere: new THREE.SphereGeometry(1, 8, 8),
  sparklePlane: new THREE.PlaneGeometry(1, 1),
  dropSphere: new THREE.SphereGeometry(1, 10, 10),
};

const canMaterials = {
  aluminum: new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.25, color: "#e6e6e6", envMapIntensity: 1.5 }),
  lid: new THREE.MeshStandardMaterial({ metalness: 0.6, roughness: 0.3, color: "#cccccc", envMapIntensity: 1.5 }),
  tab: new THREE.MeshStandardMaterial({ metalness: 0.7, roughness: 0.2, color: "#ffffff", envMapIntensity: 1.5 }),
  bubble: new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#ffffff",
    emissiveIntensity: 0.8,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  }),
};

// Pré-aquece todas as texturas de latas na VRAM da GPU no mount para evitar micro-travamentos
function TexturePrewarmer({ drinks }: { drinks: any[] }) {
  const { gl } = useThree();
  useEffect(() => {
    drinks.forEach(d => {
      const tex = getCanLabelTexture(d);
      if (tex && gl) {
        gl.initTexture(tex);
      }
    });
  }, [drinks, gl]);
  return null;
}

function CanMesh({ 
  drink, 
  drinkIndex,
  totalDrinks,
  activeIndexRef, 
  viewModeRef, 
  scrollRef,
  singleMode = false
}: { 
  drink: any, 
  drinkIndex: number,
  totalDrinks: number,
  activeIndexRef: React.MutableRefObject<number>, 
  viewModeRef: React.MutableRefObject<'carousel' | 'detail'>, 
  scrollRef: React.MutableRefObject<number>,
  singleMode?: boolean
}) {
  const rigRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const labelTexture = useMemo(() => getCanLabelTexture(drink), [drink.id]);

  useFrame((state, delta) => {
    if (!rigRef.current || !meshRef.current) return;
    
    const activeIndex = activeIndexRef.current;
    const vIndex = ((drinkIndex - activeIndex + 2) % totalDrinks + totalDrinks) % totalDrinks;
    const diff = vIndex - 2; 

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    if (singleMode && diff !== 0) {
      rigRef.current.visible = false;
      return;
    }
    // No mobile, renderizar apenas a lata ativa e seus 2 vizinhos imediatos para economizar GPU
    if (isMobile && Math.abs(diff) > 1) {
      rigRef.current.visible = false;
      return;
    }
    rigRef.current.visible = true;

    const isDetail = viewModeRef.current === 'detail';
    const detailScroll = scrollRef.current;

    // Calculate target position based on distance from center
    let targetX = diff * (isMobile ? 3.2 : 4.0); 
    if (diff !== 0) {
      targetX += diff > 0 ? (isMobile ? 0.4 : 0.8) : (isMobile ? -0.4 : -0.8);
      if (isDetail) {
        targetX += (diff > 0 ? 15 : -15);
      }
    } else {
      if (isDetail) {
        // No mobile, mantém a lata centralizada; no desktop, posiciona à esquerda
        targetX = isMobile ? 0 : (-1.40 + detailScroll * 0.55);
      }
    }

    let targetY = (isMobile ? 0.35 : -0.2) + Math.abs(diff) * 0.4; 
    let targetRotX = 0;
    let targetRotZ = -diff * 0.18; 
    let targetRotY = Math.PI + 0.15 + diff * 0.4; 

    if (diff === 0 && isDetail && isMobile) {
      // VITRINE GIRATÓRIA MOBILE: cada seção de rolagem = 1 giro completo de 360° no eixo vertical.
      // Nos pontos de snap (frac = 0) a lata fica exatamente de frente, parada e sem inclinação.
      const pos = detailScroll * (MOBILE_DETAIL_SECTIONS - 1);
      const frac = pos - Math.floor(pos);
      const hop = Math.sin(frac * Math.PI); // 0 de frente, 1 no meio do giro

      targetX = 0;
      targetY = 2.0 + hop * 0.35; // "pula" enquanto gira e pousa de frente
      targetRotY = Math.PI + 0.15 + pos * Math.PI * 2;
      targetRotX = -hop * 0.22; // inclina levemente durante o giro
      targetRotZ = Math.sin(frac * Math.PI * 2) * 0.1;
    } else if (diff === 0 && isDetail) {
      targetY = -0.36 - Math.sin(detailScroll * Math.PI) * 0.08;
      
      // Inclina para trás (topo inclina para dentro da cena)
      targetRotX = -detailScroll * 0.44;
      targetRotY = Math.PI + 0.15 - detailScroll * 0.35;
      targetRotZ = -detailScroll * 0.28;
    }

    const mobileSpin = diff === 0 && isDetail && isMobile;
    const mobileHop = mobileSpin
      ? Math.sin((detailScroll * (MOBILE_DETAIL_SECTIONS - 1) % 1) * Math.PI)
      : 0;

    // Mais perto da câmera quando virar para trás (+Z aproxima do observador)
    const targetZ = vIndex === 2
      ? (isDetail ? (mobileSpin ? mobileHop * 0.6 : detailScroll * 0.90) : 0.0)
      : -Math.abs(diff) * (isMobile ? 3.4 : 4.2); 
    const targetScale = vIndex === 2 
      ? (isDetail ? (mobileSpin ? 0.8 - mobileHop * 0.06 : 1.0 + detailScroll * 0.04) : (isMobile ? 0.95 : 1.0)) 
      : (isMobile ? 0.72 : 0.85) - Math.abs(diff) * 0.1;

    // Giro mais "colado" na rolagem no mobile para a lata acompanhar o dedo
    const rotLambda = mobileSpin ? 9 : 5;

    rigRef.current.position.x = THREE.MathUtils.damp(rigRef.current.position.x, targetX, 5, delta);
    rigRef.current.position.y = THREE.MathUtils.damp(rigRef.current.position.y, targetY, 5, delta);
    rigRef.current.position.z = THREE.MathUtils.damp(rigRef.current.position.z, targetZ, 5, delta);
    
    rigRef.current.rotation.x = THREE.MathUtils.damp(rigRef.current.rotation.x, targetRotX, rotLambda, delta);
    rigRef.current.rotation.z = THREE.MathUtils.damp(rigRef.current.rotation.z, targetRotZ, rotLambda, delta);
    
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, rotLambda, delta);
    
    rigRef.current.scale.setScalar(THREE.MathUtils.damp(rigRef.current.scale.x, targetScale, 5, delta));
  });

  return (
    <group ref={rigRef} position={[0, -0.2, 0]}>
      <group ref={meshRef}>
        {/* --- MAIN CYLINDER BODY (LABEL) --- */}
        <mesh geometry={canGeometries.body}>
          <meshPhysicalMaterial 
            map={labelTexture}
            metalness={0.5} 
            roughness={0.1} 
            clearcoat={1.0} 
            clearcoatRoughness={0.05} 
            envMapIntensity={2.0} 
          />
        </mesh>

        {/* --- TOP METAL SECTION (Brushed Aluminum) --- */}
        <group>
          <mesh position={[0, 2.15, 0]} geometry={canGeometries.topBevel} material={canMaterials.aluminum} />
          <mesh position={[0, 2.31, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={canGeometries.topRim} material={canMaterials.aluminum} />
          <mesh position={[0, 2.29, 0]} geometry={canGeometries.topLid} material={canMaterials.lid} />
          
          <mesh position={[0, 2.32, 0.2]} rotation={[Math.PI / 2, 0, 0]} geometry={canGeometries.tabRing} material={canMaterials.tab} />
          <mesh position={[0, 2.32, 0.05]} geometry={canGeometries.tabBody} material={canMaterials.tab} />
          <mesh position={[0, 2.32, -0.1]} rotation={[-Math.PI / 2, 0, 0]} geometry={canGeometries.tabRivet} material={canMaterials.tab} />
        </group>

        {/* --- BOTTOM METAL SECTION --- */}
        <group>
          <mesh position={[0, -2.0, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={canGeometries.bottomBevel} material={canMaterials.aluminum} />
          <mesh position={[0, -2.06, 0]} rotation={[Math.PI / 2, 0, 0]} geometry={canGeometries.bottomRim} material={canMaterials.aluminum} />
          <mesh position={[0, -2.05, 0]} geometry={canGeometries.bottomBase} material={canMaterials.lid} />
        </group>
      </group>
    </group>
  );
}

// MemoizedCanMesh: Compara apenas drink.id e drinkIndex. NUNCA re-renderiza durante o scroll ou troca de lata!
const MemoizedCanMesh = React.memo(CanMesh, (prev, next) => {
  return prev.drink.id === next.drink.id && prev.drinkIndex === next.drinkIndex && prev.singleMode === next.singleMode;
});

// Controlador de câmera responsivo: adapta distância e enquadramento automaticamente para telas mobile
// Número de seções da vitrine mobile (cada seção = 1 giro de 360° da lata)
export const MOBILE_DETAIL_SECTIONS = 4;
function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const isMobile = size.width < 768;
    if (isMobile) {
      camera.position.set(0, 0.45, 14.8);
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = 38;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    } else {
      camera.position.set(0, 0, 10.0);
      if ('fov' in camera) {
        (camera as THREE.PerspectiveCamera).fov = 35;
        (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
      }
    }
  }, [size.width, camera]);
  return null;
}

export function Can3DScene({ 
  drinks, 
  activeIndex, 
  singleMode = false, 
  viewMode = 'carousel',
  detailScroll = 0 
}: { 
  drinks: any[], 
  activeIndex: number, 
  singleMode?: boolean, 
  viewMode?: 'carousel' | 'detail',
  detailScroll?: number 
}) {
  const activeDrink = drinks[activeIndex] || drinks[0];
  const scrollRef = useRef(detailScroll);
  scrollRef.current = detailScroll;
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="w-full h-full">
      <Canvas 
        dpr={[1, isMobile ? 1.25 : 1.75]}
        camera={{ position: [0, 0, 10.0], fov: 35 }}
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true, stencil: false }}
      >
        <ResponsiveCamera />
        <TexturePrewarmer drinks={drinks} />
        
        <ambientLight intensity={0.9} />
        
        <spotLight 
          position={[4, 2, 8]} 
          intensity={4.0} 
          angle={0.3} 
          penumbra={0.5} 
        />
        
        <spotLight 
          position={[-8, 2, 5]} 
          intensity={1.8} 
          penumbra={1} 
          color="#fff5e6" 
        />
        
        <spotLight 
          position={[8, 0, -5]} 
          intensity={2.5} 
          angle={0.5} 
          penumbra={1} 
          color="#ffffff" 
        />
        
        <Suspense fallback={null}>
          <Environment preset="city" blur={0.05} />
        </Suspense>
        
        {/* Top Front Light */}
        <spotLight 
          position={[0, 5, 5]} 
          intensity={2.0} 
          angle={0.8} 
          penumbra={0.2} 
          color="#ffffff" 
        />

        {/* Bottom Front Light */}
        <spotLight 
          position={[1.5, -2, 5]} 
          intensity={4.0} 
          angle={0.4} 
          penumbra={0.3} 
          color="#ffffff" 
        />

        {/* Back Rim Light for Water Specular Edge Shimmer */}
        <pointLight position={[0, 1.5, -3.5]} intensity={8.5} color="#e0f2fe" distance={9} />
        
        {drinks.map((drink, index) => {
          return (
            <MemoizedCanMesh 
              key={drink.id + '-' + index} 
              drink={drink} 
              drinkIndex={index}
              totalDrinks={drinks.length}
              activeIndexRef={activeIndexRef}
              viewModeRef={viewModeRef}
              scrollRef={scrollRef}
              singleMode={singleMode}
            />
          );
        })}

        {/* --- 3D LIQUID FLOW PERSISTENTE (SINGLETON NO NÍVEL DA CENA) --- */}
        <JuiceLiquidFlow 
          color={activeDrink.color} 
          scrollRef={scrollRef}
          isDetail={viewMode === 'detail'} 
        />
        
        {/* Ground shadow estático bake (frames=1: zero render passes a cada frame) */}
        <ContactShadows 
          position={[0, isMobile ? -1.8 : -2.3, 0]} 
          opacity={0.35} 
          scale={14} 
          blur={2} 
          far={4} 
          resolution={isMobile ? 64 : 128}
          frames={1}
        />
      </Canvas>
    </div>
  );
}
