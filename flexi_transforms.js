/* flexi_transforms.js — client-side JavaScript port of the Fleximbols display
 * transforms (from flexi_transforms.py / det_overlays.py). Runs in the browser
 * (no Python server) OR in Node for testing. Faithful 1:1 port of the FIGURE
 * transforms: border, skin, hair, cvi, colour(muted), mirror, clothes(top/bottom).
 *
 * NOT yet ported (still Python-only): culture redress, arms, hairstyle, hearing,
 * lfill (lineart), soft3d, hair=random / diverse (need md5). Person-style is a
 * file swap handled by the caller, not here.
 *
 * transform(svgText, rel, opts) -> new svgText.  opts keys mirror the URL params:
 *   {border, skin, hair, colour, cvi, mirror, top, bottom}
 */
(function (root) {
  "use strict";

  // ---- palettes (verbatim from flexi_transforms.py) ----
  var TX_SKIN = { light: ["#ffe0c2", "#e0b48c"], tan: ["#e8b98f", "#c98a52"],
                  olive: ["#d6a878", "#a9772f"], brown: ["#b07a4f", "#8a5a34"],
                  dark: ["#7a4e30", "#5a371f"] };
  var SKIN_MAIN = ["#f5d6b0","#f1c9a5","#f0c0a8","#f0c49a","#f2c79a","#f2c79b","#f3c79a",
                   "#f3c19a","#f2c9a0","#f4d4b3","#f8d4b3","#e8b48a","#e9b98c","#e0b48c",
                   "#e0a878","#a86a43","#7a4a26","#7a4e30","#5e3618"];
  var TX_HAIR = { black:"#1a1a1a", brown:"#5a3a1f", darkbrown:"#3a2a18", blonde:"#e7cd6e",
                  ginger:"#cf6a2e", grey:"#9a9a9a", white:"#ededed" };
  var HAIR_RANDOM = ["#1a1a1a","#5a3a1f","#3a2a18","#e7cd6e","#cf6a2e","#9a9a9a"];  // hair=random pool (matches icon_browser._HAIR_RANDOM)
  var DIVERSE_SKIN = ["default","light","tan","olive","brown","dark"];             // diverse skin pool (md5[0] % 6)

  // md5 (blueimp, UTF-8 in, lowercase hex out) — needed so "diverse" picks the SAME
  // per-file skin/hair as the Python build (hashlib.md5(rel.encode("utf-8"))).
  var md5 = (function () {
    function sa(x, y) { var l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
    function rl(n, c) { return (n << c) | (n >>> (32 - c)); }
    function cm(q, a, b, x, s, t) { return sa(rl(sa(sa(a, q), sa(x, t)), s), b); }
    function ff(a, b, c, d, x, s, t) { return cm((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cm((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cm(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cm(c ^ (b | ~d), a, b, x, s, t); }
    function core(x, len) {
      x[len >> 5] |= 0x80 << (len % 32); x[(((len + 64) >>> 9) << 4) + 14] = len;
      var i, oa, ob, oc, od, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
      for (i = 0; i < x.length; i += 16) {
        oa = a; ob = b; oc = c; od = d;
        a = ff(a, b, c, d, x[i], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819); b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416); d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290); b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
        a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691); d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335); b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438); d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961); b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473); b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
        a = hh(a, b, c, d, x[i + 5], 4, -378558); d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632); b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487); d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651);
        a = ii(a, b, c, d, x[i], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905); b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359); d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259); b = ii(b, c, d, a, x[i + 9], 21, -343485551);
        a = sa(a, oa); b = sa(b, ob); c = sa(c, oc); d = sa(d, od);
      }
      return [a, b, c, d];
    }
    function toBin(s) { var b = [], i; for (i = 0; i < (s.length >> 2) + 1; i++) b[i] = 0;
      for (i = 0; i < s.length * 8; i += 8) b[i >> 5] |= (s.charCodeAt(i / 8) & 0xff) << (i % 32); return b; }
    function toHex(bin) { var h = "0123456789abcdef", o = "", i, x;
      for (i = 0; i < bin.length * 32; i += 8) { x = (bin[i >> 5] >>> (i % 32)) & 0xff; o += h.charAt((x >>> 4) & 0x0f) + h.charAt(x & 0x0f); } return o; }
    return function (str) { var s = unescape(encodeURIComponent(str)); return toHex(core(toBin(s), s.length * 8)); };
  })();

  var SKIN_MAIN_RE = new RegExp('fill="(?:' + SKIN_MAIN.join("|") + ')"', "gi");
  var SKIN_EDGE_RE = /fill="#c98a52"/gi;
  var HAIR_RE = /fill="#(?:5a3a1f|6b4a2b|2e2b36|3a3644|332f3c|26232e|2b2834)"/gi;
  var TROUSER = "#39425c";

  // clothes: garment identification (from det_overlays.py)
  var CL_SKIN = ["#f5d6b0","#f1c9a5","#f0c0a8","#f0c49a","#e0b48c","#a86a43","#7a4a26",
                 "#5e3618","#e8b48a","#f0c19a","#f3c79a","#d6a878","#b07a4f","#7a4e30"];
  var CL_HAIR = ["#5a3a1f","#1a1a1a","#3a2a18","#e7cd6e","#cf6a2e","#9a9a9a","#6b4a2b"];
  var CL_GARM = /<(?:polygon|path)\b[^>]*?\bfill="([^"]+)"[^>]*?\/?>/gi;
  var ELEM_RE = /<(?:line|polyline|polygon|rect|circle|ellipse|path)\b[^>]*?\/?>/gi;

  var FIXED_HAIR_RE = /(?:^|[-_ /])(?:red|white|grey|gray|black|brown|blonde|ginger)-hair/i;

  function isFixedColour(rel) {
    var segs = rel.toLowerCase().split("/");
    var bad = {flags:1, flag:1, colours:1, colors:1, money:1, "money amounts":1, currency:1};
    for (var i = 0; i < segs.length; i++) if (bad[segs[i]]) return true;
    var low = rel.toLowerCase();
    return ["sah","sensory","readable","picom","logo","brand"].some(function (b) { return low.indexOf(b) >= 0; });
  }
  function isSign(rel) { return rel.toLowerCase().indexOf("sign language") >= 0; }
  function isFixedHair(rel) {
    var base = rel.split("/").pop();
    return FIXED_HAIR_RE.test(base);
  }
  function attr(tag, a) {
    var m = tag.match(new RegExp('\\b' + a + '="([^"]*)"'));
    return m ? m[1] : "";
  }

  // ---- clothes (det_overlays.clothes) ----
  function darken(hex, f) {
    f = f || 0.82;
    var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    function h2(n) { n = Math.floor(n).toString(16); return n.length < 2 ? "0" + n : n; }
    return "#" + h2(r * f) + h2(g * f) + h2(b * f);
  }
  var HEX_RE = /^#[0-9a-fA-F]{6}$/;
  function engineTopTag(text) {
    var best = null, m;
    CL_GARM.lastIndex = 0;
    while ((m = CL_GARM.exec(text))) {
      var fill = m[1].toLowerCase();
      if (CL_SKIN.indexOf(fill) >= 0 || CL_HAIR.indexOf(fill) >= 0 || fill === "#ffffff" || fill === "#fff") continue;
      var tag = m[0];
      var d = attr(tag, "points") || attr(tag, "d") || "";
      if (/[a-df-z]/.test(d)) continue;      // case-SENSITIVE: keep absolute (M/L/Z) paths, drop lowercase relative-command decorations
      var nums = (d.match(/[-\d.]+(?:e-?\d+)?/g) || []).map(Number);
      if (nums.length < 6) continue;
      var xs = nums.filter(function (_, i) { return i % 2 === 0; });
      var ys = nums.filter(function (_, i) { return i % 2 === 1; });
      var w = Math.max.apply(null, xs) - Math.min.apply(null, xs);
      var h = Math.max.apply(null, ys) - Math.min.apply(null, ys);
      if (w < 40 || h < 40) continue;
      var area = w * h;
      if (!best || area > best[0]) best = [area, tag];
    }
    return best ? best[1] : null;
  }
  function clothes(text, top, bottom) {
    top = (top && HEX_RE.test(top)) ? top : null;
    bottom = (bottom && HEX_RE.test(bottom)) ? bottom : null;
    if (!top && !bottom) return text;
    var hasParts = ["top", "dress", "lower", "sleeve"].some(function (k) { return text.indexOf('data-part="' + k + '"') >= 0; });
    if (!hasParts) {
      if (text.indexOf('data-fig="') < 0) return text;   // person figures only
      if (top) {
        var tag = engineTopTag(text);
        if (tag) text = text.replace(tag, tag.replace(/fill="(?!none)[^"]*"/, 'fill="' + top + '"'));
      }
      if (bottom) text = text.split('stroke="' + TROUSER + '"').join('stroke="' + bottom + '"');
      return text;
    }
    // pilot path: data-part labelled garments
    return text.replace(ELEM_RE, function (el) {
      var pm = el.match(/data-part="([^"]+)"/);
      if (!pm) return el;
      var part = pm[1], col = null;
      if (top && (part === "top" || part === "dress")) col = top;
      else if (top && part === "sleeve") col = darken(top);
      else if (bottom && part === "lower") col = bottom;
      if (!col) return el;
      el = el.replace(/fill="(?!none)[^"]*"/g, 'fill="' + col + '"');
      el = el.replace(/stroke="(?!none)(?!#1a1a1a)[^"]*"/g, 'stroke="' + col + '"');
      return el;
    });
  }

  // ---- PiCom Fluent skin recolour (port of icon_browser._fluent_skin_recolour) ----
  // Fluent skin is tagged class="skin" with many baked shades. Recolour SHADE-PRESERVING:
  // centre each figure on the target tone's MAIN via its median shade, each shade rides as
  // a gentle luminance deviation. Consistent tone across figures; modelling kept.
  var FL_SKIN_EL = /<(?:path|polygon|rect|circle|ellipse|polyline)\b[^>]*\bclass="[^"]*\bskin\b[^"]*"[^>]*?\/?>/gi;
  var FL_FILL = /\bfill="(#[0-9a-fA-F]{6})"/;
  function flHex2rgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function flLum(h) { var c = flHex2rgb(h); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }
  function flMix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function flRgb2hex(c) { function h2(n) { n = Math.max(0, Math.min(255, Math.round(n))).toString(16); return n.length < 2 ? "0" + n : n; } return "#" + h2(c[0]) + h2(c[1]) + h2(c[2]); }
  function fluentSkinRecolour(text, mainHex, edgeHex) {
    var els = text.match(FL_SKIN_EL);
    if (!els) return text;
    var lums = [];
    for (var i = 0; i < els.length; i++) { var fm = els[i].match(FL_FILL); if (fm) lums.push(flLum(fm[1])); }
    if (!lums.length) return text;
    lums.sort(function (a, b) { return a - b; });
    var center = lums[Math.floor(lums.length / 2)];
    var sh = flHex2rgb(edgeHex), mn = flHex2rgb(mainHex),
        hl = [mn[0] + (255 - mn[0]) * 0.35, mn[1] + (255 - mn[1]) * 0.35, mn[2] + (255 - mn[2]) * 0.35];
    var Le = (0.299 * sh[0] + 0.587 * sh[1] + 0.114 * sh[2]) / 255,
        Lm = (0.299 * mn[0] + 0.587 * mn[1] + 0.114 * mn[2]) / 255,
        Lh = (0.299 * hl[0] + 0.587 * hl[1] + 0.114 * hl[2]) / 255, K = 0.9;
    function outHex(fh) {
      var tgt = Lm + (flLum(fh) - center) * K;
      if (tgt < Le) tgt = Le; else if (tgt > Lh) tgt = Lh;
      var c = tgt <= Lm ? flMix(sh, mn, (tgt - Le) / Math.max(1e-3, Lm - Le))
                        : flMix(mn, hl, (tgt - Lm) / Math.max(1e-3, Lh - Lm));
      return flRgb2hex(c);
    }
    return text.replace(FL_SKIN_EL, function (el) {
      var fm = el.match(FL_FILL);
      return fm ? el.replace(FL_FILL, 'fill="' + outHex(fm[1]) + '"') : el;
    });
  }

  // ---- the transform_svg equivalent ----
  function transformSvg(text, rel, o) {
    var border = o.border || "", skin = o.skin || "", hair = o.hair || "",
        colour = o.colour || "", cvi = o.cvi === "1" || o.cvi === true;
    if (hair && isFixedHair(rel)) hair = "";
    var fixed = isFixedColour(rel), sign = isSign(rel);

    // BORDER
    if (border && border !== "original" && border !== "normal" && !sign) {
      // Native Fluent rasters get a FIXED width; but the ~1030 symbols imported from Fleximbols
      // are vector line-art on SMALL canvases (viewBox 100/290/512) with several stroke weights.
      // A fixed 45/60 there is huge (half a 100px canvas) and flattens their line hierarchy, so
      // route them to the PROPORTIONAL factor scale instead — same as the vector sets. Native
      // Fluent is always ≥1024 (rasters 1024, composed numbers ~1000-1900); the imports are ≤512,
      // so viewBox size is a clean, robust discriminator (the pack strips leading-space folders).
      var _vb = (text.match(/viewBox="([\d.eE\s+-]+)"/) || [])[1];
      var _small = false;
      if (_vb) { var _p = _vb.trim().split(/\s+/).map(parseFloat); if (_p.length === 4) _small = Math.max(_p[2], _p[3]) < 700; }
      var fluentRaster = o.fluent && !_small;
      if (fluentRaster) {
        // Fluent: the ONLY strokes are the added bounding border (regular symbols, base 12)
        // or the digit outlines (numbers, also 12). Set them to a FIXED, clearly-stepped
        // width — the vector-set factor table (x0.5/x1.35/x2.0) produced sub-pixel steps on
        // Fluent's 1024 canvas, so the levels were indistinguishable at grid size. Fluent uses
        // its own Normal(12)/Medium/Thick scale; none=0 actually removes the border.
        var fw = { none: 0, normal: 12, medium: 45, thick: 60 }[border];
        if (fw != null) text = text.replace(/stroke-width="[\d.]+"/g, 'stroke-width="' + fw + '"');
      } else if (text.indexOf('id="ob"') < 0) {
        var factor = { none: 0.0, thin: 0.5, normal: 1.0, medium: 1.35, thick: 2.0 }[border];
        if (factor != null && factor !== 1.0) {
          text = text.replace(ELEM_RE, function (tag) {
            if (tag.indexOf('stroke-width="') < 0) return tag;
            var fm = tag.match(/\bfill="([^"]*)"/);
            var content = tag.slice(0, 5) === "<line" || tag.slice(0, 9) === "<polyline" ||
                          (fm && fm[1].trim().toLowerCase() === "none");
            if (factor === 0.0 && content) return tag;
            return tag.replace(/stroke-width="([\d.]+)"/g, function (m, w) {
              return 'stroke-width="' + (parseFloat(w) * factor).toFixed(2) + '"';
            });
          });
        }
      }
    }

    var inject = "", wrapf = null;
    // SKIN
    if (skin && skin !== "default" && !fixed && TX_SKIN[skin]) {
      var fillc = TX_SKIN[skin][0], edgec = TX_SKIN[skin][1];
      if (o.fluent) {
        // PiCom Fluent: shade-preserving remap of class="skin" paths (baked multi-shade skin)
        text = fluentSkinRecolour(text, fillc, edgec);
      } else {
        text = text.replace(SKIN_MAIN_RE, 'fill="' + fillc + '"');
        text = text.replace(SKIN_EDGE_RE, 'fill="' + edgec + '"');
        inject += ".skin{fill:" + fillc + "}";
      }
    }
    // HAIR  ("random" -> per-file pick from HAIR_RANDOM, used by diverse mode)
    if (hair && hair !== "default" && !fixed) {
      var hairHex = (hair === "random")
        ? HAIR_RANDOM[Number(BigInt("0x" + md5(rel)) % BigInt(HAIR_RANDOM.length))]
        : TX_HAIR[hair];
      if (hairHex) text = text.replace(HAIR_RE, 'fill="' + hairHex + '"');
    }
    // CVI  (mutually exclusive with muted)
    if (cvi && !fixed) {
      text = text.replace(/fill="#([0-9a-fA-F]{3,6})"/g, function (m, h) {
        h = h.toLowerCase();
        if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
        if (["1a1a1a","000000","0d0d0d","111111","222222","333333"].indexOf(h) >= 0) return 'fill="#ffffff"';
        if (["ffffff","fefefe","f8f8f8"].indexOf(h) >= 0) return m;
        var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return m;
        function h2(n) { n = Math.floor(n).toString(16); return n.length < 2 ? "0" + n : n; }
        return 'fill="#' + h2(r * 0.62) + h2(g * 0.62) + h2(b * 0.62) + '"';
      });
      text = text.split('stroke="#1a1a1a"').join('stroke="#ffffff"')
                 .split('stroke="#1A1A1A"').join('stroke="#ffffff"')
                 .split('stroke="#000000"').join('stroke="#ffffff"')
                 .split('flood-color="#1a1a1a"').join('flood-color="#ffffff"')
                 .split('flood-color="#1A1A1A"').join('flood-color="#ffffff"');
      inject += ".skin{fill:#d2b48c}";
    } else if (colour === "muted" && !fixed) {
      wrapf = ["txmuted",
        '<filter id="txmuted"><feColorMatrix type="saturate" values="0.62"/>' +
        '<feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="0.78" offset="0"/>' +
        '<feFuncG type="gamma" amplitude="1" exponent="0.78" offset="0"/>' +
        '<feFuncB type="gamma" amplitude="1" exponent="0.78" offset="0"/>' +
        '</feComponentTransfer></filter>'];
    }
    if (inject || wrapf) {
      var m = text.match(/<svg\b[^>]*>/);
      if (m) {
        var end = m.index + m[0].length;
        var add = inject ? "<style>" + inject + "</style>" : "";
        if (wrapf) add += '<defs>' + wrapf[1] + '</defs><g filter="url(#' + wrapf[0] + ')">';
        text = text.slice(0, end) + add + text.slice(end);
        if (wrapf) {
          var idx = text.lastIndexOf("</svg>");
          if (idx >= 0) text = text.slice(0, idx) + "</g>" + text.slice(idx);
        }
      }
    }
    // MIRROR (last)
    if (o.mirror === "1" || o.mirror === true) {
      var vbm = text.match(/viewBox="\s*(-?[\d.]+)[ ,]+(-?[\d.]+)[ ,]+(-?[\d.]+)/);
      var m0 = text.match(/<svg\b[^>]*>/);
      var idx2 = text.lastIndexOf("</svg>");
      if (vbm && m0 && idx2 >= 0) {
        var w = 2 * parseFloat(vbm[1]) + parseFloat(vbm[3]);
        var e0 = m0.index + m0[0].length;
        text = text.slice(0, e0) + '<g transform="translate(' + w + ' 0) scale(-1 1)">' +
               text.slice(e0, idx2) + "</g>" + text.slice(idx2);
      }
    }
    return text;
  }

  // full chain (order matches apply_all_transforms: clothes overlay, then transform_svg)
  function transform(text, rel, o) {
    o = o || {};
    try {
      // DIVERSE: seed a per-file skin + random hair so a grid reads as a mixed
      // classroom rather than identical figures. Deterministic per rel (md5), and
      // only fills gaps — an explicit Skin/Hair choice still wins. (icon_browser diverse)
      if (o.diverse) {
        o = Object.assign({}, o);
        var hx = md5(rel);
        if (!o.skin || o.skin === "default") o.skin = DIVERSE_SKIN[parseInt(hx.slice(0, 2), 16) % DIVERSE_SKIN.length];
        if (!o.hair || o.hair === "default") o.hair = "random";
      }
      if (o.top || o.bottom) text = clothes(text, o.top || null, o.bottom || null);
      text = transformSvg(text, rel, o);
      if (o.arms === "bare" || o.arms === "clothed") text = arms(text, o.arms);   // LAST (after dress)
    } catch (e) { /* display transform must never break serving */ }
    return text;
  }

  // LFILL — Lineart Fill colour: recolour every white fill/stroke to the chosen
  // colour, except data-lp="hair"/"skin" (and skin-toned arm/neck/hand parts),
  // which take the hair/skin colour when those pickers are set. (from flexi_transforms.py)
  function lfill(text, o) {
    var lf = (o.lfill && HEX_RE.test(o.lfill)) ? o.lfill : null;
    if (!lf) return text;
    var hairHex = (o.hair && o.hair !== "default" && TX_HAIR[o.hair]) ? TX_HAIR[o.hair] : null;
    var skinHex = (o.skin && o.skin !== "default" && TX_SKIN[o.skin]) ? TX_SKIN[o.skin][0] : null;
    return text.replace(ELEM_RE, function (tag) {
      var lpm = tag.match(/data-lp="([^"]+)"/);
      var lp = lpm ? lpm[1] : null;
      var pm = tag.match(/data-part="([^"]+)"/);
      var part = pm ? pm[1] : null;
      var cat = lp === "hair" ? "hair"
              : lp === "skin" ? "skin"
              : (part === "arm" || part === "neck" || part === "hand") ? "skin" : "lfill";
      var col = (cat === "hair" && hairHex) ? hairHex
              : (cat === "skin" && skinHex) ? skinHex : lf;
      return tag.replace(/fill="#ffffff"/ig, 'fill="' + col + '"')
                .replace(/stroke="#ffffff"/ig, 'stroke="' + col + '"');
    });
  }

  // ---- ARMS (faithful port of det_arms.recolour_arms + the det_toon helpers it uses) ----
  // mode "bare"    -> arms + neck become skin
  //      "clothed" -> arms become the figure's garment (sleeve) colour, neck skin
  // Display-only, runs LAST in the chain (after clothes/redress) so it recolours the
  // already-dressed garment colour — clothed sleeves follow the live Top-colour picker.
  var A_SKIN = "#f5d6b0";
  var A_SKIN_HEX = { "#f5d6b0": 1, "#f1c9a5": 1 };
  var A_HAIR_HEX = { "#5a3a1f": 1, "#6b4a2b": 1 };
  var A_LINE = /<line x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)" stroke="(#[0-9a-fA-F]{6})" stroke-width="([\d.]+)" stroke-linecap="round"\/>/g;
  var A_CIRCLE = /<circle\b[^>]*\/>/g;
  var A_GARM = /<(polygon|path)\b[^>]*fill="(#[0-9a-fA-F]{6})"[^>]*>/g;
  function A_ATTR(tag, a) { var m = tag.match(new RegExp(a + '="([^"]+)"')); return m ? m[1] : null; }
  function pyg(n) {                                    // Python "%g": 6 sig figs, trailing zeros stripped
    if (n === 0) return (1 / n === -Infinity) ? "-0" : "0";
    var s = Number(n).toPrecision(6);
    if (/e/i.test(s)) return Number(n).toString();     // coords never hit exponent range
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s;
  }
  function A_tlimb(x1, y1, x2, y2, colour, w) {
    var a = 'x1="' + pyg(x1) + '" y1="' + pyg(y1) + '" x2="' + pyg(x2) + '" y2="' + pyg(y2) + '"';
    return '<line ' + a + ' stroke="#1a1a1a" stroke-width="' + (w + 8).toFixed(0) + '" stroke-linecap="round" data-tn="1"/>'
         + '<line ' + a + ' stroke="' + colour + '" stroke-width="' + (w + 2).toFixed(0) + '" stroke-linecap="round" data-tn="1"/>';
  }
  function A_head_tags(t) {
    var out = [], m; A_CIRCLE.lastIndex = 0;
    while ((m = A_CIRCLE.exec(t))) {
      var tag = m[0], fill = A_ATTR(tag, "fill"), r = A_ATTR(tag, "r");
      if (!r) continue;
      if (tag.indexOf('class="skin"') >= 0 || (fill && A_SKIN_HEX[fill.toLowerCase()])) {
        var cx = A_ATTR(tag, "cx"), cy = A_ATTR(tag, "cy"), rf = parseFloat(r);
        if (cx && cy && rf >= 25 && rf < 80) out.push([m.index, m.index + tag.length, tag, parseFloat(cx), parseFloat(cy), rf]);
      }
    }
    return out;
  }
  function A_garments_of(t) {
    var lst = [], m; A_GARM.lastIndex = 0;
    while ((m = A_GARM.exec(t))) {
      var kind = m[1], fill = m[2].toLowerCase();
      if (A_SKIN_HEX[fill] || A_HAIR_HEX[fill] || fill === "#ffffff" || fill === "#fff") continue;
      var tag = m[0], d = A_ATTR(tag, "points") || A_ATTR(tag, "d") || "";
      if (/[a-df-z]/.test(d)) continue;                 // case-SENSITIVE: keep absolute (M/L/Z) paths, drop lowercase relative-command decorations
      var nums = (d.match(/[-\d.]+(?:e-?\d+)?/g) || []).map(Number);
      if (nums.length < 6) continue;
      var xs = nums.filter(function (_, i) { return i % 2 === 0; });
      var ys = nums.filter(function (_, i) { return i % 2 === 1; });
      var w = Math.max.apply(null, xs) - Math.min.apply(null, xs);
      var h = Math.max.apply(null, ys) - Math.min.apply(null, ys);
      if (w < 28 || h < 24) continue;
      lst.push([kind, fill, Math.min.apply(null, xs), Math.min.apply(null, ys),
                Math.max.apply(null, xs), Math.max.apply(null, ys), tag, w * h]);
    }
    return lst;
  }
  function A_g_spans(t) {
    var spans = [], stack = [], re = /<g\b[^>]*>|<\/g>/g, m;
    while ((m = re.exec(t))) {
      if (m[0].charAt(1) !== "/") stack.push(m.index);
      else if (stack.length) spans.push([stack.pop(), m.index + m[0].length]);
    }
    return spans;
  }
  function A_scope(sub, heads, mode, excl) {
    var allg = A_garments_of(sub), figs = [];
    for (var i = 0; i < heads.length; i++) {
      var hcx = heads[i][3], hcy = heads[i][4], hr = heads[i][5];
      var cands = allg.filter(function (g) {
        return Math.abs((g[2] + g[4]) / 2 - hcx) < 1.9 * hr && (hcy + hr - 0.9 * hr) <= g[3] && g[3] <= (hcy + hr + 2.0 * hr);
      });
      var g = null;
      if (cands.length) { g = cands[0]; for (var j = 1; j < cands.length; j++) if (cands[j][7] > g[7]) g = cands[j]; }
      figs.push([hcx, hcy, hr, g]);
    }
    A_LINE.lastIndex = 0;
    return sub.replace(A_LINE, function (full, sx1, sy1, sx2, sy2, col, sw, offset) {
      for (var e = 0; e < excl.length; e++) if (excl[e][0] <= offset && offset < excl[e][1]) return full;
      if (parseFloat(sw) < 7 || col !== "#1a1a1a") return full;
      var x1 = parseFloat(sx1), y1 = parseFloat(sy1), x2 = parseFloat(sx2), y2 = parseFloat(sy2), w = parseFloat(sw);
      var ends = [[x1, y1], [x2, y2]], L = Math.hypot(x2 - x1, y2 - y1);
      for (var f = 0; f < figs.length; f++) {
        var hcx = figs[f][0], hcy = figs[f][1], hr = figs[f][2], g = figs[f][3], k = hr / 40.0;
        var near_head = ends.some(function (p) { return Math.abs(p[0] - hcx) < hr && Math.abs(p[1] - (hcy + hr)) < 45 * k; });
        if (L < 50 * k + 5 && near_head) return A_tlimb(x1, y1, x2, y2, A_SKIN, w);
        var near_sh = ends.some(function (p) { return Math.abs(p[0] - hcx) < 3.2 * hr && (hcy + hr - 12 * k) <= p[1] && p[1] <= (hcy + hr + 78 * k); });
        if (g) {
          var near_gtop = ends.some(function (p) { return (g[3] - 18 * k) <= p[1] && p[1] <= (g[3] + 28 * k) && (g[2] - 25 * k) <= p[0] && p[0] <= (g[4] + 25 * k); });
          if (near_gtop || (L >= 50 * k && near_sh)) return A_tlimb(x1, y1, x2, y2, mode === "bare" ? A_SKIN : g[1], w);
        } else if (L >= 40 * k && near_sh) {
          return A_tlimb(x1, y1, x2, y2, A_SKIN, w);
        }
      }
      return full;
    });
  }
  function arms(t, mode) {
    if (mode !== "bare" && mode !== "clothed") return t;
    try {
      var heads = A_head_tags(t);
      if (!heads.length) return t;
      var spans = A_g_spans(t), jobs = {};
      for (var h = 0; h < heads.length; h++) {
        var head = heads[h];
        var enclosing = spans.filter(function (s) { return s[0] < head[0] && head[1] <= s[1]; });
        enclosing.sort(function (a, b) { return (a[1] - a[0]) - (b[1] - b[0]); });
        var own = null;
        for (var s = 0; s < enclosing.length; s++) {
          var inside = heads.filter(function (x) { return enclosing[s][0] < x[0] && x[1] <= enclosing[s][1]; });
          if (inside.length === 1) { own = enclosing[s]; break; }
        }
        var key = own || (enclosing.length ? enclosing[0] : [0, t.length]);
        var kk = key[0] + ":" + key[1];
        if (!jobs[kk]) jobs[kk] = { span: key, heads: [] };
        jobs[kk].heads.push(head);
      }
      var out = t, spanList = Object.keys(jobs).map(function (kk) { return jobs[kk].span; });
      spanList.sort(function (a, b) { return b[0] - a[0]; });               // descending start
      for (var q = 0; q < spanList.length; q++) {
        var s0 = spanList[q][0], s1 = spanList[q][1];
        var hs = jobs[s0 + ":" + s1].heads.map(function (hh) { return [hh[0] - s0, hh[1] - s0, hh[2], hh[3], hh[4], hh[5]]; });
        var excl = [];
        for (var kk2 in jobs) {
          var a = jobs[kk2].span[0], b = jobs[kk2].span[1];
          if (!(a === s0 && b === s1) && s0 <= a && b <= s1) excl.push([a - s0, b - s0]);
        }
        out = out.slice(0, s0) + A_scope(out.slice(s0, s1), hs, mode, excl) + out.slice(s1);
      }
      return out;
    } catch (e) { return t; }
  }

  var api = { transform: transform, clothes: clothes, transformSvg: transformSvg, lfill: lfill, arms: arms };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FlexiTransforms = api;
})(typeof self !== "undefined" ? self : this);
