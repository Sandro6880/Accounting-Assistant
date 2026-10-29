// SPDX-License-Identifier: MPL-2.0
import { createDraft, postDraft } from "../domain/ledger.ts";
import type { DraftInput, Workspace } from "../domain/ledger.ts";

export function createSyntheticWorkspace(): Workspace {
  const at = "2026-01-15T12:00:00.000Z";
  let workspace: Workspace = {
    mode: "synthetic",
    fixtureVersion: "synthetic-v1",
    businesses: [
      {
        id: "demo-consulting",
        name: "Example Consulting",
        country: "AT",
        legalForm: "sole-trader",
        vatStatus: "unconfirmed",
      },
      {
        id: "demo-studio",
        name: "Example Studio",
        country: "AT",
        legalForm: "planning",
        vatStatus: "unconfirmed",
      },
    ],
    entries: [],
    journal: [],
    audit: [],
  };
  const examples: (DraftInput & {
    id: string;
    businessId: string;
    post: boolean;
  })[] = [
    {
      id: "sample-income",
      businessId: "demo-consulting",
      description: "Fictional project payment",
      date: "2026-01-10",
      amount: "1200.00",
      currency: "EUR",
      kind: "income",
      post: true,
    },
    {
      id: "sample-expense",
      businessId: "demo-consulting",
      description: "Fictional software purchase",
      date: "2026-01-12",
      amount: "79.90",
      currency: "EUR",
      kind: "expense",
      post: true,
    },
    {
      id: "sample-usd",
      businessId: "demo-consulting",
      description: "Fictional USD payment — valuation pending",
      date: "2026-01-13",
      amount: "250.00",
      currency: "USD",
      kind: "income",
      post: true,
    },
    {
      id: "sample-draft",
      businessId: "demo-consulting",
      description: "Fictional draft expense",
      date: "2026-01-14",
      amount: "50.00",
      currency: "EUR",
      kind: "expense",
      post: false,
    },
    {
      id: "sample-studio",
      businessId: "demo-studio",
      description: "Fictional studio payment",
      date: "2026-01-14",
      amount: "800.00",
      currency: "EUR",
      kind: "income",
      post: true,
    },
  ];
  for (const example of examples) {
    workspace = createDraft(
      workspace,
      example.businessId,
      example,
      example.id,
      at,
    );
    if (example.post)
      workspace = postDraft(workspace, example.businessId, example.id, 0, at);
  }
  return workspace;
}
