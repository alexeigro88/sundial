#!/usr/bin/env python3
"""Builds motolider-standalone.html: index.html with every asset inlined as a data URI."""
import base64, mimetypes, pathlib, re
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf8")
cache = {}
def inline(m):
    f = root / m.group(0)
    if m.group(0) not in cache:
        mime = mimetypes.guess_type(f.name)[0] or "image/webp"
        cache[m.group(0)] = f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()
    return cache[m.group(0)]
out = re.sub(r"assets/[\w.-]+\.(?:webp|svg|png)", inline, html)
(root / "motolider-standalone.html").write_text(out, encoding="utf8")
print(f"motolider-standalone.html: {len(out)/1e6:.1f} MB, {len(cache)} assets inlined")
