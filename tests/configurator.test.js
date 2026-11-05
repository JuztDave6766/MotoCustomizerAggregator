const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MODELS,
  THEMES,
  PART_GROUPS,
  createState,
  priceBreakdown,
  cartItems,
  optionalCount,
  setModel,
  setTheme,
  setPart,
  setColor,
  addImport,
  removeCartItem,
  resetState,
  formatEUR,
  getModel,
} = require("../configurator.js");

test("initial state matches the designed configuration", () => {
  const state = createState();
  const breakdown = priceBreakdown(state);

  assert.equal(breakdown.base, 7990);
  assert.equal(breakdown.optional, 1150);
  assert.equal(breakdown.imports, 0);
  assert.equal(breakdown.total, 9140);
  assert.equal(optionalCount(state), 4);
});

test("catalog exposes the three designed models with their prices", () => {
  assert.deepEqual(
    MODELS.map((model) => [model.id, model.price]),
    [
      ["roadster-700", 7990],
      ["scrambler-800", 8890],
      ["sport-900", 9990],
    ],
  );
});

test("switching model changes the base price and keeps selected parts", () => {
  const state = setModel(createState(), "scrambler-800");
  const breakdown = priceBreakdown(state);

  assert.equal(getModel(state).name, "Scrambler 800");
  assert.equal(breakdown.base, 8890);
  assert.equal(breakdown.optional, 1150);
  assert.equal(breakdown.total, 10040);
});

test("unknown models are ignored instead of corrupting state", () => {
  const state = createState();
  assert.equal(setModel(state, "non-esiste"), state);
});

test("choosing a theme applies its colour preset", () => {
  const theme = THEMES.find((item) => item.id === "rosso-fuoco");
  const state = setTheme(createState(), theme.id);

  assert.equal(state.themeId, "rosso-fuoco");
  assert.deepEqual(state.colors, theme.colors);
});

test("editing a custom colour clears the active theme", () => {
  const state = setColor(createState(), "tank", "#123456");
  assert.equal(state.themeId, null);
  assert.equal(state.colors.tank, "#123456");
});

test("a part can be selected and removed", () => {
  const withTitanio = setPart(createState(), "scarico", "titanio");
  assert.equal(priceBreakdown(withTitanio).optional, 1450);
  assert.equal(optionalCount(withTitanio), 4);

  const withoutScarico = setPart(withTitanio, "scarico", null);
  assert.equal(priceBreakdown(withoutScarico).optional, 760);
  assert.equal(optionalCount(withoutScarico), 3);
});

test("unknown part groups and options are rejected", () => {
  const state = createState();
  assert.equal(setPart(state, "freni", "brembo"), state);
  assert.equal(setPart(state, "scarico", "plutonio"), state);
});

test("cart lists the base model, every chosen part and imports", () => {
  const state = addImport(createState(), {
    id: "shop-1",
    title: "Specchietti CNC",
    category: "Accessori",
    price: 89,
    site: "negozio.it",
    url: "https://negozio.it/specchietti",
    image: "",
  });
  const items = cartItems(state);

  assert.equal(items.length, 6);
  assert.equal(items[0].id, `base:${state.modelId}`);
  assert.equal(items.filter((item) => item.kind === "part").length, 4);
  assert.equal(items.at(-1).title, "Specchietti CNC");
  assert.equal(priceBreakdown(state).total, 9229);
});

test("removing a part from the cart clears its selection", () => {
  const state = removeCartItem(createState(), "part:scarico");
  assert.equal(state.parts.scarico, null);
  assert.equal(priceBreakdown(state).optional, 760);
});

test("removing an imported part drops it from the total", () => {
  const added = addImport(createState(), {
    id: "shop-2",
    title: "Borsa serbatoio",
    category: "Accessori",
    price: 120,
    site: "negozio.it",
    url: "https://negozio.it/borsa",
    image: "",
  });
  const removed = removeCartItem(added, "import:shop-2");

  assert.equal(removed.imports.length, 0);
  assert.equal(priceBreakdown(removed).total, 9140);
});

test("the base model cannot be removed", () => {
  const state = createState();
  assert.equal(removeCartItem(state, `base:${state.modelId}`), state);
});

test("reset returns to the designed default", () => {
  const dirty = addImport(setColor(setPart(createState(), "sella", "racing"), "tank", "#000000"), {
    id: "x",
    title: "x",
    category: "Accessori",
    price: 1,
  });
  assert.equal(priceBreakdown(resetState(dirty)).total, 9140);
});

test("prices format with Italian thousands separators", () => {
  assert.equal(formatEUR(9140), "€ 9.140");
  assert.equal(formatEUR(0), "€ 0");
});

test("every part option has a stable id and non-negative price", () => {
  for (const group of PART_GROUPS) {
    for (const option of group.options) {
      assert.equal(typeof option.id, "string");
      assert.ok(option.price >= 0);
    }
  }
});
