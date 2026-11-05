/* ============================================================
   MotoLab Mobile — interfaccia
   Vanilla JS, nessuna dipendenza. La logica vive in configurator.js.
   ============================================================ */
(function () {
  "use strict";

  const ML = window.MotoLab;
  if (!ML) throw new Error("configurator.js non caricato");

  const STORAGE_KEY = "motolab.mobile.state.v1";
  const ROUTES = { home: "home", config: "config", summary: "summary" };

  const ICONS = {
    logo: "M216 120a41 41 0 0 0-6.6.55l-5.82-15.14A55.6 55.6 0 0 1 216 104a8 8 0 0 0 0-16h-19.12l-13.41-34.87A8 8 0 0 0 176 48h-32a8 8 0 0 0 0 16h26.51l9.23 24H152c-18.5 0-33.5 4.31-43.37 12.46a16 16 0 0 1-16.76 2.07c-10.58-4.81-73.29-30.12-73.8-30.26a8 8 0 0 0-5 15.19s55.5 21.94 66.53 32.94A55.67 55.67 0 0 1 95.43 152H79.2a40 40 0 1 0 0 16h52.12a31.91 31.91 0 0 0 30.74-23.1a56 56 0 0 1 26.59-33.72l5.82 15.13A40 40 0 1 0 216 120M40 168h22.62a24 24 0 1 1 0-16H40a8 8 0 0 0 0 16m176 16a24 24 0 0 1-15.58-42.23l8.11 21.1a8 8 0 1 0 14.94-5.74L215.35 136h.65a24 24 0 0 1 0 48",
    home: "m219.31 108.68l-80-80a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32M208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80l80 80Z",
    sliders: "M40 88h33a32 32 0 0 0 62 0h81a8 8 0 0 0 0-16h-81a32 32 0 0 0-62 0H40a8 8 0 0 0 0 16m64-24a16 16 0 1 1-16 16a16 16 0 0 1 16-16m112 104h-17a32 32 0 0 0-62 0H40a8 8 0 0 0 0 16h97a32 32 0 0 0 62 0h17a8 8 0 0 0 0-16m-48 24a16 16 0 1 1 16-16a16 16 0 0 1-16 16",
    receipt: "M72 104a8 8 0 0 1 8-8h96a8 8 0 0 1 0 16H80a8 8 0 0 1-8-8m8 40h96a8 8 0 0 0 0-16H80a8 8 0 0 0 0 16m152-88v152a8 8 0 0 1-11.58 7.15L192 200.94l-28.42 14.21a8 8 0 0 1-7.16 0L128 200.94l-28.42 14.21a8 8 0 0 1-7.16 0L64 200.94l-28.42 14.21A8 8 0 0 1 24 208V56a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-16 0H40v139.06l20.42-10.22a8 8 0 0 1 7.16 0L96 199.06l28.42-14.22a8 8 0 0 1 7.16 0L160 199.06l28.42-14.22a8 8 0 0 1 7.16 0L216 195.06Z",
    bell: "M221.8 175.94c-5.55-9.56-13.8-36.61-13.8-71.94a80 80 0 1 0-160 0c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0 0 48 200h40.81a40 40 0 0 0 78.38 0H208a16 16 0 0 0 13.8-24.06M128 216a24 24 0 0 1-22.62-16h45.24A24 24 0 0 1 128 216m-80-32c7.7-13.24 16-43.92 16-80a64 64 0 1 1 128 0c0 36.05 8.28 66.73 16 80Z",
    arrowLeft: "M165.66 202.34a8 8 0 0 1-11.32 11.32l-80-80a8 8 0 0 1 0-11.32l80-80a8 8 0 0 1 11.32 11.32L91.31 128Z",
    reset: "M224 128a96 96 0 0 1-94.71 96H128a95.38 95.38 0 0 1-65.9-26.2a8 8 0 0 1 11-11.63a80 80 0 1 0-1.67-114.78a3 3 0 0 1-.26.25L44.59 96H72a8 8 0 0 1 0 16H24a8 8 0 0 1-8-8V56a8 8 0 0 1 16 0v29.8L60.25 60A96 96 0 0 1 224 128",
    chevronDown: "m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32",
    close: "M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z",
    download: "M224 144v64a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-64a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0m-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 124.69V32a8 8 0 0 0-16 0v92.69L93.66 98.34a8 8 0 0 0-11.32 11.32Z",
    cartCheck: "M224 128a8 8 0 0 1-8 8h-88a8 8 0 0 1 0-16h88a8 8 0 0 1 8 8m-96-56h88a8 8 0 0 0 0-16h-88a8 8 0 0 0 0 16m88 112h-88a8 8 0 0 0 0 16h88a8 8 0 0 0 0-16M82.34 42.34L56 68.69L45.66 58.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32 0l32-32a8 8 0 0 0-11.32-11.32m0 64L56 132.69l-10.34-10.35a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32 0l32-32a8 8 0 0 0-11.32-11.32m0 64L56 196.69l-10.34-10.35a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32 0l32-32a8 8 0 0 0-11.32-11.32",
    exhaust: "M240 104h-12.69L192 68.69A15.86 15.86 0 0 0 180.69 64H140V40h24a8 8 0 0 0 0-16h-64a8 8 0 0 0 0 16h24v24H64a16 16 0 0 0-16 16v52H24v-24a8 8 0 0 0-16 0v64a8 8 0 0 0 16 0v-24h24v20.69A15.86 15.86 0 0 0 52.69 180L92 219.31a15.86 15.86 0 0 0 11.31 4.69h77.38a15.86 15.86 0 0 0 11.31-4.69L227.31 184H240a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16m0 64h-16a8 8 0 0 0-5.66 2.34L180.69 208h-77.38L64 168.69V80h116.69l37.65 37.66A8 8 0 0 0 224 120h16Z",
    seat: "M216 88.8V72a40 40 0 0 0-40-40H80a40 40 0 0 0-40 40v16.8a40 40 0 0 0 0 78.4V200a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16v-32.8a40 40 0 0 0 0-78.4M80 48h96a24 24 0 0 1 24 24v16.8a40.07 40.07 0 0 0-32 39.2H88a40.07 40.07 0 0 0-32-39.2V72a24 24 0 0 1 24-24m128.39 104H208a8 8 0 0 0-8 8v40H56v-40a8 8 0 0 0-8-8h-.39A24 24 0 1 1 72 128v40a8 8 0 0 0 16 0v-24h80v24a8 8 0 0 0 16 0v-40a24 24 0 1 1 24.39 24",
    wheel: "M96.26 37.05a8 8 0 0 1 5.74-9.76a104.1 104.1 0 0 1 52 0a8 8 0 0 1-2 15.75a8.2 8.2 0 0 1-2-.26a88.1 88.1 0 0 0-44 0a8 8 0 0 1-9.74-5.73M53.79 55.14a104.05 104.05 0 0 0-26 45a8 8 0 0 0 15.42 4.27a88 88 0 0 1 22-38.09a8 8 0 0 0-11.42-11.18m-10.58 96.41a8 8 0 1 0-15.42 4.28a104.1 104.1 0 0 0 26 45a8 8 0 0 0 11.41-11.22a88.14 88.14 0 0 1-21.99-38.06M150 213.22a88 88 0 0 1-44 0a8 8 0 1 0-4 15.49a104.1 104.1 0 0 0 52 0a8 8 0 0 0-4-15.49M222.65 146a8 8 0 0 0-9.85 5.58a87.9 87.9 0 0 1-22 38.08a8 8 0 1 0 11.42 11.21a104 104 0 0 0 26-45a8 8 0 0 0-5.57-9.87m-9.86-41.54a8 8 0 0 0 15.42-4.28a104 104 0 0 0-26-45A8 8 0 1 0 190.8 66.4a88 88 0 0 1 21.99 38.05Z",
    accessory: "M184 184a32 32 0 0 1-32 32c-13.7 0-26.95-8.93-31.5-21.22a8 8 0 0 1 15-5.56C137.74 195.27 145 200 152 200a16 16 0 0 0 0-32H40a8 8 0 0 1 0-16h112a32 32 0 0 1 32 32m-64-80a32 32 0 0 0 0-64c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C105.74 60.73 113 56 120 56a16 16 0 0 1 0 32H24a8 8 0 0 0 0 16Zm88-32c-13.7 0-26.95 8.93-31.5 21.22a8 8 0 0 0 15 5.56C193.74 92.73 201 88 208 88a16 16 0 0 1 0 32H32a8 8 0 0 0 0 16h176a32 32 0 0 0 0-64",
  };

  const PART_ICON = {
    scarico: "exhaust",
    sella: "seat",
    cerchi: "wheel",
    accessori: "accessory",
  };

  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");

  let state = loadState();
  let route = readRoute();
  let lastRoute = null;
  let importDraft = null;
  let importError = "";
  let importLoading = false;
  let activeStep = "parti";
  let openGroups = new Set(["scarico"]);
  let toastTimer = null;

  /* ---------- Persistenza ---------- */

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return ML.createState();
      const parsed = JSON.parse(raw);
      return ML.createState(parsed && typeof parsed === "object" ? parsed : {});
    } catch (error) {
      return ML.createState();
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      /* la modalità privata può negare lo storage: l'app resta usabile */
    }
  }

  function commit(next) {
    if (!next || next === state) return;
    captureOpenGroups();
    state = next;
    persist();
    render();
  }

  /* ---------- Utility ---------- */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function icon(name, className) {
    const path = ICONS[name] || ICONS.logo;
    return `<svg class="${className || ""}" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path fill="currentColor" d="${path}"/></svg>`;
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (error) {
      return "";
    }
  }

  function isHttpUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  }

  function nameFromUrl(url) {
    try {
      const part = new URL(url).pathname.split("/").filter(Boolean).pop() || "Parte importata";
      return decodeURIComponent(part).replace(/[-_]+/g, " ").replace(/\.[a-z0-9]+$/i, "");
    } catch (error) {
      return "Parte importata";
    }
  }

  function showToast(message, isError) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.toggle("error", Boolean(isError));
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  /* ---------- Routing ---------- */

  function readRoute() {
    const hash = location.hash.replace("#", "");
    if (hash === "configura") return ROUTES.config;
    if (hash === "riepilogo") return ROUTES.summary;
    return ROUTES.home;
  }

  function navigate(next) {
    const hash = next === ROUTES.config ? "#configura" : next === ROUTES.summary ? "#riepilogo" : "#home";
    if (location.hash === hash) {
      render();
      return;
    }
    location.hash = hash;
  }

  function captureOpenGroups() {
    const current = Array.from(document.querySelectorAll("details[data-group][open]")).map(
      (details) => details.dataset.group,
    );
    if (current.length) openGroups = new Set(current);
  }

  /* ---------- Viste ---------- */

  function homeHeader() {
    return `
      <header class="app-header">
        <div class="brand">
          <span class="brand-logo">${icon("logo")}</span>
          <span class="brand-name">MotoLab</span>
        </div>
        <div class="brand-actions">
          <span class="micro-label">Garage</span>
          <button class="icon-btn" type="button" data-action="notify" aria-label="Notifiche">${icon("bell")}</button>
        </div>
      </header>`;
  }

  function configHeader(model) {
    return `
      <header class="app-header config-header">
        <button class="icon-btn" type="button" data-action="back" aria-label="Torna alla home">${icon("arrowLeft")}</button>
        <div class="center-title">
          <p class="micro-label">Configuratore</p>
          <p class="config-model">${esc(model.name)}</p>
        </div>
        <button class="icon-btn" type="button" data-action="reset" aria-label="Azzera la configurazione">${icon("reset")}</button>
      </header>`;
  }

  function modelCards(compact) {
    return ML.MODELS.map((model) => {
      const active = model.id === state.modelId;
      return `
        <button class="model-card${active ? " active" : ""}${compact ? " compact" : ""}" type="button"
          data-action="select-model" data-model="${esc(model.id)}" aria-pressed="${active}">
          <span class="model-type">${esc(model.type)}</span>
          <span class="model-name">${esc(model.name)}</span>
          <span class="model-price tnum">${ML.formatEUR(model.price)}</span>
        </button>`;
    }).join("");
  }

  function specStrip(extraClass) {
    return `<div class="spec-strip${extraClass ? " " + extraClass : ""}" aria-hidden="true"></div>`;
  }

  function themeGrid() {
    const cards = ML.THEMES.map((theme) => {
      const active = theme.id === state.themeId;
      return `
        <button class="theme-card${active ? " active" : ""}" type="button"
          data-action="select-theme" data-theme="${esc(theme.id)}" aria-pressed="${active}">
          <span class="dots">${theme.dots.map((color) => `<i style="background:${esc(color)}"></i>`).join("")}</span>
          <span class="theme-name">${esc(theme.name)}</span>
        </button>`;
    }).join("");
    return `
      <div class="theme-grid">${cards}</div>
      <p class="theme-note" ${state.themeId ? "hidden" : ""}>Tema personalizzato: stai usando i colori scelti a mano.</p>`;
  }

  function partsSection() {
    return ML.PART_GROUPS.map((group) => {
      const selectedId = state.parts[group.id];
      const selected = ML.getOption(group.id, selectedId);
      const isOpen = openGroups.has(group.id);
      const chips = group.options
        .map((option) => {
          const active = option.id === selectedId;
          return `
            <button class="chip${active ? " active" : ""}" type="button"
              data-action="select-part" data-group="${esc(group.id)}" data-option="${esc(option.id)}"
              aria-pressed="${active}">
              ${esc(option.name)} <span class="plus tnum">+${ML.formatEUR(option.price)}</span>
            </button>`;
        })
        .join("");
      return `
        <details class="part-group" data-group="${esc(group.id)}"${isOpen ? " open" : ""}>
          <summary>
            <span class="part-summary-text">
              <span class="part-title">${esc(group.label)}</span>
              <span class="part-now">Selezionato: ${selected ? esc(selected.name) : "Nessuno"}</span>
            </span>
            ${icon("chevronDown", "chev")}
          </summary>
          <div class="chips">${chips}</div>
        </details>`;
    }).join("");
  }

  function colorsSection() {
    return `
      <div class="color-card">
        ${Object.entries(ML.COLOR_LABELS)
          .map(([key, label]) => {
            const value = state.colors[key] || "#000000";
            return `
              <label class="color-row">
                <input type="color" data-color="${esc(key)}" value="${esc(value)}" aria-label="${esc(label)}">
                <span class="color-label">${esc(label)}</span>
                <span class="color-hex tnum">${esc(value.toUpperCase())}</span>
              </label>`;
          })
          .join("")}
      </div>`;
  }

  function homeView() {
    const model = ML.getModel(state);
    const breakdown = ML.priceBreakdown(state);
    return `
      ${homeHeader()}
      <main class="screen screen-home">
        <section class="hero-head">
          <div class="section-head">
            <span class="idx">01</span><span class="micro-label">Modello in evidenza</span>
          </div>
          <h1>${esc(model.name)}</h1>
          <p class="hero-spec"><span>${esc(model.type)}</span> · <span class="tnum">${model.cc} cc</span></p>
        </section>

        <section class="hero-media">
          <img src="../assets/roadster-hero.jpg" alt="${esc(model.name)}">
          <span class="media-pill">Disponibile</span>
          ${specStrip()}
        </section>

        <section class="price-card">
          <div>
            <p class="micro-label">Prezzo base</p>
            <p class="price accent tnum">${ML.formatEUR(breakdown.base)}</p>
          </div>
          <div class="card-specs tnum">
            <p>Potenza ${model.power} kW</p>
            <p>Peso ${model.weight} kg</p>
          </div>
        </section>

        <section class="models-section">
          <div class="section-head padded">
            <span class="idx">02</span><span class="micro-label">Gamma modelli</span>
          </div>
          <div class="model-scroller">${modelCards(false)}</div>
        </section>
      </main>

      <div class="sticky-bar">
        <button class="btn primary big" type="button" data-action="go-config">
          ${icon("sliders")} Configura la tua moto
        </button>
      </div>
      ${tabbarView()}`;
  }

  function configView() {
    const model = ML.getModel(state);
    const breakdown = ML.priceBreakdown(state);
    return `
      ${configHeader(model)}
      <main class="screen screen-config">
        <section class="preview-wrap">
          <div class="preview-card">
            <span class="preview-glow" style="background:${esc(state.colors.tank)}"></span>
            <img src="../assets/roadster-preview.jpg" alt="Anteprima ${esc(model.name)}">
            <span class="media-pill">Anteprima live</span>
          </div>
          ${specStrip("small")}
          <div class="dimensions tnum"><span>0 mm</span><span>1.420 mm</span><span>2.100 mm</span></div>
        </section>

        <section class="steps-wrap">
          <div class="segmented" role="tablist" aria-label="Passi di personalizzazione">
            ${[
              ["modello", "Modello"],
              ["tema", "Tema"],
              ["parti", "Parti"],
              ["colori", "Colori"],
            ]
              .map(
                ([id, label]) => `
              <button class="step-btn${activeStep === id ? " active" : ""}" type="button" role="tab"
                aria-selected="${activeStep === id}" data-action="step" data-step="${id}">${label}</button>`,
              )
              .join("")}
          </div>
        </section>

        <section class="step-section" id="step-modello" data-step-section="modello">
          <div class="section-head"><span class="idx">01</span><span class="micro-label">Modello</span></div>
          <div class="model-scroller in-section">${modelCards(true)}</div>
        </section>

        <section class="step-section" id="step-tema" data-step-section="tema">
          <div class="section-head"><span class="idx">02</span><span class="micro-label">Tema</span></div>
          ${themeGrid()}
        </section>

        <section class="step-section" id="step-parti" data-step-section="parti">
          <div class="section-head"><span class="idx">03</span><span class="micro-label">Parti</span></div>
          ${partsSection()}
        </section>

        <section class="step-section" id="step-colori" data-step-section="colori">
          <div class="section-head"><span class="idx">04</span><span class="micro-label">Colori personalizzati</span></div>
          ${colorsSection()}
        </section>
      </main>

      <div class="sticky-bar">
        <div class="total-bar">
          <div>
            <p class="micro-label">Totale stimato</p>
            <p class="price accent tnum">${ML.formatEUR(breakdown.total)}</p>
          </div>
          <button class="btn primary" type="button" data-action="go-summary">Apri lista acquisti</button>
        </div>
      </div>
      ${tabbarView()}`;
  }

  function cartRow(item) {
    const isBase = item.kind === "base";
    const iconName =
      item.kind === "part"
        ? PART_ICON[item.id.replace("part:", "")] || "accessory"
        : item.kind === "import"
          ? "download"
          : "logo";
    const media = item.image
      ? `<img src="${esc(item.image)}" alt="" loading="lazy">`
      : icon(iconName);
    return `
      <div class="cart-row" data-cart-id="${esc(item.id)}">
        <span class="cart-ico${isBase ? " is-base" : ""}">${media}</span>
        <span class="cart-main">
          <span class="cart-title">${esc(item.title)}</span>
          <span class="cart-sub">${esc(item.subtitle)}</span>
        </span>
        <span class="cart-price tnum${isBase ? "" : " accent"}">${isBase ? "" : "+"}${ML.formatEUR(item.price)}</span>
        <button class="remove-btn" type="button" data-action="remove" data-id="${esc(item.id)}"
          aria-label="Rimuovi ${esc(item.title)}"${isBase ? ' data-base="true"' : ""}>${icon("close")}</button>
      </div>`;
  }

  function importResultView() {
    if (importLoading) {
      return `<div class="import-status">Sto leggendo la pagina del negozio…</div>`;
    }
    if (!importDraft) return "";
    const draft = importDraft;
    const manual = !draft.title;
    return `
      ${importError ? `<p class="import-warn">${esc(importError)} Puoi comunque inserire i dati a mano qui sotto.</p>` : ""}
      <div class="import-card">
        <div class="ic-top">
          ${draft.image ? `<img src="${esc(draft.image)}" alt="" loading="lazy">` : `<span class="ic-ph">${icon("download")}</span>`}
          <div class="ic-copy">
            <p class="ic-title">${esc(draft.title || nameFromUrl(draft.url))}</p>
            <p class="ic-site">${esc(draft.site || hostOf(draft.url))}</p>
          </div>
        </div>
        ${manual ? `<label class="ic-field full">Titolo<input type="text" data-manual-title placeholder="Nome della parte" maxlength="160"></label>` : ""}
        <div class="ic-fields">
          <label class="ic-field full">Prezzo (€)<input type="number" min="0" step="1" inputmode="numeric" data-draft-price value="${Number(draft.price) || 0}"></label>
          <label class="ic-field full">Categoria
            <select data-draft-cat>
              ${ML.PART_GROUPS.map(
                (group) =>
                  `<option value="${esc(group.label)}"${group.label === draft.category ? " selected" : ""}>${esc(group.label)}</option>`,
              ).join("")}
            </select>
          </label>
        </div>
        <button class="btn secondary wide" type="button" data-action="add-import">${icon("download")} Aggiungi alla lista</button>
      </div>`;
  }

  function summaryView() {
    const items = ML.cartItems(state);
    const breakdown = ML.priceBreakdown(state);
    const optional = breakdown.optional + breakdown.imports;
    return `
      <header class="app-header summary-header">
        <p class="micro-label">Riepilogo</p>
        <h1>Lista acquisti</h1>
      </header>
      <main class="screen screen-summary">
        <section>
          <div class="section-head"><span class="idx">01</span><span class="micro-label">La tua configurazione</span></div>
          <div class="cart-list">${items.map(cartRow).join("")}</div>
        </section>

        <section class="total-hero">
          <div class="total-hero-card">
            <div class="total-hero-head">
              <p class="micro-label">Totale stimato</p>
              <span class="iva">IVA incl.</span>
            </div>
            <p class="price-hero accent tnum">${ML.formatEUR(breakdown.total)}</p>
            <div class="total-split tnum"><span>Base ${ML.formatEUR(breakdown.base)}</span><span>Optional ${ML.formatEUR(optional)}</span></div>
          </div>
        </section>

        <section class="import-section">
          <div class="section-head"><span class="idx">02</span><span class="micro-label">Importa da un negozio</span></div>
          <div class="import-panel">
            <h2>Importa una parte da un negozio</h2>
            <p class="small muted">Incolla il link del prodotto per aggiungerlo alla lista. Con il server locale attivo leggo titolo, immagine e prezzo.</p>
            <form id="import-form" autocomplete="off">
              <label class="field">Link prodotto
                <input id="import-url" type="url" inputmode="url" placeholder="https://negozio.it/prodotto" required>
              </label>
              <label class="field">Categoria
                <select id="import-cat">
                  ${ML.PART_GROUPS.map((group) => `<option value="${esc(group.label)}">${esc(group.label)}</option>`).join("")}
                </select>
              </label>
              <button class="btn secondary wide" type="submit"${importLoading ? " disabled" : ""}>${icon("download")} Importa parte</button>
            </form>
            <div id="import-result">${importResultView()}</div>
          </div>
        </section>
      </main>

      <div class="sticky-bar">
        <button class="btn primary big" type="button" data-action="open-list">
          ${icon("cartCheck")} Apri lista acquisti
        </button>
      </div>
      ${tabbarView()}`;
  }

  function tabbarView() {
    const count = ML.optionalCount(state);
    const tab = (id, hash, label, iconName) => {
      const active = route === id;
      return `
        <a class="tab${active ? " active" : ""}" href="${hash}"${active ? ' aria-current="page"' : ""}>
          ${icon(iconName)}
          <span>${label}</span>
          ${id === "summary" && count > 0 ? `<span class="tab-badge tnum">${count}</span>` : ""}
        </a>`;
    };
    return `
      <nav class="tabbar" aria-label="Navigazione principale">
        ${tab("home", "#home", "Home", "home")}
        ${tab("config", "#configura", "Configura", "sliders")}
        ${tab("summary", "#riepilogo", "Riepilogo", "receipt")}
      </nav>`;
  }

  /* ---------- Render ---------- */

  function render() {
    route = readRoute();
    if (route !== lastRoute) {
      activeStep = route === ROUTES.config ? activeStep : "parti";
      lastRoute = route;
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    app.innerHTML = `<div class="app-glow" aria-hidden="true"></div>${
      route === ROUTES.home ? homeView() : route === ROUTES.config ? configView() : summaryView()
    }`;
    document.body.dataset.route = route;
    syncStepOnScroll();
  }

  /* ---------- Azioni ---------- */

  function selectModel(modelId) {
    commit(ML.setModel(state, modelId));
    const model = ML.getModel(state);
    showToast(`${model.name} selezionata`);
  }

  function resetConfiguration() {
    if (!window.confirm("Azzerare la configurazione e ripartire dai valori iniziali?")) return;
    importDraft = null;
    importError = "";
    commit(ML.resetState());
    showToast("Configurazione azzerata");
  }

  function selectPart(groupId, optionId) {
    commit(ML.setPart(state, groupId, optionId));
  }

  function removeItem(itemId, isBase) {
    if (isBase) {
      showToast("Il modello base non può essere rimosso", true);
      return;
    }
    commit(ML.removeCartItem(state, itemId));
    showToast("Parte rimossa");
  }

  function selectStep(stepId) {
    activeStep = stepId;
    document.querySelectorAll(".step-btn").forEach((button) => {
      const active = button.dataset.step === stepId;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
    });
    const target = document.getElementById(`step-${stepId}`);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  let scrollFrame = null;
  function syncStepOnScroll() {
    if (route !== ROUTES.config) return;
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      const sections = Array.from(document.querySelectorAll("[data-step-section]"));
      if (!sections.length) return;
      const line = 190;
      let current = sections[0].dataset.stepSection;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.dataset.stepSection;
      }
      if (current === activeStep) return;
      activeStep = current;
      document.querySelectorAll(".step-btn").forEach((button) => {
        const active = button.dataset.step === current;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
      });
    });
  }

  window.addEventListener("scroll", syncStepOnScroll, { passive: true });

  /* ---------- Import da negozio ---------- */

  async function handleImport(event) {
    event.preventDefault();
    const urlInput = document.getElementById("import-url");
    const categorySelect = document.getElementById("import-cat");
    const url = (urlInput && urlInput.value ? urlInput.value : "").trim();
    const category = categorySelect ? categorySelect.value : "Accessori";

    if (!isHttpUrl(url)) {
      showToast("Inserisci un link http o https valido", true);
      return;
    }

    importLoading = true;
    importError = "";
    importDraft = null;
    render();
    const again = document.getElementById("import-url");
    if (again) again.value = url;

    try {
      const response = await fetch("/api/preview?url=" + encodeURIComponent(url), {
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Il negozio non ha restituito i dati della pagina.");
      }
      importDraft = {
        title: String(data.title || "").trim(),
        image: data.image || "",
        site: data.site || hostOf(url),
        price: Number(data.price) || 0,
        currency: data.currency || "EUR",
        category,
        url,
      };
    } catch (error) {
      importError =
        "Non riesco a leggere la pagina: avvia il server locale con python3 server.py e riprova.";
      importDraft = {
        title: "",
        image: "",
        site: hostOf(url),
        price: 0,
        currency: "EUR",
        category,
        url,
      };
    } finally {
      importLoading = false;
      render();
      const result = document.getElementById("import-result");
      if (result) result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function addImport() {
    if (!importDraft) return;
    const priceInput = document.querySelector("[data-draft-price]");
    const categorySelect = document.querySelector("[data-draft-cat]");
    const titleInput = document.querySelector("[data-manual-title]");
    const price = priceInput ? Math.max(0, Number(priceInput.value) || 0) : 0;
    const category = categorySelect ? categorySelect.value : importDraft.category;
    const title = (titleInput ? titleInput.value.trim() : importDraft.title) || nameFromUrl(importDraft.url);
    const item = {
      id: "shop-" + Date.now().toString(36),
      title,
      category,
      price,
      site: importDraft.site || hostOf(importDraft.url),
      url: importDraft.url,
      image: importDraft.image,
    };
    importDraft = null;
    importError = "";
    commit(ML.addImport(state, item));
    showToast("Parte aggiunta alla lista");
  }

  /* ---------- Lista acquisti condivisibile ---------- */

  function shoppingListHtml() {
    const items = ML.cartItems(state);
    const breakdown = ML.priceBreakdown(state);
    const rows = items
      .map((item) => {
        const title = item.url
          ? `<a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a>`
          : esc(item.title);
        return `<tr><td><strong>${title}</strong><br><span class="muted">${esc(item.subtitle)}</span></td><td class="right">${ML.formatEUR(item.price)}</td></tr>`;
      })
      .join("");
    return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MotoLab — Lista acquisti</title>
<style>
  body{font-family:Inter,system-ui,sans-serif;background:#0e0f11;color:#f2f1ee;margin:0;padding:32px}
  main{max-width:720px;margin:0 auto}
  .eyebrow{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8a9099}
  h1{font-size:32px;margin:6px 0 24px}
  table{width:100%;border-collapse:collapse;background:#17191c;border:1px solid #2a2d32;border-radius:16px;overflow:hidden}
  td{padding:14px 16px;border-bottom:1px solid #2a2d32;font-size:14px;vertical-align:top}
  tr:last-child td{border-bottom:0}
  .right{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
  .muted{color:#8a9099;font-size:12px}
  a{color:#ffb547}
  .total{display:flex;justify-content:space-between;align-items:baseline;margin-top:20px;padding:20px;border:1px solid #2a2d32;border-radius:16px;background:#17191c}
  .total strong{font-size:28px;color:#ffb547}
  p.note{color:#8a9099;font-size:12px;margin-top:18px;line-height:1.5}
  @media print{body{background:#fff;color:#111}table,.total{background:#fff;border-color:#ccc}td{border-color:#ddd}.muted{color:#555}a{color:#111}}
</style></head>
<body><main>
  <p class="eyebrow">MotoLab · Configuratore</p>
  <h1>Lista acquisti</h1>
  <table>${rows}</table>
  <div class="total"><span>Totale stimato</span><strong>${ML.formatEUR(breakdown.total)}</strong></div>
  <p class="note">Prezzi dimostrativi, IVA inclusa. Verifica prezzo, misure e compatibilità sui siti dei rivenditori prima di acquistare.</p>
</main></body></html>`;
  }

  function openShoppingList() {
    const html = shoppingListHtml();
    let opened = null;
    try {
      opened = window.open("", "_blank");
    } catch (error) {
      opened = null;
    }
    if (opened && opened.document) {
      opened.document.open();
      opened.document.write(html);
      opened.document.close();
      showToast("Lista aperta in una nuova scheda");
      return;
    }
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "motolab-lista-acquisti.html";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 4000);
    showToast("Lista scaricata come file HTML");
  }

  /* ---------- Colori ---------- */

  function updateColorLive(input) {
    const key = input.dataset.color;
    if (!key) return;
    state = ML.setColor(state, key, input.value);
    persist();
    const row = input.closest(".color-row");
    if (row) {
      const hex = row.querySelector(".color-hex");
      if (hex) hex.textContent = input.value.toUpperCase();
    }
    if (key === "tank") {
      const glow = document.querySelector(".preview-glow");
      if (glow) glow.style.background = input.value;
    }
    document.querySelectorAll(".theme-card").forEach((card) => {
      card.classList.remove("active");
      card.setAttribute("aria-pressed", "false");
    });
    const note = document.querySelector(".theme-note");
    if (note) note.hidden = false;
  }

  /* ---------- Eventi ---------- */

  document.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    switch (action) {
      case "go-config":
        navigate(ROUTES.config);
        break;
      case "go-summary":
        navigate(ROUTES.summary);
        break;
      case "back":
        navigate(ROUTES.home);
        break;
      case "reset":
        resetConfiguration();
        break;
      case "select-model":
        selectModel(actionEl.dataset.model);
        break;
      case "select-theme":
        commit(ML.setTheme(state, actionEl.dataset.theme));
        break;
      case "select-part":
        selectPart(actionEl.dataset.group, actionEl.dataset.option);
        break;
      case "step":
        selectStep(actionEl.dataset.step);
        break;
      case "remove":
        removeItem(actionEl.dataset.id, actionEl.dataset.base === "true");
        break;
      case "add-import":
        addImport();
        break;
      case "open-list":
        openShoppingList();
        break;
      case "notify":
        showToast("Nessuna nuova notifica");
        break;
      default:
        break;
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target && event.target.id === "import-form") {
      handleImport(event);
    }
  });

  document.addEventListener(
    "input",
    (event) => {
      if (event.target.matches("[data-color]")) updateColorLive(event.target);
    },
    true,
  );

  document.addEventListener(
    "change",
    (event) => {
      if (event.target.matches("[data-color]")) {
        captureOpenGroups();
        persist();
        render();
      }
    },
    true,
  );

  document.addEventListener(
    "toggle",
    (event) => {
      const details = event.target;
      if (!details.matches || !details.matches("details[data-group]")) return;
      if (details.open) openGroups.add(details.dataset.group);
      else openGroups.delete(details.dataset.group);
    },
    true,
  );

  window.addEventListener("hashchange", () => {
    render();
  });

  /* ---------- Avvio ---------- */

  if (!location.hash) {
    history.replaceState(null, "", "#home");
  }
  render();
})();
