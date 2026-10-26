/* =========================================================
   FLIQ.IT FUNNEL CORE
   Shared by /solo-quiz and /friends-quiz.

   - Step engine (rail, back button, browser back, resume)
   - Waitlist signup (the app isn't live yet)
   - The HANDOFF: a versioned description of the plan the person built,
     stored locally now and passed to the app through a deferred deep
     link once one exists. See README "Funnel handoff".

   Every claim shown to the visitor must be true.
   ========================================================= */
(function (global) {
  'use strict';

  const CONFIG = {
    WAITLIST_URL: 'https://europe-west1-fliqit-f5a70.cloudfunctions.net/api/v1/waitlist',
    PRIVACY_URL: 'https://app.termly.io/policy-viewer/policy.html?policyUUID=1be56505-1192-4bec-8f0f-e5f7b94464ea',
    /* Set to the store / smart link (Branch, AppsFlyer, etc.) when the app is live.
       While null, no download button is shown and the waitlist is the only call to action. */
    APP_LINK_BASE: null,
    USER_COUNT: '',      // e.g. "20,000+". Leave '' until it's real.
    EXPERT: null,        // {name, role, quote}, only with written approval
    TESTIMONIALS: [],    // [{text, name}], real quotes with permission
    PROGRESS_TTL_MS: 6 * 60 * 60 * 1000,
  };

  const HANDOFF_KEY = 'fliq_handoff_v1';
  const UTM_KEY = 'fliq_utm_v1';
  const HANDOFF_VERSION = 1;

  /* ---------- tiny helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (sel, root) => (root || document).querySelector(sel);
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function isoDate(d) {
    const z = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  }
  function nextDow(dow, minAhead) {
    const d = new Date(); d.setHours(12, 0, 0, 0);
    let add = (dow - d.getDay() + 7) % 7; if (add < minAhead) add += 7;
    d.setDate(d.getDate() + add); return d;
  }
  const fmt = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtLong = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  function dayOptions() {
    const sat = nextDow(6, 1), wk = new Date(); wk.setHours(12, 0, 0, 0); wk.setDate(wk.getDate() + 2);
    const nextSat = new Date(sat); nextSat.setDate(sat.getDate() + 7);
    return [['This weekend', sat], ['Midweek evening', wk], ['Next weekend', nextSat], ['Pick a date', null]];
  }

  /* ---------- analytics (dataLayer only; no tracking scripts are loaded) ---------- */
  function track(mode, event, props) {
    try { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event, mode }, props || {})); } catch (e) { /* ignore */ }
  }

  /* ---------- storage (never throws: private mode / blocked storage) ---------- */
  const store = {
    get(area, key) { try { return JSON.parse(global[area].getItem(key)); } catch (e) { return null; } },
    set(area, key, val) { try { global[area].setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ } },
    del(area, key) { try { global[area].removeItem(key); } catch (e) { /* ignore */ } },
  };

  /* ---------- campaign attribution: kept for the handoff, never shown ---------- */
  function captureUtm() {
    try {
      const q = new URLSearchParams(location.search), out = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { const v = q.get(k); if (v) out[k] = v.slice(0, 80); });
      if (Object.keys(out).length) store.set('sessionStorage', UTM_KEY, out);
    } catch (e) { /* ignore */ }
    return store.get('sessionStorage', UTM_KEY) || {};
  }
  function referrerHost() {
    try { return document.referrer ? new URL(document.referrer).hostname : null; } catch (e) { return null; }
  }

  /* ---------- waitlist ---------- */
  async function joinWaitlist(email) {
    try {
      const res = await fetch(CONFIG.WAITLIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),   // the endpoint rejects any other field
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false, error: payload.error || "We couldn't add you right now. Please try again." };
      return { ok: true, alreadyJoined: !!(payload.data && payload.data.alreadyJoined) };
    } catch (e) {
      return { ok: false, error: "We couldn't reach the server. Check your connection and try again." };
    }
  }

  /* Validates + submits an email from a funnel screen. Returns true on success. */
  async function submitEmail(S, input, errEl, button, mode) {
    const v = input.value.trim();
    if (!EMAIL_RE.test(v)) {
      errEl.textContent = "That email doesn't look right. Check for typos.";
      errEl.hidden = false; input.focus(); return false;
    }
    errEl.hidden = true;
    const label = button.textContent;
    button.disabled = true; button.textContent = 'Joining…';
    const r = await joinWaitlist(v);
    button.disabled = false; button.textContent = label;
    if (!r.ok) { errEl.textContent = r.error; errEl.hidden = false; return false; }
    S.email = v; S.joined = true;
    track(mode, 'waitlist_joined', { already: r.alreadyJoined });
    return true;
  }

  /* ---------- handoff ---------- */
  function uid() {
    try { if (crypto.randomUUID) return crypto.randomUUID(); } catch (e) { /* ignore */ }
    return 'fq-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  /* The envelope. Funnels supply {funnel, profile, user, invitee, plan, challenge, reminders, attribution_src}.
     Names live here (and in the deep link) but NEVER in analytics events. No email: the app knows the
     account email, and URLs are a poor place for it. */
  function buildHandoff(S, parts) {
    if (!S.handoffId) S.handoffId = uid();
    const tz = (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; } catch (e) { return null; } })();
    return Object.assign({
      v: HANDOFF_VERSION,
      id: S.handoffId,
      source: 'web_funnel',
      created_at: new Date().toISOString(),
      timezone: tz,
      locale: navigator.language || 'en-GB',
      attribution: Object.assign({ how_found: S.src || null, referrer: referrerHost() }, captureUtm()),
      consent: { waitlist: !!S.joined },
    }, parts);
  }
  function saveHandoff(h) { store.set('localStorage', HANDOFF_KEY, h); }
  function loadHandoff() { return store.get('localStorage', HANDOFF_KEY); }
  function clearHandoff() { store.del('localStorage', HANDOFF_KEY); }

  function b64url(str) {
    const bytes = new TextEncoder().encode(str); let bin = '';
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  /* null until APP_LINK_BASE is set. The app reads `fliq_handoff` (base64url JSON, v=1). */
  function appLink(handoff) {
    if (!CONFIG.APP_LINK_BASE || !handoff) return null;
    try {
      const u = new URL(CONFIG.APP_LINK_BASE);
      u.searchParams.set('fliq_handoff', b64url(JSON.stringify(handoff)));
      return u.toString();
    } catch (e) { return null; }
  }

  /* ---------- the step engine ---------- */
  function createEngine(opts) {
    const mode = opts.mode, S = opts.S;
    const KEY = 'fliq_funnel_progress_v1_' + mode;
    const steps = [];
    const app = $('#app'), back = $('#back'), rail = $('#rail'), foot = $('#foot');
    let step = 0, runId = 0, modalEl = null;

    const ser = () => Object.assign({}, S, { dayDate: S.dayDate ? isoDate(S.dayDate) : null });
    const deser = (o) => Object.assign({}, o, { dayDate: o && o.dayDate ? new Date(o.dayDate + 'T12:00') : null });
    function readSaved() {
      const s = store.get('sessionStorage', KEY);
      if (!s || !s.S || Date.now() - s.t > CONFIG.PROGRESS_TTL_MS) return null;
      return s;
    }
    function save() { if (step > 0) store.set('sessionStorage', KEY, { t: Date.now(), step, S: ser() }); }

    const add = (stage, render, o) => { steps.push(Object.assign({ stage, render }, o || {})); };

    function closeModal() { if (modalEl) { modalEl.remove(); modalEl = null; } }

    function go(n, o) {
      o = o || {};
      closeModal(); runId++;                       // cancels any loader still running
      n = Math.max(0, Math.min(steps.length - 1, n));
      step = n;
      if (o.push !== false) { try { history.pushState({ fq: n }, ''); } catch (e) { /* ignore */ } }
      paint();
      window.scrollTo(0, 0);
    }
    const next = () => go(step + 1);

    function paint() {
      const s = steps[step];
      back.style.visibility = step === 0 ? 'hidden' : 'visible';
      rail.hidden = s.stage < 0;
      if (foot) foot.hidden = step !== 0;
      const counts = [0, 0, 0], pos = [0, 0, 0];
      steps.forEach((x, i) => { if (x.stage >= 0) { counts[x.stage]++; if (i <= step) pos[x.stage]++; } });
      [...rail.children].forEach((el, i) => {
        const pct = s.stage > i ? 100 : s.stage === i ? Math.round(pos[i] / counts[i] * 100) : 0;
        el.querySelector('b').style.width = pct + '%';
        el.classList.toggle('on', s.stage >= i);
      });
      s.render();
      const h = app.querySelector('h1');
      if (h && step > 0) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      save();
      track(mode, 'funnel_step', { step, stage: s.stage, name: s.name || s.render.name || 'screen' });
    }

    /* Back: use real history so the button and the phone's back gesture agree. */
    const prevStep = () => { let n = step - 1; while (n > 0 && steps[n].transient) n--; return Math.max(0, n); };
    back.onclick = () => {
      if (step === 0) return;
      if (history.state && history.state.fq === step) history.back(); else go(prevStep(), { push: false });
    };
    window.addEventListener('popstate', (e) => {
      const n = e.state && typeof e.state.fq === 'number' ? e.state.fq : 0;
      if (steps[n] && steps[n].transient && n < step) { history.back(); return; }  // skip loaders going back
      go(n, { push: false });
    });

    function view(html) { app.innerHTML = '<section class="screen">' + html + '</section>'; }
    function bindOpts(onPick, selIndex) {
      const btns = app.querySelectorAll('.opt');
      btns.forEach((b, i) => {
        if (i === selIndex) b.classList.add('sel');
        b.onclick = () => { btns.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); setTimeout(() => { onPick(i); next(); }, 170); };
      });
    }
    function btn(id, fn) { const b = document.getElementById(id); if (b) b.onclick = fn; }

    function ask(question, key) {
      return new Promise((res) => {
        closeModal();
        modalEl = document.createElement('div');
        modalEl.className = 'veil';
        modalEl.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><small>One quick check</small><h2>' + question + '</h2><div class="row"><button class="btn alt" data-v="0">No</button><button class="btn" data-v="1">Yes</button></div></div>';
        document.body.appendChild(modalEl);
        modalEl.querySelectorAll('button').forEach((b) => b.onclick = () => {
          S.pop[key] = b.dataset.v === '1'; track(mode, 'loader_answer', { key, v: S.pop[key] }); closeModal(); res();
        });
        modalEl.querySelector('[data-v="1"]').focus();
      });
    }

    /* Resume: shown on the landing screen when this tab has unfinished progress. */
    function resumeBlock() {
      const s = readSaved();
      if (!s || s.step < 2) return '';
      return '<button class="btn alt" id="resume">Continue where you left off</button>';
    }
    function bindResume() {
      btn('resume', () => {
        const s = readSaved(); if (!s) return;
        Object.assign(S, deser(s.S));
        let n = Math.min(s.step, steps.length - 1);
        while (n > 0 && steps[n].transient) n--;
        track(mode, 'funnel_resume', { step: n });
        /* Rebuild the history stack so Back / the phone's back gesture walk the earlier steps. */
        try { for (let i = 1; i < n; i++) history.pushState({ fq: i }, ''); } catch (e) { /* ignore */ }
        go(n);
      });
    }
    function reset() { store.del('sessionStorage', KEY); }

    function start() {
      try { history.replaceState({ fq: 0 }, ''); } catch (e) { /* ignore */ }
      captureUtm();
      paint();
    }

    return {
      S, steps, add, go, next, paint, view, bindOpts, btn, ask, closeModal, start, resumeBlock, bindResume, reset,
      nextRun: () => ++runId, runId: () => runId, step: () => step,
    };
  }

  global.Fliq = {
    CONFIG, esc, wait, $, isoDate, nextDow, fmt, fmtLong, dayOptions, track, EMAIL_RE,
    joinWaitlist, submitEmail, buildHandoff, saveHandoff, loadHandoff, clearHandoff, appLink, createEngine,
  };
})(window);
