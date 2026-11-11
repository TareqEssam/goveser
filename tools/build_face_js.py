#!/usr/bin/env python3
"""يدمج tools/face_rig.json في tools/advisor-face.src.js وينتج js/advisor-face.js (ASCII فقط لتفادي مشاكل الترميز)."""
import os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(R, 'tools', 'advisor-face.src.js'), encoding='utf-8').read()
src = src.replace('__RIG__', open(os.path.join(R, 'tools', 'face_rig.json')).read())
open(os.path.join(R, 'js', 'advisor-face.js'), 'w').write(''.join(c if ord(c) < 128 else '\\u%04x' % ord(c) for c in src))
print('ok')
