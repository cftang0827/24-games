import assert from "node:assert/strict";
import test from "node:test";
import { parseCardValue, solveNumbers } from "../src/solver.js";

test("parses common card faces", () => {
  assert.equal(parseCardValue("A"), 1);
  assert.equal(parseCardValue("j"), 11);
  assert.equal(parseCardValue("Q"), 12);
  assert.equal(parseCardValue("K"), 13);
  assert.equal(parseCardValue("10"), 10);
});

test("finds a standard integer-only 24-point solution", () => {
  const solutions = solveNumbers([1, 2, 3, 4], 24);

  assert.ok(solutions.length > 0);
  assert.ok(solutions.some((solution) => solution.includes("*")));
});

test("supports non-24 targets", () => {
  const solutions = solveNumbers([1, 2, 3, 4], 10);

  assert.ok(solutions.length > 0);
});

test("returns no solutions when impossible under integer-only rules", () => {
  assert.deepEqual(solveNumbers([1, 5, 5, 5], 24), []);
  assert.deepEqual(solveNumbers([1, 1, 1, 1], 24), []);
});

test("only keeps division when it divides evenly", () => {
  const fractionalOnly = solveNumbers([1, 5, 5, 5], 24);
  const integerDivision = solveNumbers([8, 4, 6, 2], 24);

  assert.deepEqual(fractionalOnly, []);
  assert.ok(integerDivision.some((solution) => solution.includes("/")));
});

test("can optionally concatenate integers", () => {
  const solutions = solveNumbers([1, 2, 3, 4], 1234, { allowConcat: true });

  assert.ok(solutions.includes("1234"));
});

test("rejects decimal inputs and targets", () => {
  assert.throws(() => parseCardValue("1.5"), /無法辨識牌面/u);
  assert.throws(() => solveNumbers([1, 2, 3.5, 4], 24), /不是有效整數/u);
  assert.throws(() => solveNumbers([1, 2, 3, 4], 24.5), /目標必須是整數/u);
});
