
// Fallback script loader for insecure contexts
async function loadCryptoJs() {
    if (window.CryptoJS) return;
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

async function aiSha256hex(text) {
    if (window.crypto && window.crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    await loadCryptoJs();
    return CryptoJS.SHA256(text).toString();
}

async function aiSignRequest(method, path, bodyStr, apiKey) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    let bodyHash;
    if (window.crypto && window.crypto.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(bodyStr || ''));
        bodyHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
        await loadCryptoJs();
        bodyHash = CryptoJS.SHA256(bodyStr || '').toString();
    }
    
    const message = `${timestamp}:${method}:${path}:${bodyHash}`;
    
    let signature;
    if (window.crypto && window.crypto.subtle) {
        const keyData = new TextEncoder().encode(apiKey);
        const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const sigBuf = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
        signature = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
        await loadCryptoJs();
        signature = CryptoJS.HmacSHA256(message, apiKey).toString();
    }
    
    return { 'X-API-Timestamp': timestamp, 'X-API-Signature': signature };
}

function getAISettings() {
    return { serverUrl: 'https://symbolsmaker.online', apiKey: 'sm-42e127552d71bbda1ef4d0cfc015712a9baf6ae8' };
}




function generateUUID() {
    if (window.crypto && window.crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getAIClientId() {
    let id = localStorage.getItem('aiClientId');
    if (!id) {
        id = generateUUID();
        try { localStorage.setItem('aiClientId', id); } catch (e) {}
    }
    return id;
}




async function aiApiGet(path) {
    const { serverUrl, apiKey } = getAISettings();
    if (!navigator.onLine) throw new Error('No internet connection');
    const authHeaders = await aiSignRequest('GET', path, '', apiKey);
    let res;
    try {
        res = await fetch(`${serverUrl}${path}`, { headers: { ...authHeaders, 'X-Client-ID': getAIClientId() } });
    } catch (e) {
        throw new Error('Cannot reach AI server. Check your connection.');
    }
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        let msg;
        try { msg = JSON.parse(text).error; } catch (_) { msg = null; }
        throw new Error(msg || `Server error (${res.status})`);
    }
    return res.json();
}

async function aiApiPost(path, body) {
    const { serverUrl, apiKey } = getAISettings();
    if (!navigator.onLine) throw new Error('No internet connection');
    const bodyStr = JSON.stringify(body);
    const authHeaders = await aiSignRequest('POST', path, bodyStr, apiKey);
    let res;
    try {
        res = await fetch(`${serverUrl}${path}`, {
            method: 'POST',
            headers: { ...authHeaders, 'Content-Type': 'application/json', 'X-Client-ID': getAIClientId() },
            body: bodyStr
        });
    } catch (e) {
        throw new Error('Cannot reach AI server. Check your connection.');
    }
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        let msg;
        try { msg = JSON.parse(text).error; } catch (_) { msg = null; }
        if (res.status === 401) throw new Error('Authentication failed — clock may be out of sync');
        if (res.status === 503) throw new Error('Server busy — please try again in a few seconds');
        throw new Error(msg || `Server error (${res.status})`);
    }
    return res.json();
}

async function generateAISymbol() {
    const term = document.getElementById('aiSymbolTerm').value.trim();
    if (!term) { document.getElementById('aiSymbolTerm').focus(); return; }

    const style = document.getElementById('aiSymbolStyle').value;
    const removeBackground = document.getElementById('aiSymbolRemoveBg').checked;
    const makeSVG = document.getElementById('aiSymbolMakeSVG').checked;

    const btn = document.getElementById('aiSymbolGenerateBtn');
    const progress = document.getElementById('aiSymbolProgress');
    const status = document.getElementById('aiSymbolStatus');
    const error = document.getElementById('aiSymbolError');
    const bar = document.getElementById('aiSymbolProgressBar');
    const preview = document.getElementById('aiSymbolPreview');

    btn.disabled = true;
    btn.textContent = 'Generating...';
    progress.style.display = 'flex';
    error.style.display = 'none';
    status.textContent = 'Submitting job...';
    bar.style.width = '5%';
    preview.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    try {
        if (!navigator.onLine) throw new Error('No internet connection');
        const body = { term, style, removeBackground, makeSVG };
        
        const job = await aiApiPost('/api/generate', body);
        if (job.error) throw new Error(job.error);
        if (!job.jobId) throw new Error('Server did not return a job ID');

        const estSeconds = job.estimatedWaitSeconds || 15;
        status.textContent = job.queuePosition != null ? `Queued (Position: #${job.queuePosition})` : `Generating...`;
        bar.style.width = '10%';

        const pollInterval = 2500;
        const startTime = Date.now();
        const maxAttempts = 30; // ~75 seconds
        let attempts = 0;

        
        const poll = async () => {
            attempts++;
            const st = await aiApiGet(`/api/status/${job.jobId}`);
            if (st.status === 'complete') {
                status.textContent = 'Complete!';
                bar.style.width = '100%';
                
                if (st.imageData || st.svgData) {
                    preview.src = st.svgData || st.imageData;
                    
                    // Save to Cloudflare History API
                    try {
                        await fetch(HISTORY_API_URL + '/history', {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Client-ID': getClientId()
                            },
                            body: JSON.stringify({
                                term: document.getElementById('aiSymbolTerm').value.trim(),
                                style: document.getElementById('aiSymbolStyle').value,
                                base64Data: preview.src 
                            })
                        });
                        // Refresh mini history
                        const items = await fetchHistoryData();
                        renderMiniHistory(items);
                    } catch (e) { console.error("Failed to save history", e); }
                }
                
                btn.disabled = false;
                btn.textContent = 'Generate Symbol';
                setTimeout(() => { progress.style.display = 'none'; }, 2000);
                return;
            }
            if (st.status === 'failed') throw new Error(st.error || 'Job failed');
            if (attempts >= maxAttempts) throw new Error('Timed out waiting for symbol');

            let p = Math.min(90, 10 + (attempts / maxAttempts) * 80);
            bar.style.width = p + '%';
            if (st.queuePosition != null && st.status === 'queued') {
                status.textContent = `Queued (Position: #${st.queuePosition})...`;
            } else {
                status.textContent = 'Generating...';
            }
            setTimeout(poll, pollInterval);
        };

        setTimeout(poll, pollInterval);

    } catch (e) {
        error.textContent = e.message;
        error.style.display = 'block';
        progress.style.display = 'none';
        
        const msg = e.message.toLowerCase();
        if (msg.includes('too many') || msg.includes('queue') || msg.includes('busy')) {
            btn.disabled = true;
            let timeLeft = 15;
            btn.textContent = `⏳ Paused... (${timeLeft}s)`;
            const timer = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    btn.disabled = false;
                    btn.textContent = 'Generate Symbol';
                } else {
                    btn.textContent = `⏳ Paused... (${timeLeft}s)`;
                }
            }, 1000);
        } else {
            btn.disabled = false;
            btn.textContent = 'Generate Symbol';
        }
    }
}


let acTimer = null;

const styleToSlug = {
    "PiCom Realistic": "picom_realistic",
    "PiCom Cartoon": "picom_cartoon",
    "Anime": "anime_png",
    "Animation": "animation",
    "Pop Art": "pop_art",
    "PiCom Cute": "picom_cute",
    "PiCom Sommi (person)": "picom_sommi",
    "PiCom Classic": "picom_classic",
    "Plain": "plain",
    "ScreenPrint": "screenprint"
};

async function fetchAutocomplete() {
    clearTimeout(acTimer);
    const term = document.getElementById('aiSymbolTerm').value.trim();
    const dropdown = document.getElementById('acDropdown');
    
    // Check if empty to toggle button, etc.
    document.getElementById('aiSymbolGenerateBtn').disabled = !term;
    
    if (term.length < 2) {
        dropdown.style.display = 'none';
        return;
    }
    
    const styleRaw = document.getElementById('aiSymbolStyle').value;
    const styleAPI = styleRaw.replace(/ /g, '_'); // Matches the API expectation
    
    acTimer = setTimeout(async () => {
        try {
            const res = await fetch(`https://symbolsmaker.online/autocomplete/${encodeURIComponent(styleAPI)}/${encodeURIComponent(term)}`);
            if (!res.ok) throw new Error('API error');
            const matches = await res.json();
            
            if (matches.length === 0) {
                dropdown.style.display = 'none';
                return;
            }
            
            const slug = styleToSlug[styleRaw] || "generic";
            const ext = ["picom_classic", "simplified", "stick"].includes(slug) ? "svg" : "png";
            
            
            const repoMap = {
                "picom_realistic": "fleximbols-picom-realistic",
                "picom_cartoon": "fleximbols-picom-cartoon",
                "anime_png": "fleximbols-anime-png",
                "animation": "fleximbols-animation",
                "pop_art": "fleximbols-pop-art",
                "picom_cute": "fleximbols-picom-cute",
                "picom_sommi": "fleximbols-picom-sommi-person",
                "picom_classic": "fleximbols-picom-classic",
                "plain": "fleximbols-plain",
        "simple": "fleximbols-simple",
                "screenprint": "fleximbols-screenprint",
                "generic": "fleximbols-generic",
                "simplified": "fleximbols-simplified",
                "stick": "fleximbols-stick"
            };
            const repo = repoMap[slug] || ("fleximbols-" + slug.replace(/_/g, '-'));
            const cdnBase = `https://cdn.jsdelivr.net/gh/sensoryapphouse/${repo}@main`;

            dropdown.innerHTML = matches.map((m, i) => {
                const fname = encodeURIComponent(m);
                const esc = m.replace(/'/g, "\'");
                const imgUrl = `${cdnBase}/${fname}.${ext}`;
                return `<div class="ac-item" data-term="${m}" onmousedown="acSelect('${esc}', '${slug}', '${ext}')" style="cursor:pointer; border-radius:6px; padding:4px; display:flex; align-items:center; justify-content:center;" title="${esc}">
                  <img src="${imgUrl}" style="width:56px; height:56px; object-fit:contain; background:#fff; border-radius:4px; pointer-events:none;" onerror="this.parentElement.style.display='none'">
                </div>`;
            }).join('');

            
            dropdown.style.display = 'grid';
        } catch (e) {
            dropdown.style.display = 'none';
        }
    }, 200);
}


function acSelect(term, slug, ext) {
    document.getElementById('aiSymbolTerm').value = term;
    document.getElementById('acDropdown').style.display = 'none';
    
    const fname = encodeURIComponent(term);
    const repoMap = {
        "picom_realistic": "fleximbols-picom-realistic",
        "picom_cartoon": "fleximbols-picom-cartoon",
        "anime_png": "fleximbols-anime-png",
        "animation": "fleximbols-animation",
        "pop_art": "fleximbols-pop-art",
        "picom_cute": "fleximbols-picom-cute",
        "picom_sommi": "fleximbols-picom-sommi-person",
        "picom_classic": "fleximbols-picom-classic",
        "plain": "fleximbols-plain",
        "simple": "fleximbols-simple",
        "screenprint": "fleximbols-screenprint",
        "generic": "fleximbols-generic",
        "simplified": "fleximbols-simplified",
        "stick": "fleximbols-stick"
    };
    const repo = repoMap[slug] || ("fleximbols-" + slug.replace(/_/g, '-'));
    const cdnBase = `https://cdn.jsdelivr.net/gh/sensoryapphouse/${repo}@main`;
    
    const preview = document.getElementById('aiSymbolPreview');
    preview.src = `${cdnBase}/${fname}.${ext}`;

    
    const status = document.getElementById('aiSymbolStatus');
    const bar = document.getElementById('aiSymbolProgressBar');
    const error = document.getElementById('aiSymbolError');
    const progress = document.getElementById('aiSymbolProgress');
    
    progress.style.display = 'flex';
    status.textContent = 'Loaded existing symbol!';
    bar.style.width = '100%';
    error.style.display = 'none';
    
    setTimeout(() => { progress.style.display = 'none'; }, 2000);
    
    // Save to Cloudflare History
    fetch(HISTORY_API_URL + '/history', {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'X-Client-ID': getClientId() },
        body: JSON.stringify({
            term: term,
            style: document.getElementById('aiSymbolStyle').value,
            imageUrl: preview.src
        })
    }).then(() => fetchHistoryData()).then(items => renderMiniHistory(items)).catch(e => console.error("Failed to save AC history", e));
}



    // --- EXACT COPY FROM flux-swift ---
    let acTip = null;
    function acShowTip(item) {
      const term = item.dataset.term;
      if (!term) return;
      if (!acTip) {
        acTip = document.createElement('div');
        acTip.id = 'acTip';
        acTip.style.cssText = 'position:fixed;background:rgba(0,0,0,0.94);color:#fff;padding:8px 14px;border-radius:8px;font-size:16px;font-weight:500;line-height:1.2;pointer-events:none;z-index:10000;box-shadow:0 4px 16px rgba(0,0,0,0.6);white-space:nowrap;';
        document.body.appendChild(acTip);
      }
      acTip.textContent = term;
      acTip.style.display = 'block';
      const r = item.getBoundingClientRect();
      // place ABOVE the cell, horizontally centered
      acTip.style.left = (r.left + r.width / 2) + 'px';
      acTip.style.top = (r.top - acTip.offsetHeight - 8) + 'px';
      acTip.style.transform = 'translateX(-50%)';
    }
    function acHideTip() { if (acTip) acTip.style.display = 'none'; }
    
    document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      if (!e.target.closest('#aiSymbolTerm') && !e.target.closest('#acDropdown')) {
        const dd = document.getElementById('acDropdown');
        if (dd) dd.style.display = 'none';
      }
    });

      // Use document.body to delegate since acDropdown is dynamically shown
      document.body.addEventListener('mouseover', e => {
        const item = e.target.closest('.ac-item');
        if (item) acShowTip(item);
      });
      document.body.addEventListener('mouseout', e => {
        const item = e.target.closest('.ac-item');
        const rel = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.ac-item');
        if (item && item !== rel) acHideTip();
      });
    });

    let selectedItem = null;
    let ctxJobId = null;
    let ctxImgUrl = null;
    let ctxSvgUrl = null;
    let ctxFname = null;
    let ctxType = null;
    
    function buildActionBar(type, hasBackup, hasTransparency) {
      const isPng = type !== "svg";
      const hasBG = !!hasBackup;
      const isTrans = !!hasTransparency;
      // Show Remove BG buttons only if: png, no backup yet, and image is NOT already transparent
      const showRemove = false; // Disabled for fleximbols-browser PWA logic
      // Show Undo only if backup exists
      const showUndo = false;
      const dlBtns = isPng
        // Raster source: PNG, WebP
        ? '<button onclick="event.stopPropagation();downloadGalleryItem(\'png\')"><span class="ab-icon">&#8595;</span>PNG</button>' +
          '<button onclick="event.stopPropagation();downloadGalleryItem(\'webp\')"><span class="ab-icon">&#8595;</span>WebP</button>'
        // SVG source: ONLY SVG
        : '<button onclick="event.stopPropagation();downloadGalleryItem(\'svg\')"><span class="ab-icon">&#8595;</span>SVG</button>';
      return '<div class="action-bar visible">' +
        dlBtns +
        '</div>';
    }

    function selectResultImage(el, type) {
      // Setup dataset properties to mock the flux-swift environment for download
      const previewImg = document.getElementById('aiSymbolPreview');
      if (!previewImg.src || previewImg.src.startsWith('data:image/gif')) return;
      
      const term = document.getElementById('aiSymbolTerm').value.trim() || 'symbol';
      const isSvg = previewImg.src.includes('.svg') || previewImg.src.includes('svg+xml');
      
      el.dataset.fname = term;
      el.dataset.type = isSvg ? 'svg' : 'png';
      
      if (isSvg) {
        wrap.querySelector('#hb_svg').onclick = (e) => { e.stopPropagation(); dlHandler('svg', url); };
    } else {
        el.dataset.imgUrl = previewImg.src;
      }
      
      // Toggle if tapping same element
      if (selectedItem === el) { 
        if(el.querySelector('.action-bar')) {
          el.querySelector('.action-bar').remove();
          selectedItem = null;
        }
        return; 
      }
      if (selectedItem && selectedItem.querySelector('.action-bar')) {
          selectedItem.querySelector('.action-bar').remove();
      }
      
      selectedItem = el;
      ctxImgUrl = el.dataset.imgUrl || null;
      ctxSvgUrl = el.dataset.svgUrl || null;
      ctxFname = el.dataset.fname || "symbol";
      // Honour the element's own type (set per source) over the hard-coded
      // onclick arg, so an SVG-source single view offers SVG+PNG not PNG+WebP.
      ctxType = el.dataset.type || type || "png";
      
      el.insertAdjacentHTML("afterbegin", buildActionBar(ctxType, false, false));
    }

    
    async 
    function convertToWebP(srcUrl) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/webp', 1.0));
            };
            img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
            img.src = srcUrl;
        });
    }

    async function downloadGalleryItem(type) {
      let url;
      if (type === "webp") {
          let sourceUrl = ctxImgUrl || ctxSvgUrl;
          if (sourceUrl && sourceUrl.startsWith('data:')) {
              try {
                  url = await convertToWebP(sourceUrl);
              } catch (e) {
                  console.error(e);
                  url = sourceUrl;
              }
          } else if (sourceUrl) {
              url = sourceUrl.replace(/\.(png|svg)$/i, '.webp');
          }
      }
      else if (type === "svg") url = ctxSvgUrl;
      else url = ctxImgUrl;

      const fname = ctxFname || "symbol";
      
      if (selectedItem && selectedItem.querySelector('.action-bar')) {
          selectedItem.querySelector('.action-bar').remove();
          selectedItem = null;
      }
      
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.download = fname + "." + type;
      a.click();
    }


// --- History & Identity ---
const HISTORY_API_URL = "https://fleximbols-history-api.dave-c09.workers.dev";

function getClientId() {
    let cid = localStorage.getItem('fleximbols_client_id');
    if (!cid) {
        cid = 'client_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('fleximbols_client_id', cid);
    }
    return cid;
}

async function fetchHistoryData() {
    try {
        const res = await fetch(`${HISTORY_API_URL}/history`, {
            headers: { 'X-Client-ID': getClientId() }
        });
        if (!res.ok) throw new Error("Failed to fetch history");
        return await res.json();
    } catch (err) {
        console.error("History fetch error:", err);
        return [];
    }
}

async function renderMiniHistory(items) {
    const container = document.getElementById('aiMiniHistory');
    const thumbs = document.getElementById('aiMiniHistoryThumbs');
    if (!items || items.length === 0) {
        if(container) container.style.display = 'none';
        return;
    }
    if(container) container.style.display = 'flex';
    if(!thumbs) return;
    
    thumbs.innerHTML = '';
    
    // Limit to top 5 for the mini view
    items.slice(0, 5).forEach(item => {
        const url = item.imageUrl.startsWith('/') ? `${HISTORY_API_URL}${item.imageUrl}` : item.imageUrl;
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '64px';
        img.style.height = '64px';
        img.style.borderRadius = '8px';
        img.style.objectFit = 'contain';
        img.style.border = '1px solid #e2e8f0';
        img.style.cursor = 'pointer';
        img.style.background = 'white';
        img.style.flexShrink = '0';
        img.onclick = () => {
            // Load into main preview so it can be downloaded directly
            document.getElementById('aiSymbolPreview').src = url;
            // Scroll to top if needed, though usually it's in view
            document.getElementById('aiSymbolTerm').value = item.term;
        };
        thumbs.appendChild(img);
    });
}

async function loadHistory() {
    const grid = document.getElementById('historyGrid');
    if(grid) grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">Loading history...</div>';
    
    const items = await fetchHistoryData();
    renderMiniHistory(items); // Keep them in sync
    
    if (!grid) return;
    
    if (items.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #64748b;">No symbols generated yet.</div>';
        return;
    }
    
    grid.innerHTML = '';
    items.forEach(item => {
        const url = item.imageUrl.startsWith('/') ? `${HISTORY_API_URL}${item.imageUrl}` : item.imageUrl;
        
        const wrap = document.createElement('div');
        wrap.className = 'history-item-wrap';
        wrap.style.position = 'relative';
        wrap.style.background = 'white';
        wrap.style.borderRadius = '16px';
        wrap.style.padding = '12px';
        wrap.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
        wrap.style.border = '1px solid #e2e8f0';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = 'center';
        wrap.style.cursor = 'pointer';
        wrap.style.transition = 'transform 0.2s, box-shadow 0.2s';
        
        wrap.onmouseenter = () => { wrap.style.transform = 'translateY(-2px)'; wrap.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; };
        wrap.onmouseleave = () => { wrap.style.transform = 'translateY(0)'; wrap.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; };
        
        const imgWrap = document.createElement('div');
        imgWrap.style.width = '100%';
        imgWrap.style.aspectRatio = '1/1';
        imgWrap.style.display = 'flex';
        imgWrap.style.alignItems = 'center';
        imgWrap.style.justifyContent = 'center';
        imgWrap.style.background = '#f8fafc';
        imgWrap.style.borderRadius = '8px';
        imgWrap.style.overflow = 'hidden';
        
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        
        imgWrap.appendChild(img);
        
        const meta = document.createElement('div');
        meta.style.fontSize = '0.85rem';
        meta.style.marginTop = '10px';
        meta.style.color = '#334155';
        meta.style.fontWeight = '500';
        meta.style.textAlign = 'center';
        meta.style.display = '-webkit-box';
        meta.style.webkitLineClamp = '2';
        meta.style.webkitBoxOrient = 'vertical';
        meta.style.overflow = 'hidden';
        meta.style.width = '100%';
        meta.style.lineHeight = '1.3';
        meta.textContent = item.term;
        
        const styleMeta = document.createElement('div');
        styleMeta.style.fontSize = '0.7rem';
        styleMeta.style.color = '#94a3b8';
        styleMeta.style.marginTop = '4px';
        styleMeta.textContent = item.style;

        
        wrap.appendChild(imgWrap);
        wrap.appendChild(meta); wrap.appendChild(styleMeta);
        
        wrap.onclick = () => {
            if (wrap.querySelector('.action-bar')) return;
            
            // Set dataset properties required by selectResultImage
            wrap.dataset.imgUrl = url;
            if (url.includes('.svg')) {
                wrap.dataset.svgUrl = url;
            }
            // Temporarily mock an ID so selectResultImage can find the image inside it if it assumes #aiSymbolPreview
            // Actually, our selectResultImage in this file hardcodes `document.getElementById('aiSymbolPreview')`
            // Let's modify selectResultImage to use the wrapper! 
            showHistoryActionBar(wrap, url);
        };
        
        grid.appendChild(wrap);
    });
}

let historySelectedItem = null;
function showHistoryActionBar(wrap, url) {
    if (historySelectedItem === wrap) {
        if(wrap.querySelector('.action-bar')) wrap.querySelector('.action-bar').remove();
        historySelectedItem = null;
        return;
    }
    if (historySelectedItem && historySelectedItem.querySelector('.action-bar')) {
        historySelectedItem.querySelector('.action-bar').remove();
    }
    historySelectedItem = wrap;
    
    // We can't use the global downloadGalleryItem directly because it relies on ctxImgUrl global variables.
    // So we inject inline click handlers for downloads directly here.
    
    const isSvg = url.includes('.svg') || url.includes('svg+xml');
    let html = `<div class="action-bar visible" style="border-radius: 12px 12px 0 0;">`;
    
    const dlHandler = async (type, u) => {
        if (type === 'webp' && u && u.startsWith('data:')) {
            try {
                u = await convertToWebP(u);
            } catch (e) { console.error(e); }
        }
        const a = document.createElement('a');
        a.href = u;
        a.download = `symbol_${Date.now()}.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (isSvg) {
        html += `<button id="hb_svg"><span class="ab-icon">↓</span>SVG</button>`;
    } else {
        html += `<button id="hb_png"><span class="ab-icon">↓</span>PNG</button>`;
        const webpUrl = url.replace('.png', '.webp');
        html += `<button id="hb_webp"><span class="ab-icon">↓</span>WebP</button>`;
    }
    html += `</div>`;
    wrap.insertAdjacentHTML('beforeend', html);
    
    if (isSvg) {
        wrap.querySelector('#hb_svg').onclick = (e) => { e.stopPropagation(); dlHandler('svg', url); };
    } else {
        wrap.querySelector('#hb_png').onclick = (e) => { e.stopPropagation(); dlHandler('png', url); };
        wrap.querySelector('#hb_webp').onclick = (e) => { e.stopPropagation(); dlHandler('webp', url.replace('.png', '.webp')); };
    }
}

// Call initially to load the mini-history
fetchHistoryData().then(renderMiniHistory);




// Toggle Make SVG visibility based on style
document.getElementById('aiSymbolStyle').addEventListener('change', function(e) {
    const val = e.target.value.toLowerCase();
    const makeSvgCheckbox = document.getElementById('aiSymbolMakeSVG');
    if (!makeSvgCheckbox) return;
    const label = makeSvgCheckbox.parentElement;
    
    if (val.includes('realistic') || val.includes('sommi')) {
        makeSvgCheckbox.checked = false;
        label.style.display = 'none';
    } else {
        label.style.display = 'inline-flex';
    }
});
// Trigger once on load
document.getElementById('aiSymbolStyle').dispatchEvent(new Event('change'));
