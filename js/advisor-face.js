/**
 * GOVESER Advisor Face v1 \u2014 \u0646\u0638\u0627\u0645 \u062d\u0631\u0643\u0629 \u0648\u062c\u0647 \u0627\u0644\u0645\u0631\u0634\u062f (\u0627\u0644\u0639\u064a\u0646\u0627\u0646 \u0648\u0627\u0644\u0641\u0645 \u0648\u0627\u0644\u0631\u0623\u0633)
 *
 * \u064a\u0639\u0645\u0644 \u0639\u0644\u0649 \u0628\u0643\u0633\u0644\u0627\u062a \u0627\u0644\u0648\u062c\u0647 \u0627\u0644\u0623\u0635\u0644\u064a\u0629 \u0646\u0641\u0633\u0647\u0627 (eyes.webp / mouth.webp) \u062f\u0648\u0646 \u0631\u0633\u0645 \u0623\u064a \u0645\u0644\u0645\u062d \u062c\u062f\u064a\u062f:
 *  \u2022 \u0627\u0644\u062c\u0641\u0646: \u0627\u0644\u062c\u0641\u0646 \u0627\u0644\u0639\u0644\u0648\u064a \u064a\u0646\u0632\u0644 \u0645\u0646 \u0627\u0644\u0623\u0639\u0644\u0649 \u0625\u0644\u0649 \u0627\u0644\u0623\u0633\u0641\u0644 (\u0643\u0627\u0644\u0639\u064a\u0646 \u0627\u0644\u062d\u0642\u064a\u0642\u064a\u0629) \u0648\u064a\u0631\u062a\u0641\u0639 \u0627\u0644\u062c\u0641\u0646 \u0627\u0644\u0633\u0641\u0644\u064a \u0642\u0644\u064a\u0644\u064b\u0627\u061b
 *    \u0627\u0644\u0631\u0645\u0634 \u0639\u0634\u0648\u0627\u0626\u064a \u0627\u0644\u062a\u0648\u0642\u064a\u062a (\u0648\u0623\u062d\u064a\u0627\u0646\u064b\u0627 \u0645\u0632\u062f\u0648\u062c) \u0648\u0633\u0631\u064a\u0639 \u0627\u0644\u0625\u063a\u0644\u0627\u0642 \u0623\u0628\u0637\u0623 \u0627\u0644\u0641\u062a\u062d.
 *  \u2022 \u0627\u0644\u0639\u064a\u0646: \u0627\u0644\u0642\u0632\u062d\u064a\u0629 \u062a\u062a\u062d\u0631\u0643 \u062f\u0627\u062e\u0644 \u0641\u062a\u062d\u0629 \u0627\u0644\u0639\u064a\u0646 (\u0644\u0645\u0639\u0629 \u0627\u0644\u0636\u0648\u0621 \u062b\u0627\u0628\u062a\u0629)\u060c \u0645\u0639 \u0646\u0638\u0631\u0627\u062a \u0633\u0631\u064a\u0639\u0629 (saccades)
 *    \u0648\u0646\u0638\u0631\u0629 \u0646\u062d\u0648 \u0627\u0644\u062d\u0642\u0644 \u0627\u0644\u0645\u0633\u062a\u0647\u062f\u0641\u060c \u0648\u0646\u0638\u0631\u0629 \u0639\u0627\u0628\u0631\u0629 \u0646\u062d\u0648 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0634\u0631\u062d.
 *  \u2022 \u0627\u0644\u0641\u0645: \u0641\u0643 \u0633\u0641\u0644\u064a \u064a\u062a\u062d\u0631\u0643 \u0628\u0646\u0639\u0648\u0645\u0629 (\u0646\u0648\u0627\u0628\u0636 \u0645\u062e\u0645\u0651\u062f\u0629 \u0628\u062f\u0644 \u062d\u0644\u0642\u0629 CSS \u062b\u0627\u0628\u062a\u0629) \u0645\u0639 \u0623\u0634\u0643\u0627\u0644 \u062d\u0631\u0648\u0641 \u062a\u0642\u0631\u064a\u0628\u064a\u0629
 *    (\u0641\u062a\u062d/\u062a\u062f\u0648\u064a\u0631/\u0627\u0646\u0641\u0631\u0627\u062c/\u0625\u0637\u0628\u0627\u0642 \u0627\u0644\u0634\u0641\u062a\u064a\u0646 \u0644\u0644\u0645\u064a\u0645 \u0648\u0627\u0644\u0628\u0627\u0621 \u0648\u0627\u0644\u0641\u0627\u0621) \u0648\u062c\u062f\u0648\u0644 \u0632\u0645\u0646\u064a \u0645\u0646 \u0627\u0644\u0646\u0635 \u0646\u0641\u0633\u0647\u060c
 *    \u064a\u064f\u0635\u062d\u064e\u0651\u062d \u0639\u0646\u062f \u0623\u062d\u062f\u0627\u062b boundary \u0625\u0646 \u062a\u0648\u0641\u0631\u062a\u060c \u0648\u064a\u062a\u0628\u0639 \u0634\u062f\u0651\u0629 \u0627\u0644\u0635\u0648\u062a \u0627\u0644\u0641\u0639\u0644\u064a\u0629 \u0625\u0646 \u062a\u0648\u0641\u0631 \u0645\u0633\u0627\u0631 \u0635\u0648\u062a.
 *  \u2022 \u0627\u0644\u062a\u0639\u0628\u064a\u0631: \u0627\u0628\u062a\u0633\u0627\u0645\u0629 \u0647\u0627\u062f\u0626\u0629 \u062a\u062a\u063a\u064a\u0631 \u0628\u0628\u0637\u0621 (\u0645\u062d\u0627\u064a\u062f/\u0633\u0639\u064a\u062f/\u062c\u0627\u062f\u0651) \u0628\u062f\u0644 \u0627\u0628\u062a\u0633\u0627\u0645\u0629 \u062b\u0627\u0628\u062a\u0629.
 *  \u2022 \u0627\u0644\u0631\u0623\u0633: \u062a\u0646\u0641\u0651\u0633 \u0648\u062a\u0645\u0627\u064a\u0644 \u062f\u0642\u064a\u0642 \u062c\u062f\u064b\u0627 \u0648\u0625\u064a\u0645\u0627\u0621\u0627\u062a \u062e\u0641\u064a\u0641\u0629 \u0645\u0639 \u0627\u0644\u0646\u0628\u0631.
 *
 * \u0627\u0644\u0648\u0627\u062c\u0647\u0629: GOVESER_AdvisorFace.create({canvas, headAct, base, reduced, visible}) \u2192 \u0643\u0627\u0626\u0646 \u0628\u0627\u0644\u062f\u0648\u0627\u0644:
 *   look({nx,ny}|null)  talk(bool)  speak(text, lang, rate)  boundary(charIndex)  speakEnd()
 *   audioLevel(0..1|null)  mood(name, ms)  blinkNow()  pose(obj|null)  destroy()
 */
(function () {
  'use strict';
  var RIG = {"eyes":[{"name":"L","x0":183.0,"top":[152.05,151.19,150.41,149.73,149.15,148.68,148.28,147.93,147.62,147.34,147.06,146.78,146.5,146.26,146.09,146.0,145.97,145.94,145.92,145.91,145.9,145.92,146.03,146.22,146.48,146.76,147.05,147.43,147.89,148.42,149.0,149.67,150.46,151.37,152.4,153.67,155.2],"bot":[156.74,157.39,157.97,158.48,158.9,159.27,159.61,159.91,160.18,160.4,160.6,160.79,160.96,161.11,161.22,161.3,161.35,161.4,161.44,161.47,161.49,161.5,161.48,161.42,161.34,161.24,161.12,161.0,160.85,160.66,160.44,160.18,159.9,159.58,159.2,158.77,158.3],"iris":[201.55,153.54,8.05],"lidTop":[180,121,95],"lidBot":[188,121,92]},{"name":"R","x0":272.0,"top":[152.36,151.66,151.02,150.43,149.89,149.4,148.93,148.48,148.06,147.69,147.4,147.14,146.89,146.66,146.47,146.35,146.3,146.33,146.4,146.51,146.66,146.82,147.0,147.23,147.55,147.94,148.39,148.86,149.35,149.93,150.57,151.27,152.0,152.78,153.63,154.54,155.5],"bot":[158.6,159.14,159.64,160.1,160.49,160.8,161.06,161.3,161.52,161.71,161.86,161.97,162.02,162.07,162.11,162.14,162.17,162.19,162.2,162.2,162.17,162.13,162.06,161.98,161.9,161.8,161.67,161.49,161.26,160.99,160.69,160.37,160.02,159.6,159.12,158.58,158.0],"iris":[285.47,154.06,8.05],"lidTop":[146,92,68],"lidBot":[162,102,78]}],"mouth":{"x0":196,"cut":[232.76,233.3,233.84,234.39,234.94,235.5,236.05,236.57,237.11,237.68,238.3,239.0,239.85,240.86,241.97,243.12,244.25,245.3,246.33,247.4,248.43,249.36,250.12,250.68,251.16,251.58,251.95,252.29,252.6,252.89,253.15,253.39,253.62,253.84,254.06,254.3,254.58,254.87,255.11,255.27,255.3,255.29,255.28,255.27,255.25,255.22,255.2,255.17,255.14,255.09,255.03,254.97,254.89,254.8,254.65,254.42,254.11,253.77,253.39,253.02,252.66,252.3,251.91,251.5,251.03,250.5,249.83,249.0,248.13,247.29,246.47,245.63,244.73,243.7,242.27,240.65,239.5,238.89,238.39,237.98,237.63,237.31,237.0,236.68,236.3,235.89,235.47,235.06,234.64,234.22,233.8,233.38,232.96,232.55,232.13,231.71],"cx":243.5,"hw":48.0,"y0":218,"y1":267,"x_min":185,"x_max":299}};
  var CS = 2;                                   // \u062f\u0642\u0629 \u0627\u0644\u0644\u0648\u062d\u0629 = \u0636\u0639\u0641 \u0627\u0644\u0635\u0648\u0631\u0629 \u0627\u0644\u0623\u0635\u0644\u064a\u0629
  var W = 424, H = 592;

  /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0623\u062f\u0648\u0627\u062a \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function smooth01(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }
  function noise(t) { return (Math.sin(t * 1.31 + 1.7) + Math.sin(t * 0.71 + 4.2) + Math.sin(t * 2.17 + 0.3)) / 3; }
  // \u062a\u0646\u0639\u064a\u0645 \u0628\u062a\u062e\u0645\u064a\u062f \u062d\u0631\u062c (\u0628\u0644\u0627 \u0627\u0631\u062a\u062f\u0627\u062f): s = {x, v}
  function damp(s, target, omega, dt) {
    var x = omega * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
    var ch = s.x - target, tmp = (s.v + omega * ch) * dt;
    s.v = (s.v - omega * tmp) * e;
    s.x = target + (ch + tmp) * e;
  }
  function S0(v) { return { x: v || 0, v: 0 }; }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0623\u0634\u0643\u0627\u0644 \u0627\u0644\u0641\u0645 (visemes) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  // o: \u0645\u0642\u062f\u0627\u0631 \u0641\u062a\u062d \u0627\u0644\u0641\u0643 (0..1) \u060c l: \u0625\u0637\u0628\u0627\u0642 \u0627\u0644\u0634\u0641\u0629 \u0627\u0644\u0633\u0641\u0644\u0649 (0..1) \u060c w: \u062a\u063a\u064a\u0651\u0631 \u0627\u0644\u0639\u0631\u0636 \u060c r: \u0634\u062f\u0651 \u0627\u0644\u0632\u0648\u0627\u064a\u0627
  var V = {
    A: { o: 0.92, l: 0, w: 0.02, r: 0 },
    E: { o: 0.50, l: 0, w: 0.05, r: -0.2 },
    I: { o: 0.30, l: 0, w: 0.07, r: -0.4 },
    O: { o: 0.62, l: 0, w: -0.07, r: 0.5 },
    U: { o: 0.38, l: 0, w: -0.10, r: 0.8 },
    H: { o: 0.42, l: 0, w: 0.01, r: 0 },      // \u062d\u0631\u0648\u0641 \u062d\u0644\u0642\u064a\u0629: \u0639 \u062d \u0647
    M: { o: 0.0, l: 1, w: -0.02, r: 0.1 },    // \u0645 \u0628 p : \u0625\u0637\u0628\u0627\u0642
    F: { o: 0.10, l: 0.62, w: 0.01, r: 0 },   // \u0641 v
    S: { o: 0.14, l: 0, w: 0.05, r: -0.3 },   // \u062d\u0631\u0648\u0641 \u0635\u0641\u064a\u0631: \u0633 \u0635 \u0632 \u0634 \u062b
    C: { o: 0.20, l: 0, w: 0, r: 0 },         // \u0628\u0627\u0642\u064a \u0627\u0644\u062d\u0631\u0648\u0641
    _: { o: 0.04, l: 0.15, w: 0, r: 0 }       // \u0633\u0643\u0648\u0646 \u0628\u064a\u0646 \u0627\u0644\u0643\u0644\u0645\u0627\u062a
  };
  var AR_MAP = {};
  (function () {
    function put(chars, k) { for (var i = 0; i < chars.length; i++) AR_MAP[chars.charAt(i)] = k; }
    put('\u0627\u0623\u0625\u0622\u0649', 'A'); put('\u0648\u0624', 'U'); put('\u064a\u0626', 'I'); put('\u0639\u062d\u0647\u0629\u062e\u063a', 'H'); put('\u0645\u0628', 'M'); put('\u0641', 'F');
    put('\u0633\u0635\u0632\u0634\u062b\u0630\u0638', 'S'); put('\u062a\u062f\u0637\u0636\u0646\u0644\u0631\u0643\u0642\u062c\u0621', 'C');
  })();
  function vKey(ch) {
    if (AR_MAP[ch]) return AR_MAP[ch];
    var c = ch.toLowerCase();
    if (c === 'a') return 'A'; if (c === 'e') return 'E'; if (c === 'i' || c === 'y') return 'I';
    if (c === 'o') return 'O'; if (c === 'u') return 'U'; if (c === 'w') return 'U';
    if (c === 'm' || c === 'b' || c === 'p') return 'M'; if (c === 'f' || c === 'v') return 'F';
    if (c === 's' || c === 'z' || c === 'x' || c === 'c') return 'S';
    return 'C';
  }
  var DIAC = /[\u064b-\u065f\u0670\u0640]/;
  function isVowelKey(k) { return k === 'A' || k === 'E' || k === 'I' || k === 'O' || k === 'U'; }
  function buildTimeline(text) {
    var units = [], total = 0, i, ch, k, w, wordStart = true;
    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);
      if (DIAC.test(ch)) continue;
      if (/\s/.test(ch)) { units.push({ c: i, k: '_', w: 0.6, ws: false }); total += 0.6; wordStart = true; continue; }
      if (/[.!?\u061f]/.test(ch)) { units.push({ c: i, k: '_', w: 3.2, ws: false, pause: true }); total += 3.2; wordStart = true; continue; }
      if (/[,\u060c;\u061b:]/.test(ch)) { units.push({ c: i, k: '_', w: 2.0, ws: false, pause: true }); total += 2.0; wordStart = true; continue; }
      if (/[0-9\u0660-\u0669]/.test(ch)) { k = 'E'; }
      else if (/[A-Za-z\u0621-\u064a]/.test(ch)) { k = vKey(ch); }
      else continue;
      w = isVowelKey(k) ? 1.15 : (k === 'M' ? 0.5 : 0.55);
      units.push({ c: i, k: k, w: w, ws: wordStart && isVowelKey(k) });
      total += w; wordStart = false;
    }
    var acc = 0;
    for (i = 0; i < units.length; i++) { units[i].t = acc; acc += units[i].w; }
    return { units: units, total: total };
  }

  /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u0635\u0648\u0631 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function loadImg(src) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = function () { rej(new Error('img ' + src)); };
      im.src = src;
    });
  }

  /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u0643\u0627\u0626\u0646 \u0627\u0644\u0631\u0626\u064a\u0633\u064a \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function create(opts) {
    if (!opts || !opts.canvas || !window.Promise) return null;
    var canvas = opts.canvas, ctx = null;
    try { ctx = canvas.getContext('2d'); } catch (_) { ctx = null; }
    if (!ctx) return null;
    var base = opts.base || '', headAct = opts.headAct || null;
    var imgs = {}, ready = false, disposed = false, raf = 0, tmr = 0, last = 0;
    var reduced = function () { return !!(opts.reduced && opts.reduced()); };
    var visible = function () { return !document.hidden && (!opts.visible || opts.visible()); };

    canvas.width = W * CS; canvas.height = H * CS;

    // \u2500\u2500 \u0627\u0644\u062d\u0627\u0644\u0629 \u2500\u2500
    var P = null;                                       // \u0648\u0636\u0639\u064a\u0629 \u064a\u062f\u0648\u064a\u0629 (\u0627\u062e\u062a\u0628\u0627\u0631) \u0623\u0648 null
    var st = {
      gx: S0(), gy: S0(), tgx: 0, tgy: 0, gazeNext: 0, look: null, lastLook: null,
      blinkAt: 0, blinkT0: -1, blinkDur: [90, 40, 190], blinkAmt: 1, blinkP: 0, nextBlink: 0,
      jaw: S0(), lipS: S0(), sxS: S0(1), ckS: S0(), smile: S0(0.62),
      mood: 'calm', moodUntil: 0,
      hr: S0(), hy: S0(), hx: S0(), hz: S0(1), hk: 0, hs: 0,
      q: S0(), lidBase: S0(0.03)
    };
    var sp = { on: false, tl: null, k: 92, t0: 0, ui: -1, cur: V._, amp: 1, audio: null, audioT: 0, tail: false, fixed: false, rate: 0.95, lang: 'ar', startedAt: 0, nextTail: 0, lastBoundary: -1 };
    var sig = { eyes: '', mouth: '' };
    var EB = [], i0;
    for (i0 = 0; i0 < RIG.eyes.length; i0++) { var E0 = RIG.eyes[i0]; EB.push({ x: Math.floor(E0.x0) - 9, y: 139, w: E0.top.length + 19, h: 31 }); }
    var MB = { x: 183, y: 212, w: 121, h: 64 };
    var MR = RIG.mouth;

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u0631\u0633\u0645: \u0627\u0644\u0639\u064a\u0646\u0627\u0646 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    function eyePath(E) {
      var n = E.top.length, i;
      ctx.beginPath(); ctx.moveTo(E.x0, E.top[0]);
      for (i = 1; i < n; i++) ctx.lineTo(E.x0 + i, E.top[i]);
      for (i = n - 1; i >= 0; i--) ctx.lineTo(E.x0 + i, E.bot[i]);
      ctx.closePath();
    }
    function rgb(c, k, a) { k = k == null ? 1 : k; return 'rgba(' + Math.round(c[0] * k) + ',' + Math.round(c[1] * k) + ',' + Math.round(c[2] * k) + ',' + (a == null ? 1 : a) + ')'; }
    function drawEye(idx, p, q, gx, gy) {
      var E = RIG.eyes[idx], b = EB[idx], n = E.top.length, x0 = E.x0, i;
      var iris = E.iris, cx = iris[0], cy = iris[1], r = iris[2] + 1.2;
      var ox = gx * 3.0, oy = gy * 1.05;
      ctx.save(); eyePath(E); ctx.clip();
      ctx.drawImage(imgs.sclera, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
      ctx.save();
      ctx.translate(cx + ox, cy + oy); ctx.scale(1 - 0.09 * Math.abs(gx), 1);
      ctx.drawImage(imgs.iris, cx - r, cy - r, r * 2, r * 2, -r, -r, r * 2, r * 2);
      ctx.restore();
      ctx.drawImage(imgs.glint, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);
      // \u0638\u0644\u0651 \u0646\u0627\u0639\u0645 \u062a\u062d\u062a \u0627\u0644\u062c\u0641\u0646 \u0627\u0644\u0639\u0644\u0648\u064a \u0639\u0644\u0649 \u0645\u0642\u0644\u0629 \u0627\u0644\u0639\u064a\u0646
      if (p > 0.03) {
        var j, yU;
        ctx.lineWidth = 1.4; ctx.lineCap = 'butt';
        for (j = 0; j < 3; j++) {
          ctx.beginPath();
          for (i = 0; i < n; i++) {
            yU = E.top[i] + (E.top[i] + (E.bot[i] - E.top[i]) * 0.8 - E.top[i]) * p + 0.7 + j * 1.3;
            if (i === 0) ctx.moveTo(x0, yU); else ctx.lineTo(x0 + i, yU);
          }
          ctx.strokeStyle = 'rgba(12,4,3,' + (0.26 - j * 0.08).toFixed(3) + ')'; ctx.stroke();
        }
      }
      ctx.restore();
      ctx.drawImage(imgs.frame, b.x, b.y, b.w, b.h, b.x, b.y, b.w, b.h);

      // \u2500\u2500 \u0627\u0644\u062c\u0641\u0646 \u0627\u0644\u0639\u0644\u0648\u064a: \u064a\u0647\u0628\u0637 \u0645\u0646 \u0627\u0644\u0623\u0639\u0644\u0649 \u2500\u2500
      var cl = new Array(n), yu = new Array(n), yl = new Array(n);
      for (i = 0; i < n; i++) {
        var t = E.top[i], bt = E.bot[i];
        cl[i] = t + (bt - t) * 0.8;                         // \u062e\u0637 \u0627\u0644\u0625\u063a\u0644\u0627\u0642
        yu[i] = t + (cl[i] - t) * p;
        yl[i] = bt - (bt - cl[i]) * q;
      }
      if (p > 0.012) {
        ctx.beginPath(); ctx.moveTo(x0 - 0.3, E.top[0] - 1.0);
        for (i = 0; i < n; i++) ctx.lineTo(x0 + i, E.top[i] - 1.0);
        ctx.lineTo(x0 + n - 1 + 0.3, yu[n - 1]);
        for (i = n - 1; i >= 0; i--) ctx.lineTo(x0 + i, yu[i]);
        ctx.closePath();
        var gt = E.top[(n / 2) | 0] - 1, gg = ctx.createLinearGradient(0, gt, 0, gt + 13);
        gg.addColorStop(0, rgb(E.lidTop, 0.9)); gg.addColorStop(1, rgb(E.lidTop, 1.08));
        ctx.fillStyle = gg; ctx.fill();
        ctx.beginPath();                                   // \u062d\u0627\u0641\u0629 \u0639\u0644\u0648\u064a\u0629 \u0646\u0627\u0639\u0645\u0629 \u062a\u0646\u062f\u0645\u062c \u0645\u0639 \u062c\u0644\u062f \u0627\u0644\u062c\u0628\u0647\u0629
        for (i = 0; i < n; i++) { if (i === 0) ctx.moveTo(x0, E.top[i] - 1.2); else ctx.lineTo(x0 + i, E.top[i] - 1.2); }
        ctx.lineWidth = 1.2; ctx.strokeStyle = rgb(E.lidTop, 1, 0.45); ctx.lineJoin = 'round'; ctx.stroke();
        ctx.beginPath();                                   // \u062a\u0638\u0644\u064a\u0644 \u062e\u0641\u064a\u0641 \u0641\u0648\u0642 \u062e\u0637 \u0627\u0644\u0631\u0645\u0648\u0634
        for (i = 0; i < n; i++) { if (i === 0) ctx.moveTo(x0, yu[i] - 2.3); else ctx.lineTo(x0 + i, yu[i] - 2.3); }
        ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(40,14,8,0.14)'; ctx.stroke();
        ctx.lineCap = 'round'; ctx.strokeStyle = 'rgba(22,9,6,0.94)';   // \u062e\u0637 \u0627\u0644\u0631\u0645\u0648\u0634: \u064a\u062f\u0642\u0651 \u0639\u0646\u062f \u0627\u0644\u0632\u0627\u0648\u064a\u062a\u064a\u0646
        for (i = 1; i < n; i++) {
          var ed = Math.min(i, n - 1 - i), wl = 0.5 + 1.1 * smooth01(ed / 6);
          ctx.beginPath(); ctx.moveTo(x0 + i - 1, yu[i - 1] - 0.8); ctx.lineTo(x0 + i, yu[i] - 0.8);
          ctx.lineWidth = wl; ctx.stroke();
        }
      }
      // \u2500\u2500 \u0627\u0644\u062c\u0641\u0646 \u0627\u0644\u0633\u0641\u0644\u064a: \u064a\u0631\u062a\u0641\u0639 \u0642\u0644\u064a\u0644\u064b\u0627 (\u0627\u0628\u062a\u0633\u0627\u0645\u0629/\u0631\u0645\u0634) \u2500\u2500
      if (q > 0.02) {
        ctx.beginPath(); ctx.moveTo(x0, yl[0]);
        for (i = 0; i < n; i++) ctx.lineTo(x0 + i, yl[i]);
        for (i = n - 1; i >= 0; i--) ctx.lineTo(x0 + i, E.bot[i] + 0.7);
        ctx.closePath(); ctx.fillStyle = rgb(E.lidBot, 1); ctx.fill();
        ctx.beginPath();
        for (i = 0; i < n; i++) { if (i === 0) ctx.moveTo(x0, yl[i]); else ctx.lineTo(x0 + i, yl[i]); }
        ctx.lineWidth = 0.9; ctx.strokeStyle = 'rgba(58,26,20,0.55)'; ctx.stroke();
      }
    }
    function drawEyes(p, q, gx, gy) {
      var i;
      for (i = 0; i < EB.length; i++) ctx.clearRect(EB[i].x, EB[i].y, EB[i].w, EB[i].h);
      ctx.save(); ctx.setTransform(CS, 0, 0, CS, 0, 0);
      for (i = 0; i < RIG.eyes.length; i++) drawEye(i, p, q, gx, gy);
      ctx.restore();
    }

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u0631\u0633\u0645: \u0627\u0644\u0641\u0645 (\u0641\u0643 \u0633\u0641\u0644\u064a \u0628\u0623\u0639\u0645\u062f\u0629 \u0631\u0623\u0633\u064a\u0629) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    function cutAt(x) {
      var i = Math.round(x - MR.x0);
      return MR.cut[clamp(i, 0, MR.cut.length - 1)];
    }
    function drawMouth(jaw, sx, ck) {
      var x, X0 = MR.x_min, X1 = MR.x_max, Y0 = MR.y0, Y1 = MR.y1 + 6, cx = MR.cx, hw = MR.hw;
      ctx.clearRect(MB.x, MB.y, MB.w, MB.h);
      ctx.save(); ctx.setTransform(CS, 0, 0, CS, 0, 0);
      var cut = [], dy = [], cs = [], dxs = [], any = jaw > 0.25;
      for (x = X0; x < X1; x++) {
        var xm = x + 0.5, u = Math.min(1, Math.abs(xm - cx) / hw);
        var wgt = Math.cos(u * Math.PI / 2); wgt = wgt * wgt;
        var c = cutAt(xm);
        cut.push(c);
        dy.push(jaw >= 0 ? jaw * wgt : jaw * Math.pow(wgt, 0.6));
        cs.push(ck * u * u);
        dxs.push(cx + (xm - 0.5 - cx) * sx);
      }
      var n = cut.length, i;
      if (any) {                                           // \u062a\u062c\u0648\u064a\u0641 \u0627\u0644\u0641\u0645 \u062e\u0644\u0641 \u0627\u0644\u0623\u0633\u0646\u0627\u0646
        ctx.beginPath();
        for (i = 0; i < n; i++) { var yy = cut[i] + cs[i] - 0.7; if (i === 0) ctx.moveTo(dxs[i], yy); else ctx.lineTo(dxs[i] + 0.5, yy); }
        for (i = n - 1; i >= 0; i--) ctx.lineTo(dxs[i] + 0.5, cut[i] + cs[i] + dy[i] + 0.9);
        ctx.closePath();
        var cyc = cutAt(cx), g = ctx.createLinearGradient(0, cyc - 1, 0, cyc + jaw + 1);
        g.addColorStop(0, 'rgb(30,11,13)'); g.addColorStop(0.45, 'rgb(66,24,27)'); g.addColorStop(1, 'rgb(104,42,45)');
        ctx.fillStyle = g; ctx.fill();
        if (jaw > 3.4) {                                   // \u0644\u0633\u0627\u0646 \u062e\u0641\u064a\u0641 \u0639\u0646\u062f \u0627\u0644\u0641\u062a\u062d \u0627\u0644\u0648\u0627\u0633\u0639
          ctx.save(); ctx.clip();
          ctx.beginPath(); ctx.ellipse(cx + 1, cyc + jaw * 0.86, hw * 0.34, jaw * 0.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(158,80,82,0.78)'; ctx.fill(); ctx.restore();
        }
      }
      var m = imgs.mouth, wd = sx + 0.6;
      for (i = 0; i < n; i++) {
        x = X0 + i;
        var c0 = cut[i], s0 = cs[i], d0 = dy[i], dx0 = dxs[i];
        if (c0 > Y0) ctx.drawImage(m, x, Y0, 1, c0 - Y0, dx0, Y0 + s0, wd, c0 - Y0);
        ctx.drawImage(m, x, c0, 1, Y1 - c0, dx0, c0 + d0 + s0, wd, Y1 - c0);
      }
      ctx.restore();
    }

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u062a\u062d\u062f\u064a\u062b \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    var moodBase = { calm: 0.62, happy: 1.0, serious: 0.18 };
    function setMood(name, ms) {
      st.mood = moodBase[name] != null ? name : 'calm';
      st.moodUntil = ms ? now() + ms : 0;
    }
    function startBlink(t, amt) {
      st.blinkT0 = t; st.blinkAmt = amt || 1;
      st.blinkDur = [rnd(78, 105), rnd(25, 55), rnd(150, 215)];
    }
    function blinkP(t) {
      if (st.blinkT0 < 0) return 0;
      var e = t - st.blinkT0, d = st.blinkDur;
      if (e < d[0]) return smooth01(e / d[0]) * st.blinkAmt;
      e -= d[0]; if (e < d[1]) return st.blinkAmt;
      e -= d[1]; if (e < d[2]) return (1 - smooth01(e / d[2])) * st.blinkAmt;
      st.blinkT0 = -1; return 0;
    }
    function pickGaze(t) {
      var L = st.look, big = false, ogx = st.tgx, ogy = st.tgy;
      if (L) {
        if (Math.random() < (sp.on ? 0.34 : 0.2)) { st.tgx = rnd(-0.22, 0.22); st.tgy = rnd(-0.12, 0.12); st.gazeNext = t + rnd(500, 1100); }
        else { st.tgx = clamp(L.nx * 0.92 + rnd(-0.07, 0.07), -1, 1); st.tgy = clamp(L.ny * 0.75 + rnd(-0.06, 0.06), -1, 1); st.gazeNext = t + rnd(1500, 3400); }
      } else if (Math.random() < 0.13) { st.tgx = rnd(-0.65, 0.65); st.tgy = rnd(0.28, 0.55); st.gazeNext = t + rnd(700, 1300); }
      else { st.tgx = rnd(-0.32, 0.32); st.tgy = rnd(-0.16, 0.14); st.gazeNext = t + rnd(1200, 3600); }
      big = Math.hypot(st.tgx - ogx, st.tgy - ogy) > 0.55;
      if (big && st.blinkT0 < 0 && Math.random() < 0.4) startBlink(t + 40, 1);
    }
    function speechTargets(t) {
      // \u064a\u0639\u064a\u062f { o, l, w, r } \u0644\u0644\u0641\u0645 \u0627\u0644\u0622\u0646
      if (!sp.on) return V._;
      var el, tl = sp.tl, u, idx;
      if (sp.fixed || !tl || !tl.units.length) { return tailViseme(t); }
      el = t - sp.t0;
      var wpos = el / sp.k;
      if (wpos >= tl.total) { return tailViseme(t); }
      idx = sp.ui < 0 || tl.units[sp.ui].t > wpos ? 0 : sp.ui;
      while (idx + 1 < tl.units.length && tl.units[idx + 1].t <= wpos) idx++;
      if (idx !== sp.ui) {
        sp.ui = idx; u = tl.units[idx];
        var b = V[u.k] || V.C, amp = (u.ws ? 1.12 : 1) * (0.86 + Math.random() * 0.26);
        if (u.pause) { amp = 1; if (u.w > 3) st.hk -= 1.2; }
        sp.cur = { o: b.o * amp, l: b.l, w: b.w, r: b.r };
        if (u.ws && b.o > 0.5) st.hk += rnd(0.9, 1.7);       // \u0646\u0628\u0631 \u062e\u0641\u064a\u0641 \u0641\u064a \u0627\u0644\u0631\u0623\u0633
      }
      return sp.cur;
    }
    var TAIL = ['A', 'C', 'E', 'C', 'O', 'S', 'A', 'M', 'I', 'C', 'U', 'C'];
    function tailViseme(t) {                                  // \u0646\u0637\u0642 \u0628\u0644\u0627 \u0646\u0635/\u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u062a\u0642\u062f\u064a\u0631: \u062d\u0631\u0643\u0629 \u0645\u062a\u0646\u0648\u0639\u0629 \u063a\u064a\u0631 \u0645\u0631\u062a\u062c\u0641\u0629
      if (t >= sp.nextTail) {
        var k = TAIL[(Math.random() * TAIL.length) | 0], b = V[k];
        sp.cur = { o: b.o * (0.7 + Math.random() * 0.4), l: b.l, w: b.w, r: b.r };
        sp.nextTail = t + rnd(95, 170);
      }
      return sp.cur;
    }

    function update(t, dt) {
      var rd = reduced(), i;
      // \u2500\u2500 \u0627\u0644\u062a\u0639\u0628\u064a\u0631 \u2500\u2500
      if (st.moodUntil && t > st.moodUntil) { st.mood = 'calm'; st.moodUntil = 0; }
      var sm = moodBase[st.mood] + (st.mood === 'calm' ? 0.1 * noise(t * 0.00035) : 0);
      if (sp.on && st.mood === 'calm') sm -= 0.06;
      damp(st.smile, clamp(sm, 0, 1), 5, dt);
      var s = st.smile.x, ib = 1 - s;

      // \u2500\u2500 \u0627\u0644\u0631\u0645\u0634 \u2500\u2500
      if (!rd) {
        if (st.blinkT0 < 0 && t >= st.nextBlink) {
          startBlink(t, Math.random() < 0.14 ? 0.72 : 1);
          st.nextBlink = t + (Math.random() < 0.13 ? rnd(220, 330) : rnd(2300, 5600));
        }
        st.blinkP = blinkP(t);
      } else st.blinkP = 0;

      // \u2500\u2500 \u0627\u0644\u0646\u0638\u0631\u0629 \u2500\u2500
      if (!rd) {
        if (t >= st.gazeNext) pickGaze(t);
        damp(st.gx, st.tgx + 0.015 * noise(t * 0.011), 30, dt);
        damp(st.gy, st.tgy + 0.015 * noise(t * 0.013 + 3), 30, dt);
      } else { st.gx.x = 0; st.gy.x = 0; }

      // \u2500\u2500 \u0627\u0644\u0641\u0645 \u2500\u2500
      var tg = speechTargets(t), jawT, lipT, wT, rT;
      var audio = (sp.audio != null && t - sp.audioT < 160) ? sp.audio : null;
      if (sp.on) {
        var o = tg.o;
        if (audio != null) o = (0.3 + 0.7 * tg.o) * clamp(audio * 2.1, 0, 1.05);
        jawT = ib * -1.2 + o * 12.5 - tg.l * 3.2;
        lipT = tg.l; wT = tg.w; rT = tg.r;
      } else {
        jawT = -ib * 3.2; lipT = 0; wT = 0; rT = 0;
      }
      if (rd) { jawT = -ib * 3.2; wT = 0; rT = 0; }
      damp(st.jaw, jawT, sp.on ? 24 : 9, dt);
      damp(st.lipS, lipT, 30, dt);
      damp(st.sxS, 1 - ib * 0.05 + wT, 17, dt);
      damp(st.ckS, ib * 1.9 + (rT > 0 ? rT * 0.55 : rT * 0.3), 12, dt);

      // \u2500\u2500 \u0627\u0644\u0631\u0623\u0633: \u062d\u0631\u0643\u0629 \u062d\u064a\u0651\u0629 (\u062a\u0645\u0627\u064a\u0644 + \u0625\u064a\u0645\u0627\u0621\u0627\u062a \u0645\u0639 \u0627\u0644\u0643\u0644\u0627\u0645 + \u062a\u062a\u0628\u0651\u0639 \u0627\u0644\u0646\u0638\u0631) \u2500\u2500
      if (headAct && !rd) {
        st.hk *= Math.exp(-dt * 4.5);
        st.hs = (st.hs || 0) + ((sp.on ? 1 : 0) - (st.hs || 0)) * Math.min(1, dt * 3);   // \u0634\u062f\u0651\u0629 \u0627\u0644\u062d\u064a\u0648\u064a\u0629 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u0643\u0644\u0627\u0645 0..1
        var sv = st.hs, lk = st.look, lx = lk ? lk.nx : 0, ly = lk ? lk.ny : 0;
        var hrT = 1.1 * noise(t * 0.00031) + 0.35 * noise(t * 0.0011 + 5) + sv * 1.3 * noise(t * 0.0021 + 9) + lx * 1.4;
        var hxT = 1.8 * noise(t * 0.00027 + 2) + sv * 1.6 * noise(t * 0.0017 + 4) + lx * 3.2;
        var hyT = 0.9 * noise(t * 0.00037 + 7) + sv * 1.1 * noise(t * 0.0025) + st.hk + ly * 1.4;
        var hzT = 1 + sv * 0.012 + 0.004 * noise(t * 0.0004);
        damp(st.hr, hrT, 5, dt); damp(st.hy, hyT, 8, dt); damp(st.hx, hxT, 5, dt); damp(st.hz, hzT, 5, dt);
        headAct.style.transform = 'translate3d(' + st.hx.x.toFixed(2) + 'px,' + st.hy.x.toFixed(2) + 'px,0) rotate(' + st.hr.x.toFixed(3) + 'deg) scale(' + st.hz.x.toFixed(4) + ')';
      }
    }

    function render() {
      var p, q, gx, gy, jaw, sx, ck, e, m;
      if (P) {
        p = P.blink || 0; q = P.lower || 0; gx = P.gx || 0; gy = P.gy || 0;
        jaw = P.jaw || 0; sx = P.sx != null ? P.sx : 1; ck = P.ck || 0;
      } else {
        gx = clamp(st.gx.x, -1, 1); gy = clamp(st.gy.x, -1, 1);
        var s = st.smile.x;
        var base = 0.03 + clamp(gy, 0, 1) * 0.16 - clamp(-gy, 0, 1) * 0.02 + (1 - s) * 0.06 * 0;
        p = clamp(base + (1 - base) * st.blinkP, 0, 1);
        q = clamp(Math.max(0, (s - 0.7)) * 0.5 + st.blinkP * 0.9 * (st.blinkAmt), 0, 1);
        if (st.mood === 'serious') q = Math.max(q, 0.1);
        jaw = st.jaw.x - st.lipS.x * 0.0; sx = st.sxS.x; ck = st.ckS.x;
      }
      e = [Math.round(p * 120), Math.round(q * 80), Math.round(gx * 25), Math.round(gy * 25)].join(',');
      if (e !== sig.eyes) { sig.eyes = e; drawEyes(p, q, gx, gy); }
      m = [Math.round(jaw * 8), Math.round(sx * 200), Math.round(ck * 8)].join(',');
      if (m !== sig.mouth) { sig.mouth = m; drawMouth(jaw, sx, ck); }
    }

    function loop(ts) {
      raf = 0; if (disposed || !ready) return;
      if (!visible()) { last = 0; tmr = setTimeout(function () { tmr = 0; schedule(); }, 400); return; }
      var t = now(), dt = Math.min(0.05, Math.max(0.001, (t - (last || t)) / 1000)); last = t;
      if (!P) update(t, dt);
      render();
      if (reduced() && !sp.on) { last = 0; tmr = setTimeout(function () { tmr = 0; schedule(); }, 500); return; }
      schedule();
    }
    function schedule() { if (disposed || !ready || raf || tmr) return; raf = requestAnimationFrame(loop); }

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u062a\u062d\u0645\u064a\u0644 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    var names = { sclera: 'eye_sclera.webp', iris: 'eye_iris.webp', glint: 'eye_glint.webp', frame: 'eye_frame.webp', mouth: 'mouth.webp' };
    var keys = Object.keys(names);
    Promise.all(keys.map(function (k) { return loadImg(base + names[k]); })).then(function (list) {
      if (disposed) return;
      keys.forEach(function (k, i) { imgs[k] = list[i]; });
      ready = true;
      st.nextBlink = now() + rnd(900, 2200); st.gazeNext = now() + 600;
      render(); sig.eyes = sig.eyes || '';
      if (opts.onReady) { try { opts.onReady(); } catch (_) {} }
      schedule();
    }).catch(function () { if (opts.onFail) { try { opts.onFail(); } catch (_) {} } });

    /* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 \u0627\u0644\u0648\u0627\u062c\u0647\u0629 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
    var api = {
      look: function (L) {
        if (!L) { if (st.look) { st.look = null; st.gazeNext = 0; } return; }
        var ch = !st.look || Math.hypot(L.nx - st.look.nx, L.ny - st.look.ny) > 0.3;
        st.look = { nx: clamp(L.nx, -1, 1), ny: clamp(L.ny, -1, 1) };
        if (ch) st.gazeNext = 0;
      },
      talk: function (on) {
        if (on) { if (!sp.on) { sp.on = true; sp.fixed = true; sp.audio = null; sp.cur = V._; sp.nextTail = 0; schedule(); } }
        else { sp.on = false; sp.fixed = false; sp.tl = null; sp.audio = null; sp.ui = -1; }
      },
      speak: function (text, lang, rate) {
        sp.on = true; sp.fixed = false; sp.lang = lang || 'ar'; sp.rate = rate || 0.95;
        sp.tl = buildTimeline(String(text || '')); sp.ui = -1; sp.cur = V._; sp.nextTail = 0;
        sp.k = sp.kBase = (sp.kLearn || 92) / Math.max(0.6, sp.rate / 0.95);
        sp.t0 = sp.startedAt = now(); sp.lastBoundary = -1; schedule();
      },
      boundary: function (charIndex) {
        if (!sp.on || !sp.tl || sp.fixed) return;
        var us = sp.tl.units, i;
        for (i = 0; i < us.length; i++) if (us[i].c >= charIndex) break;
        if (i >= us.length) return;
        var t = now(), wpos = us[i].t;
        // \u062a\u0639\u0644\u0651\u0645 \u0627\u0644\u0633\u0631\u0639\u0629 \u0627\u0644\u0641\u0639\u0644\u064a\u0629 \u0645\u0646 \u0627\u0644\u0643\u0644\u0645\u0627\u062a \u0627\u0644\u0633\u0627\u0628\u0642\u0629
        if (sp.lastBoundary >= 0 && wpos > sp.lastW) {
          var kk = (t - sp.lastBT) / (wpos - sp.lastW);
          if (kk > 30 && kk < 260) { sp.k = lerp(sp.k, kk, 0.35); }
        }
        sp.lastBoundary = charIndex; sp.lastBT = t; sp.lastW = wpos;
        sp.t0 = t - wpos * sp.k;
      },
      speakEnd: function () {
        if (sp.tl && sp.on && !sp.fixed) {
          var el = now() - sp.startedAt, total = sp.tl.total;
          if (total > 4 && el > 300 && el < 60000) {
            var kk = el / total;
            if (kk > 40 && kk < 220) sp.kLearn = lerp(sp.kLearn || 92, kk * (sp.rate / 0.95), 0.5);
          }
        }
        sp.on = false; sp.tl = null; sp.ui = -1; sp.audio = null; sp.fixed = false;
      },
      audioLevel: function (a) { if (a == null) { sp.audio = null; return; } sp.audio = clamp(a, 0, 1); sp.audioT = now(); },
      mood: setMood,
      blinkNow: function () { if (st.blinkT0 < 0) startBlink(now(), 1); },
      nod: function () { st.hk += 3.2; setMood('happy', 1600); },
      pose: function (o) { P = o || null; sig.eyes = ''; sig.mouth = ''; schedule(); },
      renderOnce: function () { render(); },
      state: function () { return { smile: st.smile.x, jaw: st.jaw.x, gx: st.gx.x, gy: st.gy.x, blink: st.blinkP, speaking: sp.on, k: sp.k }; },
      isReady: function () { return ready; },
      destroy: function () { disposed = true; if (raf) cancelAnimationFrame(raf); clearTimeout(tmr); ctx.clearRect(0, 0, canvas.width, canvas.height); if (headAct) headAct.style.transform = ''; }
    };
    create.last = api;
    return api;
  }

  window.GOVESER_AdvisorFace = { create: create, _buildTimeline: buildTimeline };
})();
