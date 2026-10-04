let globalSearchData = [];

async function initGlobalSearch() {
    try {
        const [listRes, collRes] = await Promise.all([
            fetch('/list.json').then(r => r.json()).catch(() => ({files: []})),
            fetch('/collections.json').then(r => r.json()).catch(() => ({}))
        ]);

        const items = [];
        if (listRes.files) {
            listRes.files.forEach(f => {
                const name = typeof f === 'string' ? f : f.name;
                items.push({ style: 'fluent', rawPath: name });
            });
        }
        for (const [styleKey, files] of Object.entries(collRes)) {
            files.forEach(f => {
                items.push({ style: styleKey, rawPath: f });
            });
        }
        globalSearchData = items;
    } catch (e) {
        console.error("Failed to load search data", e);
    }
}

function normGlobal(s) {
    return s.toLowerCase().replace(/[_\\-]/g, ' ').trim();
}

const searchInput = document.querySelector('.global-search-input');
const searchPopup = document.getElementById('globalSearchPopup');

let globalSearchTimer;
searchInput.addEventListener('input', () => {
    clearTimeout(globalSearchTimer);
    globalSearchTimer = setTimeout(() => {
        performGlobalSearch(searchInput.value);
    }, 200);
});

searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
        searchPopup.style.display = 'block';
    }
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchPopup.contains(e.target)) {
        searchPopup.style.display = 'none';
    }
});

function performGlobalSearch(query) {
    const q = normGlobal(query);
    if (!q || q.length < 2) {
        searchPopup.style.display = 'none';
        return;
    }
    
    const checkboxes = document.querySelectorAll('#searchStyleDropdown input[type="checkbox"]');
    const activeStyles = new Set();
    checkboxes.forEach(cb => { if (cb.checked) activeStyles.add(cb.value); });
    
    if (activeStyles.size === 0) {
        searchPopup.style.display = 'none';
        return;
    }
    
    let exact = [], prefix = [], substring = [], seen = new Set();
    
    for (const item of globalSearchData) {
        if (!activeStyles.has(item.style)) continue;
        
        const parts = item.rawPath.split('/');
        const filename = parts[parts.length - 1];
        const stem = filename.replace(/\.(svg|png)$/i, '');
        
        const dedupKey = `${item.style}|${stem}`;
        if (seen.has(dedupKey)) continue;
        
        const nstem = normGlobal(stem);
        if (!nstem.includes(q)) continue;
        
        const matchObj = { ...item, stem, display: stem.replace(/_/g, ' ') };
        seen.add(dedupKey);
        
        if (nstem === q) exact.push(matchObj);
        else if (nstem.startsWith(q)) prefix.push(matchObj);
        else substring.push(matchObj);
    }
    
    prefix.sort((a, b) => a.stem.localeCompare(b.stem));
    substring.sort((a, b) => a.stem.localeCompare(b.stem));
    
    const results = [...exact, ...prefix, ...substring].slice(0, 32);
    renderGlobalSearchPopup(results);
}

function renderGlobalSearchPopup(results) {
    if (results.length === 0) {
        searchPopup.innerHTML = '<div style="padding: 24px; text-align: center; color: #64748b; font-size: 1.1rem;">No symbols found.</div>';
        searchPopup.style.display = 'block';
        return;
    }
    
    searchPopup.innerHTML = '';
    const header = document.createElement('div');
    header.style.padding = '12px 16px';
    header.style.borderBottom = '1px solid #e2e8f0';
    header.style.background = '#f8fafc';
    header.style.fontSize = '0.9rem';
    header.style.fontWeight = '600';
    header.style.color = '#475569';
    header.textContent = `Top matches (${results.length})`;
    searchPopup.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'global-search-grid';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
    grid.style.gap = '12px';
    grid.style.padding = '16px';
    grid.style.maxHeight = '500px';
    grid.style.overflowY = 'auto';
    grid.style.background = '#f1f5f9';
    
    results.forEach(item => {
        const svgUrl = `/api/v1/svg/${item.style}/${encodeURIComponent(item.rawPath)}`;
        const isRawPng = item.rawPath.toLowerCase().endsWith('.png');
        
        const wrap = document.createElement('div');
        wrap.className = 'history-item-wrap';
        wrap.style.position = 'relative';
        wrap.style.background = 'white';
        wrap.style.borderRadius = '12px';
        wrap.style.padding = '10px';
        wrap.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        wrap.style.border = '1px solid #e2e8f0';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.alignItems = 'center';
        wrap.style.cursor = 'pointer';
        wrap.style.transition = 'transform 0.2s, box-shadow 0.2s';
        
        wrap.onmouseenter = () => { wrap.style.transform = 'translateY(-2px)'; wrap.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; };
        wrap.onmouseleave = () => { wrap.style.transform = 'translateY(0)'; wrap.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; };
        
        const imgWrap = document.createElement('div');
        imgWrap.style.width = '100%';
        imgWrap.style.aspectRatio = '1/1';
        imgWrap.style.display = 'flex';
        imgWrap.style.alignItems = 'center';
        imgWrap.style.justifyContent = 'center';
        
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous'; // Important for canvas conversion
        img.src = svgUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.objectFit = 'contain';
        imgWrap.appendChild(img);
        
        const nameDiv = document.createElement('div');
        nameDiv.style.marginTop = '10px';
        nameDiv.style.fontSize = '0.85rem';
        nameDiv.style.fontWeight = '600';
        nameDiv.style.textAlign = 'center';
        nameDiv.style.lineHeight = '1.2';
        nameDiv.style.color = '#1e293b';
        nameDiv.textContent = item.display;
        
        const styleDiv = document.createElement('div');
        styleDiv.style.fontSize = '0.7rem';
        styleDiv.style.color = '#64748b';
        styleDiv.style.marginTop = '4px';
        styleDiv.style.background = '#e2e8f0';
        styleDiv.style.padding = '2px 6px';
        styleDiv.style.borderRadius = '4px';
        styleDiv.textContent = item.style;
        
        wrap.appendChild(imgWrap);
        wrap.appendChild(nameDiv);
        wrap.appendChild(styleDiv);
        
        wrap.onclick = () => {
            if (wrap.querySelector('.action-bar')) return;
            showGlobalSearchActionBar(wrap, item, img, isRawPng);
        };
        
        grid.appendChild(wrap);
    });
    
    searchPopup.appendChild(grid);
    searchPopup.style.display = 'block';
}

let searchSelectedItem = null;
function showGlobalSearchActionBar(wrap, item, imgElement, isRawPng) {
    if (searchSelectedItem === wrap) {
        if(wrap.querySelector('.action-bar')) wrap.querySelector('.action-bar').remove();
        searchSelectedItem = null;
        return;
    }
    if (searchSelectedItem && searchSelectedItem.querySelector('.action-bar')) {
        searchSelectedItem.querySelector('.action-bar').remove();
    }
    searchSelectedItem = wrap;
    
    const actionWrap = document.createElement('div');
    actionWrap.className = 'action-bar';
    actionWrap.style.position = 'absolute';
    actionWrap.style.bottom = '8px';
    actionWrap.style.left = '4%';
    actionWrap.style.width = '92%';
    actionWrap.style.background = 'rgba(255,255,255,0.95)';
    actionWrap.style.backdropFilter = 'blur(4px)';
    actionWrap.style.borderRadius = '8px';
    actionWrap.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
    actionWrap.style.padding = '8px';
    actionWrap.style.display = 'flex';
    actionWrap.style.flexDirection = 'column';
    actionWrap.style.gap = '6px';
    actionWrap.style.zIndex = '10';
    
    const dlTitle = document.createElement('div');
    dlTitle.textContent = 'Download format:';
    dlTitle.style.fontSize = '0.7rem';
    dlTitle.style.fontWeight = '600';
    dlTitle.style.color = '#64748b';
    dlTitle.style.textAlign = 'center';
    
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '4px';
    btnRow.style.justifyContent = 'center';
    
    const makeBtn = (text, onClick) => {
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.textContent = text;
        btn.style.flex = '1';
        btn.style.textAlign = 'center';
        btn.style.padding = '4px 0';
        btn.style.background = '#f1f5f9';
        btn.style.color = '#0f172a';
        btn.style.textDecoration = 'none';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '0.75rem';
        btn.style.fontWeight = '600';
        btn.style.transition = 'background 0.1s';
        btn.onmouseenter = () => btn.style.background = '#e2e8f0';
        btn.onmouseleave = () => btn.style.background = '#f1f5f9';
        btn.onclick = (e) => { e.stopPropagation(); onClick(); };
        return btn;
    };
    
    if (!isRawPng) {
        btnRow.appendChild(makeBtn('SVG', () => {
            const a = document.createElement('a');
            a.href = imgElement.src;
            a.download = `${item.stem}.svg`;
            a.click();
        }));
    }
    
    btnRow.appendChild(makeBtn('PNG', () => convertAndDownload(imgElement, item.stem, 'image/png')));
    btnRow.appendChild(makeBtn('WebP', () => convertAndDownload(imgElement, item.stem, 'image/webp')));
    
    actionWrap.appendChild(dlTitle);
    actionWrap.appendChild(btnRow);
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '0px';
    closeBtn.style.right = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1.4rem';
    closeBtn.style.lineHeight = '1';
    closeBtn.style.color = '#94a3b8';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        actionWrap.remove();
        searchSelectedItem = null;
    };
    actionWrap.appendChild(closeBtn);
    wrap.appendChild(actionWrap);
}

function convertAndDownload(imgElement, stem, mimeType) {
    const ext = mimeType === 'image/webp' ? 'webp' : 'png';
    try {
        const canvas = document.createElement('canvas');
        canvas.width = imgElement.naturalWidth || 512;
        canvas.height = imgElement.naturalHeight || 512;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL(mimeType, 1.0);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stem}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (e) {
        alert("Could not convert image. Try downloading the SVG.");
    }
}

initGlobalSearch();
