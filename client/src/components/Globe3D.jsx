import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { feature } from "topojson-client";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";

// ─── Geo math ───────────────────────────────────────────────────

function latLngToDir(lat, lng) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  return new THREE.Vector3(
    -(Math.sin(phi) * Math.cos(theta)),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ).normalize();
}

function latLngToPos(lat, lng, r) {
  return latLngToDir(lat, lng).multiplyScalar(r);
}

// ─── Texture builder ────────────────────────────────────────────

const TEX_W = 4096;
const TEX_H = 2048;

function lngToX(lng) { return ((lng + 180) / 360) * TEX_W; }
function latToY(lat) { return ((90 - lat) / 180) * TEX_H; }

function drawRing(ctx, ring) {
  if (ring.length < 2) return;
  ctx.moveTo(lngToX(ring[0][0]), latToY(ring[0][1]));
  for (let i = 1; i < ring.length; i++) {
    if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) {
      ctx.moveTo(lngToX(ring[i][0]), latToY(ring[i][1]));
    } else {
      ctx.lineTo(lngToX(ring[i][0]), latToY(ring[i][1]));
    }
  }
}

function polygonArea(coords) {
  let area = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    area += coords[i][0] * coords[i + 1][1] - coords[i + 1][0] * coords[i][1];
  }
  return Math.abs(area) / 2;
}

function centroid(geometry) {
  let coords;
  if (geometry.type === "Polygon") {
    coords = geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    let best = geometry.coordinates[0][0];
    let bestArea = 0;
    for (const poly of geometry.coordinates) {
      const a = polygonArea(poly[0]);
      if (a > bestArea) { bestArea = a; best = poly[0]; }
    }
    coords = best;
  } else return null;
  let sx = 0, sy = 0;
  for (const c of coords) { sx += c[0]; sy += c[1]; }
  return [sx / coords.length, sy / coords.length];
}

// Well-known label overrides for countries whose polygon centroid falls in an
// awkward spot (e.g. France centroid lands in Africa due to overseas territories).
const LABEL_OVERRIDES = {
  France: [46.6, 2.5],
  Norway: [64.5, 12.0],
  "United States of America": [39.5, -98.5],
  Russia: [62.0, 95.0],
  Canada: [60.0, -96.0],
  China: [35.0, 103.0],
  Brazil: [-10.0, -52.0],
  Australia: [-25.5, 134.5],
  Indonesia: [-2.5, 118.0],
  India: [22.0, 79.0],
  Chile: [-33.5, -70.5],
  "New Zealand": [-41.5, 174.0],
  Netherlands: [52.2, 5.3],
  Denmark: [56.0, 10.0],
  Portugal: [39.5, -8.0],
  Malaysia: [3.5, 109.0],
  Japan: [36.5, 138.5],
  "United Kingdom": [54.0, -2.5],
};

async function loadGeoData() {
  const topoRes = await fetch("/countries-110m.json").then((r) => r.json());
  const geo = feature(topoRes, topoRes.objects.countries);

  const countries = [];
  for (const feat of geo.features) {
    const name = feat.properties.name;
    if (!name) continue;
    const override = LABEL_OVERRIDES[name];
    const c = override ? [override[1], override[0]] : centroid(feat.geometry);
    if (!c) continue;

    let area = 0;
    const geom = feat.geometry;
    if (geom.type === "Polygon") {
      area = polygonArea(geom.coordinates[0]);
    } else if (geom.type === "MultiPolygon") {
      for (const poly of geom.coordinates) area += polygonArea(poly[0]);
    }
    countries.push({ name, lat: c[1], lng: c[0], area, geometry: geom });
  }
  return countries;
}

function drawBorders(ctx, countries) {
  // Border glow pass
  ctx.strokeStyle = "rgba(100, 160, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const c of countries) {
    ctx.beginPath();
    const { geometry } = c;
    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) drawRing(ctx, ring);
    } else if (geometry.type === "MultiPolygon") {
      for (const poly of geometry.coordinates)
        for (const ring of poly) drawRing(ctx, ring);
    }
    ctx.stroke();
  }

  // Crisp border pass
  ctx.strokeStyle = "rgba(200, 225, 255, 0.7)";
  ctx.lineWidth = 1.6;
  for (const c of countries) {
    ctx.beginPath();
    const { geometry } = c;
    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) drawRing(ctx, ring);
    } else if (geometry.type === "MultiPolygon") {
      for (const poly of geometry.coordinates)
        for (const ring of poly) drawRing(ctx, ring);
    }
    ctx.stroke();
  }
}

const BORDER_RADIUS = 2.003;

function buildBorderGeometry(countries) {
  const verts = [];
  for (const c of countries) {
    const rings = [];
    const { geometry } = c;
    if (geometry.type === "Polygon") {
      for (const ring of geometry.coordinates) rings.push(ring);
    } else if (geometry.type === "MultiPolygon") {
      for (const poly of geometry.coordinates)
        for (const ring of poly) rings.push(ring);
    }
    for (const ring of rings) {
      for (let i = 0; i < ring.length - 1; i++) {
        const [lng0, lat0] = ring[i];
        const [lng1, lat1] = ring[i + 1];
        if (Math.abs(lng1 - lng0) > 180) continue;
        const p0 = latLngToPos(lat0, lng0, BORDER_RADIUS);
        const p1 = latLngToPos(lat1, lng1, BORDER_RADIUS);
        verts.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts), 3));
  return geo;
}

async function buildTextures() {
  const [img, countries] = await Promise.all([
    new Promise((res, rej) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = "/earth-blue-marble.jpg";
    }),
    loadGeoData(),
  ]);

  // ── Plain texture (no borders) ──
  const plainCanvas = document.createElement("canvas");
  plainCanvas.width = TEX_W;
  plainCanvas.height = TEX_H;
  const pCtx = plainCanvas.getContext("2d");
  pCtx.drawImage(img, 0, 0, TEX_W, TEX_H);

  const plainTex = new THREE.CanvasTexture(plainCanvas);
  plainTex.colorSpace = THREE.SRGBColorSpace;
  plainTex.needsUpdate = true;

  // ── Overlay texture (with borders) ──
  const overCanvas = document.createElement("canvas");
  overCanvas.width = TEX_W;
  overCanvas.height = TEX_H;
  const oCtx = overCanvas.getContext("2d");
  oCtx.drawImage(img, 0, 0, TEX_W, TEX_H);

  // Slight darken for contrast
  oCtx.fillStyle = "rgba(0, 0, 15, 0.12)";
  oCtx.fillRect(0, 0, TEX_W, TEX_H);

  drawBorders(oCtx, countries);

  const overTex = new THREE.CanvasTexture(overCanvas);
  overTex.colorSpace = THREE.SRGBColorSpace;
  overTex.needsUpdate = true;

  const borderGeo = buildBorderGeometry(countries);

  return { plainTex, overTex, countries, borderGeo };
}

// ─── Billboard country labels ───────────────────────────────────

const _dir = new THREE.Vector3();
const _camDir = new THREE.Vector3();

const MIN_DIST = 3.0;
const MAX_DIST = 8.0;

function CountryLabels({ countries, globeRef }) {
  const { camera } = useThree();
  const [visible, setVisible] = useState([]);
  const frameCount = useRef(0);

  useFrame(() => {
    // Throttle to every 3rd frame for performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;
    if (!globeRef.current) return;

    camera.getWorldDirection(_camDir);
    const camPos = camera.position;
    const dist = camPos.length();

    // zoom: 0 = far out, 1 = fully zoomed in
    const zoom = THREE.MathUtils.clamp(1 - (dist - MIN_DIST) / (MAX_DIST - MIN_DIST), 0, 1);

    // More labels visible as user zooms in
    const maxLabels = Math.round(THREE.MathUtils.lerp(18, 120, zoom));
    // Loosen the facing threshold when zoomed in so more peripheral labels show
    const dotThreshold = THREE.MathUtils.lerp(0.2, 0.05, zoom);
    // Smaller countries become visible when zoomed in
    const minArea = THREE.MathUtils.lerp(8, 0, zoom);

    const globeMatrix = globeRef.current.matrixWorld;
    const vis = [];

    for (let i = 0; i < countries.length; i++) {
      const c = countries[i];
      if (c.area < minArea) continue;
      _dir.copy(c._dir).applyMatrix4(globeMatrix).normalize();
      const dot = _dir.dot(_camDir.clone().negate());
      if (dot > dotThreshold) {
        vis.push({ ...c, dot, idx: i });
      }
    }

    vis.sort((a, b) => b.area - a.area);
    const capped = vis.slice(0, maxLabels);
    setVisible((prev) => {
      if (prev.length === capped.length && prev.every((p, j) => p.idx === capped[j]?.idx)) return prev;
      return capped;
    });
  });

  return visible.map((c) => {
    const isLarge = c.area > 200;
    const fontSize = isLarge ? 13 : c.area > 50 ? 11 : c.area > 10 ? 10 : 9;

    return (
      <Html
        key={c.name}
        position={c._pos}
        center
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none", userSelect: "none" }}
        occlude={false}
      >
        <span
          className="whitespace-nowrap font-sans"
          style={{
            fontSize,
            fontWeight: isLarge ? 700 : 600,
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 0 6px rgba(0,0,0,0.7)",
            letterSpacing: isLarge ? "0.14em" : "0.05em",
            textTransform: isLarge ? "uppercase" : "none",
          }}
        >
          {c.name}
        </span>
      </Html>
    );
  });
}

// ─── Marker ─────────────────────────────────────────────────────

function GlobeMarker({ lat, lng, radius, name }) {
  const ref = useRef();
  const pos = useMemo(() => latLngToPos(lat, lng, radius), [lat, lng, radius]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.3);
    }
  });

  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.15} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#e9d5ff" />
      </mesh>
      <pointLight color="#c084fc" intensity={4} distance={1.5} />
      <Html position={[0, 0.18, 0]} center distanceFactor={5} zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white shadow-lg shadow-black/40 backdrop-blur-sm">
          {name}
        </div>
      </Html>
    </group>
  );
}

// ─── Stars ──────────────────────────────────────────────────────

function StarField() {
  const ref = useRef();
  const geo = useMemo(() => {
    const n = 2500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 40 + Math.random() * 60;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      pos[i * 3 + 2] = r * Math.cos(p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.003; });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.15} color="#d4bfff" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

// ─── Earth ──────────────────────────────────────────────────────

function EarthMesh({ plainTex, countries, borderGeo }) {
  const groupRef = useRef();
  const destination = useAppStore((s) => s.activeDestination);
  const showOverlay = useAppStore((s) => s.showOverlay);
  const targetQuat = useRef(new THREE.Quaternion());
  const isIdle = useRef(true);
  const { camera } = useThree();
  const destVersion = useRef(0);

  const [bumpMap, specMap] = useLoader(THREE.TextureLoader, [
    "/earth-topology.png",
    "/earth-water.png",
  ]);

  const enrichedCountries = useMemo(() => {
    return countries.map((c) => ({
      ...c,
      _pos: latLngToPos(c.lat, c.lng, 2.08),
      _dir: latLngToDir(c.lat, c.lng),
    }));
  }, [countries]);

  useEffect(() => {
    if (destination) {
      isIdle.current = false;
      destVersion.current++;
      const dir = latLngToDir(destination.lat, destination.lng);
      const camDir = camera.position.clone().normalize();
      targetQuat.current.setFromUnitVectors(dir, camDir);
    } else {
      isIdle.current = true;
    }
  }, [destination, camera]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (isIdle.current) {
      g.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), delta * 0.06);
    } else {
      const t = 1 - Math.pow(0.005, delta);
      g.quaternion.slerp(targetQuat.current, t);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2, 96, 64]} />
        <meshPhongMaterial
          map={plainTex}
          bumpMap={bumpMap}
          bumpScale={0.03}
          specularMap={specMap}
          specular={new THREE.Color("#222230")}
          shininess={12}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>

      {showOverlay && (
        <lineSegments geometry={borderGeo}>
          <lineBasicMaterial color="#94b8db" transparent opacity={0.6} depthWrite={false} />
        </lineSegments>
      )}

      {showOverlay && (
        <CountryLabels countries={enrichedCountries} globeRef={groupRef} />
      )}

      {destination && (
        <GlobeMarker lat={destination.lat} lng={destination.lng} radius={2.04} name={destination.name} />
      )}
    </group>
  );
}

// ─── Scene ──────────────────────────────────────────────────────

function Scene({ plainTex, countries, borderGeo, isDark }) {
  return (
    <>
      <ambientLight intensity={isDark ? 1.0 : 1.6} />
      <directionalLight position={[5, 3, 5]} intensity={isDark ? 3.5 : 5.0} color="#ffffff" />
      <directionalLight position={[-3, 1, -4]} intensity={isDark ? 1.2 : 2.0} color={isDark ? "#e0e7ff" : "#fef3c7"} />
      <directionalLight position={[0, -4, 2]} intensity={isDark ? 0.5 : 1.0} color={isDark ? "#a5b4fc" : "#e0e7ff"} />
      {isDark && <StarField />}
      <EarthMesh plainTex={plainTex} countries={countries} borderGeo={borderGeo} />
      <OrbitControls enablePan={false} enableZoom minDistance={3.0} maxDistance={8} rotateSpeed={0.5} zoomSpeed={0.6} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial color="#1e1b4b" wireframe />
    </mesh>
  );
}

// ─── Root ───────────────────────────────────────────────────────

function GlobeCanvas({ data, isDark }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(isDark ? "#09090b" : "#f0f1f5");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = isDark ? 1.5 : 2.0;
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Scene plainTex={data.plainTex} countries={data.countries} borderGeo={data.borderGeo} isDark={isDark} />
      </Suspense>
    </Canvas>
  );
}

export default function Globe3D() {
  const [data, setData] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    buildTextures().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading Globe…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0" style={{ width: "100%", height: "100%" }}>
      <GlobeCanvas key={isDark ? "dark" : "light"} data={data} isDark={isDark} />
    </div>
  );
}
