/* ============================================================
   GrihVann — live WebGL sea
   Vanilla port of the "SeaView WebGL Masterpiece" shaders:
   - OCEAN_FRAG    → hero background (live Arabian Sea at dusk)
   - CAUSTICS_FRAG → dark stats band background
   Requires WebGL2; every consumer keeps its static fallback
   (hero photo / --abyss band) when WebGL2 is unavailable.
   ============================================================ */
(() => {
  'use strict';

  const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const OCEAN_FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float seaHeight(vec2 p, float t){
  float h = 0.0;
  float amp = 0.62;
  float frq = 0.11;
  vec2 d = vec2(1.0, 0.35);
  for(int i = 0; i < 5; i++){
    float ph = dot(p, d) * frq + t * (0.85 + 0.22 * float(i));
    h += amp * (sin(ph) + 0.55 * sin(ph * 1.9 + 1.7));
    h += amp * 0.55 * noise(p * frq * 1.6 + vec2(t * 0.35, -t * 0.22));
    d = mat2(1.3, 1.1, -1.1, 1.3) * d;
    amp *= 0.48;
    frq *= 1.85;
  }
  return h;
}

float map(vec3 p, float t){ return p.y - seaHeight(p.xz, t); }

vec3 seaNormal(vec2 p, float t, float e){
  float h = seaHeight(p, t);
  return normalize(vec3(
    seaHeight(p - vec2(e, 0.0), t) - h,
    e,
    seaHeight(p - vec2(0.0, e), t) - h
  ));
}

vec3 skyColor(vec3 d, vec3 sun){
  float y = max(d.y, 0.0);
  vec3 col = mix(vec3(0.96, 0.55, 0.30), vec3(0.035, 0.10, 0.22), pow(y, 0.5));
  col = mix(col, vec3(0.42, 0.55, 0.68), pow(y, 0.12) * 0.25);
  float s = max(dot(d, sun), 0.0);
  col += vec3(1.0, 0.72, 0.42) * pow(s, 900.0) * 4.0;
  col += vec3(1.0, 0.55, 0.25) * pow(s, 10.0) * 0.38;
  col += vec3(0.95, 0.45, 0.30) * pow(s, 2.5) * 0.12;
  return col;
}

float trace(vec3 ori, vec3 dir, out vec3 p, float t){
  float tm = 0.0;
  float tx = 900.0;
  float hx = map(ori + dir * tx, t);
  if(hx > 0.0){ p = ori + dir * tx; return tx; }
  float hm = map(ori + dir * tm, t);
  for(int i = 0; i < 8; i++){
    float tmid = mix(tm, tx, hm / (hm - hx));
    p = ori + dir * tmid;
    float hmid = map(p, t);
    if(hmid < 0.0){ tx = tmid; hx = hmid; }
    else { tm = tmid; hm = hmid; }
  }
  return tm;
}

void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  float t = uTime * 0.9;

  vec3 sun = normalize(vec3(uMouse.x * 0.35, 0.16 + uMouse.y * 0.08, -1.0));
  vec3 ori = vec3(0.0, 3.4 + uScroll * 2.0, 6.0);
  vec3 fwd = normalize(vec3(0.0, -0.16 - uScroll * 0.12, -1.0));
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rgt, fwd);
  vec3 dir = normalize(uv.x * rgt + uv.y * up + fwd * 1.6);

  vec3 sky = skyColor(dir, sun);
  vec3 p;
  float dist = trace(ori, dir, p, t);
  vec3 col;
  if(dist > 800.0){
    col = sky;
  } else {
    vec3 n = seaNormal(p.xz, t, 0.02 + dist * 0.0016);
    vec3 refl = skyColor(reflect(dir, n), sun);
    float fres = 0.03 + 0.97 * pow(1.0 - max(dot(n, -dir), 0.0), 5.0);
    vec3 deep = vec3(0.012, 0.075, 0.11);
    vec3 scatter = vec3(0.02, 0.30, 0.34) * max(p.y * 0.4 + 0.4, 0.0);
    vec3 water = mix(deep + scatter, refl, clamp(fres, 0.0, 1.0));
    float spec = pow(max(dot(reflect(dir, n), sun), 0.0), 260.0) * 2.4;
    float foam = smoothstep(0.55, 1.05, p.y) * noise(p.xz * 3.0 + t) * 0.5;
    col = water + vec3(1.0, 0.75, 0.5) * spec + vec3(0.75, 0.85, 0.9) * foam;
    col = mix(col, sky, 1.0 - exp(-dist * 0.006));
  }

  col = pow(col, vec3(0.86));
  float vig = 1.0 - 0.32 * dot(uv * vec2(0.62, 0.8), uv * vec2(0.62, 0.8));
  fragColor = vec4(col * vig, 1.0);
}`;

  const CAUSTICS_FRAG = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for(int i = 0; i < 4; i++){
    v += a * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p;
    a *= 0.5;
  }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  float t = uTime * 0.25;
  vec2 q = vec2(fbm(uv * 2.2 + t * 0.3), fbm(uv * 2.2 - t * 0.24));
  float w = fbm(uv * 3.0 + q * 2.2 + vec2(t * 0.5, -t * 0.4));
  float c = pow(smoothstep(0.35, 0.95, w), 3.0);
  vec3 base = mix(vec3(0.006, 0.05, 0.09), vec3(0.02, 0.14, 0.20), uv.y * 0.7);
  vec3 col = base + vec3(0.12, 0.55, 0.62) * c * 0.85;
  col += vec3(0.55, 0.42, 0.24) * pow(c, 3.0) * 0.35;
  fragColor = vec4(col, 1.0);
}`;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mountShaderCanvas(canvas, frag, scale, onLive) {
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) { canvas.remove(); return; } // static fallback stays visible

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      canvas.remove();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uScroll = gl.getUniformLocation(prog, 'uScroll');

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    let scroll = 0, tscroll = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const onMove = (e) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1;
      tmy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      const r = canvas.parentElement && canvas.parentElement.getBoundingClientRect();
      if (!r) return;
      tscroll = Math.min(Math.max(-r.top / Math.max(r.height, 1), 0), 1);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let announced = false;
    const frame = () => {
      requestAnimationFrame(frame);
      if (!visible) return;
      resize();
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      scroll += (tscroll - scroll) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 12 : (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!announced) { announced = true; if (onLive) onLive(); }
    };
    frame();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- hero: live ocean replaces the static photo once running ---- */
  const heroCanvas = document.getElementById('hero-sea');
  mountShaderCanvas(heroCanvas, OCEAN_FRAG, 0.8, () => {
    heroCanvas.classList.add('is-live');
    const hero = document.getElementById('top');
    if (hero) hero.classList.add('is-live');
  });

  /* ---- stats band: dark caustics backdrop ---- */
  mountShaderCanvas(document.getElementById('stats-sea'), CAUSTICS_FRAG, 0.4);
})();
