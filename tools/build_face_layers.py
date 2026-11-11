#!/usr/bin/env python3
"""
يولّد طبقات العينين من eyes.webp الأصلية (بكسلاتها نفسها — لا يُرسم أي ملمح جديد)
ويطبع بيانات الهندسة (حواف فتحة العين وقوس قطع الفم) لتُلصق في js/advisor.js (FACE_RIG).

الاستعمال:   python3 tools/build_face_layers.py            (من جذر المشروع)
المخرجات:    assets/advisor/eye_sclera.webp  eye_iris.webp  eye_glint.webp  eye_frame.webp
             tools/face_rig.json
المتطلبات:   numpy, opencv-python, pillow, scipy
"""
import json, os, sys
import numpy as np, cv2
from PIL import Image
from scipy.interpolate import PchipInterpolator

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ADV = os.path.join(ROOT, 'assets', 'advisor')
W, H = 424, 592
SS = 8                                    # تكبير لحساب أقنعة ناعمة

# ── هندسة فتحة العين (إحداثيات الصورة؛ مركز البكسل = +0.5) — من القياس على eyes.webp ──
EYES = [
    dict(name='L',
         top=[(181.0,154.3),(183.5,151.6),(187.5,148.9),(192.5,147.2),(198,146.0),(203.5,145.9),(208.5,146.9),(213,149.0),(217,152.4),(219.6,156.2)],
         bot=[(219.2,158.2),(215,159.9),(210,161.0),(204,161.5),(198,161.3),(192,160.4),(186.5,158.7),(182.5,156.4)],
         iris=(201.55,153.54), lidTop=(180,121,95), lidBot=(188,121,92)),
    dict(name='R',
         top=[(269.0,155.0),(272.5,152.0),(277,149.4),(282,147.4),(288,146.3),(294,147.0),(299.5,149.1),(304,152.0),(308.5,156.0)],
         bot=[(308,158.0),(303.5,160.2),(297,161.8),(290.5,162.2),(283.5,162.0),(277,160.8),(272,158.6)],
         iris=(285.47,154.06), lidTop=(146,92,68), lidBot=(162,102,78)),
]
IRIS_R = 8.05          # نصف قطر القزحية (مع حلقة الحدّ الداكنة)
IRIS_FADE = 0.65       # تلاشي الحافة (يحتوي بكسلات أصلية فيطابق السكون الأصل)
HOLE_R = 9.4           # منطقة الصلبة التي تُملأ تحت القزحية

def poly_mask(pts, dil_px=0.0):
    """قناع ناعم (0..1) بحجم الصورة الكاملة لمضلع."""
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, y0 = int(min(xs)) - 8, int(min(ys)) - 8; x1, y1 = int(max(xs)) + 9, int(max(ys)) + 9
    hi = np.zeros(((y1 - y0) * SS, (x1 - x0) * SS), np.uint8)
    poly = np.array([[(x - x0) * SS, (y - y0) * SS] for x, y in pts], np.int32)
    cv2.fillPoly(hi, [poly], 255)
    if dil_px > 0:
        k = int(round(dil_px * SS)) * 2 + 1
        hi = cv2.dilate(hi, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    lo = cv2.resize(hi, (x1 - x0, y1 - y0), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    out = np.zeros((H, W), np.float32); out[y0:y1, x0:x1] = lo
    return out

def circle_mask(cx, cy, r0, r1):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.hypot(xx + 0.5 - cx, yy + 0.5 - cy)
    t = np.clip((r1 - d) / max(r1 - r0, 1e-6), 0, 1)
    return t * t * (3 - 2 * t)

def contour_arrays(top, bot):
    t = sorted(top); b = sorted(bot)
    x0 = max(t[0][0], b[0][0]); x1 = min(t[-1][0], b[-1][0])
    ft = PchipInterpolator([p[0] for p in t], [p[1] for p in t]); fb = PchipInterpolator([p[0] for p in b], [p[1] for p in b])
    xs = np.arange(np.ceil(x0), np.floor(x1) + 1, 1.0)
    return xs, ft(xs), fb(xs)

def main():
    eyes = np.array(Image.open(os.path.join(ADV, 'eyes.webp')).convert('RGBA'))
    rgb = eyes[..., :3].astype(np.float32); alpha = eyes[..., 3].astype(np.float32) / 255
    mn = rgb.min(2); mx = rgb.max(2); sat = (mx - mn) / (mx + 1e-6)

    M_all = np.zeros((H, W), np.float32); Mdil_all = np.zeros((H, W), np.float32); D_all = np.zeros((H, W), np.float32)
    iris_rgba = np.zeros((H, W, 4), np.float32); glint_rgba = np.zeros((H, W, 4), np.float32)
    scl_rgb = rgb.copy()
    rig = dict(eyes=[], mouth={})

    for E in EYES:
        poly = E['top'] + E['bot']
        M = poly_mask(poly); Mdil = poly_mask(poly, 1.6)
        cx, cy = E['iris']
        D = circle_mask(cx, cy, IRIS_R, IRIS_R + IRIS_FADE)
        Dsolid = (circle_mask(cx, cy, HOLE_R, HOLE_R + 0.1) > 0.5)

        # لون الصلبة المتوسط (بياض العين) خارج القزحية
        sclera_px = (mn > 135) & (sat < 0.42) & (M > 0.95) & (~Dsolid)
        mean_scl = rgb[sclera_px].mean(0) if sclera_px.sum() > 10 else np.array([215, 205, 200], np.float32)

        # ── طبقة الصلبة: البكسلات الأصلية داخل الفتحة (موسّعة)، وتُملأ مكان القزحية بالتدرّج ──
        src = rgb.copy()
        src[Mdil < 0.5] = mean_scl
        hole = (Dsolid & (Mdil > 0.3)).astype(np.uint8) * 255
        # ملء ما تحت القزحية بالاستيفاء الأفقي بين بياض العين يمينًا ويسارًا (بلا بقع رمادية)
        scl = src.copy()
        light = (mn > 125) & (sat < 0.45) & (Mdil > 0.5) & (~Dsolid)
        rows = [y for y in range(H) if hole[y].any()]
        LC = []; RC = []
        for y in rows:
            xs_ = np.nonzero(hole[y])[0]; a_, b_ = xs_.min(), xs_.max()
            lx = [x for x in range(a_ - 1, max(a_ - 8, 0), -1) if light[y, x]]
            rx = [x for x in range(b_ + 1, min(b_ + 8, W)) if light[y, x]]
            lc = src[y, lx[0]] if lx else (src[y, rx[0]] if rx else mean_scl)
            rc = src[y, rx[0]] if rx else lc
            LC.append(lc); RC.append(rc)
        from scipy.ndimage import gaussian_filter1d
        LC = gaussian_filter1d(np.array(LC), 2.5, axis=0, mode='nearest'); RC = gaussian_filter1d(np.array(RC), 2.5, axis=0, mode='nearest')
        for k, y in enumerate(rows):
            xs_ = np.nonzero(hole[y])[0]; a_, b_ = xs_.min(), xs_.max()
            for x in xs_:
                t = (x - a_) / max(b_ - a_, 1)
                scl[y, x] = LC[k] * (1 - t) + RC[k] * t
        scl = np.maximum(scl, np.where((hole > 0)[..., None], mean_scl * 0.92, 0))
        scl_rgb = np.where((Mdil > 0)[..., None], scl, scl_rgb)

        # ── القزحية: دائرة كاملة؛ الجزء المخفي تحت الجفن يُعوَّض بانعكاس الجزء السفلي ──
        iris = rgb.copy()
        yy, xx = np.mgrid[0:H, 0:W]
        outside = (D > 0) & (M < 0.5) & (yy + 0.5 < cy)
        ys_src = np.clip(np.round(2 * cy - (yy + 0.5) - 0.5).astype(int), 0, H - 1)
        mirrored = iris[ys_src, xx]
        iris = np.where(outside[..., None], mirrored, iris)
        # لمعة العين (انعكاس الضوء): تُفصل في طبقة ثابتة لا تتحرك مع القزحية
        G = ((mn > 168) & (D > 0.2) & (M > 0.5))
        G = cv2.dilate(G.astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))) > 0
        G &= (D > 0.2)
        bgr_i = cv2.cvtColor(np.clip(iris, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR)
        iris_clean = cv2.cvtColor(cv2.inpaint(bgr_i, G.astype(np.uint8) * 255, 3, cv2.INPAINT_TELEA), cv2.COLOR_BGR2RGB).astype(np.float32)
        iris_rgba[..., :3] = np.where((D > 0)[..., None], iris_clean, iris_rgba[..., :3])
        iris_rgba[..., 3] = np.maximum(iris_rgba[..., 3], D)
        ga = np.clip((mn - 120) / 100, 0, 1) * G
        glint_rgba[..., :3] = np.where(G[..., None], rgb, glint_rgba[..., :3])
        glint_rgba[..., 3] = np.maximum(glint_rgba[..., 3], ga)

        M_all = np.maximum(M_all, M); Mdil_all = np.maximum(Mdil_all, Mdil); D_all = np.maximum(D_all, D)

        xs, ft, fb = contour_arrays(E['top'], E['bot'])
        rig['eyes'].append(dict(name=E['name'], x0=float(xs[0]), top=[round(float(v), 2) for v in ft], bot=[round(float(v), 2) for v in fb],
                                iris=[cx, cy, IRIS_R], lidTop=list(E['lidTop']), lidBot=list(E['lidBot'])))

    # ── كتابة الطبقات ──
    def save(arr_rgb, a, name):
        out = np.dstack([np.clip(arr_rgb, 0, 255), np.clip(a, 0, 1) * 255]).astype(np.uint8)
        Image.fromarray(out, 'RGBA').save(os.path.join(ADV, name), lossless=True, quality=100, method=6)
        print('wrote', name, os.path.getsize(os.path.join(ADV, name)), 'bytes')
    save(scl_rgb, Mdil_all, 'eye_sclera.webp')
    save(iris_rgba[..., :3], iris_rgba[..., 3], 'eye_iris.webp')
    save(glint_rgba[..., :3], glint_rgba[..., 3], 'eye_glint.webp')
    save(rgb, alpha * (1 - M_all), 'eye_frame.webp')

    # ── التحقق: التركيب في وضع السكون يجب أن يطابق eyes.webp الأصلية ──
    def over(dst, src_rgb, src_a):
        a = src_a[..., None]; return dst * (1 - a) + src_rgb * a
    base = np.zeros((H, W, 3), np.float32); base[:] = (200, 200, 200)
    comp = over(base, scl_rgb, Mdil_all); comp = over(comp, iris_rgba[..., :3], iris_rgba[..., 3] * M_all)
    comp = over(comp, glint_rgba[..., :3], glint_rgba[..., 3] * M_all); comp = over(comp, rgb, alpha * (1 - M_all))
    orig = over(base, rgb, alpha)
    diff = np.abs(comp - orig).max(2); print('rest-pose max diff', float(diff.max()), 'mean(over eyes)', float(diff[diff > 0].mean()) if (diff > 0).any() else 0)

    # ── الفم: قوس خط الأسنان السفلي (حدّ الفك) من القياس على mouth.webp ──
    cut = [(195.5,232.5),(201,235.5),(207,239.0),(213,245.3),(218.3,250.3),(224,252.6),(230.6,254.2),(235.6,255.3),(242,255.2),(249,254.8),(255.6,252.8),(261,250.5),(264.5,247.7),(269,243.7),(272,239.5),(280,236.3),(286,233.8),(291.5,231.5)]
    fc = PchipInterpolator([p[0] for p in cut], [p[1] for p in cut])
    xs = np.arange(196, 292, 1.0)
    rig['mouth'] = dict(x0=196, cut=[round(float(v), 2) for v in fc(xs)], cx=243.5, hw=48.0, y0=218, y1=267, x_min=185, x_max=299)
    with open(os.path.join(ROOT, 'tools', 'face_rig.json'), 'w') as f:
        json.dump(rig, f, separators=(',', ':'))
    print('rig json written')

if __name__ == '__main__':
    main()
