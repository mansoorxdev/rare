'use client';

import React, { useEffect, useRef, useState } from 'react';

// 5x7 Bitmap Font for Digital Background Ticker (Refracted through Glass)
const BITMAP_5x7 = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '$': ['..#..', '.####', '#.#..', '.###.', '..#.#', '####.', '..#..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '+': ['.....', '..#..', '..#..', '#####', '..#..', '..#..', '.....'],
  '%': ['##..#', '##.#.', '...#.', '..#..', '.#...', '.#.##', '#..##'],
  '/': ['....#', '...#.', '..#..', '.#...', '#....', '.....', '.....'],
  'S': ['.####', '#....', '.###.', '....#', '####.', '.....', '.....'],
  'O': ['.###.', '#...#', '#...#', '#...#', '.###.', '.....', '.....'],
  'L': ['#....', '#....', '#....', '#....', '#####', '.....', '.....'],
  'R': ['####.', '#...#', '####.', '#.#..', '#..#.', '.....', '.....'],
  'A': ['.###.', '#...#', '#####', '#...#', '#...#', '.....', '.....'],
  'E': ['#####', '#....', '####.', '#....', '#####', '.....', '.....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....']
};

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uRadius;
uniform mat3 uRot;
uniform vec3 uLight;
uniform float uFlash;
uniform float uBeam;
uniform sampler2D uDigits;
uniform float uHasDigits;
uniform vec3 uTint;
out vec4 outColor;

const vec3 AX = vec3(0.68, 1.0, 0.68);
const float IOR = 1.46;

vec2 hitOcta(vec3 o, vec3 d, out vec3 n0, out vec3 n1) {
  float tn = -1e9, tf = 1e9;
  n0 = vec3(0.0); n1 = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    vec3 s = vec3((i & 1) == 0 ? 1.0 : -1.0, (i & 2) == 0 ? 1.0 : -1.0, (i & 4) == 0 ? 1.0 : -1.0);
    vec3 n = s / AX;
    float nd = dot(n, d), no = dot(n, o);
    if (abs(nd) < 1e-6) { if (no > 1.0) return vec2(1.0, -1.0); continue; }
    float t = (1.0 - no) / nd;
    if (nd < 0.0) { if (t > tn) { tn = t; n0 = n; } }
    else { if (t < tf) { tf = t; n1 = n; } }
  }
  return vec2(tn, tf);
}

float edgeDist(vec3 p) {
  vec3 q = abs(p) / AX;
  return min(q.x, min(q.y, q.z));
}

vec3 digitsAt(vec2 frag) {
  vec2 uv = frag / uRes;
  return texture(uDigits, vec2(uv.x, 1.0 - uv.y)).rgb * uHasDigits;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 q = (frag - uCenter) / uRadius;
  float r = length(q);
  vec3 bloomCol = vec3(1.0, 0.95, 0.9) * uFlash * 0.4 * exp(-r * r * 3.2);
  if (r > 1.25) {
    float a = clamp(max(bloomCol.r, max(bloomCol.g, bloomCol.b)), 0.0, 1.0);
    outColor = vec4(bloomCol, a);
    return;
  }

  mat3 RT = transpose(uRot);
  vec3 ro = RT * vec3(q, 3.0);
  vec3 rd = RT * normalize(vec3(q * 0.08, -1.0));
  vec3 n0, n1;
  vec2 t = hitOcta(ro, rd, n0, n1);
  if (t.x > t.y || t.y < 0.0) {
    float a = clamp(max(bloomCol.r, max(bloomCol.g, bloomCol.b)), 0.0, 1.0);
    outColor = vec4(bloomCol, a);
    return;
  }

  vec3 p0 = ro + rd * t.x;
  vec3 N0 = normalize(n0);
  vec3 L = RT * normalize(uLight);

  vec3 di = refract(rd, N0, 1.0 / IOR);
  vec3 m0, m1;
  vec2 t2 = hitOcta(p0 - di * 1e-3, di, m0, m1);
  vec3 p1 = p0 + di * max(t2.y, 0.0);
  vec3 N1 = normalize(m1);
  vec3 dout = refract(di, -N1, IOR);
  if (dot(dout, dout) < 1e-4) dout = reflect(di, -N1);
  vec3 dw = uRot * dout;

  vec2 shift = dw.xy * uRadius * 0.18;
  vec3 through = vec3(
    digitsAt(frag + shift * 1.00).r,
    digitsAt(frag + shift * 1.06).g,
    digitsAt(frag + shift * 1.12).b
  ) * 2.2;

  float cosi = clamp(dot(-rd, N0), 0.0, 1.0);
  float fres = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);
  vec3 refl = reflect(rd, N0);
  float spec = pow(max(dot(refl, L), 0.0), 48.0);
  float faceCatch = smoothstep(0.86, 0.97, dot(refl, L)) * (0.25 + uFlash);
  vec3 env = mix(vec3(0.03, 0.02, 0.05), uTint, smoothstep(-0.2, 0.9, refl.y) * 0.35);

  float ef = edgeDist(p0), eb = edgeDist(p1);
  float w = 0.012 + 0.006 * (1.0 - cosi);
  float edgeF = 1.0 - smoothstep(0.0, w, ef);
  float edgeB = 1.0 - smoothstep(0.0, w * 0.8, eb);

  vec3 col = through * (1.0 - fres) + env * 0.6 + fres * vec3(0.55, 0.5, 0.55);
  col += uTint * uBeam * 0.12 * (1.0 - cosi);
  col += vec3(1.0) * spec * 0.9 + vec3(1.0, 0.97, 0.93) * faceCatch * 1.4;
  col += vec3(0.95) * edgeF * 0.95 + vec3(0.75) * edgeB * 0.35;
  col += bloomCol;
  float alpha = clamp(0.32 + fres * 0.5 + faceCatch + edgeF + edgeB * 0.4 + spec, 0.0, 1.0);
  outColor = vec4(col * alpha, alpha);
}`;

class CrystalRenderer {
  constructor(canvas, gl) {
    this.canvas = canvas;
    this.gl = gl;
    this.u = {};
    this.hasDigits = false;
    this.lost = false;

    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(prog) || 'Link failed');
    }
    this.prog = prog;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uniforms = ['uRes', 'uCenter', 'uRadius', 'uRot', 'uLight', 'uFlash', 'uBeam', 'uDigits', 'uHasDigits', 'uTint'];
    for (const name of uniforms) {
      this.u[name] = gl.getUniformLocation(prog, name);
    }

    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.uniform1i(this.u.uDigits, 0);

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
    });
  }

  compileShader(type, src) {
    const s = this.gl.createShader(type);
    this.gl.shaderSource(s, src);
    this.gl.compileShader(s);
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(s) || 'Compile failed');
    }
    return s;
  }

  setDigits(srcCanvas) {
    if (!this.gl || this.lost) return;
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);
    this.hasDigits = true;
  }

  render(opts, dpr) {
    if (this.lost) return;
    const gl = this.gl;
    const a = this.canvas;
    gl.viewport(0, 0, a.width, a.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(this.prog);

    gl.uniform2f(this.u.uRes, a.width, a.height);
    gl.uniform2f(this.u.uCenter, opts.center.x * dpr, a.height - opts.center.y * dpr);
    gl.uniform1f(this.u.uRadius, opts.radius * dpr);

    // Rotation Matrix
    const rotMat = this.calcRotation(opts.time * opts.tumble);
    gl.uniformMatrix3fv(this.u.uRot, false, rotMat);

    gl.uniform3f(this.u.uLight, ...opts.light);
    gl.uniform1f(this.u.uFlash, opts.flash);
    gl.uniform1f(this.u.uBeam, opts.beam);
    gl.uniform1f(this.u.uHasDigits, this.hasDigits ? 1.0 : 0.0);
    gl.uniform3f(this.u.uTint, ...opts.tint);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  calcRotation(angle) {
    const raw = [0.42, 1, 0.28];
    const r = Math.hypot(...raw);
    const [ax, ay, az] = [raw[0] / r, raw[1] / r, raw[2] / r];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const omc = 1 - cos;

    const c = [
      omc * ax * ax + cos,
      omc * ax * ay + sin * az,
      omc * ax * az - sin * ay,
      omc * ax * ay - sin * az,
      omc * ay * ay + cos,
      omc * ay * az + sin * ax,
      omc * ax * az + sin * ay,
      omc * ay * az - sin * ax,
      omc * az * az + cos
    ];

    const d = new Float32Array(9);
    for (let e = 0; e < 3; e++) {
      const t = c[3 * e];
      const r_val = c[3 * e + 1];
      const a_val = c[3 * e + 2];
      d[3 * e] = t;
      d[3 * e + 1] = 0.9492354180824408 * r_val - 0.31456656061611776 * a_val;
      d[3 * e + 2] = 0.31456656061611776 * r_val + 0.9492354180824408 * a_val;
    }
    return d;
  }
}

// Draw Refracted Laser Beams in 2D Canvas
const SPECTRUM = ['#fac88f', '#faa670', '#e58bb0', '#a47ce6', '#00E599'];

function drawBeams(canvas, { w, h, dpr }, origin, { angle, intensity }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';

  const dx = origin.x * w;
  const dy = origin.y * h;
  const hyp = 1.25 * Math.hypot(w, h);
  const px = dx - Math.cos(angle) * hyp;
  const py = dy - Math.sin(angle) * hyp;

  // Incident Beam Layers
  const beamLayers = [
    [52, 0.03],
    [24, 0.06],
    [10, 0.15],
    [3.5, 0.6],
    [1.5, 0.95]
  ];

  for (const [width, alpha] of beamLayers) {
    const grad = ctx.createLinearGradient(px, py, dx, dy);
    grad.addColorStop(0, 'rgba(246, 239, 226, 0)');
    grad.addColorStop(0.55, `rgba(246, 239, 226, ${0.65 * alpha * intensity})`);
    grad.addColorStop(1, `rgba(255, 250, 240, ${alpha * intensity})`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(dx, dy);
    ctx.stroke();
  }

  // Dispersed Refracted Rainbow Slices
  const exitAngle = 0.45 * angle + 0.34;
  const maxDist = Math.hypot(w, h);

  SPECTRUM.forEach((hex, idx) => {
    const a0 = exitAngle + (idx - 2) * 0.052 - 0.026;
    const a1 = exitAngle + (idx - 2) * 0.052 + 0.026;
    const [r, g, b] = [1, 3, 5].map((pos) => parseInt(hex.slice(pos, pos + 2), 16));

    const radGrad = ctx.createRadialGradient(dx, dy, 4, dx, dy, maxDist);
    radGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.6 * intensity})`);
    radGrad.addColorStop(0.38, `rgba(${r}, ${g}, ${b}, ${0.25 * intensity})`);
    radGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.moveTo(dx, dy);
    ctx.lineTo(dx + Math.cos(a0) * maxDist, dy + Math.sin(a0) * maxDist);
    ctx.lineTo(dx + Math.cos(a1) * maxDist, dy + Math.sin(a1) * maxDist);
    ctx.closePath();
    ctx.fill();
  });

  // Central Prism Flash Bloom
  const flashGrad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 80);
  flashGrad.addColorStop(0, `rgba(255, 248, 236, ${0.55 * intensity})`);
  flashGrad.addColorStop(1, 'rgba(255, 248, 236, 0)');
  ctx.fillStyle = flashGrad;
  ctx.fillRect(dx - 80, dy - 80, 160, 160);

  ctx.globalCompositeOperation = 'source-over';
}

// 5x7 Digital Background Ticker Drawer
function drawDigits(ctx, text, { color = '#f6efe2', alpha = 0.12, region } = {}) {
  const { width: w, height: h } = ctx.canvas;
  ctx.clearRect(0, 0, w, h);

  const dx = (region?.x ?? 0) * w;
  const dy = (region?.y ?? 0) * h;
  const dw = (region?.w ?? 1) * w;
  const dh = (region?.h ?? 1) * h;

  const chars = [...text].filter((c) => c in BITMAP_5x7);
  if (!chars.length) return;

  const gap = 1;
  const totalCols = chars.length * (5 + gap) - gap;
  const pixelSize = Math.max(2, Math.floor(Math.min((0.92 * dw) / totalCols, (dh * 0.6) / 7)));
  const startX = Math.round(dx + (dw - totalCols * pixelSize) / 2);
  const startY = Math.round(dy + (dh - 7 * pixelSize) / 2);

  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;

  chars.forEach((c, cIdx) => {
    const glyph = BITMAP_5x7[c];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === '#') {
          ctx.fillRect(
            startX + (cIdx * (5 + gap) + col) * pixelSize,
            startY + row * pixelSize,
            pixelSize - 1,
            pixelSize - 1
          );
        }
      }
    }
  });

  ctx.globalAlpha = 1;
}

export default function ZauberHeroCanvas({ tickerValue = '10,078' }) {
  const containerRef = useRef(null);
  const webglCanvasRef = useRef(null);
  const beamCanvasRef = useRef(null);
  const bgDigitsCanvasRef = useRef(null);
  const rendererRef = useRef(null);

  const pointerRef = useRef(null);
  const beamStateRef = useRef({ angle: (18 * Math.PI) / 180, intensity: 1 });
  const dimsRef = useRef({ w: 1, h: 1, dpr: 1 });

  // WebGL & Canvas Lifecycle
  useEffect(() => {
    const glCanvas = webglCanvasRef.current;
    const beamCanvas = beamCanvasRef.current;
    const bgDigitsCanvas = bgDigitsCanvasRef.current;
    if (!glCanvas || !beamCanvas || !bgDigitsCanvas) return;

    let gl;
    try {
      gl = glCanvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true, antialias: true });
    } catch {
      // fallback
    }

    if (gl) {
      try {
        rendererRef.current = new CrystalRenderer(glCanvas, gl);
      } catch (err) {
        console.warn('WebGL2 crystal setup failed:', err);
      }
    }

    const updateSizes = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dimsRef.current = { w: rect.width, h: rect.height, dpr };

      [glCanvas, beamCanvas, bgDigitsCanvas].forEach((c) => {
        c.width = Math.max(1, Math.round(rect.width * dpr));
        c.height = Math.max(1, Math.round(rect.height * dpr));
      });

      // Redraw Digits into background canvas
      const dCtx = bgDigitsCanvas.getContext('2d');
      if (dCtx) {
        dCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawDigits(dCtx, tickerValue, {
          color: '#f6efe2',
          alpha: 0.05,
          region: { x: 0.44, y: 0.24, w: 0.52, h: 0.54 }
        });
        if (rendererRef.current) {
          rendererRef.current.setDigits(bgDigitsCanvas);
        }
      }
    };

    updateSizes();
    const ro = new ResizeObserver(updateSizes);
    ro.observe(containerRef.current);

    const onPointerMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerLeave = () => {
      pointerRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);

    // Animation Loop
    let animId;
    let startTime = performance.now();

    const renderLoop = (now) => {
      const elapsed = (now - startTime) * 0.001;
      const { w, h, dpr } = dimsRef.current;

      // Crystal origin point on screen (safely anchored on the right side on desktop)
      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1180;
      const origin = {
        x: isMobile ? 0.5 : (isTablet ? 0.78 : 0.72),
        y: isMobile ? 0.28 : 0.46
      };

      // Interactive laser beam angle calculation
      const defaultAngle = (18 * Math.PI) / 180;
      let targetAngle = defaultAngle;

      const pointer = pointerRef.current;
      if (pointer) {
        const dx = origin.x * w - pointer.x;
        const dy = origin.y * h - pointer.y;
        targetAngle = Math.atan2(dy, Math.max(1, Math.abs(dx)));
      }

      const maxLimit = (72 * Math.PI) / 180;
      targetAngle = Math.max(-maxLimit, Math.min(maxLimit, targetAngle));

      // Smooth interpolation
      const smoothFactor = 0.08;
      const beam = beamStateRef.current;
      beam.angle += (targetAngle - beam.angle) * smoothFactor;
      beam.intensity += ((pointer ? 1.25 : 1.0) - beam.intensity) * smoothFactor;

      // Draw Beams
      drawBeams(beamCanvas, dimsRef.current, origin, beam);

      // Render 3D Crystal
      if (rendererRef.current) {
        rendererRef.current.render(
          {
            center: { x: origin.x * w, y: origin.y * h },
            radius: isMobile ? Math.min(w, h) * 0.18 : Math.min(w, h) * (isTablet ? 0.22 : 0.26),
            time: elapsed,
            tumble: 0.65,
            light: [-0.6, 0.8, 1.2],
            flash: Math.sin(elapsed * 1.5) * 0.15 + 0.15,
            beam: beam.intensity,
            tint: [0.0, 0.9, 0.6]
          },
          dpr
        );
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [tickerValue]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#050505]"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* Background Digital Ticker Display */}
      <canvas
        ref={bgDigitsCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full blur-[0.6px]"
      />

      {/* Laser Beams Canvas */}
      <canvas
        ref={beamCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* WebGL2 Raytraced Crystal Canvas */}
      <canvas
        ref={webglCanvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Live Sample Ticker Indicator */}
      <span aria-hidden="true" className="absolute right-6 bottom-4 font-mono text-[10px] tracking-widest text-[#958890] uppercase">
        GENESIS CAP // 10,078 AGENTS
      </span>
    </div>
  );
}
