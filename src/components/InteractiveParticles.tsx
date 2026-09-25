"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

/**
 * Interactive Particles
 * Samples an image into thousands of GPU particles that scatter and flow
 * around the cursor via an off-screen "touch texture", with a GSAP intro
 * animation and simplex-noise displacement.
 *
 * Ported from Bruno Imbrizi's Codrops "Interactive Particles" (Three.js)
 * into a single, self-contained, prop-driven React component.
 */

// Ashima / Stefan Gustavson 2D simplex noise — inlined shader.
const SIMPLEX_2D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const VERT = /* glsl */ `
precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uTouch;

varying vec2 vPUv;
varying vec2 vUv;

${SIMPLEX_2D}

float random(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vUv = uv;

  vec2 puv = offset.xy / uTextureSize;
  vPUv = puv;

  vec4 colA = texture2D(uTexture, puv);
  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

  vec3 displaced = offset;
  displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
  float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));
  displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
  displaced.xy -= uTextureSize * 0.5;

  float t = texture2D(uTouch, puv).r;
  displaced.z += t * 20.0 * rndz;
  displaced.x += cos(angle) * t * 20.0 * rndz;
  displaced.y += sin(angle) * t * 20.0 * rndz;

  float psize = (snoise(vec2(uTime * 0.4, pindex * 0.05)) * 0.25 + 1.8);
  psize *= max(grey, 0.4);
  psize *= uSize;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * psize;
  vec4 finalPosition = projectionMatrix * mvPosition;

  gl_Position = finalPosition;
}
`;

const FRAG = /* glsl */ `
precision highp float;

uniform sampler2D uTexture;
uniform vec3 uColor;

varying vec2 vPUv;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 puv = vPUv;

  vec4 colA = texture2D(uTexture, puv);
  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

  // Crisp, well-defined micro-dots instead of muddy fuzzy blur
  float radius = 0.5;
  float border = 0.12;
  float dist = radius - distance(uv, vec2(0.5));
  float t = smoothstep(0.0, border, dist);

  // Vibrant gold color without muddy grey blend
  vec3 rgb = uColor;
  float alpha = t * min(grey * 1.25, 1.0);

  gl_FragColor = vec4(rgb, alpha);
}
`;

/**
 * Off-screen canvas recording cursor trail
 */
class TouchTexture {
  size = 64;
  maxAge = 120;
  radius: number;
  trail: { x: number; y: number; age: number; force: number }[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.Texture;

  constructor(radius: number) {
    this.radius = radius;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.texture = new THREE.Texture(this.canvas);
  }

  private easeOutSine(t: number, b: number, c: number, d: number) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  }

  addTouch(x: number, y: number) {
    let force = 0;
    const last = this.trail[this.trail.length - 1];
    if (last) {
      const dx = last.x - x;
      const dy = last.y - y;
      force = Math.min((dx * dx + dy * dy) * 10000, 1);
    }
    this.trail.push({ x, y, age: 0, force });
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.size, this.size);

    for (let i = this.trail.length - 1; i >= 0; i--) {
      this.trail[i].age++;
      if (this.trail[i].age > this.maxAge) this.trail.splice(i, 1);
    }
    for (const point of this.trail) this.drawTouch(point);

    this.texture.needsUpdate = true;
  }

  private drawTouch(point: { x: number; y: number; age: number; force: number }) {
    const pos = { x: point.x * this.size, y: (1 - point.y) * this.size };
    let intensity: number;
    if (point.age < this.maxAge * 0.3) {
      intensity = this.easeOutSine(point.age / (this.maxAge * 0.3), 0, 1, 1);
    } else {
      intensity = this.easeOutSine(1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7), 0, 1, 1);
    }
    intensity *= point.force;

    const radius = this.size * this.radius * intensity;
    const grd = this.ctx.createRadialGradient(pos.x, pos.y, radius * 0.25, pos.x, pos.y, radius);
    grd.addColorStop(0, "rgba(255, 255, 255, 0.25)");
    grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");
    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

/**
 * Creates high-contrast raster texture with the live waitlist count and label
 */
function createWaitlistTextImage(countText: string, subtext: string = ""): string {
  if (typeof window === "undefined") return "";
  const hasSubtext = Boolean(subtext && subtext.trim());

  let canvasWidth = 560;
  let canvasHeight = 360;
  let fontSize = 160;

  if (!hasSubtext) {
    if (countText.length <= 2) {
      canvasWidth = 360;
      canvasHeight = 360;
      fontSize = 240;
    } else if (countText.length <= 4) {
      canvasWidth = 460;
      canvasHeight = 360;
      fontSize = 200;
    } else {
      canvasWidth = 580;
      canvasHeight = 360;
      fontSize = 160;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Pure black background (shader ignores pixels <= threshold)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pure white for bright, responsive particles
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Large bold count typography
  ctx.font = `900 ${fontSize}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', Inter, sans-serif`;
  ctx.fillText(
    countText,
    canvas.width / 2,
    hasSubtext ? canvas.height / 2 - 32 : canvas.height / 2
  );

  // Subtitle (only rendered if provided)
  if (hasSubtext) {
    ctx.font = "700 24px -apple-system, BlinkMacSystemFont, 'SF Pro Text', Inter, sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText(subtext.trim().toUpperCase(), canvas.width / 2, canvas.height / 2 + 68);
  }

  return canvas.toDataURL("image/png");
}

export interface InteractiveParticlesProps {
  /** Optional image URL to sample particles from. If not provided, generates waitlist count text. */
  src?: string;
  /** Actual count of users from the waitinglist table */
  waitlistCount?: number | string;
  /** Subtitle label beneath the number (optional) */
  waitlistLabel?: string;
  /** Longest edge sampled (caps particle count). Defaults to 320. */
  maxDimension?: number;
  /** Extra classes for wrapper */
  className?: string;
  /** Background color. Defaults to transparent to match application background */
  background?: string;
  /** Particle tint. Defaults to Apple Blue #0071e3 */
  color?: string;
  /** Particle size multiplier. Defaults to 1.35 */
  size?: number;
  /** Random spread. Defaults to 1.8 */
  randomness?: number;
  /** Depth (z displacement). Defaults to 3.0 */
  depth?: number;
  /** Cursor touch radius (0–1). Defaults to 0.16 */
  touchRadius?: number;
  /** Brightness threshold (0–255). Defaults to 34 */
  threshold?: number;
}

export function InteractiveParticles({
  src,
  waitlistCount = 1,
  waitlistLabel = "",
  maxDimension = 320,
  className,
  background = "transparent",
  color = "#0071e3",
  size = 1.35,
  randomness = 1.8,
  depth = 3.0,
  touchRadius = 0.16,
  threshold = 34,
}: InteractiveParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live database count state (refreshed every second)
  const [liveCount, setLiveCount] = useState<number | string>(waitlistCount);

  useEffect(() => {
    setLiveCount(waitlistCount);
  }, [waitlistCount]);

  useEffect(() => {
    let active = true;

    async function fetchLiveCount() {
      try {
        const { count, error } = await supabase
          .from("waitinglist")
          .select("*", { count: "exact", head: true });
        if (active && !error && typeof count === "number") {
          setLiveCount((prev) => (prev !== count ? count : prev));
        }
      } catch (err) {
        console.error("Failed to fetch live count in particle canvas:", err);
      }
    }

    // Initial check
    fetchLiveCount();

    // React immediately to local waitlist submissions
    const handleWaitlistUpdated = () => {
      fetchLiveCount();
    };
    window.addEventListener("waitlist-updated", handleWaitlistUpdated);

    // Conservative fallback refresh every 60 seconds instead of continuous 1s polling
    const interval = setInterval(fetchLiveCount, 60000);

    return () => {
      active = false;
      window.removeEventListener("waitlist-updated", handleWaitlistUpdated);
      clearInterval(interval);
    };
  }, []);

  // Fallback dynamic particle texture containing waitlist numbers
  const [generatedSrc, setGeneratedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      const currentCount = liveCount ?? waitlistCount;
      const formatted =
        typeof currentCount === "number"
          ? currentCount.toLocaleString()
          : String(currentCount || "1");
      const url = createWaitlistTextImage(formatted, waitlistLabel);
      setGeneratedSrc(url);
    }
  }, [src, liveCount, waitlistCount, waitlistLabel]);

  const effectiveSrc = src ?? generatedSrc ?? null;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !effectiveSrc) return;

    let disposed = false;
    const getSize = () => ({
      width: container.clientWidth || 1,
      height: container.clientHeight || 1,
    });
    let view = getSize();

    // ── Three.js basics ─────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, view.width / view.height, 1, 10000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(view.width, view.height);
    renderer.setClearColor(0x000000, 0); // 100% transparent to blend with page theme

    let fovHeight = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;

    let timer: THREE.Timer | null = null;
    if (typeof (THREE as any).Timer === "function") {
      timer = new (THREE as any).Timer();
    }
    let lastPerfTime = performance.now();
    const container3D = new THREE.Object3D();
    scene.add(container3D);

    // ── Interaction ─────────────────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    let rect = canvas.getBoundingClientRect();

    let object3D: THREE.Mesh | null = null;
    let hitArea: THREE.Mesh | null = null;
    let touch: TouchTexture | null = null;
    let uniforms: Record<string, THREE.IUniform> | null = null;
    let imgWidth = 0;
    let imgHeight = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (!hitArea || !touch) return;
      rect = canvas.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(hitArea);
      if (hits.length > 0 && hits[0].uv) touch.addTouch(hits[0].uv.x, hits[0].uv.y);
    };
    canvas.addEventListener("pointermove", onPointerMove);

    // ── Build particles from image ───────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(effectiveSrc, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      const image = texture.image as HTMLImageElement;

      const longest = Math.max(image.width, image.height);
      const isMobileDevice = typeof window !== 'undefined' && window.innerWidth < 768;
      const effectiveMaxDim = maxDimension ? maxDimension : (isMobileDevice ? 260 : 300);
      const scaleDown = longest > effectiveMaxDim ? effectiveMaxDim / longest : 1;
      imgWidth = Math.max(1, Math.round(image.width * scaleDown));
      imgHeight = Math.max(1, Math.round(image.height * scaleDown));
      const numPoints = imgWidth * imgHeight;

      const readCanvas = document.createElement("canvas");
      readCanvas.width = imgWidth;
      readCanvas.height = imgHeight;
      const rctx = readCanvas.getContext("2d")!;
      rctx.scale(1, -1);
      rctx.drawImage(image, 0, 0, imgWidth, imgHeight * -1);
      const colors = Float32Array.from(rctx.getImageData(0, 0, imgWidth, imgHeight).data);

      let numVisible = 0;
      for (let i = 0; i < numPoints; i++) {
        if (colors[i * 4] > threshold) numVisible++;
      }

      uniforms = {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new THREE.Vector2(imgWidth, imgHeight) },
        uTexture: { value: texture },
        uTouch: { value: null },
        uColor: { value: new THREE.Color(color) },
      };

      const material = new THREE.RawShaderMaterial({
        uniforms,
        vertexShader: VERT,
        fragmentShader: FRAG,
        depthTest: false,
        transparent: true,
      });

      const geometry = new THREE.InstancedBufferGeometry();

      const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
      positions.setXYZ(0, -0.5, 0.5, 0.0);
      positions.setXYZ(1, 0.5, 0.5, 0.0);
      positions.setXYZ(2, -0.5, -0.5, 0.0);
      positions.setXYZ(3, 0.5, -0.5, 0.0);
      geometry.setAttribute("position", positions);

      const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
      uvs.setXY(0, 0.0, 0.0);
      uvs.setXY(1, 1.0, 0.0);
      uvs.setXY(2, 0.0, 1.0);
      uvs.setXY(3, 1.0, 1.0);
      geometry.setAttribute("uv", uvs);

      geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

      const indices = new Uint16Array(numVisible);
      const offsets = new Float32Array(numVisible * 3);
      const angles = new Float32Array(numVisible);
      let count = 0;
      for (let i = 0; i < numPoints; i++) {
        if (colors[i * 4] <= threshold) continue;
        offsets[count * 3 + 0] = i % imgWidth;
        offsets[count * 3 + 1] = Math.floor(i / imgWidth);
        indices[count] = i;
        angles[count] = Math.random() * Math.PI;
        count++;
      }
      geometry.setAttribute("pindex", new THREE.InstancedBufferAttribute(indices, 1, false));
      geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3, false));
      geometry.setAttribute("angle", new THREE.InstancedBufferAttribute(angles, 1, false));

      object3D = new THREE.Mesh(geometry, material);
      container3D.add(object3D);

      const hitGeo = new THREE.PlaneGeometry(imgWidth, imgHeight, 1, 1);
      const hitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, depthTest: false });
      hitMat.visible = false;
      hitArea = new THREE.Mesh(hitGeo, hitMat);
      container3D.add(hitArea);

      touch = new TouchTexture(touchRadius);
      uniforms.uTouch.value = touch.texture;

      applyScale();

      // Intro animation.
      gsap.fromTo(uniforms.uSize, { value: 0.5 }, { value: size, duration: 1.0 });
      gsap.to(uniforms.uRandom, { value: randomness, duration: 1.0 });
      gsap.fromTo(uniforms.uDepth, { value: 35.0 }, { value: depth, duration: 1.5 });
    });

    const applyScale = () => {
      if (!object3D || !hitArea || !imgHeight || !imgWidth) return;
      const fovWidth = fovHeight * camera.aspect;
      const scaleX = (fovWidth * 0.96) / imgWidth;
      const scaleY = (fovHeight * 0.85) / imgHeight;
      const scale = Math.min(scaleX, scaleY);
      object3D.scale.set(scale, scale, 1);
      hitArea.scale.set(scale, scale, 1);
    };

    // ── Resize ────────────────────────────────────────────────────────────────
    const applySize = () => {
      view = getSize();
      camera.aspect = view.width / view.height;
      camera.updateProjectionMatrix();
      fovHeight = 2 * Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
      renderer.setSize(view.width, view.height);
      rect = canvas.getBoundingClientRect();
      applyScale();
    };
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(container);
    window.addEventListener("resize", applySize);

    // ── Loop ──────────────────────────────────────────────────────────────────
    let isInViewport = true;
    let lastRender = 0;
    const frameInterval = 1000 / 30;
    const renderFrame = (timestamp: number) => {
      if (timestamp - lastRender < frameInterval) return;
      lastRender = timestamp;
      let delta = 0;
      if (timer) {
        timer.update(timestamp);
        delta = Math.min(timer.getDelta(), 0.05);
      } else {
        const now = performance.now();
        delta = Math.min((now - lastPerfTime) / 1000, 0.05);
        lastPerfTime = now;
      }
      if (touch) touch.update();
      if (uniforms) uniforms.uTime.value += delta;
      renderer.render(scene, camera);
    };

    const updateAnimationLoop = () => {
      renderer.setAnimationLoop(
        !disposed && isInViewport && !document.hidden ? renderFrame : null,
      );
    };
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        updateAnimationLoop();
      },
      { rootMargin: "160px" },
    );
    const onVisibilityChange = () => updateAnimationLoop();
    visibilityObserver.observe(container);
    document.addEventListener("visibilitychange", onVisibilityChange);
    updateAnimationLoop();

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", applySize);
      resizeObserver.disconnect();
      if (uniforms) gsap.killTweensOf([uniforms.uSize, uniforms.uRandom, uniforms.uDepth]);
      if (object3D) {
        object3D.geometry.dispose();
        (object3D.material as THREE.Material).dispose();
      }
      if (hitArea) {
        hitArea.geometry.dispose();
        (hitArea.material as THREE.Material).dispose();
      }
      if (touch) touch.texture.dispose();
      renderer.dispose();
    };
  }, [effectiveSrc, color, size, randomness, depth, touchRadius, threshold, maxDimension]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden select-none", className)}
      style={{ background }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}

export default InteractiveParticles;
