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

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  function formatDate(date) {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  // ISO dates (YYYY-MM-DD) are formatted as "16 October 2026"; anything else is shown as given
  function displayDate(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
    if (!m) return value;
    return formatDate(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  }

  function displayHours(value) {
    return /^\d+(\.\d+)?$/.test(String(value).trim()) ? `${value} hours` : value;
  }

  // Shrink the name so it never runs past the gold line printed in the template
  const NAME_MAX_WIDTH = 451 / 842;
  function fitName() {
    const el = document.getElementById('name');
    const cert = el?.closest('.certificate');
    if (!el || !cert) return;
    el.style.fontSize = '';
    const maxWidth = cert.clientWidth * NAME_MAX_WIDTH;
    const width = el.scrollWidth;
    if (width > maxWidth) {
      el.style.fontSize = `calc(30.4 * var(--u) * ${maxWidth / width})`;
    }
  }

  function populate() {
    const p = getParamMap();

    setHTML('serial', p.serial ? escapeHTML(p.serial) : '');

    const name = maybeUppercaseName(p.name, p.caps);
    setHTML('name', name ? escapeHTML(name) : 'RECIPIENT NAME');

    setHTML('course', p.course ? escapeHTML(p.course) : '');
    // body1 replaces the whole "attended the ... as a participant" line
    setHTMLWithBreaks('body1', p.body1);

    if (p.hours) setHTML('hours', escapeHTML(displayHours(p.hours)));

    const trainingDate = p.training_date || p.date;
    if (trainingDate) setHTML('training-date', escapeHTML(displayDate(trainingDate)));
    // Issue date falls back to the day the certificate is generated
    setHTML('issue-date', escapeHTML(p.issue_date ? displayDate(p.issue_date) : formatDate(new Date())));

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

    // Parse combined trainer_name format: "Name; Title1; Title2"
    function parseTrainerData(trainerParam) {
      if (!trainerParam) return { name: '', title: '' };
      const parts = trainerParam.split(';').map(s => s.trim()).filter(Boolean);
      if (parts.length === 0) return { name: '', title: '' };
      if (parts.length === 1) return { name: parts[0], title: '' };
      
      const name = parts[0];
      const title = parts.slice(1).join('<br>');
      return { name, title };
    }

    // Handle both separate params and combined format
    const trainer1 = parseTrainerData(p.trainer1_name);
    const trainer2 = parseTrainerData(p.trainer2_name);
    const trainer3 = parseTrainerData(p.trainer3_name);

    setSigner(1, trainer1.name, trainer1.title);
    setSigner(2, trainer2.name, trainer2.title);
    setSigner(3, trainer3.name, trainer3.title);

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

    setSignatureFor(1, trainer1.name);
    setSignatureFor(2, trainer2.name);
    setSignatureFor(3, trainer3.name);

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(fitName);
    window.addEventListener('resize', fitName);

    // Auto print when ready (default to auto unless autoprint=0)
    const auto = (p.autoprint !== '0');
    if (auto) {
      fontsReady.then(() => setTimeout(() => window.print(), 800));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', populate);
  } else {
    populate();
  }
})();


