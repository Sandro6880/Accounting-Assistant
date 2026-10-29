// SPDX-License-Identifier: MPL-2.0
import { DomainError, parseAmount } from "./money.ts";
import type { Currency } from "./money.ts";

export interface Business {
  readonly id: string;
  readonly name: string;
  readonly country: "AT";
  readonly legalForm: "sole-trader" | "planning";
  readonly vatStatus: "unconfirmed";
}
export interface Entry {
  readonly id: string;
  readonly businessId: string;
  readonly kind: "income" | "expense";
  readonly description: string;
  readonly date: string;
  readonly cents: bigint;
  readonly currency: Currency;
  readonly status: "draft" | "posted";
  readonly revision: number;
  readonly reverses?: string;
}
export interface JournalLine {
  readonly entryId: string;
  readonly businessId: string;
  readonly account: "bank" | "income" | "expense";
  readonly side: "debit" | "credit";
  readonly currency: Currency;
  readonly cents: bigint;
}
export interface AuditEvent {
  readonly entryId: string;
  readonly action: "draft-created" | "posted" | "reversed";
  readonly at: string;
}
export interface Workspace {
  readonly mode: "synthetic";
  readonly fixtureVersion: "synthetic-v1";
  readonly businesses: readonly Business[];
  readonly entries: readonly Entry[];
  readonly journal: readonly JournalLine[];
  readonly audit: readonly AuditEvent[];
}
export interface DraftInput {
  description: string;
  date: string;
  amount: string;
  currency: Currency;
  kind: "income" | "expense";
}

// Persistent adapters must preserve this history contract as well.
export function assertPreservedHistory(
  previous: Workspace,
  next: Workspace,
): void {
  const same = (left: object, right: object | undefined) =>
    right !== undefined &&
    Object.keys(left).length === Object.keys(right).length &&
    Object.entries(left).every(
      ([key, value]) => value === (right as Record<string, unknown>)[key],
    );
  for (const entry of previous.entries.filter(
    (item) => item.status === "posted",
  )) {
    if (
      !same(
        entry,
        next.entries.find((item) => item.id === entry.id),
      )
    )
      throw new DomainError("immutable");
  }
  if (
    !previous.journal.every((line, index) => same(line, next.journal[index])) ||
    !previous.audit.every((event, index) => same(event, next.audit[index]))
  ) {
    throw new DomainError("immutable");
  }
}

export function assertSynthetic(workspace: Workspace): void {
  if (
    workspace.mode !== "synthetic" ||
    workspace.fixtureVersion !== "synthetic-v1"
  ) {
    throw new DomainError("synthetic");
  }
}
export function requireBusiness(
  workspace: Workspace,
  businessId: string,
): Business {
  const business = workspace.businesses.find((item) => item.id === businessId);
  if (!business) throw new DomainError("business");
  return business;
}
function requireEntry(
  workspace: Workspace,
  businessId: string,
  entryId: string,
): Entry {
  requireBusiness(workspace, businessId);
  const entry = workspace.entries.find((item) => item.id === entryId);
  if (!entry || entry.businessId !== businessId) throw new DomainError("scope");
  return entry;
}
export function validateDate(value: string): void {
  const date = new Date(`${value}T12:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new DomainError("date");
  }
}
export function createBusiness(
  workspace: Workspace,
  id: string,
  name: string,
): Workspace {
  assertSynthetic(workspace);
  if (!name.trim() || name.trim().length > 80)
    throw new DomainError("businessName");
  if (workspace.businesses.some((item) => item.id === id))
    throw new DomainError("duplicate");
  return {
    ...workspace,
    businesses: [
      ...workspace.businesses,
      {
        id,
        name: name.trim(),
        country: "AT",
        legalForm: "planning",
        vatStatus: "unconfirmed",
      },
    ],
  };
}
export function createDraft(
  workspace: Workspace,
  businessId: string,
  input: DraftInput,
  id: string,
  at: string,
): Workspace {
  assertSynthetic(workspace);
  requireBusiness(workspace, businessId);
  if (workspace.entries.some((item) => item.id === id))
    throw new DomainError("duplicate");
  if (!input.description.trim() || input.description.trim().length > 200)
    throw new DomainError("description");
  if (input.currency !== "EUR" && input.currency !== "USD")
    throw new DomainError("currency");
  if (input.kind !== "income" && input.kind !== "expense")
    throw new DomainError("kind");
  validateDate(input.date);
  const cents = parseAmount(input.amount);
  if (cents <= 0n) throw new DomainError("amount");
  const entry: Entry = {
    id,
    businessId,
    description: input.description.trim(),
    date: input.date,
    cents,
    currency: input.currency,
    kind: input.kind,
    status: "draft",
    revision: 0,
  };
  return {
    ...workspace,
    entries: [...workspace.entries, entry],
    audit: [...workspace.audit, { entryId: id, action: "draft-created", at }],
  };
}
function journalFor(entry: Entry): JournalLine[] {
  const debit = entry.kind === "income" ? "bank" : "expense";
  const credit = entry.kind === "income" ? "income" : "bank";
  const shared = {
    entryId: entry.id,
    businessId: entry.businessId,
    currency: entry.currency,
    cents: entry.cents,
  };
  return [
    { ...shared, account: debit, side: entry.reverses ? "credit" : "debit" },
    { ...shared, account: credit, side: entry.reverses ? "debit" : "credit" },
  ];
}
export function postDraft(
  workspace: Workspace,
  businessId: string,
  entryId: string,
  revision: number,
  at: string,
): Workspace {
  assertSynthetic(workspace);
  const entry = requireEntry(workspace, businessId, entryId);
  if (entry.status === "posted") return workspace; // Identical post retry creates no duplicate lines.
  if (entry.revision !== revision) throw new DomainError("conflict");
  const posted: Entry = {
    ...entry,
    status: "posted",
    revision: entry.revision + 1,
  };
  return {
    ...workspace,
    entries: workspace.entries.map((item) =>
      item.id === entryId ? posted : item,
    ),
    journal: [...workspace.journal, ...journalFor(posted)],
    audit: [...workspace.audit, { entryId, action: "posted", at }],
  };
}
export function reversePosting(
  workspace: Workspace,
  businessId: string,
  entryId: string,
  date: string,
  id: string,
  at: string,
): Workspace {
  assertSynthetic(workspace);
  const original = requireEntry(workspace, businessId, entryId);
  if (original.status !== "posted" || original.reverses)
    throw new DomainError("reversal");
  validateDate(date);
  if (date < original.date) throw new DomainError("reversalDate");
  const existing = workspace.entries.find((item) => item.reverses === entryId);
  if (existing) {
    if (existing.date !== date) throw new DomainError("conflict");
    return workspace;
  }
  if (workspace.entries.some((item) => item.id === id))
    throw new DomainError("duplicate");
  const reversed: Entry = {
    ...original,
    id,
    date,
    description: `Reversal: ${original.description}`,
    reverses: original.id,
    revision: 1,
  };
  return {
    ...workspace,
    entries: [...workspace.entries, reversed],
    journal: [...workspace.journal, ...journalFor(reversed)],
    audit: [...workspace.audit, { entryId: id, action: "reversed", at }],
  };
}
export function entriesFor(
  workspace: Workspace,
  businessId: string,
): readonly Entry[] {
  requireBusiness(workspace, businessId);
  return workspace.entries.filter((item) => item.businessId === businessId);
}
export function totalsFor(
  workspace: Workspace,
  businessId: string,
  currency: Currency,
) {
  const entries = entriesFor(workspace, businessId).filter(
    (item) => item.status === "posted" && item.currency === currency,
  );
  const total = (kind: Entry["kind"]) =>
    entries
      .filter((item) => item.kind === kind)
      .reduce(
        (sum, item) => sum + (item.reverses ? -item.cents : item.cents),
        0n,
      );
  const income = total("income");
  const expenses = total("expense");
  return { income, expenses, net: income - expenses };
}
