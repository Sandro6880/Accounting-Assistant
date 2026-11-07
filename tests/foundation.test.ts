// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import { createBusiness, createDraft, postDraft, totalsFor } from "../src/domain/ledger.ts";
import { addProject, archiveBusiness, changeProfile, migrateWorkspace, profileOn } from "../src/domain/ownership.ts";
import { financialDate, correctionDate, importIdentity } from "../src/domain/identity.ts";
import { decode, encode, validateWorkspace } from "../src/domain/codec.ts";
import { executeCommand, initialCommandState, canonical } from "../src/application/commands.ts";
import { foundationModules, moduleAccess, validateModules } from "../src/domain/modules.ts";
import { translator } from "../src/app/i18n.ts";

const draft = { description: "Fictional regression expense", date: "2026-02-28", kind: "expense" as const, amount: "12,34", currency: "EUR" as const };
test("P1.C01 migration preserves original financial IDs and totals and scopes every business", () => {
  const original = createSyntheticWorkspace();
  const migrated = migrateWorkspace(createBusiness(original, "third-foundation", "Fictional third"));
  assert.deepEqual(migrated.entries, original.entries);
  assert.deepEqual(migrated.journal, original.journal);
  assert.equal(totalsFor(migrated, "demo-consulting", "EUR").net, 112010n);
  assert.equal(totalsFor(migrated, "demo-consulting", "USD").net, 25000n);
  assert.equal(migrated.ownership.profiles.length, 3);
  assert(migrated.ownership.scopes.every(s => s.status === "unknown"));
  assert.equal(migrateWorkspace(migrated), migrated);
  validateWorkspace(migrated);
  const withActivity = { ...migrated, ownership: { ...migrated.ownership, activities: [{ id: "activity", businessId: "demo-consulting", name: "Fictional activity" }] } };
  assert.throws(() => addProject(withActivity, { id: "p", businessId: "demo-studio", activityId: "activity", name: "Fictional project" }), /scope/);
  validateWorkspace(addProject(withActivity, { id: "p", businessId: "demo-consulting", activityId: "activity", name: "Fictional project" }));
  const income = { ...withActivity, ownership: { ...withActivity.ownership, personalIncome: [{ id: "salary", entityId: "entity:demo-consulting", date: "2026-01-01", currency: "EUR" as const, cents: 200000n }] } };
  validateWorkspace(income);
  assert.equal(totalsFor(income, "demo-consulting", "EUR").net, 112010n);
});
test("P1.C02 portable commands preserve business scope without a hosted adapter", () => {
  let state = initialCommandState(createSyntheticWorkspace());
  const created = executeCommand(state, { id: "draft-portable", businessId: "demo-consulting", expectedRevision: 0, payload: { type: "draft", input: draft } }, "2026-03-01T12:00:00Z");
  state = created.state;
  assert.throws(() => executeCommand(state, { id: "wrong-business", businessId: "demo-studio", expectedRevision: 1, payload: { type: "post", entryId: created.result.recordId, revision: 0 } }, "2026-03-01T12:00:00Z"), /scope/);
  const posted = executeCommand(state, { id: "post-portable", businessId: "demo-consulting", expectedRevision: 1, payload: { type: "post", entryId: created.result.recordId, revision: 0 } }, "2026-03-01T12:00:00Z");
  assert.equal(totalsFor(posted.state.workspace, "demo-consulting", "EUR").net, 110776n);
});
test("P1.C03 canonical retries replay results and reject changed payloads and stale revisions", () => {
  const initial = initialCommandState(createSyntheticWorkspace());
  const command = { id: "idempotent-test", businessId: "demo-consulting", expectedRevision: 0, payload: { type: "draft" as const, input: draft } };
  const first = executeCommand(initial, command, "2026-03-01T12:00:00Z");
  const second = executeCommand(first.state, command, "2026-03-02T12:00:00Z");
  assert.equal(second.state, first.state); assert.deepEqual(second.result, first.result);
  assert.throws(() => executeCommand(first.state, { ...command, payload: { type: "draft", input: { ...draft, amount: "99" } } }, "2026-03-01T12:00:00Z"), /conflict/);
  assert.throws(() => executeCommand(first.state, { ...command, id: "stale" }, "2026-03-01T12:00:00Z"), /conflict/);
  assert.equal(first.state.receipts.length, 1);
  assert.equal(canonical({ b: 2, a: 1 }), canonical({ a: 1, b: 2 }));
});
test("P1.C04 dates reject impossible days and import identities remain scoped and collision-free", () => {
  assert.equal(financialDate("2028-02-29"), "2028-02-29");
  assert.throws(() => financialDate("2026-02-29"), /date/);
  assert.throws(() => correctionDate("2026-03-01", "2026-02-28"), /reversalDate/);
  assert.notEqual(importIdentity("a", "b:c", "d"), importIdentity("a:b", "c", "d"));
  assert.notEqual(importIdentity("a", "bank", "line1"), importIdentity("b", "bank", "line1"));
  assert.throws(() => importIdentity("a", "", "row"), /identity/);
});
test("P1.C03 command IDs are scoped per business and semantic reversal retries return the retained record", () => {
  const first = executeCommand(initialCommandState(createSyntheticWorkspace()), { id: "shared-local-id", businessId: "demo-consulting", expectedRevision: 0, payload: { type: "draft", input: draft } }, "2026-03-01T12:00:00Z");
  const second = executeCommand(first.state, { id: "shared-local-id", businessId: "demo-studio", expectedRevision: 1, payload: { type: "draft", input: draft } }, "2026-03-01T12:00:00Z");
  assert.notEqual(first.result.recordId, second.result.recordId);
  assert.equal(second.state.receipts.length, 2);
  const reversed = executeCommand(second.state, { id: "reverse-one", businessId: "demo-consulting", expectedRevision: 2, payload: { type: "reverse", entryId: "sample-income", date: "2026-03-01" } }, "2026-03-01T12:00:00Z");
  const retry = executeCommand(reversed.state, { id: "reverse-two", businessId: "demo-consulting", expectedRevision: 3, payload: { type: "reverse", entryId: "sample-income", date: "2026-03-01" } }, "2026-03-01T12:00:00Z");
  assert.equal(retry.result.recordId, reversed.result.recordId);
  assert.equal(retry.state.workspace.entries.filter(e => e.reverses === "sample-income").length, 1);
});
test("P1.C05 language changes cannot mutate canonical commands, currencies or stored identifiers", () => {
  const state = initialCommandState(createSyntheticWorkspace()); const before = encode(state);
  assert.notEqual(translator("en")("expense"), translator("de")("expense"));
  assert.equal(encode(state), before);
  const decoded = decode<typeof state>(before); validateWorkspace(decoded.workspace);
  assert.equal(decoded.workspace.entries[0]!.cents, 120000n);
  assert.throws(() => decode('{"$cents":"1e2"}'), /amount/);
  assert.throws(() => decode('{"__proto__":{}}'), /schema/);
});
test("P1.C06 registry keeps accounting and security mandatory and disabled history readable", () => {
  const enabled = ["accounting", "security", "businesses"];
  validateModules(foundationModules, enabled);
  assert.equal(moduleAccess(foundationModules, enabled, "evidence"), "read-only");
  assert.throws(() => validateModules(foundationModules, ["accounting"]), /module/);
  assert.throws(() => validateModules([...foundationModules, { id: "cycle", mandatory: false, dependencies: ["cycle"], commands: [], routes: [], reports: [] }], enabled), /module/);
});
test("P1.C07 profile changes are effective-dated and archival retains immutable history", () => {
  const initial = migrateWorkspace(createSyntheticWorkspace());
  const next = changeProfile(initial, { businessId: "demo-consulting", effectiveFrom: "2026-06-01", vat: "registered", method: "cash-basis" });
  assert.equal(profileOn(next, "demo-consulting", "2026-05-31").vat, "unknown");
  assert.equal(profileOn(next, "demo-consulting", "2026-06-01").vat, "registered");
  assert.throws(() => changeProfile(next, { businessId: "demo-consulting", effectiveFrom: "2026-06-01", vat: "exempt", method: "unknown" }), /conflict/);
  const archived = archiveBusiness(next, "demo-consulting", "2026-07-01T12:00:00Z");
  assert.deepEqual(archived.entries, initial.entries);
  assert.equal(totalsFor(archived, "demo-consulting", "EUR").net, 112010n);
  assert.throws(() => createDraft(archived, "demo-consulting", draft, "archived-test", "2026-07-01T12:00:00Z"), /archived/);
  assert.throws(() => postDraft(archived, "demo-consulting", "sample-draft", 0, "2026-07-01T12:00:00Z"), /archived/);
  assert.equal(archiveBusiness(archived, "demo-consulting", "2026-07-02T12:00:00Z"), archived);
});
