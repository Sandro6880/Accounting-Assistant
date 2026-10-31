// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AccountingApplication } from "../src/application/accounting.ts";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import { entriesFor, totalsFor } from "../src/domain/ledger.ts";
import type { Business, DraftInput, Workspace } from "../src/domain/ledger.ts";
import { DomainError } from "../src/domain/money.ts";
import type { Currency } from "../src/domain/money.ts";
import { MemoryRepository } from "../src/infrastructure/memory-repository.ts";

type ExpectedTotals = Record<
  Currency,
  { income: string; expenses: string; net: string }
>;
interface ProfileCatalog {
  schemaVersion: number;
  dataMode: string;
  catalogVersion: string;
  workspaceFixtureVersion: string;
  reportingCurrency: string;
  scenarioDate: string;
  clock: string;
  profiles: (Business & { origin: "baseline" | "create" })[];
  baselineTotals: Record<string, ExpectedTotals>;
  emptyTotals: ExpectedTotals;
  thirdBusinessCases: (Omit<DraftInput, "date"> & { id: string })[];
  thirdBusinessPostedTotals: ExpectedTotals;
}

// A fixed, wholly fictional repository fixture; never discover user files.
const catalog: ProfileCatalog = JSON.parse(
  readFileSync(
    new URL("./fixtures/p0-c03/profiles.json", import.meta.url),
    "utf8",
  ),
);

function createScenario() {
  const baseline = createSyntheticWorkspace();
  const repository = new MemoryRepository(baseline);
  const third = catalog.profiles.find((profile) => profile.origin === "create");
  assert.ok(third);
  let sequence = 0;
  const application = new AccountingApplication(
    repository,
    () => (sequence++ === 0 ? third.id : `p0-c03-entry-${sequence}`),
    () => catalog.clock,
  );
  assert.equal(application.addBusiness(third.name), third.id);
  return { baseline, repository, application, third };
}

function expectTotals(
  workspace: Workspace,
  businessId: string,
  expected: ExpectedTotals,
) {
  for (const currency of ["EUR", "USD"] as const) {
    assert.deepEqual(totalsFor(workspace, businessId, currency), {
      income: BigInt(expected[currency].income),
      expenses: BigInt(expected[currency].expenses),
      net: BigInt(expected[currency].net),
    });
  }
}

test("P0.C03 profiles run through generic business creation without changing the baseline", () => {
  const { baseline, repository, third } = createScenario();
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(catalog.dataMode, "synthetic");
  assert.equal(catalog.catalogVersion, "p0-c03-v1");
  assert.equal(catalog.reportingCurrency, "EUR");
  const state = repository.getSnapshot();
  assert.equal(state.fixtureVersion, catalog.workspaceFixtureVersion);
  assert.equal(state.businesses.length, 3);
  assert.equal(new Set(catalog.profiles.map((profile) => profile.id)).size, 3);
  for (const profile of catalog.profiles) {
    assert.equal(profile.vatStatus, "unconfirmed");
    assert.deepEqual(
      state.businesses.find((business) => business.id === profile.id),
      {
        id: profile.id,
        name: profile.name,
        country: profile.country,
        legalForm: profile.legalForm,
        vatStatus: profile.vatStatus,
      },
    );
    if (profile.origin === "baseline") {
      const expected = catalog.baselineTotals[profile.id];
      assert.ok(expected);
      expectTotals(state, profile.id, expected);
    }
  }
  expectTotals(state, third.id, catalog.emptyTotals);
  assert.deepEqual(state.entries, baseline.entries);
  assert.equal(baseline.businesses.length, 2);
  assert.deepEqual(createSyntheticWorkspace(), baseline);
});

test("P0.C03 EUR/USD scenarios preserve three-business scope and exact source amounts", () => {
  const { baseline, repository, application, third } = createScenario();
  const drafts = catalog.thirdBusinessCases.map((example) => ({
    example,
    id: application.addDraft(third.id, {
      description: example.description,
      kind: example.kind,
      currency: example.currency,
      amount: example.amount,
      date: catalog.scenarioDate,
    }),
  }));
  expectTotals(repository.getSnapshot(), third.id, catalog.emptyTotals);

  const first = drafts[0];
  const otherBusiness = catalog.profiles.find(
    (profile) => profile.origin === "baseline",
  );
  assert.ok(first);
  assert.ok(otherBusiness);
  const beforeWrongScope = repository.getSnapshot();
  assert.throws(
    () => application.post(otherBusiness.id, first.id, 0),
    (error) => error instanceof DomainError && error.code === "scope",
  );
  assert.equal(repository.getSnapshot(), beforeWrongScope);

  for (const draft of drafts) application.post(third.id, draft.id, 0);
  const state = repository.getSnapshot();
  expectTotals(state, third.id, catalog.thirdBusinessPostedTotals);
  for (const profile of catalog.profiles.filter(
    (profile) => profile.origin === "baseline",
  )) {
    const expected = catalog.baselineTotals[profile.id];
    assert.ok(expected);
    expectTotals(state, profile.id, expected);
  }
  assert.deepEqual(
    state.entries.filter((entry) => entry.businessId !== third.id),
    baseline.entries,
  );
  assert.equal(entriesFor(state, third.id).length, 3);
  for (const { id, example } of drafts) {
    const entry = state.entries.find((candidate) => candidate.id === id);
    assert.equal(entry?.currency, example.currency);
    assert.equal(entry?.date, catalog.scenarioDate);
    assert.equal(entry?.status, "posted");
  }
});
