// SPDX-License-Identifier: MPL-2.0
import { validateDate } from "./ledger.ts";
import { DomainError } from "./money.ts";

export function financialDate(value: string): string { validateDate(value); return value; }
export function correctionDate(original: string, correction: string): string {
  financialDate(original); financialDate(correction);
  if (correction < original) throw new DomainError("reversalDate");
  return correction;
}
// Length-prefix each canonical component; delimiters inside an external ID cannot collide.
export function importIdentity(businessId: string, source: string, externalId: string): string {
  const parts = [businessId, source, externalId];
  if (parts.some(p => typeof p !== "string" || !p.trim() || p !== p.normalize("NFC") || p.length > 200)) throw new DomainError("identity");
  return parts.map(p => `${p.length}:${p}`).join("");
}
