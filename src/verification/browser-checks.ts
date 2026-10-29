// SPDX-License-Identifier: MPL-2.0
import { createSyntheticWorkspace } from "../demo/fixture.ts";
import {
  assertSynthetic,
  createDraft,
  postDraft,
  reversePosting,
  totalsFor,
} from "../domain/ledger.ts";
import { parseAmount } from "../domain/money.ts";
import type { Workspace } from "../domain/ledger.ts";

export interface BrowserCheck {
  name: string;
  passed: boolean;
  milliseconds: number;
  detail: string;
}
const ensure = (condition: boolean) => {
  if (!condition) throw new Error("Expected invariant failed");
};
const rejects = (action: () => unknown) => {
  let rejected = false;
  try {
    action();
  } catch {
    rejected = true;
  }
  ensure(rejected);
};

export function runBrowserChecks(): BrowserCheck[] {
  const business = "demo-consulting";
  const at = "2026-01-15T12:00:00Z";
  const checks: [string, () => void][] = [
    [
      "Exact cents / Exakte Centbeträge",
      () => ensure(parseAmount("0.01") + parseAmount("0,02") === 3n),
    ],
    [
      "Ambiguous amount rejected / Mehrdeutiger Betrag abgelehnt",
      () => rejects(() => parseAmount("1,234.00")),
    ],
    [
      "Draft excluded / Entwurf ausgeschlossen",
      () =>
        ensure(
          totalsFor(createSyntheticWorkspace(), business, "EUR").net ===
            112010n,
        ),
    ],
    [
      "Balanced journal / Ausgeglichenes Journal",
      () => {
        const state = createSyntheticWorkspace();
        for (const currency of ["EUR", "USD"])
          ensure(
            state.journal
              .filter((line) => line.currency === currency)
              .reduce(
                (sum, line) =>
                  sum + (line.side === "debit" ? line.cents : -line.cents),
                0n,
              ) === 0n,
          );
      },
    ],
    [
      "Post retry / Buchung wiederholen",
      () => {
        const state = createSyntheticWorkspace();
        ensure(postDraft(state, business, "sample-income", 0, at) === state);
      },
    ],
    [
      "Reversal retains original / Storno erhält Original",
      () => {
        const state = reversePosting(
          createSyntheticWorkspace(),
          business,
          "sample-income",
          "2026-01-15",
          "reverse-test",
          at,
        );
        ensure(
          state.entries.some((entry) => entry.id === "sample-income") &&
            totalsFor(state, business, "EUR").net === -7990n,
        );
      },
    ],
    [
      "Business scope / Betriebszuordnung",
      () =>
        rejects(() =>
          postDraft(
            createSyntheticWorkspace(),
            "demo-studio",
            "sample-draft",
            0,
            at,
          ),
        ),
    ],
    [
      "Invalid date rejected / Ungültiges Datum abgelehnt",
      () =>
        rejects(() =>
          createDraft(
            createSyntheticWorkspace(),
            business,
            {
              description: "Fictional invalid date",
              date: "2026-02-30",
              amount: "1",
              currency: "EUR",
              kind: "expense",
            },
            "invalid",
            at,
          ),
        ),
    ],
    [
      "Synthetic marker / Kennzeichnung fiktiver Daten",
      () =>
        rejects(() =>
          assertSynthetic({
            ...createSyntheticWorkspace(),
            mode: "production",
          } as unknown as Workspace),
        ),
    ],
  ];
  return checks.map(([name, run]) => {
    const start = performance.now();
    try {
      run();
      return {
        name,
        passed: true,
        milliseconds: performance.now() - start,
        detail: "",
      };
    } catch (error) {
      return {
        name,
        passed: false,
        milliseconds: performance.now() - start,
        detail: error instanceof Error ? error.message : "Failed",
      };
    }
  });
}
