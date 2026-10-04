/* config.js — jsDelivr bases for the Fleximbols web browser's Service Worker.
 * Loaded via importScripts() inside sw.js, so it assigns to `self` (works in a
 * worker; `window` is undefined there). The 68 symbol/culture repos are PUBLIC,
 * so jsDelivr serves them CORS-enabled with no server or Cloudflare Worker.
 * Cache note: jsDelivr caches "@main" hard — bump to "@v2" (push a tag) after
 * re-publishing symbols, or purge via purge.jsdelivr.net. */
var GH = "https://cdn.jsdelivr.net/gh/sensoryapphouse";
self.SVG_CONFIG = {
  bases: {
    stick:      GH + "/fleximbols-stick@main",
    toon:       GH + "/fleximbols-toon@main",
    anime:      GH + "/fleximbols-anime@main",
    simplified: GH + "/fleximbols-simplified@main",
    inclusive:  GH + "/fleximbols-inclusive@main",
    cp:         GH + "/fleximbols-inclusive@main",
    kawaii:     GH + "/fleximbols-kawaii@main",
    "3d":       GH + "/fleximbols-3d@main",
    lineart:    GH + "/fleximbols-lineart@v3",
    // New libraries from precache
    "3d_png":   GH + "/fleximbols-3d-png@main",
    plain:      GH + "/fleximbols-plain@main",
    simple:     GH + "/fleximbols-simple@main",
    animation:  GH + "/fleximbols-animation@main",
    picom_realistic: GH + "/fleximbols-picom-realistic@main",
    pop_art:    GH + "/fleximbols-pop-art@main",
    picom_classic: GH + "/fleximbols-picom-classic@main",
    screenprint: GH + "/fleximbols-screenprint@main",
    picom_cartoon: GH + "/fleximbols-picom-cartoon@main",
    generic:    GH + "/fleximbols-generic@main",
    picom_sommi: GH + "/fleximbols-picom-sommi-person@main",
    picom_cute: GH + "/fleximbols-picom-cute@main",
    "anime_png": GH + "/fleximbols-anime-png@main",
  },
  cultureBase: GH + "/fleximbols-culture-{culture}@main",   // {culture} -> the culture key
  // PiCom Fluent (55k) is served from sharded deflate packs + index.json (not per-file),
  // Range-fetched from this public repo. See sw.js fluentFetchSvg(). LOCAL dev uses the
  // web/fluent-pack symlink (served by range_server.py).
  //
  // PRODUCTION USES GITHUB RAW, **NOT** jsDelivr. jsDelivr brotli-compresses the .bin packs
  // and serves Range requests against the COMPRESSED representation (content-range total came
  // back as the compressed size, ~167 KB smaller than the real file), so byte-offsets from the
  // index landed in the wrong stream -> truncated deflate -> inflate fails -> blank symbols.
  // It appeared to work right after publishing only because that edge hadn't cached the
  // compressed variant yet; a purge did NOT fix it. raw.githubusercontent.com serves the packs
  // IDENTITY (no content-encoding), honours Range with the correct total (206, exact bytes),
  // and sends `access-control-allow-origin: *`. Use an immutable TAG ref (v4) so the offsets in
  // index.json always match the packs; bump it whenever the packs are rebuilt.
  fluentPack: "https://raw.githubusercontent.com/sensoryapphouse/fleximbols-fluent/v10",
};
