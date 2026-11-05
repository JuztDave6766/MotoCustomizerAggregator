/* ============================================================
   MotoLab — configuratore moto
   Vanilla JS, nessuna dipendenza.
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   Utility
   ------------------------------------------------------------ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const euro = (n) =>
  '€ ' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const STORAGE_KEY = 'motolab.state.v2';

/* ------------------------------------------------------------
   Dati: modelli
   ------------------------------------------------------------ */

const MODELS = {
  leoncino: {
    key: 'leoncino',
    name: 'Benelli Leoncino 250',
    spec: 'Scrambler · 249 cc · 25,8 cv',
    base: 4290,
    style: 'scrambler',
    wheels: 'cast',
    colors: {
      tank: '#c9ccd2',
      tail: '#c9ccd2',
      seat: '#26282e',
      rim: '#b6bbc4',
      frame: '#2b2e35',
      engine: '#3a3d44',
      exhaust: '#6d747d',
      accent: '#9aa0aa',
      glass: '#7d8b9c',
    },
  },
  roadster: {
    key: 'roadster',
    name: 'Roadster 700',
    spec: 'Naked · 689 cc · 74 cv',
    base: 7990,
    style: 'naked',
    wheels: 'cast',
    colors: {
      tank: '#c8402f',
      tail: '#191b20',
      seat: '#26282e',
      rim: '#c9a24b',
      frame: '#2b2e35',
      engine: '#3a3d44',
      exhaust: '#9aa2ad',
      accent: '#f2f3f5',
      glass: '#7d8b9c',
    },
  },
  sport: {
    key: 'sport',
    name: 'Sport 900 RR',
    spec: 'Sport · 890 cc · 121 cv',
    base: 12900,
    style: 'sport',
    wheels: 'forged',
    colors: {
      tank: '#23272e',
      tail: '#23272e',
      seat: '#17191e',
      rim: '#c0392b',
      frame: '#23262c',
      engine: '#31343b',
      exhaust: '#a8b0ba',
      accent: '#e03a2f',
      glass: '#5d6b7d',
    },
  },
  scrambler: {
    key: 'scrambler',
    name: 'Scrambler 800',
    spec: 'Scrambler · 803 cc · 73 cv',
    base: 9900,
    style: 'scrambler',
    wheels: 'spoked',
    colors: {
      tank: '#7c8a5a',
      tail: '#23251f',
      seat: '#4a3a2c',
      rim: '#d9dde2',
      frame: '#2c2e33',
      engine: '#3f434a',
      exhaust: '#b9bfc7',
      accent: '#e8dcc4',
      glass: '#8b97a6',
    },
  },
};

/* ------------------------------------------------------------
   Dati: temi
   ------------------------------------------------------------ */

const THEMES = {
  argento: {
    name: 'Argento',
    swatch: ['#c9ccd2', '#26282e', '#7d838d'],
    colors: { tank: '#c9ccd2', tail: '#c9ccd2', seat: '#26282e', accent: '#9aa0aa', rim: '#b6bbc4' },
    decal: 'none',
  },
  corsa: {
    name: 'Corsa',
    swatch: ['#d0352b', '#f4f4f4', '#1b1d22'],
    colors: { tank: '#d0352b', tail: '#1b1d22', seat: '#22242a', accent: '#f4f4f4', rim: '#c9a24b' },
    decal: 'stripes',
  },
  stealth: {
    name: 'Stealth',
    swatch: ['#2a2d33', '#0f1114', '#8a929c'],
    colors: { tank: '#2a2d33', tail: '#15171b', seat: '#1e2025', accent: '#8a929c', rim: '#3a3d44' },
    decal: 'none',
  },
  gulf: {
    name: 'Gulf',
    swatch: ['#8fc6e8', '#f08a3c', '#1b2733'],
    colors: { tank: '#8fc6e8', tail: '#1b2733', seat: '#2b3742', accent: '#f08a3c', rim: '#e8e2d4' },
    decal: 'stripes',
  },
  neon: {
    name: 'Neon',
    swatch: ['#14161a', '#c6ff3f', '#2b2f36'],
    colors: { tank: '#14161a', tail: '#1b1e24', seat: '#20242a', accent: '#c6ff3f', rim: '#c6ff3f' },
    decal: 'number',
  },
  retro: {
    name: 'Retrò',
    swatch: ['#e8ddc7', '#7a2f2a', '#33302b'],
    colors: { tank: '#e8ddc7', tail: '#7a2f2a', seat: '#4a3a2c', accent: '#7a2f2a', rim: '#cfc6b4' },
    decal: 'stripes',
  },
};

/* ------------------------------------------------------------
   Modalità foto: base e maschere colore
   Coordinate in pixel dell'immagine (705 × 600).
   Le maschere sono volutamente larghe: la calibrazione nell'UI
   permette di spostarle, scalarle e ruotarle sulla foto.
   ------------------------------------------------------------ */

const PHOTO = {
  leoncino: {
    src: 'assets/leoncino-250.png',
    width: 705,
    height: 600,
    credit: 'Render studio ufficiale Benelli (cdn.keeway.com)',
    zones: {
      tail: {
        label: 'Codino',
        color: 'tail',
        d: 'M 112 268 C 140 252 190 248 226 260 C 242 266 246 282 242 300 C 236 320 212 330 178 330 C 140 330 110 322 100 304 C 92 288 96 276 112 268 Z',
        cx: 172,
        cy: 292,
        feather: 5,
        opacity: 0.85,
        tint: 0.4,
        labelAt: [104, 246],
      },
      tank: {
        label: 'Serbatoio',
        color: 'tank',
        d: 'M 330 202 C 365 192 425 190 452 205 C 468 216 476 245 472 276 C 468 300 452 315 424 320 L 340 322 C 300 320 272 308 258 288 C 244 268 258 244 286 224 C 300 214 314 206 330 202 Z',
        cx: 365,
        cy: 258,
        feather: 4,
        opacity: 0.92,
        tint: 0.55,
        labelAt: [340, 190],
      },
      seat: {
        label: 'Sella',
        color: 'seat',
        d: 'M 148 254 C 190 236 280 232 335 242 C 352 246 358 260 350 274 C 342 288 320 296 288 298 L 190 300 C 152 300 128 292 122 278 C 116 264 124 260 148 254 Z',
        cx: 236,
        cy: 268,
        feather: 5,
        opacity: 0.82,
        tint: 0.3,
        boost: 0.18,
        labelAt: [150, 228],
      },
      exhaust: {
        label: 'Scarico',
        color: 'exhaust',
        d: 'M 260 364 L 336 356 A 22 22 0 0 1 344 398 L 268 406 A 22 22 0 0 1 260 364 Z',
        cx: 300,
        cy: 382,
        feather: 4,
        opacity: 0.85,
        tint: 0.3,
        boost: 0.45,
        labelAt: [248, 342],
      },
      fender: {
        label: 'Parafango',
        color: 'fender',
        d: 'M 515 342 A 108 108 0 0 1 649 342',
        stroke: 20,
        cx: 582,
        cy: 342,
        feather: 2.5,
        opacity: 0.92,
        tint: 0.5,
        labelAt: [520, 300],
      },
      rimRear: {
        label: 'Cerchio posteriore',
        color: 'rim',
        ring: { cx: 141, cy: 424, rOuter: 66, rInner: 16 },
        cx: 141,
        cy: 424,
        feather: 2,
        opacity: 0.92,
        tint: 0.35,
        labelAt: [70, 348],
      },
      rimFront: {
        label: 'Cerchio anteriore',
        color: 'rim',
        ring: { cx: 582, cy: 424, rOuter: 66, rInner: 16 },
        cx: 582,
        cy: 424,
        feather: 2,
        opacity: 0.92,
        tint: 0.35,
        labelAt: [510, 348],
      },
    },
  },
};

const PHOTO_ORDER = ['tail', 'tank', 'seat', 'exhaust', 'fender', 'rimRear', 'rimFront'];

/* ------------------------------------------------------------
   Dati: categorie e catalogo
   ------------------------------------------------------------ */

const CATEGORIES = [
  { key: 'exhaust', label: 'Scarico', target: 'exhaust' },
  { key: 'seat', label: 'Sella', target: 'seat' },
  { key: 'wheels', label: 'Cerchi', target: 'rim' },
  { key: 'fender', label: 'Parafango', target: 'fender' },
  { key: 'mirrors', label: 'Specchietti', target: 'mirror' },
  { key: 'windshield', label: 'Cupolino', target: 'glass' },
  { key: 'decal', label: 'Livrea', target: 'accent' },
];

// Link dimostrativi: sostituiscili con deep link/affiliazione reali.
const storeLink = (q) => 'https://www.amazon.it/s?k=' + encodeURIComponent(q);

const PARTS = {
  exhaust: {
    items: [
      { id: 'stock', name: 'Di serie', price: 0, meta: 'Scarico originale del modello' },
      {
        id: 'slipon',
        name: 'Slip-on Titanio',
        price: 489,
        color: '#b7bec9',
        meta: 'Omologato · −1,8 kg · suono più pieno',
        url: storeLink('scarico slip-on moto titanio omologato'),
      },
      {
        id: 'full',
        name: 'Full system Racing',
        price: 1349,
        color: '#9aa2ad',
        meta: 'Solo pista · non omologato',
        url: storeLink('scarico completo racing moto'),
      },
      {
        id: 'short',
        name: 'Shorty Nero',
        price: 359,
        color: '#26282d',
        meta: 'Omologato · terminale corto',
        url: storeLink('terminale scarico corto moto nero'),
      },
    ],
  },
  seat: {
    items: [
      { id: 'stock', name: 'Di serie', price: 0, meta: 'Sella originale' },
      {
        id: 'comfort',
        name: 'Sella Comfort gel',
        price: 279,
        color: '#3b3e46',
        meta: '−15% vibrazioni · uso turismo',
        url: storeLink('sella comfort gel moto'),
      },
      {
        id: 'racing',
        name: 'Sella Racing monoposto',
        price: 349,
        color: '#17181c',
        meta: 'Monoposto · non omologata per il passeggero',
        url: storeLink('sella racing monoposto moto'),
      },
    ],
  },
  wheels: {
    items: [
      { id: 'stock', name: 'Di serie', price: 0, meta: 'Cerchi originali' },
      {
        id: 'forged',
        name: 'Forgiati 5 razze',
        price: 1590,
        color: '#c9a24b',
        wheels: 'forged',
        meta: '−2,4 kg · più reattiva',
        url: storeLink('cerchi forgiati moto 5 razze'),
      },
      {
        id: 'spoked',
        name: 'A raggi',
        price: 1090,
        color: '#d9dde2',
        wheels: 'spoked',
        meta: 'Stile scrambler · offroad leggero',
        url: storeLink('cerchi a raggi moto'),
      },
      {
        id: 'black',
        name: 'Neri opachi',
        price: 690,
        color: '#26282d',
        wheels: 'cast',
        meta: 'Look total black',
        url: storeLink('cerchi moto nero opaco'),
      },
    ],
  },
  fender: {
    items: [
      { id: 'stock', name: 'Di serie', price: 0, meta: 'Parafango originale' },
      {
        id: 'carbon',
        name: 'Carbonio',
        price: 219,
        color: '#23262b',
        meta: 'Carbonio vero · −60% peso',
        url: storeLink('parafango carbonio moto'),
      },
      {
        id: 'high',
        name: 'Alto scrambler',
        price: 179,
        meta: 'Stile offroad · montaggio alto',
        url: storeLink('parafango alto scrambler'),
      },
    ],
  },
  mirrors: {
    items: [
      { id: 'stock', name: 'Di serie', price: 0, meta: 'Specchietti originali' },
      {
        id: 'barend',
        name: 'Bar-end',
        price: 129,
        color: '#2a2c31',
        meta: 'Omologati · look minimale',
        url: storeLink('specchietti bar end moto omologati'),
      },
      {
        id: 'none',
        name: 'Rimuovi',
        price: 0,
        meta: 'Solo uso pista · non omologato su strada',
        url: '',
      },
    ],
  },
  windshield: {
    items: [
      { id: 'none', name: 'Nessuno', price: 0, meta: 'Configurazione originale' },
      {
        id: 'sport',
        name: 'Sport fumé',
        price: 179,
        color: '#6d7b8c',
        meta: 'Riparo basso · look sportivo',
        url: storeLink('cupolino sport moto fumé'),
      },
      {
        id: 'touring',
        name: 'Touring alto',
        price: 239,
        color: '#8fa0b5',
        meta: 'Max riparo · viaggi lunghi',
        url: storeLink('cupolino touring alto moto'),
      },
    ],
  },
  decal: {
    items: [
      { id: 'none', name: 'Nessuna', price: 0, meta: 'Verniciatura pulita' },
      { id: 'stripes', name: 'Strisce racing', price: 89, meta: 'Adesivi predisposti', url: storeLink('adesivi strisce racing moto') },
      { id: 'number', name: 'Numero gara', price: 119, meta: 'Personalizzabile', url: storeLink('adesivo numero gara moto') },
      { id: 'camo', name: 'Camouflage', price: 159, meta: 'Kit adesivi completo', url: storeLink('adesivi camouflage moto') },
    ],
  },
};

const STOCK = {
  exhaust: 'stock',
  seat: 'stock',
  wheels: 'stock',
  fender: 'stock',
  mirrors: 'stock',
  windshield: 'none',
  decal: 'none',
};

const DEFAULT_TINT = {
  exhaust: '#aab2bd',
  seat: '#2b2d33',
  wheels: '#c9a24b',
  fender: '#2a2d33',
  mirrors: '#2a2c31',
  windshield: '#6d7b8c',
  decal: '#f2f2f2',
};

/* ------------------------------------------------------------
   Stato
   ------------------------------------------------------------ */

function blankState(model = 'leoncino') {
  return {
    model,
    theme: 'argento',
    colors: {},
    chosen: { ...STOCK },
    custom: [],
    compare: false,
    photo: Boolean(PHOTO[model]),
    photoSrc: '',
    calib: {},
    showMasks: false,
  };
}

let st = blankState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const model = MODELS[data.model] ? data.model : 'leoncino';
    const theme = THEMES[data.theme] ? data.theme : 'argento';
    const chosen = { ...STOCK };
    if (data.chosen && typeof data.chosen === 'object') {
      for (const key of Object.keys(STOCK)) {
        if (typeof data.chosen[key] === 'string') chosen[key] = data.chosen[key];
      }
    }
    const custom = Array.isArray(data.custom)
      ? data.custom
          .filter((p) => p && typeof p.id === 'string' && typeof p.name === 'string')
          .slice(0, 100)
      : [];
    const calib = {};
    if (data.calib && typeof data.calib === 'object') {
      for (const key of Object.keys(PHOTO[model] ? PHOTO[model].zones : {})) {
        const c = data.calib[key];
        if (!c || typeof c !== 'object') continue;
        const item = {};
        for (const k of ['dx', 'dy', 'scale', 'rot', 'feather', 'opacity']) {
          if (Number.isFinite(Number(c[k]))) item[k] = Number(c[k]);
        }
        calib[key] = item;
      }
    }
    const photoSrc =
      typeof data.photoSrc === 'string' && /^data:image\//.test(data.photoSrc) && data.photoSrc.length < 3500000
        ? data.photoSrc
        : '';
    return {
      model,
      theme,
      colors: data.colors && typeof data.colors === 'object' ? data.colors : {},
      chosen,
      custom,
      compare: false,
      photo: Boolean(PHOTO[model]) && data.photo !== false,
      photoSrc,
      calib,
      showMasks: false,
    };
  } catch (err) {
    return null;
  }
}

function persist() {
  try {
    const copy = { ...st, compare: false, showMasks: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(copy));
  } catch (err) {
    /* storage piena o disabilitata: ignora */
  }
}

/* ------------------------------------------------------------
   Ricerca parti
   ------------------------------------------------------------ */

function findPart(cat, id) {
  const local = st.custom.find((p) => p.id === id && p.cat === cat);
  if (local) return local;
  const group = PARTS[cat];
  return group ? group.items.find((p) => p.id === id) || null : null;
}

function selectedId(cat) {
  return st.compare ? STOCK[cat] : st.chosen[cat];
}

function partName(cat) {
  const part = findPart(cat, st.chosen[cat]);
  return part ? part.name : 'Di serie';
}

function totalPrice() {
  let total = MODELS[st.model].base;
  for (const cat of CATEGORIES) {
    const part = findPart(cat.key, st.chosen[cat.key]);
    if (part && part.price) total += part.price;
  }
  return total;
}

/* ------------------------------------------------------------
   Colori effettivi
   ------------------------------------------------------------ */

function effectiveColors() {
  const model = MODELS[st.model];
  const theme = THEMES[st.theme];
  const c = {
    ...model.colors,
    ...(theme ? theme.colors : {}),
    ...st.colors,
  };

  c.fairing = c.tank;
  c.fender = c.tank;
  c.mirror = c.frame;

  if (!st.compare) {
    for (const cat of CATEGORIES) {
      const part = findPart(cat.key, st.chosen[cat.key]);
      if (part && part.color) c[cat.target] = part.color;
    }
  }

  c.tire = '#15171a';
  return c;
}

function svgVars() {
  const c = effectiveColors();
  const vars = Object.keys(c)
    .map((k) => `--${k}:${c[k]};`)
    .join('');
  return `.bike-svg{${vars}}`;
}

/* ------------------------------------------------------------
   SVG: ruote
   ------------------------------------------------------------ */

function wheelSVG(cx, cy, kind) {
  let spokes = '';

  if (kind === 'spoked') {
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * 15;
      const y1 = cy + Math.sin(a) * 15;
      const x2 = cx + Math.cos(a) * 67;
      const y2 = cy + Math.sin(a) * 67;
      spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--rim)" stroke-width="2" opacity=".9"/>`;
    }
  } else if (kind === 'forged') {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const x2 = cx + Math.cos(a) * 66;
      const y2 = cy + Math.sin(a) * 66;
      spokes += `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--rim)" stroke-width="13" stroke-linecap="round"/>`;
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      for (const off of [-0.19, 0.19]) {
        const x1 = cx + Math.cos(a + off) * 15;
        const y1 = cy + Math.sin(a + off) * 15;
        const x2 = cx + Math.cos(a + off) * 64;
        const y2 = cy + Math.sin(a + off) * 64;
        spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--rim)" stroke-width="8" stroke-linecap="round"/>`;
      }
    }
  }

  return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="90" fill="none" stroke="var(--tire)" stroke-width="20"/>
      <circle cx="${cx}" cy="${cy}" r="79" fill="none" stroke="#0a0b0d" stroke-width="2" opacity=".45"/>
      <circle cx="${cx}" cy="${cy}" r="42" fill="none" stroke="#9aa1ac" stroke-width="3" opacity=".45"/>
      <circle cx="${cx}" cy="${cy}" r="70" fill="none" stroke="var(--rim)" stroke-width="6"/>
      ${spokes}
      <circle cx="${cx}" cy="${cy}" r="16" fill="var(--rim)"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#121418"/>
    </g>`;
}

/* ------------------------------------------------------------
   SVG: scarichi
   ------------------------------------------------------------ */

function exhaustSVG(kind, style) {
  const pipe = (d, w = 12) =>
    `<path d="${d}" fill="none" stroke="var(--exhaust)" stroke-width="${w}" stroke-linecap="round"/>`;

  const can = (x, y, w, h, rotate = 0, cap) => {
    const tr = rotate ? ` transform="rotate(${rotate} ${x + w / 2} ${y + h / 2})"` : '';
    const capEl = cap
      ? `<circle cx="${x + 10}" cy="${y + h / 2}" r="${h / 2 - 4}" fill="#14161a" opacity=".8"/>`
      : '';
    return `<g${tr}><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="var(--exhaust)" stroke="#101216" stroke-width="2"/>${capEl}<rect x="${x + w - 22}" y="${y + 5}" width="8" height="${h - 10}" rx="4" fill="#0f1114" opacity=".35"/></g>`;
  };

  if (style === 'scrambler' && kind === 'stock') {
    return `
      <g>
        ${pipe('M 596 356 C 620 400 606 430 566 442 C 512 458 470 424 430 398 C 396 376 358 366 322 372')}
        <rect x="206" y="350" width="128" height="35" rx="17" fill="var(--exhaust)" stroke="#101216" stroke-width="2"/>
        <rect x="206" y="350" width="128" height="35" rx="17" fill="none" stroke="#fff" stroke-width="1" opacity=".18"/>
        <rect x="320" y="374" width="92" height="12" rx="6" fill="#cfd6de" opacity=".45"/>
        <circle cx="212" cy="367" r="12" fill="#14161a"/>
      </g>`;
  }

  if (kind === 'full') {
    return `
      <g>
        ${pipe('M 596 356 C 632 404 614 458 566 482 C 512 508 452 496 408 466 C 380 446 356 448 338 452')}
        ${can(246, 428, 190, 42, -15, true)}
        <path d="M 348 432 L 356 400" stroke="#2b2e35" stroke-width="4" opacity=".7"/>
      </g>`;
  }

  if (kind === 'short') {
    return `
      <g>
        ${pipe('M 596 356 C 626 400 620 452 566 470 C 530 481 496 484 464 482')}
        ${can(352, 466, 104, 40, -3, true)}
      </g>`;
  }

  if (kind === 'slipon') {
    return `
      <g>
        ${pipe('M 596 356 C 626 400 620 452 566 470 C 528 483 486 486 448 483')}
        ${can(300, 462, 142, 40, -3, true)}
      </g>`;
  }

  // stock
  if (style === 'sport') {
    return `
      <g>
        ${pipe('M 598 356 C 628 402 620 452 566 470 C 522 485 478 486 438 478')}
        ${can(250, 440, 170, 37, -13, true)}
      </g>`;
  }

  return `
    <g>
      ${pipe('M 596 356 C 626 400 620 452 566 470 C 522 485 474 488 430 485')}
      ${can(270, 461, 160, 44, -2, true)}
      <rect x="300" y="471" width="90" height="6" rx="3" fill="#fff" opacity=".14"/>
    </g>`;
}

/* ------------------------------------------------------------
   SVG: livree
   ------------------------------------------------------------ */

function decalSVG(kind) {
  if (kind === 'stripes') {
    return `
      <g fill="var(--accent)" opacity=".95">
        <path d="M 472 314 L 612 270 L 620 286 L 480 330 Z"/>
        <path d="M 468 294 L 606 252 L 610 261 L 472 303 Z" opacity=".55"/>
      </g>`;
  }
  if (kind === 'number') {
    return `
      <g>
        <circle cx="538" cy="292" r="31" fill="var(--accent)"/>
        <circle cx="538" cy="292" r="31" fill="none" stroke="#0d0f12" stroke-width="2" opacity=".25"/>
        <text x="538" y="305" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#15171b">7</text>
      </g>`;
  }
  if (kind === 'camo') {
    return `
      <g fill="var(--accent)" opacity=".38">
        <ellipse cx="500" cy="286" rx="32" ry="18"/>
        <ellipse cx="556" cy="304" rx="26" ry="14"/>
        <ellipse cx="594" cy="276" rx="20" ry="24"/>
        <ellipse cx="516" cy="320" rx="24" ry="11"/>
      </g>`;
  }
  return '';
}

/* ------------------------------------------------------------
   SVG: moto completa
   ------------------------------------------------------------ */

function bikeMarkup() {
  const model = MODELS[st.model];
  const style = model.style;
  const sport = style === 'sport';
  const scram = style === 'scrambler';

  const wheelKind = st.compare
    ? model.wheels
    : (findPart('wheels', st.chosen.wheels) || {}).wheels || model.wheels;

  const exhaustId = selectedId('exhaust');
  const exhaustKind = ['stock', 'slipon', 'full', 'short'].includes(exhaustId) ? exhaustId : 'stock';
  const fenderId = selectedId('fender');
  const fenderKind = ['stock', 'carbon', 'high'].includes(fenderId) ? fenderId : 'stock';
  const windId = selectedId('windshield');
  const windKind = ['none', 'sport', 'touring'].includes(windId) ? windId : 'none';
  const mirrorId = selectedId('mirrors');
  const mirrorKind = ['stock', 'barend', 'none'].includes(mirrorId) ? mirrorId : 'stock';
  const decalId = selectedId('decal');
  const decalKind = ['none', 'stripes', 'number', 'camo'].includes(decalId) ? decalId : 'none';

  const rearWheel = wheelSVG(250, 455, wheelKind);
  const frontWheel = wheelSVG(752, 455, wheelKind);

  const fork = `
    <g stroke-linecap="round">
      <line x1="752" y1="455" x2="697" y2="294" stroke="#2a2d33" stroke-width="17"/>
      <line x1="697" y1="296" x2="674" y2="234" stroke="#b9c2cd" stroke-width="10"/>
      <line x1="750" y1="450" x2="700" y2="304" stroke="#8d96a2" stroke-width="3" opacity=".55"/>
      <path d="M 660 236 L 692 246" stroke="#3a3f48" stroke-width="11" stroke-linecap="round"/>
    </g>`;

  const swingarm = `
    <g>
      <path d="M 470 432 L 250 455" stroke="#0c0e11" stroke-width="5" stroke-dasharray="7 4" opacity=".75"/>
      <line x1="356" y1="414" x2="250" y2="455" stroke="var(--frame)" stroke-width="18" stroke-linecap="round"/>
      <line x1="356" y1="414" x2="250" y2="455" stroke="#0b0d10" stroke-width="6" stroke-linecap="round" opacity=".3"/>
      <line x1="356" y1="408" x2="320" y2="312" stroke="var(--accent)" stroke-width="9" stroke-linecap="round" opacity=".9"/>
      <line x1="356" y1="408" x2="320" y2="312" stroke="#0b0d10" stroke-width="3" stroke-linecap="round" opacity=".35"/>
    </g>`;

  const frame = `
    <g fill="none" stroke="var(--frame)" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 672 246 L 612 332 L 470 360" stroke-width="14"/>
      <path d="M 610 334 L 560 394 L 444 424" stroke-width="12"/>
      <path d="M 360 422 L 470 360" stroke-width="10"/>
    </g>`;

  const engine = `
    <g>
      <rect x="430" y="336" width="182" height="112" rx="20" fill="var(--engine)"/>
      <rect x="452" y="310" width="132" height="46" rx="12" fill="var(--engine)"/>
      <g stroke="#0d0f13" stroke-width="3" opacity=".35" stroke-linecap="round">
        <line x1="458" y1="352" x2="574" y2="352"/>
        <line x1="458" y1="364" x2="574" y2="364"/>
        <line x1="458" y1="376" x2="574" y2="376"/>
      </g>
      <rect x="452" y="432" width="140" height="22" rx="10" fill="#272a30"/>
      <circle cx="584" cy="402" r="31" fill="#2b2f36" stroke="#14161a" stroke-width="3"/>
      <circle cx="584" cy="402" r="20" fill="#1d2025" opacity=".8"/>
      <circle cx="462" cy="420" r="12" fill="#1b1d22" opacity=".7"/>
    </g>`;

  const tail = sport
    ? `<path d="M 342 284 L 256 290 Q 214 292 210 310 L 224 332 L 346 326 Z" fill="var(--tail)" stroke="#0b0d10" stroke-width="2"/>
       <path d="M 210 308 L 232 306" stroke="#e0453a" stroke-width="9" stroke-linecap="round"/>`
    : `<path d="M 336 292 L 240 300 Q 200 304 198 322 L 210 346 L 340 340 Z" fill="var(--tail)" stroke="#0b0d10" stroke-width="2"/>
       <rect x="198" y="304" width="21" height="13" rx="4" fill="#e0453a"/>
       <path d="M 214 330 L 336 326" stroke="var(--accent)" stroke-width="3" opacity=".55"/>`;

  const tank = sport
    ? `<path d="M 406 322 L 412 288 L 466 248 L 578 236 L 620 252 L 640 288 L 642 310 L 612 334 L 458 344 Z" fill="var(--tank)" stroke="#0b0d10" stroke-width="3"/>
       <path d="M 424 290 L 480 258 L 566 248" stroke="#fff" stroke-width="6" opacity=".08" fill="none" stroke-linecap="round"/>`
    : `<path d="M 404 320 C 398 286 422 254 462 246 L 566 234 C 604 230 630 252 636 286 L 640 306 C 642 324 626 338 602 340 L 458 348 C 428 348 408 340 404 320 Z" fill="var(--tank)" stroke="#0b0d10" stroke-width="3"/>
       <path d="M 428 270 C 470 250 540 242 590 250" stroke="#fff" stroke-width="7" opacity=".1" fill="none" stroke-linecap="round"/>
       <ellipse cx="590" cy="252" rx="16" ry="6" fill="#0e1013" opacity=".55"/>`;

  const seat = sport
    ? `<path d="M 334 290 C 368 282 412 282 448 292 L 452 314 C 410 322 356 322 336 316 Z" fill="var(--seat)" stroke="#0b0d10" stroke-width="2"/>`
    : scram
      ? `<path d="M 210 298 L 446 294 L 452 320 L 214 324 Q 200 322 200 310 Z" fill="var(--seat)" stroke="#0b0d10" stroke-width="2"/>
         <path d="M 216 306 L 438 302" stroke="#fff" stroke-width="3" opacity=".08"/>`
      : `<path d="M 302 302 C 344 288 402 288 450 300 L 454 326 C 398 334 340 334 306 326 Z" fill="var(--seat)" stroke="#0b0d10" stroke-width="2"/>
         <path d="M 310 306 C 350 294 402 294 444 304" stroke="#fff" stroke-width="3" opacity=".07" fill="none"/>`;

  const fairing = sport
    ? `<g>
         <path d="M 640 306 C 632 262 650 226 688 212 L 748 198 C 786 216 808 272 804 334 L 782 372 L 722 364 C 676 354 650 334 640 306 Z" fill="var(--tank)" stroke="#0b0d10" stroke-width="3"/>
         <path d="M 664 300 C 690 270 730 246 776 240" stroke="var(--accent)" stroke-width="6" fill="none" opacity=".9" stroke-linecap="round"/>
         <path d="M 672 210 L 734 192 Q 772 212 774 244 L 708 226 Z" fill="var(--glass)" opacity=".7" stroke="#0d0f12" stroke-width="2"/>
         <ellipse cx="754" cy="300" rx="30" ry="14" transform="rotate(-22 754 300)" fill="#dce7f5" opacity=".9"/>
         <ellipse cx="754" cy="300" rx="30" ry="14" transform="rotate(-22 754 300)" fill="none" stroke="#0b0d10" stroke-width="2"/>
       </g>`
    : '';

  const fenderPath =
    fenderKind === 'high'
      ? `<path d="M 640 404 A 124 124 0 0 1 864 404" fill="none" stroke="var(--fender)" stroke-width="18" stroke-linecap="round"/>
         <line x1="700" y1="404" x2="690" y2="430" stroke="#2a2d33" stroke-width="5"/>`
      : `<path d="M 652 419 A 106 106 0 0 1 852 419" fill="none" stroke="var(--fender)" stroke-width="16" stroke-linecap="round"/>`;

  const headlight = sport
    ? ''
    : `<g>
         <circle cx="714" cy="252" r="35" fill="#14161a" stroke="var(--frame)" stroke-width="6"/>
         <circle cx="714" cy="252" r="25" fill="url(#lens)"/>
         <circle cx="714" cy="252" r="25" fill="none" stroke="#0b0d10" stroke-width="2" opacity=".4"/>
         ${scram ? `<path d="M 690 232 L 738 272 M 738 232 L 690 272" stroke="#2b2e35" stroke-width="3" opacity=".7"/>` : ''}
       </g>`;

  const bar = sport
    ? `<g stroke-linecap="round">
         <path d="M 706 258 L 660 268" stroke="var(--frame)" stroke-width="9"/>
         <path d="M 662 268 L 632 274" stroke="var(--accent)" stroke-width="13"/>
       </g>`
    : `<g stroke-linecap="round">
         <path d="M 682 238 L 636 214" stroke="var(--frame)" stroke-width="10"/>
         <path d="M 640 216 L 606 204" stroke="var(--accent)" stroke-width="14"/>
       </g>`;

  let mirrors = '';
  if (mirrorKind === 'stock') {
    mirrors = sport
      ? `<g><path d="M 772 236 L 792 214" stroke="var(--frame)" stroke-width="6" stroke-linecap="round"/>
           <ellipse cx="797" cy="208" rx="17" ry="8" transform="rotate(-22 797 208)" fill="var(--mirror)" stroke="#0b0d10" stroke-width="2"/></g>`
      : `<g><path d="M 660 224 L 650 182" stroke="var(--frame)" stroke-width="5" stroke-linecap="round"/>
           <ellipse cx="648" cy="174" rx="18" ry="8" transform="rotate(-14 648 174)" fill="var(--mirror)" stroke="#0b0d10" stroke-width="2"/></g>`;
  } else if (mirrorKind === 'barend') {
    mirrors = sport
      ? `<ellipse cx="630" cy="280" rx="7" ry="16" fill="var(--mirror)" stroke="#0b0d10" stroke-width="2"/>`
      : `<ellipse cx="602" cy="210" rx="8" ry="18" transform="rotate(20 602 210)" fill="var(--mirror)" stroke="#0b0d10" stroke-width="2"/>`;
  }

  let windscreen = '';
  if (windKind !== 'none') {
    const tall = windKind === 'touring';
    windscreen = sport
      ? tall
        ? `<path d="M 660 210 Q 700 158 772 186 L 768 232 L 690 216 Z" fill="var(--glass)" opacity=".62" stroke="#0d0f12" stroke-width="2"/>`
        : `<path d="M 676 204 Q 712 180 756 196 L 752 226 L 700 214 Z" fill="var(--glass)" opacity=".6" stroke="#0d0f12" stroke-width="2"/>`
      : tall
        ? `<path d="M 676 234 Q 706 186 762 206 L 756 250 Q 716 226 686 254 Z" fill="var(--glass)" opacity=".62" stroke="#0d0f12" stroke-width="2"/>`
        : `<path d="M 690 230 Q 716 202 752 216 L 748 238 Q 716 222 696 246 Z" fill="var(--glass)" opacity=".6" stroke="#0d0f12" stroke-width="2"/>`;
  }

  const vars = svgVars();

  return `
<svg class="bike-svg" xmlns="http://www.w3.org/2000/svg" viewBox="140 130 720 450" role="img" aria-label="${esc(model.name)} personalizzata">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="34%" r="78%">
      <stop offset="0%" stop-color="#2a3140"/>
      <stop offset="58%" stop-color="#15181e"/>
      <stop offset="100%" stop-color="#0b0c0f"/>
    </radialGradient>
    <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1b1712" stop-opacity="0"/>
      <stop offset="100%" stop-color="#241c14" stop-opacity=".75"/>
    </linearGradient>
    <radialGradient id="contact" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000" stop-opacity=".7"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f7fbff"/>
      <stop offset="55%" stop-color="#b9c6d6"/>
      <stop offset="100%" stop-color="#5c6878"/>
    </linearGradient>
  </defs>

  <style>${vars}</style>

  <rect x="140" y="130" width="720" height="450" fill="url(#bgGlow)"/>
  <rect x="140" y="480" width="720" height="100" fill="url(#floorFade)"/>
  <ellipse cx="500" cy="562" rx="330" ry="16" fill="url(#contact)"/>

  ${rearWheel}
  ${frontWheel}
  ${swingarm}
  ${fork}
  ${frame}
  ${engine}
  ${exhaustSVG(exhaustKind, style)}
  ${tail}
  ${tank}
  ${decalSVG(decalKind)}
  ${seat}
  ${fairing}
  ${fenderPath}
  ${bar}
  ${mirrors}
  ${headlight}
  ${windscreen}
</svg>`;
}

/* ------------------------------------------------------------
   Modalità foto: rendering SVG con maschere colore
   ------------------------------------------------------------ */

function hasPhoto() {
  return Boolean(PHOTO[st.model]);
}

function photoSrc() {
  const p = PHOTO[st.model];
  if (!p) return '';
  return st.photoSrc || p.src;
}

function calibFor(key) {
  const p = PHOTO[st.model];
  const z = p && p.zones[key];
  const out = {
    dx: 0,
    dy: 0,
    scale: 1,
    rot: 0,
    feather: z ? z.feather : 0,
    opacity: z ? z.opacity : 1,
  };
  const custom = st.calib && st.calib[key] ? st.calib[key] : {};
  for (const k of ['dx', 'dy', 'scale', 'rot', 'feather', 'opacity']) {
    if (Number.isFinite(Number(custom[k]))) out[k] = Number(custom[k]);
  }
  out.dx = clamp(out.dx, -140, 140);
  out.dy = clamp(out.dy, -140, 140);
  out.scale = clamp(out.scale, 0.5, 1.7);
  out.rot = clamp(out.rot, -25, 25);
  out.feather = clamp(out.feather, 0, 16);
  out.opacity = clamp(out.opacity, 0.3, 1);
  return out;
}

function photoTransform(cal, cx, cy) {
  const parts = [];
  if (cal.dx || cal.dy) parts.push(`translate(${cal.dx.toFixed(2)} ${cal.dy.toFixed(2)})`);
  if (cal.rot) parts.push(`rotate(${cal.rot.toFixed(2)} ${cx} ${cy})`);
  if (cal.scale !== 1) {
    parts.push(
      `translate(${cx} ${cy}) scale(${cal.scale.toFixed(3)}) translate(${-cx} ${-cy})`
    );
  }
  return parts.join(' ') || 'translate(0 0)';
}

function photoShape(z, colorRef) {
  if (z.ring) {
    const r = (z.ring.rOuter + z.ring.rInner) / 2;
    const width = z.ring.rOuter - z.ring.rInner;
    return `<circle cx="${z.ring.cx}" cy="${z.ring.cy}" r="${r}" fill="none" stroke="${colorRef}" stroke-width="${width}"/>`;
  }
  if (z.stroke) {
    return `<path d="${z.d}" fill="none" stroke="${colorRef}" stroke-width="${z.stroke}" stroke-linecap="round"/>`;
  }
  return `<path d="${z.d}" fill="${colorRef}"/>`;
}

function photoLayer(z, key, cal, colorRef) {
  const tf = photoTransform(cal, z.cx, z.cy);
  const filter = `url(#pf-${key})`;
  const shape = photoShape(z, colorRef);
  let out = `<g class="pzone" data-zone="${key}" mask="url(#photoAlpha)" style="mix-blend-mode:color" opacity="${cal.opacity}">
    <g transform="${tf}" filter="${filter}">${shape}</g>
  </g>`;
  if (z.tint) {
    out += `<g class="pzone-tint" mask="url(#photoAlpha)" style="mix-blend-mode:multiply" opacity="${z.tint}">
      <g transform="${tf}" filter="${filter}">${shape}</g>
    </g>`;
  }
  if (z.boost) {
    out += `<g class="pzone-boost" mask="url(#photoAlpha)" style="mix-blend-mode:screen" opacity="${z.boost}">
      <g transform="${tf}" filter="${filter}">${shape}</g>
    </g>`;
  }
  return out;
}

function photoDecalMarkup(decal) {
  if (decal === 'none') return '';
  const z = PHOTO[st.model].zones.tank;
  const cal = calibFor('tank');
  const tf = photoTransform(cal, z.cx, z.cy);
  let inner = '';

  if (decal === 'stripes') {
    inner = `
      <path d="M 286 308 C 340 285 396 268 462 258" fill="none" stroke="var(--accent)" stroke-width="11" opacity=".9" stroke-linecap="round"/>
      <path d="M 292 295 C 344 274 398 259 460 250" fill="none" stroke="var(--accent)" stroke-width="3" opacity=".6" stroke-linecap="round"/>`;
  } else if (decal === 'number') {
    inner = `
      <circle cx="392" cy="272" r="30" fill="var(--accent)" opacity=".95"/>
      <text x="392" y="285" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700" fill="#15171b">7</text>`;
  } else if (decal === 'camo') {
    inner = `
      <g fill="var(--accent)" opacity=".35">
        <ellipse cx="360" cy="278" rx="28" ry="15"/>
        <ellipse cx="410" cy="295" rx="22" ry="12"/>
        <ellipse cx="440" cy="266" rx="16" ry="19"/>
      </g>`;
  }

  return `<g class="pdecal" mask="url(#photoAlpha)" opacity=".95">
    <g transform="${tf}">
      <clipPath id="tankClip"><path d="${z.d}"/></clipPath>
      <g clip-path="url(#tankClip)">${inner}</g>
    </g>
  </g>`;
}

function photoGuidesMarkup() {
  if (!st.showMasks) return '';
  const p = PHOTO[st.model];
  return PHOTO_ORDER.map((key) => {
    const z = p.zones[key];
    const cal = calibFor(key);
    const tf = photoTransform(cal, z.cx, z.cy);
    const outline = z.ring
      ? `<circle cx="${z.ring.cx}" cy="${z.ring.cy}" r="${(z.ring.rOuter + z.ring.rInner) / 2}" fill="none" stroke="#ff8a4d" stroke-width="1.6" stroke-dasharray="7 5"/>`
      : `<path d="${z.d}" fill="none" stroke="#ff8a4d" stroke-width="1.6" stroke-dasharray="7 5"/>`;
    const lx = z.cx + cal.dx;
    const ly = z.cy + cal.dy;
    return `<g class="pguide" pointer-events="none">
      <g transform="${tf}">${outline}</g>
      <circle cx="${lx}" cy="${ly}" r="3" fill="#ff8a4d"/>
      <text x="${lx}" y="${ly - 8}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" fill="#ffb08a" stroke="#12141a" stroke-width="3" paint-order="stroke">${esc(z.label)}</text>
    </g>`;
  }).join('');
}

function photoMarkup() {
  const p = PHOTO[st.model];
  const src = photoSrc();
  const decalId = selectedId('decal');
  const decal = ['stripes', 'number', 'camo'].includes(decalId) ? decalId : 'none';

  const filters = PHOTO_ORDER.map((key) => {
    const cal = calibFor(key);
    return `<filter id="pf-${key}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${cal.feather.toFixed(1)}"/>
    </filter>`;
  }).join('');

  const zones = PHOTO_ORDER.map((key) =>
    photoLayer(p.zones[key], key, calibFor(key), `var(--${p.zones[key].color})`)
  ).join('');

  return `
<svg class="bike-svg photo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 705 600" role="img" aria-label="${esc(MODELS[st.model].name)} in modalità foto">
  <defs>
    ${filters}
    <mask id="photoAlpha" maskUnits="userSpaceOnUse" x="0" y="0" width="705" height="600" mask-type="alpha" style="mask-type:alpha">
      <image href="${esc(src)}" x="0" y="0" width="705" height="600" preserveAspectRatio="none"/>
    </mask>
  </defs>
  <style>${svgVars()}</style>

  <image class="photo-base" href="${esc(src)}" x="0" y="0" width="705" height="600" preserveAspectRatio="none"/>
  ${zones}
  ${photoDecalMarkup(decal)}
  ${photoGuidesMarkup()}
</svg>`;
}

/* ------------------------------------------------------------
   Rendering UI
   ------------------------------------------------------------ */

function renderBike() {
  const box = $('#bike');
  if (!box) return;
  const photo = Boolean(st.photo && hasPhoto());
  box.classList.toggle('photo', photo);
  box.innerHTML = photo ? photoMarkup() : bikeMarkup();
}

function refreshColors() {
  const styleEl = $('#bike svg style');
  if (styleEl) styleEl.textContent = svgVars();
}

function renderModelCards() {
  const box = $('#model-list');
  box.innerHTML = Object.values(MODELS)
    .map(
      (m) => `
      <button type="button" class="model-card ${st.model === m.key ? 'active' : ''}" data-model="${m.key}" aria-pressed="${st.model === m.key}">
        <span>
          <span class="m-name">${esc(m.name)}${PHOTO[m.key] ? '<span class="m-photo">FOTO</span>' : ''}</span>
          <span class="m-spec">${esc(m.spec)}</span>
        </span>
        <span class="m-price">${euro(m.base)}</span>
      </button>`
    )
    .join('');
}

function renderThemeCards() {
  const box = $('#theme-list');
  box.innerHTML = Object.entries(THEMES)
    .map(
      ([key, t]) => `
      <button type="button" class="theme-card ${st.theme === key ? 'active' : ''}" data-theme="${key}" aria-pressed="${st.theme === key}">
        <span class="dots" aria-hidden="true">${t.swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</span>
        <span class="t-name">${esc(t.name)}</span>
      </button>`
    )
    .join('');
}

function renderParts() {
  const box = $('#part-groups');
  if (!box) return;

  box.innerHTML = CATEGORIES.map((cat) => {
    const custom = st.custom.filter((p) => p.cat === cat.key);
    const items = [...PARTS[cat.key].items, ...custom];

    const chips = items
      .map((p) => {
        const active = st.chosen[cat.key] === p.id && !st.compare;
        const price = p.price ? `+ ${euro(p.price)}` : p.id === 'stock' || p.id === 'none' ? 'incluso' : '—';
        const dot = p.color ? `<span class="dot" style="background:${esc(p.color)}"></span>` : '';
        const star = p.custom ? '<span class="star" aria-hidden="true">★</span>' : '';
        return `<button type="button" class="chip ${active ? 'active' : ''}" data-cat="${cat.key}" data-id="${esc(p.id)}" title="${esc(p.meta || p.name)}">
          ${dot}${star}${esc(p.name)}<span class="price">${price}</span>
        </button>`;
      })
      .join('');

    const selected = findPart(cat.key, st.chosen[cat.key]);

    return `
      <div class="part-group">
        <div class="part-group-head">
          <span class="pg-label">${cat.label}</span>
          <span class="pg-now">${esc(selected ? selected.name : 'Di serie')}</span>
        </div>
        <div class="chips">${chips}</div>
        ${selected && selected.meta ? `<p class="part-note">${esc(selected.meta)}</p>` : ''}
      </div>`;
  }).join('');
}

function renderColors() {
  const box = $('#color-list');
  if (!box) return;
  const c = effectiveColors();
  const rows = [
    ['tank', 'Serbatoio'],
    ['tail', 'Codino'],
    ['seat', 'Sella'],
    ['rim', 'Cerchi'],
    ['frame', 'Telaio'],
    ['exhaust', 'Scarico'],
    ['accent', 'Dettagli'],
    ['glass', 'Cupolino'],
  ];

  box.innerHTML = rows
    .map(
      ([key, label]) => `
      <label class="color-row">
        <span>${label}</span>
        <input type="color" data-color="${key}" value="${c[key]}" aria-label="Colore ${label}">
      </label>`
    )
    .join('');
}

function renderStage() {
  const model = MODELS[st.model];
  const photoOn = Boolean(st.photo && hasPhoto());
  $('#stage-title').textContent = model.name;
  const bits = [model.spec];
  if (photoOn) bits.push('modalità foto');
  if (st.compare) bits.push('anteprima originale');
  $('#stage-sub').textContent = bits.join(' · ');
  $('#stage-price').textContent = euro(totalPrice());
  $('#btn-compare').classList.toggle('active', st.compare);
  $('#btn-compare').setAttribute('aria-pressed', String(st.compare));
  const hint = $('#stage-hint');
  if (hint) {
    hint.textContent = photoOn
      ? 'Foto ufficiale del modello: i colori cambiano in tempo reale. Le forme delle parti restano quelle della foto.'
      : "Seleziona le parti a sinistra: l'anteprima si aggiorna in tempo reale.";
  }
}

function photoZones() {
  const p = PHOTO[st.model];
  return p ? PHOTO_ORDER.filter((key) => p.zones[key]) : [];
}

function syncCalibControls() {
  const select = $('#calib-zone');
  if (!select || !hasPhoto()) return;
  const keys = photoZones();
  if (!keys.length) return;
  const key = keys.includes(select.value) ? select.value : keys[0];
  select.value = key;
  const cal = calibFor(key);
  const set = (id, value, text) => {
    const el = $(id);
    if (el) el.value = String(value);
    const lab = $(id + '-val');
    if (lab) lab.textContent = text;
  };
  set('#calib-x', cal.dx, Math.round(cal.dx) + ' px');
  set('#calib-y', cal.dy, Math.round(cal.dy) + ' px');
  set('#calib-scale', cal.scale, '× ' + cal.scale.toFixed(2));
  set('#calib-rot', cal.rot, cal.rot.toFixed(1) + '°');
  set('#calib-feather', cal.feather, cal.feather.toFixed(1) + ' px');
  set('#calib-opacity', cal.opacity, Math.round(cal.opacity * 100) + '%');
}

function renderPhotoUI() {
  const available = hasPhoto();
  const on = Boolean(st.photo && available);
  const photoBtn = $('#view-photo');
  const vectorBtn = $('#view-vector');
  if (photoBtn) {
    photoBtn.disabled = !available;
    photoBtn.classList.toggle('active', on);
    photoBtn.setAttribute('aria-pressed', String(on));
    photoBtn.title = available ? 'Anteprima fotografica' : 'Disponibile con Benelli Leoncino 250';
  }
  if (vectorBtn) {
    vectorBtn.classList.toggle('active', !on);
    vectorBtn.setAttribute('aria-pressed', String(!on));
  }
  const block = $('#photo-block');
  if (block) block.hidden = !on;
  if (!on) return;

  const select = $('#calib-zone');
  const keys = photoZones();
  if (select) {
    if (select.options.length !== keys.length) {
      select.innerHTML = keys
        .map((key) => `<option value="${key}">${esc(PHOTO[st.model].zones[key].label)}</option>`)
        .join('');
    }
  }

  const credit = $('#photo-credit');
  if (credit) {
    credit.textContent = st.photoSrc
      ? 'Foto caricata da te: resta solo su questo dispositivo.'
      : PHOTO[st.model].credit;
  }
  const resetPhoto = $('#photo-reset-src');
  if (resetPhoto) resetPhoto.hidden = !st.photoSrc;

  syncCalibControls();
}

function renderChips() {
  const box = $('#active-chips');
  const active = CATEGORIES.filter((cat) => {
    const part = findPart(cat.key, st.chosen[cat.key]);
    return part && part.price > 0;
  });

  if (!active.length) {
    box.innerHTML = '<span class="chip">Configurazione di serie</span>';
    return;
  }

  box.innerHTML = active
    .map((cat) => {
      const part = findPart(cat.key, st.chosen[cat.key]);
      return `<span class="chip">${esc(cat.label)} · <b>${esc(part.name)}</b></span>`;
    })
    .join('');
}

function renderCart() {
  const box = $('#cart');
  const model = MODELS[st.model];
  const rows = [
    `<div class="cart-row base">
      <div class="cr-main">
        <span class="cr-name">${esc(model.name)}</span>
        <span class="cr-cat">Moto di serie</span>
      </div>
      <div class="cr-price">${euro(model.base)}</div>
    </div>`,
  ];

  for (const cat of CATEGORIES) {
    const part = findPart(cat.key, st.chosen[cat.key]);
    if (!part) continue;
    if (part.id === STOCK[cat.key] && !part.custom) continue;
    if (!part.price && !part.custom) continue;

    const link = part.url
      ? `<a class="cr-link" href="${esc(part.url)}" target="_blank" rel="noopener noreferrer">${esc(part.site || 'negozio')} ↗</a>`
      : '';
    const price = part.price ? euro(part.price) : '—';

    rows.push(`
      <div class="cart-row">
        <div class="cr-main">
          <span class="cr-name" title="${esc(part.name)}">${esc(part.name)}</span>
          <span class="cr-cat">${esc(cat.label)}${link ? ' · ' + link : ''}</span>
        </div>
        <div class="cr-price">${price}</div>
        <button type="button" class="cr-x" data-revert="${cat.key}" title="Rimuovi ${esc(cat.label)}" aria-label="Rimuovi ${esc(cat.label)}">×</button>
      </div>`);
  }

  box.innerHTML = rows.join('');
  $('#total').textContent = euro(totalPrice());
}

function renderAll() {
  renderModelCards();
  renderThemeCards();
  renderParts();
  renderColors();
  renderCart();
  renderStage();
  renderPhotoUI();
  renderChips();
  renderBike();
}

/* ------------------------------------------------------------
   Azioni
   ------------------------------------------------------------ */

let toastTimer = null;
function toast(message, isError) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.toggle('error', Boolean(isError));
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function setModel(key) {
  if (!MODELS[key]) return;
  st.model = key;
  st.colors = {};
  st.photo = Boolean(PHOTO[key]);
  st.showMasks = false;
  renderAll();
  persist();
}

function setPhotoMode(mode) {
  if (mode === 'photo' && !hasPhoto()) {
    toast('La modalità foto è disponibile con Benelli Leoncino 250', true);
    return;
  }
  st.photo = mode === 'photo';
  st.showMasks = false;
  renderAll();
  persist();
}

function updateCalib() {
  if (!hasPhoto()) return;
  const key = $('#calib-zone').value;
  if (!PHOTO[st.model].zones[key]) return;
  const num = (id) => Number($(id).value);
  st.calib[key] = {
    dx: clamp(num('#calib-x'), -140, 140),
    dy: clamp(num('#calib-y'), -140, 140),
    scale: clamp(num('#calib-scale'), 0.5, 1.7),
    rot: clamp(num('#calib-rot'), -25, 25),
    feather: clamp(num('#calib-feather'), 0, 16),
    opacity: clamp(num('#calib-opacity'), 0.3, 1),
  };
  const set = (id, text) => {
    const lab = $(id + '-val');
    if (lab) lab.textContent = text;
  };
  set('#calib-x', Math.round(st.calib[key].dx) + ' px');
  set('#calib-y', Math.round(st.calib[key].dy) + ' px');
  set('#calib-scale', '× ' + st.calib[key].scale.toFixed(2));
  set('#calib-rot', st.calib[key].rot.toFixed(1) + '°');
  set('#calib-feather', st.calib[key].feather.toFixed(1) + ' px');
  set('#calib-opacity', Math.round(st.calib[key].opacity * 100) + '%');
  renderBike();
  persist();
}

function resetCalib(all) {
  if (all) {
    st.calib = {};
  } else {
    const key = $('#calib-zone').value;
    if (key) delete st.calib[key];
  }
  syncCalibControls();
  renderBike();
  persist();
  toast(all ? 'Calibrazione azzerata' : 'Area riportata ai valori iniziali');
}

function normalizePhotoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) {
      reject(new Error('Il file non è un’immagine'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const W = 1200;
        const H = 1021;
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0f1115';
        ctx.fillRect(0, 0, W, H);
        const ratio = Math.min(W / img.width, H / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Immagine non leggibile'));
    };
    img.src = url;
  });
}

async function handlePhotoFile(file) {
  if (!file) return;
  try {
    const dataUrl = await normalizePhotoFile(file);
    st.photoSrc = dataUrl;
    st.calib = {};
    st.photo = true;
    st.showMasks = true;
    renderAll();
    persist();
    toast('Foto caricata: regola le aree con la calibrazione');
  } catch (err) {
    toast('Caricamento non riuscito: ' + err.message, true);
  }
}

function setTheme(key) {
  if (!THEMES[key]) return;
  st.theme = key;
  st.colors = {};
  if (THEMES[key].decal) st.chosen.decal = THEMES[key].decal;
  renderAll();
  persist();
}

function choosePart(cat, id) {
  if (!PARTS[cat]) return;
  st.chosen[cat] = id;
  renderParts();
  renderBike();
  renderCart();
  renderStage();
  renderChips();
  persist();
}

function revertPart(cat) {
  st.chosen[cat] = STOCK[cat];
  renderParts();
  renderBike();
  renderCart();
  renderStage();
  renderChips();
  persist();
}

/* ------------------------------------------------------------
   Export PNG
   ------------------------------------------------------------ */

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('immagine non renderizzabile'));
    img.src = url;
  });
}

function applyPhotoTransform(ctx, cal, cx, cy) {
  ctx.translate(cal.dx, cal.dy);
  ctx.translate(cx, cy);
  if (cal.rot) ctx.rotate((cal.rot * Math.PI) / 180);
  ctx.scale(cal.scale, cal.scale);
  ctx.translate(-cx, -cy);
}

function drawPhotoShape(ctx, z, color) {
  if (z.ring) {
    const r = (z.ring.rOuter + z.ring.rInner) / 2;
    ctx.beginPath();
    ctx.arc(z.ring.cx, z.ring.cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = z.ring.rOuter - z.ring.rInner;
    ctx.stroke();
    return;
  }
  const path = new Path2D(z.d);
  if (z.stroke) {
    ctx.strokeStyle = color;
    ctx.lineWidth = z.stroke;
    ctx.lineCap = 'round';
    ctx.stroke(path);
  } else {
    ctx.fillStyle = color;
    ctx.fill(path);
  }
}

async function exportPhotoPNG() {
  const p = PHOTO[st.model];
  const src = photoSrc();
  if (!p || !src) return;

  const W = 1440;
  const H = 1226;
  const k = W / p.width;
  const c = effectiveColors();
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createRadialGradient(W * 0.5, H * 0.34, 20, W * 0.5, H * 0.34, W * 0.8);
  bg.addColorStop(0, '#2a3140');
  bg.addColorStop(0.58, '#15181e');
  bg.addColorStop(1, '#0b0c0f');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.drawImage(img, 0, 0, W, H);

  const layer = document.createElement('canvas');
  layer.width = W;
  layer.height = H;
  const lctx = layer.getContext('2d');

  const drawLayer = (z, cal, color, blend, opacity) => {
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.clearRect(0, 0, W, H);
    lctx.setTransform(k, 0, 0, k, 0, 0);
    lctx.globalCompositeOperation = 'source-over';
    lctx.globalAlpha = 1;
    lctx.filter = cal.feather > 0 ? `blur(${(cal.feather * k).toFixed(2)}px)` : 'none';
    applyPhotoTransform(lctx, cal, z.cx, z.cy);
    drawPhotoShape(lctx, z, color);
    lctx.filter = 'none';
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalCompositeOperation = 'destination-in';
    lctx.drawImage(img, 0, 0, W, H);
    lctx.globalCompositeOperation = 'source-over';

    ctx.globalCompositeOperation = blend;
    ctx.globalAlpha = opacity;
    ctx.drawImage(layer, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  for (const key of PHOTO_ORDER) {
    const z = p.zones[key];
    const cal = calibFor(key);
    drawLayer(z, cal, c[z.color], 'color', cal.opacity);
    if (z.tint) drawLayer(z, cal, c[z.color], 'multiply', z.tint);
    if (z.boost) drawLayer(z, cal, c[z.color], 'screen', z.boost);
  }

  const decalId = selectedId('decal');
  const decal = ['stripes', 'number', 'camo'].includes(decalId) ? decalId : 'none';
  if (decal !== 'none') {
    const z = p.zones.tank;
    const cal = calibFor('tank');
    ctx.save();
    ctx.setTransform(k, 0, 0, k, 0, 0);
    applyPhotoTransform(ctx, cal, z.cx, z.cy);
    ctx.clip(new Path2D(z.d));
    if (decal === 'stripes') {
      ctx.strokeStyle = c.accent;
      ctx.lineCap = 'round';
      ctx.lineWidth = 11;
      ctx.globalAlpha = 0.9;
      ctx.stroke(new Path2D('M 286 308 C 340 285 396 268 462 258'));
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.stroke(new Path2D('M 292 295 C 344 274 398 259 460 250'));
    } else if (decal === 'number') {
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = c.accent;
      ctx.beginPath();
      ctx.arc(392, 272, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#15171b';
      ctx.font = '700 36px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('7', 392, 275);
    } else if (decal === 'camo') {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = c.accent;
      for (const [x, y, rx, ry] of [[360, 278, 28, 15], [410, 295, 22, 12], [440, 266, 16, 19]]) {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!png) throw new Error('conversione fallita');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(png);
  a.download = 'motolab-' + st.model + '-foto.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  toast('Anteprima fotografica esportata in PNG');
}

async function exportPNG() {
  if (st.photo && hasPhoto()) {
    try {
      await exportPhotoPNG();
    } catch (err) {
      toast('Export non riuscito: ' + err.message, true);
    }
    return;
  }

  const svg = $('#bike svg');
  if (!svg) return;

  const clone = svg.cloneNode(true);
  clone.setAttribute('width', '1440');
  clone.setAttribute('height', '900');

  const xml = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = 1440;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const png = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!png) throw new Error('conversione fallita');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(png);
    a.download = 'motolab-' + st.model + '.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
    toast('Anteprima esportata in PNG');
  } catch (err) {
    toast('Export non riuscito: ' + err.message, true);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ------------------------------------------------------------
   Import da link negozio
   ------------------------------------------------------------ */

function nameFromUrl(url) {
  try {
    const u = new URL(url);
    const seg = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
    return decodeURIComponent(seg)
      .replace(/\.[a-z0-9]{2,5}$/i, '')
      .replace(/[-_+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 90) || u.hostname;
  } catch (err) {
    return 'Parte importata';
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (err) {
    return 'negozio';
  }
}

function renderImportCard(data, url, cat, warning) {
  const image = data.image ? esc(data.image) : '';
  const site = data.site ? esc(data.site) : hostOf(url);
  const title = data.title ? esc(data.title) : nameFromUrl(url);
  const price = Number.isFinite(Number(data.price)) ? Math.round(Number(data.price)) : 0;

  $('#import-result').innerHTML = `
    <div class="import-card">
      <div class="ic-top">
        ${image ? `<img src="${image}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
        <div>
          <div class="ic-title">${title}</div>
          <div class="ic-site">${site} · ${esc(url)}</div>
        </div>
      </div>
      <div class="ic-fields">
        <label class="full">Nome <input type="text" id="imp-name" value="${title}" maxlength="90"></label>
        <label>Prezzo € <input type="number" id="imp-price" min="0" step="1" value="${price}"></label>
        <label>Colore <span class="ic-color-wrap"><input type="color" id="imp-color" value="${DEFAULT_TINT[cat] || '#8892a0'}"></span></label>
        <label class="full">Categoria
          <select id="imp-cat">
            ${CATEGORIES.map((c) => `<option value="${c.key}" ${c.key === cat ? 'selected' : ''}>${c.label}</option>`).join('')}
          </select>
        </label>
      </div>
      <button type="button" class="btn primary" id="imp-add">Aggiungi alla moto</button>
      ${warning ? `<p class="import-warn">${warning}</p>` : ''}
    </div>`;

  $('#imp-add').addEventListener('click', () => {
    const name = ($('#imp-name').value || '').trim() || nameFromUrl(url);
    const value = clamp(parseFloat($('#imp-price').value) || 0, 0, 99999);
    const color = $('#imp-color').value || DEFAULT_TINT[cat] || '#8892a0';
    const chosenCat = $('#imp-cat').value;

    const part = {
      id: 'c' + Date.now().toString(36),
      cat: chosenCat,
      name,
      price: value,
      color,
      url,
      site: hostOf(url),
      image: data.image || '',
      custom: true,
    };

    st.custom.push(part);
    st.chosen[chosenCat] = part.id;
    renderAll();
    persist();
    $('#import-result').innerHTML = `<p class="small" style="margin-top:10px;color:var(--ok)">Aggiunta: <b>${esc(name)}</b> · ${euro(value)}</p>`;
    toast('Parte aggiunta e applicata alla moto');
  });
}

async function handleImport(event) {
  event.preventDefault();
  const input = $('#import-url');
  const url = input.value.trim();
  const cat = $('#import-cat').value;
  if (!/^https?:\/\//i.test(url)) {
    toast('Inserisci un link http:// o https:// valido', true);
    return;
  }

  $('#import-result').innerHTML = '<p class="small muted" style="margin-top:10px">Lettura del prodotto…</p>';

  try {
    const res = await fetch('/api/preview?url=' + encodeURIComponent(url), {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderImportCard(data, url, cat, '');
  } catch (err) {
    const warning =
      'Non riesco a leggere la pagina (' +
      esc(err.message) +
      '). Puoi inserire i dati a mano. Per l\u2019import automatico avvia il server locale con <code>python3 server.py</code>.';
    renderImportCard({ title: nameFromUrl(url), price: 0, image: '', site: hostOf(url) }, url, cat, warning);
  }
}

/* ------------------------------------------------------------
   Eventi
   ------------------------------------------------------------ */

function wireEvents() {
  $('#model-list').addEventListener('click', (e) => {
    const card = e.target.closest('[data-model]');
    if (card) setModel(card.dataset.model);
  });

  $('#theme-list').addEventListener('click', (e) => {
    const card = e.target.closest('[data-theme]');
    if (card) setTheme(card.dataset.theme);
  });

  $('#part-groups').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cat][data-id]');
    if (chip) choosePart(chip.dataset.cat, chip.dataset.id);
  });

  $('#color-list').addEventListener('input', (e) => {
    const input = e.target.closest('[data-color]');
    if (!input) return;
    st.colors[input.dataset.color] = input.value;
    refreshColors();
    persist();
  });

  $('#cart').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-revert]');
    if (btn) revertPart(btn.dataset.revert);
  });

  const viewToggle = $('#view-toggle');
  if (viewToggle) {
    viewToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view]');
      if (btn) setPhotoMode(btn.dataset.view);
    });
  }

  const calibSelect = $('#calib-zone');
  if (calibSelect) {
    calibSelect.addEventListener('change', () => {
      syncCalibControls();
      renderBike();
    });
  }

  for (const id of ['#calib-x', '#calib-y', '#calib-scale', '#calib-rot', '#calib-feather', '#calib-opacity']) {
    const el = $(id);
    if (el) el.addEventListener('input', updateCalib);
  }

  const showMasks = $('#calib-show');
  if (showMasks) {
    showMasks.addEventListener('change', () => {
      st.showMasks = showMasks.checked;
      renderBike();
    });
  }

  const resetOne = $('#calib-reset');
  if (resetOne) resetOne.addEventListener('click', () => resetCalib(false));
  const resetAll = $('#calib-reset-all');
  if (resetAll) resetAll.addEventListener('click', () => resetCalib(true));

  const photoFile = $('#photo-file');
  if (photoFile) {
    photoFile.addEventListener('change', () => {
      handlePhotoFile(photoFile.files && photoFile.files[0]);
      photoFile.value = '';
    });
  }

  const resetSrc = $('#photo-reset-src');
  if (resetSrc) {
    resetSrc.addEventListener('click', () => {
      st.photoSrc = '';
      st.calib = {};
      st.showMasks = false;
      renderAll();
      persist();
      toast('Ripristinata la foto ufficiale del modello');
    });
  }

  $('#btn-compare').addEventListener('click', () => {
    st.compare = !st.compare;
    renderBike();
    renderStage();
    renderParts();
  });

  $('#btn-save').addEventListener('click', () => {
    persist();
    toast('Configurazione salvata su questo dispositivo');
  });

  $('#btn-png').addEventListener('click', exportPNG);

  $('#btn-reset').addEventListener('click', () => {
    if (!confirm('Azzerare la configurazione e ripartire dalla moto di serie?')) return;
    const model = st.model;
    st = blankState(model);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      /* ignora */
    }
    renderAll();
    persist();
    toast('Configurazione azzerata');
  });

  $('#btn-links').addEventListener('click', () => {
    const links = CATEGORIES.map((cat) => findPart(cat.key, st.chosen[cat.key]))
      .filter((p) => p && p.url);
    const unique = [...new Set(links.map((p) => p.url))];
    if (!unique.length) {
      toast('Nessun link: seleziona almeno una parte acquistabile', true);
      return;
    }
    unique.forEach((u) => window.open(u, '_blank', 'noopener'));
    toast('Apro ' + unique.length + (unique.length === 1 ? ' link' : ' link') + ' in nuove schede');
  });

  $('#import-form').addEventListener('submit', handleImport);
}

/* ------------------------------------------------------------
   Avvio
   ------------------------------------------------------------ */

function init() {
  const saved = loadState();
  if (saved) st = saved;

  // popola il selettore categorie dell'import
  $('#import-cat').innerHTML = CATEGORIES.map(
    (c) => `<option value="${c.key}">${c.label}</option>`
  ).join('');

  wireEvents();
  renderAll();
  persist();
}

document.addEventListener('DOMContentLoaded', init);
