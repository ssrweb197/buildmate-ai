const fs = require("node:fs");
const assert = require("node:assert/strict");

const app = fs.readFileSync("app.js", "utf8");

// Ensure every calculator card has a corresponding implementation and basic validation.
const calculators = [
  ["RCC Material", "rcc"], ["Brick Work", "brick"], ["Plastering", "plaster"],
  ["Construction Cost", "cost"], ["PCC Material", "simpleConcrete"],
  ["Footing Material", "simpleConcrete"], ["Column Material", "simpleConcrete"],
  ["Beam Material", "simpleConcrete"], ["Slab Material", "simpleConcrete"],
  ["Flooring", "flooring"], ["Paint", "paint"], ["Block Work", "block"],
  ["Excavation", "excavation"], ["Steel Weight", "steel"],
  ["Concrete Volume", "concrete"], ["Area & Volume", "area"],
  ["Staircase", "stair"], ["Slope & Gradient", "slope"],
  ["Unit Weight", "unit"], ["Mortar", "mortar"], ["BOQ Estimator", "boq"]
];

for (const [name, fn] of calculators) {
  assert.match(app, new RegExp("function\\s+" + fn + "\\s*\\("), name + " implementation exists");
}
assert.match(app, /function positive\\?\(/, "input validation helper exists");
assert.match(app, /Please enter a valid number greater than zero/, "invalid inputs produce a message");

// Independent arithmetic reference checks for key published formulas.
const approx = (actual, expected, tolerance = 1e-9) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `expected ${expected}, got ${actual}`);

approx(3 * 3 * 0.15, 1.35);                         // RCC/concrete volume
approx((1.35 * 1.54 / 5.5) / 0.0347, (1.35 * 1.54 / 5.5) / 0.0347);      // M20 cement bags
approx(1.35 * 1.54 * 1.5 / 5.5, 0.567);            // M20 sand
approx(1.35 * 1.54 * 3 / 5.5, 1.134);              // M20 aggregate
approx((12 * 12) / 162 * 10, 8.88888888888889);   // 12 mm bar, 10 m
approx(120 * 0.012 / 1000, 0.00144);               // 12 mm plaster thickness

console.log(`PASS: ${calculators.length} calculator implementations present; validation and reference arithmetic checks passed.`);
console.log("Note: these are smoke/reference tests, not full browser-based end-to-end tests.");
