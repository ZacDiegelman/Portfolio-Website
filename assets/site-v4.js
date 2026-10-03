
(function(){
  // Zac Portfolio V4.3 — prioritize preserved project-l3d wrapper pages
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  function preferredTheme(){
    const saved = localStorage.getItem('zac-portfolio-theme');
    if(saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function currentTheme(){
    return root.getAttribute('data-theme') || preferredTheme();
  }

  function setTheme(theme){
    root.setAttribute('data-theme', theme);
    localStorage.setItem('zac-portfolio-theme', theme);
    if(toggle){
      toggle.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
    window.applyArchiveFrameTheme?.();
  }

  setTheme(preferredTheme());

  if(toggle){
    toggle.addEventListener('click', function(){
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // Keep the Projects dropdown consistent across existing pages.
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    if(menu.querySelector('a[href="junior-design.html"]')) return;

    const juniorLink = document.createElement('a');
    juniorLink.href = 'junior-design.html';
    juniorLink.textContent = 'Junior Design';

    const sophomoreLink = menu.querySelector('a[href="sophomore-design.html"]');
    if(sophomoreLink) menu.insertBefore(juniorLink, sophomoreLink);
    else menu.appendChild(juniorLink);
  });

  const dropdown = document.querySelector('.dropdown');
  const dropdownButton = dropdown?.querySelector('.nav-button');

  if(dropdown && dropdownButton){
    dropdownButton.addEventListener('click', function(e){
      e.preventDefault();
      const open = dropdown.classList.toggle('open');
      dropdownButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', function(e){
      if(!dropdown.contains(e.target)){
        dropdown.classList.remove('open');
        dropdownButton.setAttribute('aria-expanded','false');
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        dropdown.classList.remove('open');
        dropdownButton.setAttribute('aria-expanded','false');
      }
    });
  }

  const current = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(el => {
    if(el.dataset.nav === current) el.classList.add('active');
  });

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  /* ---------- Theme-aware archived page viewer ---------- */
  const archiveFrame = document.getElementById('archive-frame');
  if(!archiveFrame) return;

  const statusEl = document.getElementById('viewer-status');
  const titleEl = document.getElementById('viewer-title');
  const errorEl = document.getElementById('viewer-error');
  const candidatesEl = document.getElementById('viewer-candidates');
  const directEl = document.getElementById('viewer-direct-link');

  const params = new URLSearchParams(location.search);
  const requestedTitle = params.get('title');
  if(requestedTitle && titleEl) titleEl.textContent = requestedTitle;

  const LABS = {
    l1: [
      'coursework/megr-2156-l3d/labs/lab-number-1-download-something-small.html',
      'coursework/megr-2156-l3d/labs/download-something-small.html'
    ],
    l2: [
      'coursework/megr-2156-l3d/labs/lab-number-2-print-something-small.html',
      'coursework/megr-2156-l3d/labs/lab-2-print-something-small.html'
    ],
    l3: [
      'coursework/megr-2156-l3d/labs/lab-number-3-design-something-small.html',
      'coursework/megr-2156-l3d/labs/lab-3-design-something-small.html'
    ],
    l4: [
      'coursework/megr-2156-l3d/labs/lab-number-4-benchmark-a-parameter.html',
      'coursework/megr-2156-l3d/labs/lab-4-benchmark-a-parameter.html'
    ],
    l5: [
      'coursework/megr-2156-l3d/labs/lab-number-5-design-a-snap-fit.html',
      'coursework/megr-2156-l3d/labs/lab-5-design-a-snap-fit.html'
    ],
    l6: [
      'coursework/megr-2156-l3d/labs/lab-number-6-design-a-fit-for-an-artifact.html',
      'coursework/megr-2156-l3d/labs/lab-6-design-a-fit-for-an-artifact.html'
    ],
    l7: [
      'coursework/megr-2156-l3d/labs/lab-number-7-design-a-linkage-mechanism.html',
      'coursework/megr-2156-l3d/labs/lab-number-7-design-a-linkage-or-mechanism.html',
      'coursework/megr-2156-l3d/labs/lab-7-design-a-linkage-mechanism.html'
    ],
    l8: [
      'coursework/megr-2156-l3d/labs/lab-number-8-design-and-print-something-useful.html',
      'coursework/megr-2156-l3d/labs/lab-8-design-and-print-something-useful.html'
    ],
    l9: [
      'coursework/megr-2156-l3d/labs/lab-number-9-sla-rc-2-sliding-fit-design-and-verification.html',
      'coursework/megr-2156-l3d/labs/lab-number-9-sla-rc2-sliding-fit-design-and-verification.html',
      'coursework/megr-2156-l3d/labs/lab-9-sla-rc-2-sliding-fit-design-and-verification.html'
    ],
    l10: [
      'coursework/megr-2156-l3d/labs/lab-number-10-sla-form-4-interlocking-parts.html',
      'coursework/megr-2156-l3d/labs/lab-number-10-form-4-interlocking-parts.html',
      'coursework/megr-2156-l3d/labs/lab-10-sla-form-4-interlocking-parts.html'
    ],
    fp1: [
      'coursework/megr-2156-l3d/labs/final-project-part-1-define-the-problem-and-rough-prototype.html',
      'coursework/megr-2156-l3d/labs/final-project-part-1-define-the-problem-rough-prototype.html'
    ],
    fp2: [
      'coursework/megr-2156-l3d/labs/final-project-part-2-enhance-the-prototype.html',
      'coursework/megr-2156-l3d/labs/final-project-part-2-enhance-prototype.html'
    ]
  };

  const ASSIGNMENTS = {
    a2: ['project-a2-complete.html','project-a2.html'],
    a3: ['project-a3-complete.html','project-a3.html'],
    a4: ['project-a4-complete.html','project-a4.html'],
    a5: ['project-a5-complete.html','project-a5.html'],
    a6: ['project-a6-complete.html','project-a6.html'],
    a7: ['project-a7-complete.html','project-a7.html'],
    a8: ['project-a8-complete.html','project-a8.html'],
    a9: ['project-a9-complete.html','project-a9.html'],
    a10:['project-a10-complete.html','project-a10.html'],
    a11:['project-a11-complete.html','project-a11.html'],
    pda:['project-pda-complete.html','project-pda.html','pda-complete.html']
  };

  function abs(rel, base){
    return new URL(rel, base || location.href).href;
  }

  async function getUsable(url){
    try{
      const r = await fetch(url, {cache:'no-store'});
      if(!r.ok) return null;
      const text = await r.text();
      const low = text.slice(0,5000).toLowerCase();
      if((low.includes('404') && low.includes('not found')) || low.includes('page not found')) return null;
      return {url:r.url || abs(url), text};
    }catch(_){
      return null;
    }
  }

  async function extractOriginalFromWrapper(wrapperUrl, text){
    try{
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a[href]'));

      let link = links.find(a => /open\s+original\s+page\s+alone/i.test(a.textContent || ''));
      if(!link) link = links.find(a => /original\s+page/i.test(a.textContent || ''));
      if(!link) link = links.find(a => /coursework\//i.test(a.getAttribute('href') || ''));

      if(link){
        return abs(link.getAttribute('href'), wrapperUrl);
      }

      const iframe = doc.querySelector('iframe[src]');
      if(iframe){
        return abs(iframe.getAttribute('src'), wrapperUrl);
      }
    }catch(_){}
    return wrapperUrl;
  }

  async function resolveAssignment(item){
    const candidates = ASSIGNMENTS[item] || [];
    for(const rel of candidates){
      const result = await getUsable(rel);
      if(result){
        const original = await extractOriginalFromWrapper(abs(rel), result.text);
        return {target:original, attempted:candidates};
      }
    }
    return {target:null, attempted:candidates};
  }

  /*
   * V4.2 — L3D PATH RESOLVER
   * ------------------------
   * Resolve the real preserved lab URLs from l3d-files.html instead of
   * trusting guessed filenames.
   */

  const LAB_TEXT_MATCHES = {
    l1:  ['download something small'],
    l2:  ['print something small'],
    l3:  ['design something small'],
    l4:  ['benchmark a parameter'],
    l5:  ['design a snap fit'],
    l6:  ['design a fit for an artifact'],
    l7:  ['design a linkage mechanism', 'design a linkage or mechanism'],
    l8:  ['design and print something useful'],
    l9:  ['sliding fit design and verification', 'rc 2 sliding fit', 'rc2 sliding fit'],
    l10: ['form 4 interlocking parts', 'sla form 4'],
    fp1: ['final project part 1', 'define the problem and rough prototype', 'define problem and rough prototype'],
    fp2: ['final project part 2', 'enhance the prototype', 'enhance prototype']
  };

  function normalizeLabText(value){
    return String(value || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function labKeyFromText(text){
    const n = normalizeLabText(text);
    const order = ['fp1','fp2','l10','l9','l8','l7','l6','l5','l4','l3','l2','l1'];

    for(const key of order){
      const phrases = LAB_TEXT_MATCHES[key] || [];
      if(phrases.some(p => n.includes(normalizeLabText(p)))){
        return key;
      }
    }
    return null;
  }

  function looksLikeNotFound(text){
    const t = String(text || '').toLowerCase();
    return (
      t.includes('the requested url was not found on this server') ||
      t.includes('404 not found') ||
      (t.includes('not found') && t.includes('errordocument'))
    );
  }

  async function fetchHtml(url){
    try{
      const r = await fetch(url, {cache:'no-store'});
      const text = await r.text();
      if(!r.ok || looksLikeNotFound(text)) return null;

      return {
        url: r.url || new URL(url, location.href).href,
        text
      };
    }catch(_){
      return null;
    }
  }

  async function validateTarget(url){
    const result = await fetchHtml(url);
    if(!result) return null;

    const low = result.text.toLowerCase();
    if(
      low.includes('all 115 files') ||
      low.includes('all 94 images') ||
      low.includes('original zip')
    ){
      return null;
    }

    return result.url;
  }

  async function scanIndexPage(indexRel){
    const index = await fetchHtml(indexRel);
    if(!index) return [];

    const found = [];

    try{
      const doc = new DOMParser().parseFromString(index.text, 'text/html');
      const anchors = Array.from(doc.querySelectorAll('a[href]'));

      for(const a of anchors){
        const href = a.getAttribute('href');
        if(!href) continue;
        if(href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) continue;

        const combined = [
          a.textContent || '',
          a.getAttribute('title') || '',
          a.getAttribute('aria-label') || '',
          href
        ].join(' ');

        const key = labKeyFromText(combined);
        if(!key) continue;

        try{
          const url = new URL(href, index.url).href;
          if(new URL(url).origin !== location.origin) continue;
          found.push({key, url, source:indexRel, text:combined});
        }catch(_){}
      }

      const containers = Array.from(
        doc.querySelectorAll('li, tr, .file-row, .source-file, .resource-row, article, .card')
      );

      for(const node of containers){
        const key = labKeyFromText(node.textContent || '');
        if(!key) continue;

        const a = node.querySelector('a[href]');
        const href = a?.getAttribute('href');
        if(!href) continue;

        try{
          const url = new URL(href, index.url).href;
          if(new URL(url).origin !== location.origin) continue;
          found.push({key, url, source:indexRel, text:node.textContent || ''});
        }catch(_){}
      }
    }catch(_){}

    return found;
  }

  async function discoverAllLabLinks(){
    if(window.__zacV42LabLinks) return window.__zacV42LabLinks;

    const indexSources = [
      'l3d-files.html',
      'l3d-gallery.html',
      'archive.html'
    ];

    const candidatesByKey = {};

    for(const source of indexSources){
      const matches = await scanIndexPage(source);
      for(const match of matches){
        (candidatesByKey[match.key] ||= []).push(match);
      }
    }

    const resolved = {};
    const diagnostics = {};

    for(const key of Object.keys(LAB_TEXT_MATCHES)){
      const candidates = candidatesByKey[key] || [];
      diagnostics[key] = candidates.map(c => c.url);

      for(const candidate of candidates){
        const usable = await validateTarget(candidate.url);
        if(usable){
          resolved[key] = usable;
          break;
        }
      }
    }

    window.__zacV42LabLinks = {resolved, diagnostics};
    return window.__zacV42LabLinks;
  }


  /*
   * V4.3 — ROOT WRAPPER DISCOVERY
   * ------------------------------
   * The preserved portfolio already has project-l3d-*.html wrapper pages in
   * /public_html. Those wrappers are the most reliable bridge to the original
   * Canvas-exported L3D pages because they were generated from the real archive.
   *
   * Instead of guessing deep coursework paths, probe the likely root wrappers,
   * validate the wrapper by its visible title/content, then extract the
   * wrapper's original-page URL.
   */

  const LAB_WRAPPER_CANDIDATES = {
    l1: [
      'project-l3d-download.html',
      'project-l3d-download-small.html',
      'project-l3d-download-something-small.html'
    ],
    l2: [
      'project-l3d-lab2.html',
      'project-l3d-print.html',
      'project-l3d-print-small.html',
      'project-l3d-print-something-small.html'
    ],
    l3: [
      'project-l3d-design.html',
      'project-l3d-design-small.html',
      'project-l3d-design-something-small.html'
    ],
    l4: [
      'project-l3d-benchmark.html',
      'project-l3d-benchmark-parameter.html',
      'project-l3d-benchmark-a-parameter.html'
    ],
    l5: [
      'project-l3d-snap.html',
      'project-l3d-snap-fit.html',
      'project-l3d-design-snap-fit.html'
    ],
    l6: [
      'project-l3d-artifact.html',
      'project-l3d-fit-artifact.html',
      'project-l3d-design-fit-artifact.html'
    ],
    l7: [
      'project-l3d-linkage.html',
      'project-l3d-linkage-mechanism.html',
      'project-l3d-design-linkage.html'
    ],
    l8: [
      'project-l3d-useful.html',
      'project-l3d-print-useful.html',
      'project-l3d-design-print-useful.html'
    ],
    l9: [
      'project-l3d-sliding.html',
      'project-l3d-sliding-fit.html',
      'project-l3d-rc2-sliding.html'
    ],
    l10: [
      'project-l3d-sla.html',
      'project-l3d-sla-form4.html',
      'project-l3d-form4.html'
    ],
    fp1: [
      'project-l3d-project1.html',
      'project-l3d-project-1.html',
      'project-l3d-part1.html',
      'project-l3d-part-1.html'
    ],
    fp2: [
      'project-l3d-project2.html',
      'project-l3d-project-2.html',
      'project-l3d-part2.html',
      'project-l3d-part-2.html'
    ]
  };

  function wrapperMatchesLab(key, text){
    const normalized = normalizeLabText(text);
    const phrases = LAB_TEXT_MATCHES[key] || [];

    if(phrases.some(p => normalized.includes(normalizeLabText(p)))){
      return true;
    }

    // Additional tolerant patterns for pages whose wrapper title was shortened.
    const tolerant = {
      l1:  ['download something small', 'download small'],
      l2:  ['print something small', 'print small'],
      l3:  ['design something small', 'design small'],
      l4:  ['benchmark', 'parameter'],
      l5:  ['snap fit'],
      l6:  ['artifact', 'fit for an artifact'],
      l7:  ['linkage', 'mechanism'],
      l8:  ['something useful', 'print something useful'],
      l9:  ['sliding fit'],
      l10: ['form 4', 'interlocking'],
      fp1: ['final project part 1', 'rough prototype'],
      fp2: ['final project part 2', 'enhance the prototype']
    };

    const words = tolerant[key] || [];
    if(key === 'l4'){
      return words.every(w => normalized.includes(normalizeLabText(w)));
    }

    return words.some(w => normalized.includes(normalizeLabText(w)));
  }

  async function resolveLabFromRootWrapper(lab){
    const candidates = LAB_WRAPPER_CANDIDATES[lab] || [];
    const attempted = [];

    for(const rel of candidates){
      attempted.push(rel);
      const wrapper = await fetchHtml(rel);
      if(!wrapper) continue;

      // Do not accept a wrapper just because the filename exists. Verify that
      // its contents correspond to the requested lab.
      if(!wrapperMatchesLab(lab, wrapper.text)) continue;

      const original = await extractOriginalFromWrapper(wrapper.url || abs(rel), wrapper.text);

      // Validate the extracted original page too. This prevents a good wrapper
      // with a stale/broken source link from loading a 404 into the viewer.
      const usableOriginal = await validateTarget(original);
      if(usableOriginal){
        return {
          target: usableOriginal,
          attempted
        };
      }

      // If the wrapper itself contains the complete assignment content rather
      // than a separate original-page link, use the wrapper as a last resort.
      const wrapperUsable = await validateTarget(wrapper.url || abs(rel));
      if(wrapperUsable){
        return {
          target: wrapperUsable,
          attempted
        };
      }
    }

    return {target:null, attempted};
  }

  async function resolveLab(lab){
    const attempted = [];

    // 1. FIRST CHOICE: preserved project-l3d-*.html root wrappers.
    const wrapperResult = await resolveLabFromRootWrapper(lab);
    attempted.push(...(wrapperResult.attempted || []));
    if(wrapperResult.target){
      return {
        target: wrapperResult.target,
        attempted
      };
    }

    // 2. SECOND CHOICE: links discovered from preserved L3D index/gallery pages.
    const discovered = await discoverAllLabLinks();

    if(discovered.resolved[lab]){
      const usable = await validateTarget(discovered.resolved[lab]);
      if(usable){
        return {
          target: usable,
          attempted: [
            ...attempted,
            ...(discovered.diagnostics[lab] || [])
          ]
        };
      }
    }

    attempted.push(...(discovered.diagnostics[lab] || []));

    // 3. LAST RESORT: legacy deep-path guesses.
    const slugs = {
      l1:'lab-number-1-download-something-small.html',
      l2:'lab-number-2-print-something-small.html',
      l3:'lab-number-3-design-something-small.html',
      l4:'lab-number-4-benchmark-a-parameter.html',
      l5:'lab-number-5-design-a-snap-fit.html',
      l6:'lab-number-6-design-a-fit-for-an-artifact.html',
      l7:'lab-number-7-design-a-linkage-mechanism.html',
      l8:'lab-number-8-design-and-print-something-useful.html',
      l9:'lab-number-9-sla-rc-2-sliding-fit-design-and-verification.html',
      l10:'lab-number-10-sla-form-4-interlocking-parts.html',
      fp1:'final-project-part-1-define-the-problem-and-rough-prototype.html',
      fp2:'final-project-part-2-enhance-the-prototype.html'
    };

    const slug = slugs[lab];

    const fallbackPrefixes = [
      'coursework/megr-2156-l3d/labs/',
      'coursework/megr-2156-l3d/eportfolioL3D/labs/',
      'coursework/megr-2156-l3d/eportfolioL3D/eportfolioL3D/labs/',
      'coursework/megr-2156-l3d/portfolio3D/eportfolioL3D/labs/',
      'coursework/megr-2156-l3d/Portfolios/eportfolioL3D/eportfolioL3D/labs/',
      'Portfolios/eportfolioL3D/eportfolioL3D/labs/'
    ];

    if(slug){
      for(const prefix of fallbackPrefixes){
        const rel = prefix + slug;
        attempted.push(rel);

        const usable = await validateTarget(rel);
        if(usable){
          return {target:usable, attempted};
        }
      }
    }

    return {
      target:null,
      attempted:[...new Set(attempted)]
    };
  }

  function bridgeCss(theme){
    if(theme === 'dark'){
      return `
        :root{color-scheme:dark!important}
        html,body{background:#111827!important;color:#e8eef6!important}
        body,main,#content,.content,.container,.ic-Layout-contentMain,.ic-Layout-contentWrapper,
        .show-content,.user_content,.pages.show,.course-content,.wiki-page-content{
          background:#111827!important;color:#e8eef6!important
        }
        header,nav,.header,.ic-app-header,.ic-app-nav-toggle-and-crumbs,.ic-Layout-watermark{
          background:#182231!important;color:#f6f8fb!important;border-color:#344153!important
        }
        h1,h2,h3,h4,h5,h6,p,li,span,div,td,th,label,strong,em{
          color:inherit
        }
        a{color:#87b5f2!important}
        table,td,th,.card,.panel,.module,.item-group-container{
          border-color:#3b4758!important;background-color:#17202c!important;color:#e8eef6!important
        }
        input,select,textarea,button{
          background:#1b2634!important;color:#eef3f8!important;border-color:#4a586b!important
        }
        img,video,canvas,svg{filter:none!important}
      `;
    }
    return `
      :root{color-scheme:light!important}
      html,body{background:#fff!important;color:#172033!important}
    `;
  }

  function resizeFrame(){
    try{
      const doc = archiveFrame.contentDocument;
      if(!doc) return;
      const h = Math.max(
        doc.documentElement?.scrollHeight || 0,
        doc.body?.scrollHeight || 0,
        760
      );
      archiveFrame.style.height = Math.min(Math.max(h + 24, 760), 16000) + 'px';
    }catch(_){}
  }

  window.applyArchiveFrameTheme = function(){
    try{
      const doc = archiveFrame.contentDocument;
      if(!doc) return;
      let style = doc.getElementById('zac-v4-theme-bridge');
      if(!style){
        style = doc.createElement('style');
        style.id = 'zac-v4-theme-bridge';
        doc.head?.appendChild(style);
      }
      style.textContent = bridgeCss(currentTheme());
      resizeFrame();
    }catch(_){
      // Same-origin is expected on the UNC webspace. If unavailable,
      // the outer viewer still stays themed.
    }
  };

  archiveFrame.addEventListener('load', function(){
    window.applyArchiveFrameTheme();
    setTimeout(window.applyArchiveFrameTheme, 250);
    setTimeout(window.applyArchiveFrameTheme, 1200);
    setTimeout(resizeFrame, 2500);
  });

  async function startViewer(){
    if(statusEl) statusEl.textContent = 'Locating archived page…';

    let resolved = {target:null, attempted:[]};
    const item = params.get('item');
    const lab = params.get('lab');
    const explicit = params.get('src');

    if(item) resolved = await resolveAssignment(item);
    else if(lab) resolved = await resolveLab(lab);
    else if(explicit) resolved = {target:abs(explicit), attempted:[explicit]};

    if(resolved.target){
      archiveFrame.src = resolved.target;
      archiveFrame.hidden = false;
      if(statusEl) statusEl.textContent = 'Original archived coursework';
      if(directEl){
        directEl.href = resolved.target;
        directEl.hidden = false;
      }
      return;
    }

    archiveFrame.hidden = true;
    errorEl?.classList.add('show');
    if(statusEl) statusEl.textContent = 'Archived file could not be located automatically';
    if(candidatesEl){
      candidatesEl.textContent = resolved.attempted.length
        ? 'Tried: ' + resolved.attempted.join('  •  ')
        : 'No candidate file paths were supplied.';
    }
  }

  startViewer();
})();
