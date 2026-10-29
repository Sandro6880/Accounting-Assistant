// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { parseAmount, formatMoney, DomainError } from "../src/domain/money.ts";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import {
  createBusiness,
  createDraft,
  entriesFor,
  postDraft,
  reversePosting,
  totalsFor,
} from "../src/domain/ledger.ts";
import type { DraftInput, Workspace } from "../src/domain/ledger.ts";
import { MemoryRepository } from "../src/infrastructure/memory-repository.ts";
import { AccountingApplication } from "../src/application/accounting.ts";

const business = "demo-consulting";
const at = "2026-01-20T12:00:00Z";
const input: DraftInput = {
  description: "Fictional test expense",
  amount: "10.05",
  currency: "EUR",
  kind: "expense",
  date: "2026-01-20",
};
const rejects = (action: () => unknown, code: string) =>
  assert.throws(
    action,
    (error) => error instanceof DomainError && error.code === code,
  );

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
test("a draft does not affect posted totals; EUR never includes USD", () => {
  const state = createDraft(
    createSyntheticWorkspace(),
    business,
    input,
    "test-draft",
    at,
  );
  assert.deepEqual(totalsFor(state, business, "EUR"), {
    income: 120000n,
    expenses: 7990n,
    net: 112010n,
  });
  assert.equal(totalsFor(state, business, "USD").net, 25000n);
});
test("posting atomically adds a balanced pair and records the event", () => {
  const draft = createDraft(
    createSyntheticWorkspace(),
    business,
    input,
    "test-draft",
    at,
  );
  const state = postDraft(draft, business, "test-draft", 0, at);
  const lines = state.journal.filter((line) => line.entryId === "test-draft");
  assert.equal(lines.length, 2);
  assert.equal(
    lines.reduce(
      (sum, line) => sum + (line.side === "debit" ? line.cents : -line.cents),
      0n,
    ),
    0n,
  );
  assert.equal(totalsFor(state, business, "EUR").expenses, 8995n);
  assert.equal(state.audit.at(-1)?.action, "posted");
  assert.equal(
    draft.entries.find((entry) => entry.id === "test-draft")?.status,
    "draft",
  );
});
test("post retries create no duplicate journal or audit event", () => {
  const state = createSyntheticWorkspace();
  assert.equal(postDraft(state, business, "sample-income", 0, at), state);
});
test("stale revisions are rejected before posting", () =>
  rejects(
    () =>
      postDraft(createSyntheticWorkspace(), business, "sample-draft", 99, at),
    "conflict",
  ));
test("cross-business post and reversal cannot affect another business", () => {
  const state = createSyntheticWorkspace();
  rejects(
    () => postDraft(state, "demo-studio", "sample-draft", 0, at),
    "scope",
  );
  rejects(
    () =>
      reversePosting(
        state,
        "demo-studio",
        "sample-income",
        "2026-01-20",
        "reverse",
        at,
      ),
    "scope",
  );
  assert.equal(totalsFor(state, "demo-studio", "EUR").net, 80000n);
});
test("reversal appends inverse lines, keeps original and restores its effect", () => {
  const before = createSyntheticWorkspace();
  const original = before.entries.find((entry) => entry.id === "sample-income");
  const after = reversePosting(
    before,
    business,
    "sample-income",
    "2026-01-20",
    "reverse",
    at,
  );
  assert.equal(
    after.entries.find((entry) => entry.id === "sample-income"),
    original,
  );
  assert.equal(after.entries.length, before.entries.length + 1);
  assert.equal(totalsFor(after, business, "EUR").net, -7990n);
  assert.equal(
    after.journal.reduce(
      (sum, line) => sum + (line.side === "debit" ? line.cents : -line.cents),
      0n,
    ),
    0n,
  );
  assert.equal(
    reversePosting(
      after,
      business,
      "sample-income",
      "2026-01-20",
      "another-id",
      at,
    ),
    after,
  );
  rejects(
    () =>
      reversePosting(
        after,
        business,
        "sample-income",
        "2026-01-21",
        "another-id",
        at,
      ),
    "conflict",
  );
});
test("drafts, reversals and dates before the original cannot be reversed", () => {
  const before = createSyntheticWorkspace();
  rejects(
    () =>
      reversePosting(
        before,
        business,
        "sample-draft",
        "2026-01-20",
        "reverse",
        at,
      ),
    "reversal",
  );
  rejects(
    () =>
      reversePosting(
        before,
        business,
        "sample-income",
        "2026-01-01",
        "reverse",
        at,
      ),
    "reversalDate",
  );
  const after = reversePosting(
    before,
    business,
    "sample-income",
    "2026-01-20",
    "reverse",
    at,
  );
  rejects(
    () => reversePosting(after, business, "reverse", "2026-01-20", "again", at),
    "reversal",
  );
});
test("invalid calendar dates and zero or unsupported-currency drafts are rejected", () => {
  const state = createSyntheticWorkspace();
  for (const date of ["2026-02-30", "2026-02-29", "not-a-date"])
    rejects(
      () => createDraft(state, business, { ...input, date }, "invalid", at),
      "date",
    );
  rejects(
    () =>
      createDraft(state, business, { ...input, amount: "0" }, "invalid", at),
    "amount",
  );
  rejects(
    () =>
      createDraft(
        state,
        business,
        { ...input, currency: "GBP" as DraftInput["currency"] },
        "invalid",
        at,
      ),
    "currency",
  );
});
test("a third fictional business works without source-code branches", () => {
  const state = createBusiness(
    createSyntheticWorkspace(),
    "third",
    "Third Fictional Business",
  );
  const draft = createDraft(state, "third", input, "third-draft", at);
  assert.equal(entriesFor(draft, "third").length, 1);
  assert.equal(totalsFor(draft, "third", "EUR").net, 0n);
  assert.equal(state.businesses.at(-1)?.vatStatus, "unconfirmed");
});
test("duplicate record identifiers do not replace existing facts", () =>
  rejects(
    () =>
      createDraft(
        createSyntheticWorkspace(),
        business,
        input,
        "sample-income",
        at,
      ),
    "duplicate",
  ));
test("memory snapshots are immutable and failed transactions do not publish changes", () => {
  const repository = new MemoryRepository(createSyntheticWorkspace());
  const before = repository.getSnapshot();
  let notifications = 0;
  const unsubscribe = repository.subscribe(() => notifications++);
  assert.throws(() => {
    (before.entries as unknown as { cents: bigint }[])[0]!.cents = 1n;
  }, TypeError);
  assert.throws(() =>
    repository.transact(() => {
      throw new Error("Synthetic failure");
    }),
  );
  assert.equal(repository.getSnapshot(), before);
  assert.equal(notifications, 0);
  repository.transact((state) =>
    createDraft(state, business, input, "new-draft", at),
  );
  assert.equal(notifications, 1);
  unsubscribe();
});
test("production or ambiguous workspace markers are rejected", () => {
  for (const mode of ["production", undefined])
    rejects(
      () =>
        new MemoryRepository({
          ...createSyntheticWorkspace(),
          mode,
        } as unknown as Workspace),
      "synthetic",
    );
});

test("repository rejects replacing posted facts or rewriting journal/audit history", () => {
  const repository = new MemoryRepository(createSyntheticWorkspace());
  const before = repository.getSnapshot();
  rejects(
    () =>
      repository.transact((state) => ({
        ...state,
        entries: state.entries.map((entry) =>
          entry.id === "sample-income" ? { ...entry, cents: 1n } : entry,
        ),
      })),
    "immutable",
  );
  rejects(
    () =>
      repository.transact((state) => ({
        ...state,
        journal: state.journal.slice(1),
      })),
    "immutable",
  );
  rejects(
    () => repository.transact((state) => ({ ...state, audit: [] })),
    "immutable",
  );
  assert.equal(repository.getSnapshot(), before);
});
test("application commands use the repository boundary and injected IDs/clock", () => {
  const repository = new MemoryRepository(createSyntheticWorkspace());
  const app = new AccountingApplication(
    repository,
    () => "app-test",
    () => at,
  );
  const id = app.addDraft(business, input);
  app.post(business, id, 0);
  assert.equal(repository.getSnapshot().audit.at(-1)?.at, at);
  assert.equal(
    repository.getSnapshot().entries.find((entry) => entry.id === id)?.status,
    "posted",
  );
});
