// SPDX-License-Identifier: MPL-2.0
import type { AccountingActions } from "../application/accounting.ts";
import { canonical } from "../application/commands.ts";
import type { Command, CommandState, Payload } from "../application/commands.ts";
import type { DesktopRequest } from "../application/desktop-api.ts";
import type { DraftInput } from "../domain/ledger.ts";
import type { ProfileChange } from "../domain/ownership.ts";
import { decode } from "../domain/codec.ts";
import { DomainError } from "../domain/money.ts";
export async function desktopRequest<T>(request: DesktopRequest): Promise<T> {
  if (!window.accountingDesktop) throw new DomainError("desktop");
  const reply = await window.accountingDesktop.request(request);
  if (!reply.ok || reply.data === undefined) throw new DomainError(reply.code ?? "storage");
  return decode<T>(reply.data);
}
export class DesktopClient implements AccountingActions {
  private state: CommandState;
  private listeners = new Set<() => void>();
  private pending = false;
  private retry: Command | null = null;
  constructor(initial: CommandState) { this.state = initial; }
  getSnapshot = () => this.state.workspace;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private async execute(businessId: string, payload: Payload): Promise<string> {
    if (this.pending) throw new DomainError("conflict");
    this.pending = true;
    try {
      if (this.retry && (this.retry.businessId !== businessId || canonical(this.retry.payload) !== canonical(payload))) throw new DomainError("conflict");
      const command = this.retry ?? { id: crypto.randomUUID(), businessId, expectedRevision: this.state.revision, payload };
      this.retry = command;
      const reply = await desktopRequest<{ state: CommandState; result: { recordId: string } }>({ action: "command", command });
      this.state = reply.state; this.retry = null; for (const listener of this.listeners) listener();
      return reply.result.recordId;
    } finally { this.pending = false; }
  }
  addBusiness(name: string) { return this.execute("workspace", { type: "business", name }); }
  addDraft(businessId: string, input: DraftInput) { return this.execute(businessId, { type: "draft", input }); }
  async post(businessId: string, entryId: string, revision: number) { await this.execute(businessId, { type: "post", entryId, revision }); }
  async reverse(businessId: string, entryId: string, date: string) { await this.execute(businessId, { type: "reverse", entryId, date }); }
  async archive(businessId: string) { await this.execute(businessId, { type: "archive" }); }
  async profile(change: ProfileChange) { const { businessId, ...profile } = change; await this.execute(businessId, { type: "profile", change: profile }); }
}
