(function() {
  'use strict';

  function getParamMap() {
    const params = new URLSearchParams(window.location.search);
    const map = {};
    params.forEach((value, key) => {
      map[key.toLowerCase()] = value;
    });
    return map;
  }

  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (!el) return;
    if (html == null || html === '') return;
    el.innerHTML = String(html);
  }

  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Set content allowing only line breaks: supports \n and <br> (case-insensitive), including URL-encoded
  function setHTMLWithBreaks(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if (text == null || text === '') return;
    const escaped = escapeHTML(text);
    const withBreaks = escaped
      .replace(/&lt;br\s*\/?&gt;/gi, '<br>') // already-escaped <br>
      .replace(/\n/g, '<br>');
    el.innerHTML = withBreaks;
  }

  function maybeUppercaseName(name, caps) {
    if (!name) return name;
    if (caps === 'name' || caps === 'all') {
      return name.toUpperCase();
    }
    return name;
  }

  function populate() {
    const p = getParamMap();

    setHTML('serial', p.serial);
    setHTML('title', p.title || 'CERTIFICATE');
    setHTML('subtitle', p.subtitle || 'OF PARTICIPATION');
    setHTML('awarded', p.awarded || 'THIS CERTIFICATE IS AWARDED TO');

    const name = maybeUppercaseName(p.name, p.caps);
    setHTML('name', name || 'RECIPIENT NAME');

    // body1 may contain <br> or newlines which should become visible line breaks
    setHTMLWithBreaks('body1', p.body1);
    // body2 deprecated in current layout but still supported if present
    setHTMLWithBreaks('body2', p.body2);
    setHTML('date', p.date);
    setHTML('organizer', p.organizer);

    // Signatories (hide blocks when empty so they don't take space)
    function setSigner(idx, name, title) {
      const nameId = `trainer${idx}-name`;
      const titleId = `trainer${idx}-title`;
      setHTML(nameId, name);
      setHTMLWithBreaks(titleId, title);
      const holder = document.getElementById(nameId)?.closest('.sig');
      if (!holder) return;
      const present = !!(name || title);
      holder.style.display = present ? '' : 'none';
    }

    setSigner(1, p.trainer1_name, p.trainer1_title);
    setSigner(2, p.trainer2_name, p.trainer2_title);
    setSigner(3, p.trainer3_name, p.trainer3_title);

    // Load signatures based on fuzzy match of provided trainer names
    function probeImage(url) {
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }

    function setSignatureFor(index, displayName) {
      if (!displayName) return;
      const holder = document.getElementById(`trainer${index}-name`);
      if (!holder) return;
      const imageDiv = holder.closest('.sig')?.querySelector('.sig-image');
      if (!imageDiv) return;

      const baseDir = 'static/sig/';
      const normalized = displayName.toLowerCase();

      // Directory mapping: add/adjust keys over time
      const signatureMap = {
        'au soon yong': 'soon yong.png',
        'soon yong': 'soon yong.png',
        'yong': 'soon yong.png',
        'soon': 'soon yong.png',
        'daniell': 'daniell.png',
        'daniel': 'daniell.png',
        'toidy': 'daniell.png'
      };

      let mapped = null;
      for (const key in signatureMap) {
        if (normalized.includes(key)) {
          mapped = signatureMap[key];
          break;
        }
      }

      if (mapped) {
        const url = baseDir + mapped;
        probeImage(url).then(ok => {
          if (ok) imageDiv.style.backgroundImage = `url('${url}')`;
        });
      }
    }

    setSignatureFor(1, p.trainer1_name);
    setSignatureFor(2, p.trainer2_name);
    setSignatureFor(3, p.trainer3_name);

    // Auto print when ready (default to auto unless autoprint=0)
    const auto = (p.autoprint !== '0');
    if (auto) {
      setTimeout(() => window.print(), 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populate);
  } else {
    populate();
  }
})();


