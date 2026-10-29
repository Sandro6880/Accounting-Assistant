// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { parseAmount, formatMoney, DomainError } from "../src/domain/money.ts";
const rejects = (action: () => unknown, code: string) => assert.throws(action, error => error instanceof DomainError && error.code === code);
test("decimal dot/comma parsing conserves cents without floating point", () => {
  assert.equal(parseAmount("0.01") + parseAmount("0,02"), 3n);
  assert.equal(parseAmount("00012.3"), 1230n);
  assert.equal(parseAmount("999999999999.99"), 99999999999999n);
});
test("rejects ambiguous, exponent, negative, oversized and overprecise amounts", () => {
  for (const value of [
    "1,234.00",
    "1.234,00",
    "1e3",
    "-1",
    "NaN",
    "1.005",
    "",
    ".5",
    "1000000000000",
  ])
    rejects(() => parseAmount(value), "amount");
});
test("formatting keeps large-cent precision and supports German and English", () => {
  assert.match(
    formatMoney(123456789012345678901n, "EUR", "en"),
    /1,234,567,890,123,456,789\.01/,
  );
  const german = formatMoney(-1005n, "EUR", "de");
  assert.match(german, /10,05/);
  assert.match(german, /-/);
  assert.match(formatMoney(1005n, "USD", "en"), /10\.05/);
});
