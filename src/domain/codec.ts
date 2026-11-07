// SPDX-License-Identifier: MPL-2.0
import { DomainError } from "./money.ts";
import { assertSynthetic, validateDate } from "./ledger.ts";
import type { Workspace } from "./ledger.ts";
import type { CommandState } from "../application/commands.ts";
import { migrateWorkspace } from "./ownership.ts";

export function encode(value: unknown): string {
  return JSON.stringify(value, (_, v) => typeof v === "bigint" ? { $cents: v.toString() } : v);
}
export function decode<T>(text: string): T {
  if (text.length > 32 * 1024 * 1024) throw new DomainError("schema");
  return JSON.parse(text, (key, v) => {
    if (["__proto__", "constructor", "prototype"].includes(key)) throw new DomainError("schema");
    if (v && typeof v === "object" && "$cents" in v) {
      if (Object.keys(v).length !== 1 || typeof v.$cents !== "string" || !/^(0|[1-9]\d{0,30})$/.test(v.$cents)) throw new DomainError("amount");
      return BigInt(v.$cents);
    }
    return v;
  }) as T;
}
function check(condition: unknown): asserts condition { if (!condition) throw new DomainError("schema"); }
function unique(items: readonly { id: string }[]) { check(Array.isArray(items)); check(new Set(items.map(i => i.id)).size === items.length); for (const i of items) check(typeof i.id === "string" && i.id.length > 0 && i.id.length <= 240); }
export function validateWorkspace(w: Workspace): void {
  assertSynthetic(w);
  unique(w.businesses); unique(w.entries);
  check(w.businesses.length > 0 && Array.isArray(w.journal) && Array.isArray(w.audit));
  for (const b of w.businesses) check(typeof b.name === "string" && b.name.trim().length > 0 && b.name.length <= 80 && b.country === "AT" && ["sole-trader", "planning"].includes(b.legalForm) && b.vatStatus === "unconfirmed" && (!b.archivedAt || Number.isFinite(Date.parse(b.archivedAt))));
  for (const e of w.entries) {
    check(w.businesses.some(b => b.id === e.businessId));
    check(typeof e.description === "string" && e.description.length > 0 && e.description.length <= 220);
    check(typeof e.cents === "bigint" && e.cents > 0n && e.cents <= 99999999999999n && ["EUR", "USD"].includes(e.currency) && ["income", "expense"].includes(e.kind) && ["draft", "posted"].includes(e.status) && Number.isSafeInteger(e.revision) && e.revision >= 0);
    validateDate(e.date);
    if (e.reverses) {
      const original = w.entries.find(i => i.id === e.reverses);
      check(original && original.businessId === e.businessId && original.status === "posted" && !original.reverses && e.status === "posted" && e.date >= original.date && e.currency === original.currency && e.cents === original.cents && e.kind === original.kind);
      check(w.entries.filter(i => i.reverses === e.reverses).length === 1);
    }
    const lines = w.journal.filter(l => l.entryId === e.id);
    check(lines.length === (e.status === "posted" ? 2 : 0));
    if (e.status === "posted") {
      const debit = e.kind === "income" ? "bank" : "expense";
      const credit = e.kind === "income" ? "income" : "bank";
      check(lines.some(l => l.account === debit && l.side === (e.reverses ? "credit" : "debit")) && lines.some(l => l.account === credit && l.side === (e.reverses ? "debit" : "credit")));
    }
  }
  for (const l of w.journal) { const e = w.entries.find(e => e.id === l.entryId); check(e && l.businessId === e.businessId && l.currency === e.currency && l.cents === e.cents); }
  for (const a of w.audit) check(w.entries.some(e => e.id === a.entryId) && ["draft-created", "posted", "reversed"].includes(a.action) && Number.isFinite(Date.parse(a.at)));
  const o = migrateWorkspace(w).ownership;
  unique(o.entities); unique(o.scopes); unique(o.activities); unique(o.projects); unique(o.personalIncome);
  for (const e of o.entities) check(["unknown", "sole-trader"].includes(e.kind) && typeof e.name === "string");
  for (const s of o.scopes) check(o.entities.some(e => e.id === s.entityId) && s.currency === "EUR" && ["unknown", "confirmed"].includes(s.status));
  for (const m of o.memberships) { check(w.businesses.some(b => b.id === m.businessId) && o.scopes.some(s => s.id === m.scopeId)); validateDate(m.effectiveFrom); }
  for (const a of o.activities) check(w.businesses.some(b => b.id === a.businessId) && typeof a.name === "string");
  for (const p of o.projects) check(o.activities.some(a => a.id === p.activityId && a.businessId === p.businessId) && typeof p.name === "string");
  for (const p of o.personalIncome) { check(o.entities.some(e => e.id === p.entityId) && typeof p.cents === "bigint" && p.cents >= 0n && ["EUR", "USD"].includes(p.currency)); validateDate(p.date); }
  for (const b of w.businesses) {
    const profiles = o.profiles.filter(p => p.businessId === b.id);
    check(profiles.length > 0);
    profiles.forEach((p, i) => { validateDate(p.effectiveFrom); check(["unknown", "exempt", "registered"].includes(p.vat) && ["unknown", "cash-basis"].includes(p.method) && (!i || p.effectiveFrom > profiles[i - 1]!.effectiveFrom)); });
  }
  check(o.profiles.every(p => w.businesses.some(b => b.id === p.businessId)));
}
export function validateCommandState(state: CommandState): void {
  check(state.version === 1 && Number.isSafeInteger(state.revision) && state.revision >= 0 && Array.isArray(state.receipts) && state.receipts.length === state.revision);
  validateWorkspace(state.workspace);
  check(new Set(state.receipts.map(r => r.key)).size === state.receipts.length);
  state.receipts.forEach((r, i) => check(typeof r.key === "string" && typeof r.canonical === "string" && r.result.revision === i + 1 && typeof r.result.commandId === "string" && typeof r.result.recordId === "string"));
}
