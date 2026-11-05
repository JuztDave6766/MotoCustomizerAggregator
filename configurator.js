/* MotoLab — dominio del configuratore.
   Funzioni pure, senza DOM: usate dal browser e dai test Node. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MotoLab = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MODELS = [
    {
      id: "roadster-700",
      name: "Roadster 700",
      type: "Naked",
      cc: 689,
      price: 7990,
      power: 75,
      weight: 166,
    },
    {
      id: "scrambler-800",
      name: "Scrambler 800",
      type: "Scrambler",
      cc: 803,
      price: 8890,
      power: 70,
      weight: 189,
    },
    {
      id: "sport-900",
      name: "Sport 900",
      type: "Sport",
      cc: 899,
      price: 9990,
      power: 95,
      weight: 178,
    },
  ];

  const THEMES = [
    {
      id: "nero-corsa",
      name: "Nero Corsa",
      dots: ["#0e0f11", "#1c1e21", "#ff6a1a"],
      colors: { tank: "#ff6a1a", frame: "#1c1e21", details: "#f2f1ee" },
    },
    {
      id: "grafite",
      name: "Grafite",
      dots: ["#5c6470", "#8a9099", "#c9cdd3"],
      colors: { tank: "#5c6470", frame: "#8a9099", details: "#c9cdd3" },
    },
    {
      id: "rosso-fuoco",
      name: "Rosso Fuoco",
      dots: ["#ff6a1a", "#e5484d", "#ffb547"],
      colors: { tank: "#e5484d", frame: "#ff6a1a", details: "#ffb547" },
    },
    {
      id: "ghiaccio",
      name: "Ghiaccio",
      dots: ["#c9cdd3", "#f2f1ee", "#17191c"],
      colors: { tank: "#c9cdd3", frame: "#f2f1ee", details: "#17191c" },
    },
  ];

  const PART_GROUPS = [
    {
      id: "scarico",
      label: "Scarico",
      options: [
        { id: "standard", name: "Standard", price: 0 },
        { id: "sport", name: "Sport", price: 390 },
        { id: "titanio", name: "Titanio", price: 690 },
      ],
    },
    {
      id: "sella",
      label: "Sella",
      options: [
        { id: "comfort", name: "Comfort", price: 180 },
        { id: "racing", name: "Racing", price: 250 },
      ],
    },
    {
      id: "cerchi",
      label: "Cerchi",
      options: [
        { id: "neri", name: "Neri", price: 240 },
        { id: "forgiati", name: "Forgiati", price: 420 },
      ],
    },
    {
      id: "accessori",
      label: "Accessori",
      options: [
        { id: "paramotore", name: "Paramotore", price: 160 },
        { id: "cupolino", name: "Cupolino", price: 120 },
        { id: "manopole", name: "Manopole riscaldate", price: 210 },
      ],
    },
  ];

  const COLOR_LABELS = {
    tank: "Serbatoio",
    frame: "Telaio",
    details: "Dettagli",
  };

  const DEFAULT_COLORS = {
    tank: "#ff6a1a",
    frame: "#5c6470",
    details: "#f2f1ee",
  };

  const DEFAULT_PARTS = {
    scarico: "sport",
    sella: "comfort",
    cerchi: "forgiati",
    accessori: "paramotore",
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createState(overrides) {
    const base = {
      modelId: "roadster-700",
      themeId: "nero-corsa",
      parts: clone(DEFAULT_PARTS),
      colors: clone(DEFAULT_COLORS),
      imports: [],
    };
    if (!overrides) return base;
    return {
      ...base,
      ...overrides,
      parts: { ...base.parts, ...(overrides.parts || {}) },
      colors: { ...base.colors, ...(overrides.colors || {}) },
      imports: Array.isArray(overrides.imports) ? overrides.imports.slice() : base.imports,
    };
  }

  function getModel(state) {
    return MODELS.find((model) => model.id === state.modelId) || MODELS[0];
  }

  function getTheme(state) {
    return THEMES.find((theme) => theme.id === state.themeId) || null;
  }

  function getGroup(groupId) {
    return PART_GROUPS.find((group) => group.id === groupId) || null;
  }

  function getOption(groupId, optionId) {
    const group = getGroup(groupId);
    if (!group) return null;
    return group.options.find((option) => option.id === optionId) || null;
  }

  function partPrice(state) {
    let sum = 0;
    for (const group of PART_GROUPS) {
      const option = getOption(group.id, state.parts[group.id]);
      if (option) sum += option.price;
    }
    return sum;
  }

  function importsPrice(state) {
    return (state.imports || []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  }

  function priceBreakdown(state) {
    const base = getModel(state).price;
    const optional = partPrice(state);
    const imports = importsPrice(state);
    return { base, optional, imports, total: base + optional + imports };
  }

  function optionalCount(state) {
    const parts = PART_GROUPS.filter((group) => Boolean(state.parts[group.id])).length;
    return parts + (state.imports || []).length;
  }

  function cartItems(state) {
    const model = getModel(state);
    const theme = getTheme(state);
    const items = [
      {
        id: `base:${model.id}`,
        kind: "base",
        title: model.name,
        subtitle: `Modello base · ${theme ? theme.name : "Personalizzato"}`,
        price: model.price,
        removable: false,
      },
    ];

    for (const group of PART_GROUPS) {
      const option = getOption(group.id, state.parts[group.id]);
      if (!option) continue;
      items.push({
        id: `part:${group.id}`,
        kind: "part",
        title: `${group.label} ${option.name}`,
        subtitle: `Parti · ${group.label}`,
        price: option.price,
        removable: true,
      });
    }

    for (const item of state.imports || []) {
      items.push({
        id: `import:${item.id}`,
        kind: "import",
        title: item.title || "Parte importata",
        subtitle: item.site ? `Importata · ${item.site}` : "Importata da un negozio",
        price: Number(item.price) || 0,
        url: item.url || "",
        image: item.image || "",
        category: item.category || "Accessori",
        removable: true,
      });
    }

    return items;
  }

  function withState(state, patch) {
    return { ...state, ...patch };
  }

  function setModel(state, modelId) {
    if (!MODELS.some((model) => model.id === modelId)) return state;
    return withState(state, { modelId });
  }

  function setTheme(state, themeId) {
    const theme = THEMES.find((item) => item.id === themeId);
    if (!theme) return state;
    return withState(state, { themeId, colors: clone(theme.colors) });
  }

  function setPart(state, groupId, optionId) {
    const group = getGroup(groupId);
    if (!group) return state;
    if (optionId !== null && !getOption(groupId, optionId)) return state;
    return withState(state, { parts: { ...state.parts, [groupId]: optionId } });
  }

  function setColor(state, key, value) {
    if (!Object.prototype.hasOwnProperty.call(COLOR_LABELS, key)) return state;
    if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) return state;
    return withState(state, { themeId: null, colors: { ...state.colors, [key]: value } });
  }

  function addImport(state, item) {
    if (!item || !item.id || !item.title) return state;
    const price = Number(item.price);
    const normalized = {
      id: String(item.id),
      title: String(item.title).slice(0, 160),
      category: item.category || "Accessori",
      price: Number.isFinite(price) && price >= 0 ? price : 0,
      site: item.site || "",
      url: item.url || "",
      image: item.image || "",
    };
    return withState(state, { imports: [...(state.imports || []), normalized] });
  }

  function removeCartItem(state, itemId) {
    if (typeof itemId !== "string") return state;
    if (itemId.startsWith("part:")) {
      return setPart(state, itemId.slice(5), null);
    }
    if (itemId.startsWith("import:")) {
      const id = itemId.slice(7);
      return withState(state, {
        imports: (state.imports || []).filter((item) => String(item.id) !== id),
      });
    }
    return state;
  }

  function resetState() {
    return createState();
  }

  function formatEUR(value) {
    const amount = String(Math.round(Number(value) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return "€ " + amount;
  }

  return {
    MODELS,
    THEMES,
    PART_GROUPS,
    COLOR_LABELS,
    DEFAULT_COLORS,
    createState,
    getModel,
    getTheme,
    getGroup,
    getOption,
    priceBreakdown,
    optionalCount,
    cartItems,
    setModel,
    setTheme,
    setPart,
    setColor,
    addImport,
    removeCartItem,
    resetState,
    formatEUR,
  };
});
