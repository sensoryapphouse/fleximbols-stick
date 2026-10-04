/* sw.js — the serverless shell for the Fleximbols web browser.
 *
 * The page is the Python browser's front-end, UNCHANGED. It talks to a server via
 * /api/list, /api/marks, /api/comment and renders each tile as <img src="/svg/...">.
 * This worker intercepts those same-origin requests so the whole thing runs with no
 * server:
 *   /api/list   -> static list.json
 *   /api/marks  -> empty marks (public web has no review marks)
 *   /api/comment-> no-op ok
 *   /svg/<style>/<file>?<transforms> -> raw SVG fetched from the public jsDelivr
 *      repos (person-style / culture pick the repo) then FlexiTransforms applied
 *      client-side. Byte-parity with the Python /svg endpoint is verified offline.
 */
importScripts("config.js", "flexi_transforms.js", "i18n.js");   // -> self.SVG_CONFIG, self.FlexiTransforms, self.FlexiI18n

var CFG = self.SVG_CONFIG, FT = self.FlexiTransforms;
var PS2REPO = { stick: "stick", toon: "toon", anime: "anime", simplified: "simplified",
                inclusive: "inclusive", cp: "inclusive", kawaii: "kawaii", threed: "3d", lineart: "lineart" };
var MARK_STYLES = ["stick", "toonlibbeta", "animelibbeta", "simplifiedlibbeta",
                   "inclusivelibbeta", "cplibbeta", "kawaiilibbeta", "threedlibbeta", "lineartlibbeta"];
var EMPTY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"></svg>';
// Persistent cache of transformed SVGs (Cache Storage, survives reloads). Each
// symbol+transform is fetched from the CDN and transformed ONCE, then served
// instantly from local cache. BUMP this version whenever flexi_transforms.js
// changes, so stale transformed SVGs don't outlive an engine update.
var SVG_CACHE = "fleximbols-svg-v29";


// ---- PiCom Fluent: sharded deflate packs + index.json, Range-fetched from jsDelivr ----
var FLUENT_INDEX = null, FLUENT_INDEX_P = null;
function _delay(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }
// Fetch the ~1 MB index with RETRIES — on a weak/flaky signal a single failed fetch would
// otherwise leave the whole Fluent set empty. 4 tries with backoff before giving up.
function fetchIndexRetry(tries) {
  return fetch(CFG.fluentPack + "/index.json", { cache: "no-store" })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
    .catch(function (e) {
      if (tries > 1) return _delay(700).then(function () { return fetchIndexRetry(tries - 1); });
      throw e;
    });
}
function fluentIndex() {
  if (FLUENT_INDEX) return Promise.resolve(FLUENT_INDEX);
  if (!FLUENT_INDEX_P) {
    FLUENT_INDEX_P = fetchIndexRetry(4)
      .then(function (j) { FLUENT_INDEX = j; return j; })
      .catch(function () { FLUENT_INDEX_P = null; return null; });   // allow a later call to retry afresh
  }
  return FLUENT_INDEX_P;
}
function pad3(n) { n = String(n); return n.length >= 3 ? n : ("000" + n).slice(-3); }
async function inflateRaw(ab) {
  var ds = new DecompressionStream("deflate-raw");
  var stream = new Response(ab).body.pipeThrough(ds);
  return await new Response(stream).text();
}
async function fluentFetchSvg(rel) {
  var idx = await fluentIndex();
  if (!idx || !idx.files) return null;
  var e = idx.files[rel];
  if (!e) return null;
  var shard = e[0], off = e[1], clen = e[2];
  var url = CFG.fluentPack + "/pack-" + pad3(shard) + ".bin";
  for (var attempt = 0; attempt < 3; attempt++) {   // retries — a dropped/cold range shouldn't blank the tile
    try {
      // cache:"no-store" — a brand-new @tag can be COLD on a jsDelivr edge and serve a corrupt
      // partial range; the browser would then cache that bad response and keep re-serving it.
      // Bypassing the HTTP cache always re-pulls the (warmed) bytes; the SW caches the final SVG.
      var r = await fetch(url, { headers: { Range: "bytes=" + off + "-" + (off + clen - 1) }, cache: "no-store" });
      if (!(r.status === 206 || r.status === 200)) throw new Error("http " + r.status);
      var ab = await r.arrayBuffer();
      if (r.status === 200 && ab.byteLength > clen) ab = ab.slice(off, off + clen);   // Range ignored -> slice
      return await inflateRaw(ab);   // throws if the (cold) range was corrupt -> retried below
    } catch (_) {
      if (attempt < 2) await _delay(600 * (attempt + 1));   // 600ms, 1200ms — let a cold shard warm
    }
  }
  return null;
}
function fluentListResp() {
  return fluentIndex().then(function (idx) {
    var files = (idx && idx.files) ? Object.keys(idx.files).map(function (n) { return { name: n, mtime: 0 }; }) : [];
    if (files.length) maybePrewarmFluent();   // opened Fluent -> warm shards (fully decoupled, safe)
    return jsonResp({ files: files });
  });
}
// A SEARCH page scatters across all 16 shards; on a cold jsDelivr edge each shard's first
// hit makes jsDelivr fetch+cache the whole 18MB, stalling the page. Pre-warm every shard
// with a 1-byte Range (one range caches the whole shard edge-side). Runs in its OWN promise
// chain, each fetch individually try/caught — it can NEVER affect the index/list load. Once/SW.
var FLUENT_WARMED = false;
function maybePrewarmFluent() {
  if (FLUENT_WARMED) return;
  // SKIP on slow / data-saver connections — the point of warming is faster search on good
  // links; on a weak signal 16 requests would only compete with the actual symbol loads.
  try {
    var c = navigator.connection;
    if (c && (c.saveData || /(^|[^0-9])2g$/.test(c.effectiveType || "") || c.effectiveType === "slow-2g")) return;
  } catch (e) {}
  FLUENT_WARMED = true;
  Promise.resolve(FLUENT_INDEX).then(function (idx) {
    if (!idx || !idx.shards) return;
    // fire GENTLY — stagger the shard warms so we never burst 16 requests at once.
    var s = 0;
    (function next() {
      if (s >= idx.shards) return;
      try {
        fetch(CFG.fluentPack + "/pack-" + pad3(s) + ".bin", { headers: { Range: "bytes=0-0" }, cache: "no-store" }).catch(function () {});
      } catch (e) {}
      s++;
      _delay(250).then(next);
    })();
  }).catch(function () {});
}

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== SVG_CACHE; })
                          .map(function (k) { return caches.delete(k); }));   // drop old cache versions
    await self.clients.claim();
  })());
});

function jsonResp(obj) { return new Response(JSON.stringify(obj), { headers: { "Content-Type": "application/json" } }); }
function svgResp(txt) { return new Response(txt, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "no-cache" } }); }
function emptyMarks() {
  var m = { delete: {}, rebuild: {}, notes: {} };
  MARK_STYLES.forEach(function (k) { m.delete[k] = []; m.rebuild[k] = []; m.notes[k] = {}; });
  return m;
}

var CACHED_LIST = null;
async function getListJson() {
  if (CACHED_LIST) return CACHED_LIST;
  try {
    var r = await fetch("list.json");
    if (r.ok) {
      CACHED_LIST = await r.json();
      return CACHED_LIST;
    }
  } catch (_) {}
  return { files: [] };
}


async function handleApiList(url) {
  var style = url.searchParams.get("style") || "stick";
  if (style === "fluent" && url.searchParams.get("use_legacy_fluent") === "true") {
      return fluentListResp();
  }
  
  var collectionsData = await getCollectionsJson();
  if (collectionsData) {
      if (collectionsData[style]) {
          var files = collectionsData[style].map(function(s) { return { name: s, mtime: 0 }; });
          return jsonResp({ files: files });
      }
  }
  
  if (style === "stick" || style === "simplified") {
      var r = await fetch("list.json", { cache: "no-store" });
      if (r.ok) return jsonResp(await r.json());
  }
  
  return jsonResp({ files: [] });
}

async function handleApiLanguages() {
  var i18n = self.FlexiI18n;
  var langs = i18n ? i18n.getLanguages() : [];
  return jsonResp({ total: langs.length, languages: langs });
}


async function getCollectionsJson() {
  try {
    var r = await fetch("/collections.json");
    if (r.ok) return await r.json();
  } catch (_) {}
  return null;
}

async function handleApiCategories(url) {
  var lang = url.searchParams.get("lang") || "en";
  var i18n = self.FlexiI18n;
  if (i18n) i18n.setLocale(lang);
  var targetCollection = url.searchParams.get("style") || url.searchParams.get("collection") || "fluent";
  var collectionsData = await getCollectionsJson();
  var collectionsToSearch = [];
  if (collectionsData) {
      if (targetCollection === "all") {
        for (var k in collectionsData) collectionsToSearch.push(collectionsData[k]);
      } else if (collectionsData[targetCollection]) {
        collectionsToSearch.push(collectionsData[targetCollection]);
      }
  } else {
      var list = await getListJson();
      collectionsToSearch.push(list.files ? list.files.map(f => f.name) : []);
  }

  var catCounts = new Map();
  for (var i = 0; i < collectionsToSearch.length; i++) {
    var files = collectionsToSearch[i];
    for (var j = 0; j < files.length; j++) {
      var parts = files[j].split('/');
      if (parts.length > 1) {
        var c = parts[0];
        catCounts.set(c, (catCounts.get(c) || 0) + 1);
      }
    }
  }
  var categories = Array.from(catCounts.entries()).map(function (entry) {
    return {
      id: entry[0],
      name: entry[0],
      localizedName: i18n ? i18n.translateCategory(entry[0]) : entry[0],
      symbolCount: entry[1]
    };
  }).sort(function (a, b) { return a.localizedName.localeCompare(b.localizedName); });
  return jsonResp({ lang: lang, total: categories.length, categories: categories });
}

async function handleApiDisambiguate(url) {
  var rawWord = url.searchParams.get("word");
  var lang = url.searchParams.get("lang") || "en";
  if (!rawWord) return jsonResp({ error: "Missing required 'word' parameter" });
  var i18n = self.FlexiI18n;
  if (i18n) i18n.setLocale(lang);
  var stem = i18n ? i18n.cleanSymbolStem(rawWord) : rawWord.toLowerCase();
  var domains = ['AAC Device', 'Business and Workplace Concepts', 'Work and Jobs', 'Games',
                 'Transport', 'Sports', 'Toys', 'Community Places', 'Money', 'Nature',
                 'Animals', 'Birds', 'Insects', 'Plants', 'Weather', 'Time', 'Verbs',
                 'Storytelling', 'Music', 'Instruments', 'Kitchen Objects', 'Measuring',
                 'Clothing', 'Technology', 'Life Skills', 'Social and Emotional',
                 'Health', 'Household Objects', 'American Sign Language', 'Feelings Extra',
                 'Tools', 'School', 'History'];
  var senses = [], seen = new Set();
  domains.forEach(function (domain) {
    var dummyPath = domain + "/" + stem + ".svg";
    var trans = i18n ? i18n.translateSymbol(dummyPath) : stem;
    if (trans && trans.toLowerCase() !== stem && !seen.has(trans)) {
      seen.add(trans);
      senses.push({
        domain: domain,
        localizedDomain: i18n ? i18n.translateCategory(domain) : domain,
        localizedDescription: trans,
        examplePath: dummyPath,
        svgUrl: "/svg/stick/" + encodeURIComponent(dummyPath)
      });
    }
  });
  var defaultTrans = i18n ? i18n.translateSymbol("General/" + stem + ".svg") : rawWord;
  return jsonResp({
    word: rawWord,
    stem: stem,
    lang: lang,
    defaultTranslation: defaultTrans,
    sensesCount: senses.length,
    senses: senses
  });
}

async function handleApiSearch(url) {
  var q = (url.searchParams.get("q") || "").trim().toLowerCase();
  var lang = url.searchParams.get("lang") || "en";
  var style = url.searchParams.get("style") || "all";
  var category = (url.searchParams.get("category") || "").trim();
  var gender = url.searchParams.get("gender") || "all";
  var adult = url.searchParams.get("adult") === "1" || url.searchParams.get("adult") === "true";
  var showPlurals = url.searchParams.get("plurals") === "1" || url.searchParams.get("plurals") === "true";
  var showAlphabets = url.searchParams.get("alphabets") === "1" || url.searchParams.get("alphabets") === "true";
  var page = parseInt(url.searchParams.get("page") || "1", 10);
  var limit = parseInt(url.searchParams.get("limit") || "24", 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 24;
  if (limit > 100) limit = 100;

  var i18n = self.FlexiI18n;
  if (i18n) i18n.setLocale(lang);
  var targetCollection = url.searchParams.get("style") || url.searchParams.get("collection") || "fluent";
  var collectionsData = await getCollectionsJson();
  var collectionsToSearch = [];
  if (collectionsData) {
      if (targetCollection === "all") {
        for (var k in collectionsData) {
          collectionsToSearch.push({ id: k, files: collectionsData[k] });
        }
      } else if (collectionsData[targetCollection]) {
        collectionsToSearch.push({ id: targetCollection, files: collectionsData[targetCollection] });
      }
  } else {
      var list = await getListJson();
      collectionsToSearch.push({ id: "fluent", files: list.files ? list.files.map(f => f.name) : [] });
  }

  var matched = [];
  for (var i = 0; i < collectionsToSearch.length; i++) {
    var colId = collectionsToSearch[i].id;
    var files = collectionsToSearch[i].files;
    
    for (var j = 0; j < files.length; j++) {
      var rawPath = files[j];
      var parts = rawPath.split('/');
      var cat = parts[0];
      var filename = parts[parts.length - 1];

      if (!adult && cat === "18+") continue;
      if (!showPlurals && (cat === "Plurals and tenses" || cat.startsWith("Plurals"))) continue;
      if (!showAlphabets && cat === "Alphabets") continue;
      if (category && cat.toLowerCase() !== category.toLowerCase()) continue;
      if (gender === "male" && filename.includes("(F)")) continue;
      if (gender === "female" && filename.includes("(M)")) continue;

      if (q) {
        var matchRaw = rawPath.toLowerCase().includes(q);
        var locSymbol = i18n ? i18n.translateSymbol(rawPath).toLowerCase() : "";
        var matchLocSymbol = locSymbol.includes(q);
        var locCat = i18n ? i18n.translateCategory(cat).toLowerCase() : "";
        var matchCat = locCat.includes(q);
        if (!matchRaw && !matchLocSymbol && !matchCat) continue;
      }

      var localizedTitle = i18n ? i18n.translateSymbol(rawPath) : filename;
      var localizedCategory = i18n ? i18n.translateCategory(cat) : cat;
      var svgUrl = "/api/v1/svg/" + (colId === "fluent" ? (style === "all" ? "stick" : style) : colId) + "/" + encodeURIComponent(rawPath);

      matched.push({
        id: rawPath.replace(/\.(svg|png)$/i, ""),
        path: rawPath,
        name: filename.replace(/\.(svg|png)$/i, ""),
        localizedName: localizedTitle,
        category: cat,
        localizedCategory: localizedCategory,
        collection: colId,
        mtime: null,
        url: svgUrl,
        svgUrl: svgUrl
      });
    }
  }

  var total = matched.length;
  var totalPages = Math.ceil(total / limit) || 1;
  var start = (page - 1) * limit;
  var results = matched.slice(start, start + limit);

  return jsonResp({
    query: q,
    lang: lang,
    page: page,
    limit: limit,
    total: total,
    totalPages: totalPages,
    results: results
  });
}

async function handleApiStats() {
  var list = await getListJson();
  var catSet = new Set();
  (list.files || []).forEach(function (f) {
    var c = f.name.split("/")[0];
    if (c) catSet.add(c);
  });
  var i18n = self.FlexiI18n;
  var langs = i18n ? i18n.getLanguages() : [];
  return jsonResp({
    totalSymbols: (list.files || []).length,
    totalCategories: catSet.size,
    totalLanguages: langs.length,
    supportedStyles: [
      { id: "stick", name: "PiCom Fleximbols Stick" },
      { id: "fluent", name: "PiCom Fluent" },
      { id: "toon", name: "Toon Library" },
      { id: "anime", name: "Anime Library" },
      { id: "simplified", name: "Simplified Library" },
      { id: "inclusive", name: "Inclusive Library" },
      { id: "kawaii", name: "Kawaii Library" },
      { id: "3d", name: "3D Library" },
      { id: "lineart", name: "Lineart Library" }
    ],
    supportedCulturesCount: 60,
    version: "1.0.0",
    docsUrl: "/api/docs"
  });
}

self.addEventListener("fetch", function (e) {
  var url;
  try { url = new URL(e.request.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;         // let cross-origin (jsDelivr) pass through
  var p = url.pathname;
  
  if (p.indexOf("/svg/") >= 0) {
    var after = url.pathname.substring(url.pathname.indexOf("/svg/") + 5);
    var slash = after.indexOf("/");
    var style = slash >= 0 ? after.substring(0, slash) : "";
    var rel = decodeURIComponent(slash >= 0 ? after.substring(slash + 1) : after);
    
    var parametric = ["fluent", "stick", "simplified", "3d", "inclusive", "cp", "kawaii", "toon", "lineart"];
    if (!parametric.includes(style)) {
        var base = self.SVG_CONFIG.bases[style];
        if (base) {
            var fetchUrl = base + "/" + encodeURIComponent(rel).replace(/%2F/g, "/");
            e.respondWith(fetch(fetchUrl, {mode: 'cors'}));
            return;
        }
    }
    e.respondWith(renderSvg(url)); 
    return; 
  }

  if (/\/api\/list$/.test(p))    { e.respondWith(handleApiList(url)); return; }
  if (/\/api\/marks$/.test(p))   { e.respondWith(e.request.method === "POST" ? jsonResp({ ok: true }) : jsonResp(emptyMarks())); return; }
  if (/\/api\/comment$/.test(p)) { e.respondWith(jsonResp({ ok: true })); return; }

  // API v1 routes
  if (/\/api\/v1\/languages$/.test(p))    { e.respondWith(handleApiLanguages()); return; }
  if (/\/api\/v1\/categories$/.test(p))   { e.respondWith(handleApiCategories(url)); return; }
  if (/\/api\/v1\/disambiguate$/.test(p)) { e.respondWith(handleApiDisambiguate(url)); return; }
  if (/\/api\/v1\/search$/.test(p))       { e.respondWith(handleApiSearch(url)); return; }
  if (/\/api\/v1\/stats$/.test(p))        { e.respondWith(handleApiStats()); return; }
  // Locales JSON caching (network-first, falling back to cache)
  if (p.indexOf("/locales/") >= 0) {
    e.respondWith(
      fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var clone = res.clone();
          caches.open(SVG_CACHE).then(function (cache) { cache.put(e.request, clone); });
        }
        return res;
      }).catch(function () {
        return caches.match(e.request);
      })
    );
    return;
  }
  // everything else (index.html, config.js, flexi_transforms.js, list.json, ...) → network
});


async function tryFetch(u) { try { var r = await fetch(u); if (r.ok) return await r.text(); } catch (_) {} return null; }

// Cache key = the request minus the volatile cache-buster params (v, s); only the
// transform-affecting params matter, so identical looks share one cache entry
// across reloads and pages.
var TX_KEYS = ["ps", "border", "skin", "hair", "colour", "cvi", "mirror", "top", "bottom", "arms", "diverse", "culture", "lfill"];
function cacheKeyFor(url) {
  var kp = new URLSearchParams();
  TX_KEYS.forEach(function (k) { var v = url.searchParams.get(k); if (v != null && v !== "") kp.set(k, v); });
  var qs = kp.toString();
  return url.origin + url.pathname + (qs ? "?" + qs : "");
}

async function renderSvg(url) {
  var cache = null, key = cacheKeyFor(url);
  try { cache = await caches.open(SVG_CACHE); var hit = await cache.match(key); if (hit) return hit; } catch (_) {}
  var out = await computeSvg(url);
  if (out == null) return svgResp(EMPTY_SVG);                          // failure: serve empty, do NOT cache
  var resp = svgResp(out);
  try { if (cache) await cache.put(key, resp.clone()); } catch (_) {}
  return resp;
}

// Returns the SVG text (or null on failure — never cached). Skips FlexiTransforms
// entirely when no transform is active (the common default view) — a pure passthrough.
async function computeSvg(url) {
  try {
    var after = url.pathname.substring(url.pathname.indexOf("/svg/") + 5);   // "<style>/<enc rel>"
    var slash = after.indexOf("/");
    var style = slash >= 0 ? after.substring(0, slash) : "";
    var rel = decodeURIComponent(slash >= 0 ? after.substring(slash + 1) : after);
    var q = url.searchParams;

    // PiCom Fluent: fetch from packs; apply Border + Skin (shade-preserving) + the
    // generic Colour(muted)/CVI/Mirror transforms (figure transforms don't apply).
    if (style === "fluent") {
      var ftext = await fluentFetchSvg(rel);
      if (ftext === null) return null;
      var fo = {
        border: q.get("border") || "", skin: q.get("skin") || "",
        colour: q.get("colour") || "", cvi: q.get("cvi") === "1" ? "1" : "",
        mirror: q.get("mirror") === "1" ? "1" : "", fluent: true
      };
      var fAny = (fo.border && fo.border !== "original") || (fo.skin && fo.skin !== "default") ||
                 fo.colour === "muted" || fo.cvi || fo.mirror;
      return fAny ? FT.transform(ftext, rel, fo) : ftext;
    }
    var ps = q.get("ps") || "stick";
    var culture = q.get("culture") || "none";
    var B = CFG.bases, CB = CFG.cultureBase;
    var enc = rel.split("/").map(encodeURIComponent).join("/");

    var text = null, kind = "stick";
    if (culture !== "none" && ps === "stick") {                       // pre-baked dressed figure
      text = await tryFetch(CB.replace("{culture}", encodeURIComponent(culture)) + "/" + enc);
      if (text !== null) kind = "culture";
      else { text = await tryFetch(B.stick + "/" + enc); kind = "stick"; }
    } else {
      var repo = PS2REPO[ps] || "stick";
      text = await tryFetch(B[repo] + "/" + enc);
      if (text !== null) kind = (repo === "stick") ? "stick" : "pilot";
      else if (repo !== "stick") { text = await tryFetch(B.stick + "/" + enc); kind = "stick"; }
    }
    if (text === null) return null;

    var opts = {
      border: q.get("border") || "", skin: q.get("skin") || "", hair: q.get("hair") || "",
      colour: q.get("colour") || "", cvi: q.get("cvi") === "1" ? "1" : "",
      mirror: q.get("mirror") === "1" ? "1" : "", top: q.get("top") || null,
      bottom: q.get("bottom") || null, arms: q.get("arms") || "stick",
      diverse: q.get("diverse") === "1", lfill: q.get("lfill") || ""
    };
    var anyTx = (opts.border && opts.border !== "original") || (opts.skin && opts.skin !== "default") ||
                (opts.hair && opts.hair !== "default") || opts.colour === "muted" || opts.cvi ||
                opts.mirror || opts.top || opts.bottom || (opts.arms && opts.arms !== "stick") || opts.diverse || opts.lfill;
    if (kind === "culture") return text;                              // baked, as-is
    return anyTx ? FT.transform(text, rel, opts) : text;
  } catch (err) {
    return null;
  }
}
