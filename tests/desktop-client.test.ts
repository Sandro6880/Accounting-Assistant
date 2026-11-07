// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { DesktopClient } from "../src/infrastructure/desktop-client.ts";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import { executeCommand, initialCommandState } from "../src/application/commands.ts";
import type { DesktopRequest } from "../src/application/desktop-api.ts";
import { encode } from "../src/domain/codec.ts";

test("P1.C03 desktop client retries a lost acknowledgement with the original command identity", async t => {
  let state = initialCommandState(createSyntheticWorkspace()); let first = true;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { accountingDesktop: {
    request: async (request: DesktopRequest) => {
      if (request.action !== "command") throw new Error("Unexpected test request");
      const result = executeCommand(state, request.command, "2026-01-20T12:00:00Z"); state = result.state;
      if (first) { first = false; throw new Error("fictional lost response after commit"); }
      return { ok: true, data: encode(result) };
    },
  } } });
  t.after(() => { if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow); else Reflect.deleteProperty(globalThis, "window"); });
  const client = new DesktopClient(state);
  await assert.rejects(client.addBusiness("Fictional retry business"), /lost response/);
  const recordId = await client.addBusiness("Fictional retry business");
  assert.equal(state.revision, 1); assert.equal(state.receipts.length, 1);
  assert.equal(client.getSnapshot().businesses.filter(b => b.id === recordId).length, 1);
});
