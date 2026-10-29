// SPDX-License-Identifier: MPL-2.0
export type Currency = "EUR" | "USD";
export type Language = "en" | "de";

export class DomainError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.name = "DomainError";
    this.code = code;
  }
}

// Decimal strings only: no thousands separators, exponent notation or floats.
export function parseAmount(value: string): bigint {
  if (
    typeof value !== "string" ||
    !/^\d{1,12}(?:[.,]\d{1,2})?$/.test(value.trim())
  ) {
    throw new DomainError("amount");
  }
  const [whole = "", fraction = ""] = value.trim().replace(",", ".").split(".");
  return BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));
}

export function formatMoney(
  cents: bigint,
  currency: Currency,
  language: Language,
): string {
  const locale = language === "de" ? "de-AT" : "en-IE";
  const absolute = cents < 0n ? -cents : cents;
  const whole = new Intl.NumberFormat(locale).format(absolute / 100n);
  const fraction = (absolute % 100n).toString().padStart(2, "0");
  // Build display parts without converting exact values to floating point.
  return new Intl.NumberFormat(locale, { style: "currency", currency })
    .formatToParts(cents < 0n ? -1 : 1)
    .map((part) =>
      part.type === "integer"
        ? whole
        : part.type === "fraction"
          ? fraction
          : part.value,
    )
    .join("");
}
