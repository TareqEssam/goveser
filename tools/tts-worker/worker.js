/**
 * Cloudflare Worker — صوت رجل مضمون للمرشد (عربي + إنجليزي) بلا مفاتيح ولا حساب مدفوع.
 *
 * لماذا هنا؟ واجهة Web Speech في المتصفح لا تكشف جنس الصوت، فلا يمكن ضمانه من جهة العميل.
 * الضمان الوحيد الحقيقي: اختيار الصوت «بمعرّفه» على الخادم. هنا المعرّفان ثابتان ومن الرجال:
 *   العربية  ar-EG-ShakirNeural   |   الإنجليزية  en-US-GuyNeural
 * المسار 1 (مجاني، بلا مفتاح ولا بطاقة): خدمة القراءة الصوتية المدمجة في Edge (أصوات عصبية، نفس أصوات Azure).
 * المسار 2 (اختياري): Azure Speech إن عُرّف AZURE_KEY و AZURE_REGION (الطبقة المجانية 0.5 مليون حرف/شهر).
 * العميل لا يحمّل نموذجًا: يستلم mp3 صغيرًا فقط، ويُخزَّن (كاش) فلا يُولَّد النص المتكرر مرتين.
 *
 * متغيرات اختيارية: ALLOW_ORIGIN (نطاق موقعكم، يحمي الحصة المجانية من الاستعمال الخارجي)،
 *                   EDGE_VERSION (إن غيّرت مايكروسوفت رقم الإصدار المطلوب).
 * الاستعمال في الصفحة قبل advisor.js:
 *   <script>window.GOVESER_ADVISOR_CONFIG = { ttsEndpoint: 'https://YOUR-WORKER.workers.dev/tts', strictMale: true };</script>
 */
const VOICES = { ar: ['ar-EG', 'ar-EG-ShakirNeural'], en: ['en-US', 'en-US-GuyNeural'] };
const EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
// نسخ مقبولة تُجرَّب بالترتيب [بادئة Sec-MS-GEC-Version , رقم الإصدار] — حدّثوها إن غيّرت مايكروسوفت المطلوب
const EDGE_VERS = [['2', '143.0.3650.75']];
const esc = s => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const rnd = () => hex(crypto.getRandomValues(new Uint8Array(16)));
const stamp = () => new Date().toUTCString().replace(/^(\w+), (\d+) (\w+) (\d+) ([\d:]+) GMT$/, '$1 $3 $2 $4 $5 GMT+0000 (Coordinated Universal Time)');

function ssmlFor(lang, text, rate, edge) {
  const [loc, short] = VOICES[lang], voice = edge ? `Microsoft Server Speech Text to Speech Voice (${loc}, ${short.slice(loc.length + 1)})` : short, pct = Math.round((rate - 1) * 100);
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${loc}"><voice name="${voice}"><prosody pitch="+0Hz" rate="${pct >= 0 ? '+' : ''}${pct}%" volume="+0%">${esc(text)}</prosody></voice></speak>`;
}

/* ---------- توقيع Sec-MS-GEC النسخة 2: منقول من مكتبة edge-tts (rany2/edge-tts، رخصة LGPL-3.0) ومُتحقَّق منه بمقارنة المخرجات مع المكتبة الأصلية ---------- */
const U = x => x >>> 0, mul = (a, b) => Math.imul(a, b) >>> 0;
const ror = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0, rol16 = x => ((x << 16) | (x >>> 16)) >>> 0;
const sg0 = x => U(ror(x, 7) ^ ror(x, 18) ^ (x >>> 3)), sg1 = x => U(ror(x, 17) ^ ror(x, 19) ^ (x >>> 10));
const S_INIT = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
const S_STATE = [0xFD9FBEA2, 0x91243CE7, 0xBE499094, 0xCD2E1E0A, 0x6C006F49, 0x04BD35AB, 0xFEB0A7E4, 0x03EFFBD2];
const S_SCHED = [0xEB24BF9E, 0x1558691F, 0xA0C09EE2, 0x0CFA32BA, 0xA622EE8C, 0xD1DD9491, 0xC0DD25A0, 0xF9E70AB6, 0xF0C31573, 0x7058CE4E, 0x7188E606, 0x00E5AB33, 0xD258B060, 0x72766564];
const K = [0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2];
const K_BLOCK = K.slice(); K_BLOCK[14] = 0xC9DC06A7;
const CS = [[0xE82E91B1, 0xB32700D0], [0x44DE24C6, 0x88DFF51D], [0x3BEB65BC, 0x29514038], [0xC89C5933, 0xB328CBDF], [0x8D1EC211, 0xD405B4D5], [0x314EF5D5, 0x26E55F3C], [0xE92491B1, 0x607801C6], [0xF0A5B9D5, 0x82B2C1FB], [0x06064CF3, 0xFA51A3DA], [0xDA79FA60, 0x207CC464], [0xBED20560, 0x3C3C74F3], [0x89F9C9F8, 0xD2D14B61], [0x35FA38C6, 0xBB04A2C1], [0xCB49E3C6, 0xC5626167]];
const be32 = (b, o, n) => { let v = 0; for (let i = 0; i < n; i++) v = v * 256 + b[o + i]; return v; };
function expand(w, from) { for (let i = from; i < 64; i++) w[i] = U(sg1(w[i - 2]) + w[i - 7] + sg0(w[i - 15]) + w[i - 16]); }
function rounds(st, w, first, k) {
  let [a, b, c, d, e, f, g, h] = st;
  for (let i = first; i < 64; i++) {
    const t1 = U(h + (ror(e, 6) ^ ror(e, 11) ^ ror(e, 25)) + (g ^ (e & (f ^ g))) + k[i] + w[i]);
    const t2 = U((ror(a, 2) ^ ror(a, 13) ^ ror(a, 22)) + ((a & b) | (c & (a | b))));
    h = g; g = f; f = e; e = U(d + t1); d = c; c = b; b = a; a = U(t1 + t2);
  }
  return [a, b, c, d, e, f, g, h];
}
function shaInit(d7) {
  const w = new Array(14).fill(0); w.push(be32(d7, 0, 3), be32(d7, 3, 4));
  for (let i = 16; i < 30; i++) {
    let v = S_SCHED[i - 16];
    if (i - 2 >= 14) v += i === 16 ? U(sg1(w[i - 2]) ^ 0x000B92C0) : sg1(w[i - 2]);
    if (i - 7 >= 14) v += w[i - 7];
    if (i - 15 >= 14) v += i === 29 ? U(sg0(w[i - 15]) ^ 0x059C0B80) : sg0(w[i - 15]);
    w.push(U(v));
  }
  w.push(U(sg1(w[28]) + w[23] + sg0(w[15]) + w[14] + 0xC9DC06A7 - K[14]));
  expand(w, 31);
  const r = rounds(S_STATE, w, 14, K_BLOCK); return r.map((x, i) => U(x + S_INIT[i]));
}
function shaDigest(data) {
  const len = 57 + data.length, padN = (((55 - len) % 64) + 64) % 64;
  const tail = data.subarray(7), p = new Uint8Array(tail.length + 1 + padN + 8); p.set(tail); p[tail.length] = 0x80;
  const bits = len * 8; for (let i = 0; i < 4; i++) p[p.length - 1 - i] = (bits / 2 ** (8 * i)) & 255;
  let st = shaInit(data.subarray(0, 7));
  for (let o = 0; o < p.length; o += 64) {
    const w = []; for (let i = 0; i < 16; i++) w.push(be32(p, o + i * 4, 4)); expand(w, 16);
    const r = rounds(st, w, 0, K); st = st.map((x, i) => U(x + r[i]));
  }
  return st;
}
function cs64(data, dig) {   // dig: 8 كلمات (SHA)، نحتاج أول 8 بايت بترتيب Little-endian من البايتات الناتجة
  const db = new Uint8Array(32); dig.forEach((x, i) => { db[i * 4] = x >>> 24; db[i * 4 + 1] = (x >>> 16) & 255; db[i * 4 + 2] = (x >>> 8) & 255; db[i * 4 + 3] = x & 255; });
  const le = (b, o) => U(b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24));
  const ka = U(le(db, 0) | 1), kb = U(le(db, 4) | 1), fac = [mul(ka, 0x82893933), mul(kb, 0x82893933)];
  const terms = CS.map(([c], i) => mul(c, fac[i % 2])), offs = CS.map(([, o]) => o);
  const raw = new Uint8Array(1 + data.length); raw.set(data, 1);
  const padded = new Uint8Array(Math.ceil(raw.length / 4) * 4); padded.set(raw);
  const ws = []; for (let i = 0; i < padded.length; i += 4) ws.push(le(padded, i)); if (ws.length % 2) ws.push(0);
  ws.forEach((wd, i) => {
    let term = mul(wd, i % 2 ? kb : ka), off = mul(rol16(wd), i % 2 ? 0xC31713DB : 0xEF0569FB);
    if (i === 0) { term = U(term + mul(0xF2F90B1A, fac[0])); off = U(off + 0x0B1A0000); }
    terms.push(term); offs.push(off);
  });
  let swapAcc = 0, swapLast = 0, st = 0, acc = 0;
  for (let i = 0; i < terms.length; i += 2) {
    const x = terms[i], y = terms[i + 1];
    let t = rol16(U(offs[i] + x)), q = mul(t, 0x76F50F34);
    swapAcc = U(swapAcc + U(mul(rol16(q), 0xC3EFEA97) + q));
    t = rol16(U(offs[i + 1] + y)); q = mul(t, 0x1881CE3C);
    swapLast = U(mul(rol16(q), 0x35BD1EC9) + q); swapAcc = U(swapAcc + swapLast);
    st = U(mul(st, ka) + x);
    st = mul(rol16(st), 0xCF98B111); st = mul(rol16(st), 0x87085B9F); st = mul(rol16(st), 0x12CEB96D); st = mul(rol16(st), 0x257E1D83);
    acc = U(acc + st);
    t = U(mul(st, kb) + y); t = mul(rol16(t), 0xA27416F5); t = mul(rol16(t), 0xD38396FF);
    st = mul(rol16(mul(rol16(t), 0x7C932B89)), 0xBFA49F69); acc = U(acc + st);
  }
  return [U(swapLast ^ st), U(swapAcc ^ acc)];
}
const hexLE = w => [0, 8, 16, 24].map(s => ((w >>> s) & 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const hexBE = w => w.toString(16).padStart(8, '0').toUpperCase();
/* unixSeconds: الوقت الحالي (مع تصحيح فرق الساعة إن وُجد) */
export function secMsGecV2(unixSeconds) {
  let t = Math.floor(unixSeconds) + 11644473600; t -= t % 300;
  const data = new TextEncoder().encode(String(BigInt(t) * 10000000n) + EDGE_TOKEN);
  const dig = shaDigest(data), [a, b] = cs64(data, dig);
  return hexLE(a) + hexLE(b) + '-' + dig.map(hexBE).join('');
}

let skew = 0;   // فرق ساعة الخادم عن ساعة مايكروسوفت (يُصحَّح تلقائيًا عند 403)
const gec = async () => secMsGecV2(Date.now() / 1000 + skew);

/* يقرأ إطارات الخدمة: الثنائي = [2 بايت طول الترويسة][ترويسة][صوت]، والنصي turn.end يعني الانتهاء */
export function audioFrom(buf) {
  const b = new Uint8Array(buf), hl = (b[0] << 8) | b[1];
  const head = new TextDecoder().decode(b.subarray(2, 2 + hl));
  return head.includes('Path:audio') ? b.subarray(2 + hl) : null;
}

async function edgeTTS(lang, text, rate, env, pre, ver, retried) {
  const url = 'https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=' + EDGE_TOKEN +
    '&ConnectionId=' + rnd() + '&Sec-MS-GEC=' + await gec() + '&Sec-MS-GEC-Version=' + pre + '-' + ver;
  const resp = await fetch(url, { headers: {
    Upgrade: 'websocket', Pragma: 'no-cache', 'Cache-Control': 'no-cache',
    Origin: 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ver.split('.')[0]}.0.0.0 Safari/537.36 Edg/${ver.split('.')[0]}.0.0.0`,
    'Accept-Language': 'en-US,en;q=0.9', Cookie: 'muid=' + rnd().toUpperCase() + ';'
  } });
  const ws = resp.webSocket;
  if (!ws) {
    const d = resp.headers.get('Date');   // 403 غالبًا بسبب فرق الساعة: نصحّح مرة واحدة ونعيد
    if (resp.status === 403 && d && !retried) { skew = Date.parse(d) / 1000 - Date.now() / 1000; return edgeTTS(lang, text, rate, env, pre, ver, true); }
    throw new Error('edge ws refused ' + resp.status);
  }
  ws.accept();
  return new Promise((resolve, reject) => {
    const parts = []; let size = 0, over = false;
    const timer = setTimeout(() => { try { ws.close(); } catch (_) {} reject(new Error('edge timeout')); }, 15000);
    const finish = () => {
      clearTimeout(timer); if (over) return; over = true;
      if (!size) return reject(new Error('edge empty'));
      const out = new Uint8Array(size); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
      try { ws.close(); } catch (_) {} resolve(out);
    };
    ws.addEventListener('message', ev => {
      if (typeof ev.data === 'string') { if (ev.data.includes('Path:turn.end')) finish(); return; }
      const a = audioFrom(ev.data); if (a && a.length) { parts.push(a); size += a.length; }
    });
    ws.addEventListener('close', finish);
    ws.addEventListener('error', () => { clearTimeout(timer); if (!over) { over = true; reject(new Error('edge ws error')); } });
    ws.send(`X-Timestamp:${stamp()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
      '{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}');
    ws.send(`X-RequestId:${rnd()}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp()}Z\r\nPath:ssml\r\n\r\n` + ssmlFor(lang, text, rate, true));
  });
}

async function edgeAny(lang, text, rate, env) {
  const list = env.EDGE_VERSION ? [['2', env.EDGE_VERSION]] : EDGE_VERS; let last;
  for (const [pre, ver] of list) { try { return await edgeTTS(lang, text, rate, env, pre, ver); } catch (e) { last = e; } }
  throw last;
}

async function azureTTS(lang, text, rate, env) {
  if (!env.AZURE_KEY || !env.AZURE_REGION) throw new Error('azure not configured');
  const r = await fetch(`https://${env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: { 'Ocp-Apim-Subscription-Key': env.AZURE_KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'goveser-advisor' },
    body: ssmlFor(lang, text, rate, false)
  });
  if (!r.ok) throw new Error('azure ' + r.status);
  return new Uint8Array(await r.arrayBuffer());
}

export default {
  async fetch(req, env, ctx) {
    const allow = env.ALLOW_ORIGIN || '*';
    const cors = { 'Access-Control-Allow-Origin': allow, 'Access-Control-Allow-Methods': 'GET', 'Vary': 'Origin' };
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
    const u = new URL(req.url);
    if (u.pathname !== '/tts') return new Response('not found', { status: 404, headers: cors });
    const org = req.headers.get('Origin');
    if (env.ALLOW_ORIGIN && org && org !== env.ALLOW_ORIGIN) return new Response('forbidden', { status: 403, headers: cors });
    const lang = u.searchParams.get('lang') === 'en' ? 'en' : 'ar';
    const text = (u.searchParams.get('text') || '').trim().slice(0, 600);
    const rate = Math.min(1.3, Math.max(0.6, parseFloat(u.searchParams.get('rate')) || 0.95));
    if (!text) return new Response('empty', { status: 400, headers: cors });
    // مفتاح الكاش مُطبَّع: لا يتأثر بترتيب المعاملات ولا بمعاملات إضافية
    const key = new Request(`${u.origin}/tts?lang=${lang}&rate=${rate.toFixed(2)}&text=${encodeURIComponent(text)}`, { method: 'GET' });
    const cache = caches.default, hit = await cache.match(key);
    if (hit) return new Response(hit.body, { headers: { ...Object.fromEntries(hit.headers), ...cors } });
    let audio, engine = 'edge';
    // إن وُجد مفتاح Azure يُستعمل أولًا (رسمي ومستقر)؛ وإلا تُجرَّب خدمة Edge غير الرسمية
    const order = env.AZURE_KEY ? [['azure', azureTTS], ['edge', edgeAny]] : [['edge', edgeAny], ['azure', azureTTS]], errs = [];
    for (const [name, fn] of order) { try { audio = await fn(lang, text, rate, env); engine = name; break; } catch (e) { errs.push(name + ': ' + e.message); } }
    if (!audio) return new Response('tts failed: ' + errs.join(' / '), { status: 502, headers: cors });
    const res = new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=2592000', 'X-TTS-Engine': engine, ...cors } });
    ctx.waitUntil(cache.put(key, res.clone()));
    return res;
  }
};
