// SPDX-License-Identifier: MPL-2.0
import { assertPreservedHistory, createBusiness, createDraft, postDraft, reversePosting } from "../domain/ledger.ts";
import type { Workspace, DraftInput } from "../domain/ledger.ts";
import { archiveBusiness, changeProfile, migrateWorkspace } from "../domain/ownership.ts";
import type { ProfileChange } from "../domain/ownership.ts";
import { DomainError } from "../domain/money.ts";

export type Payload =
  | { type: "business"; name: string }
  | { type: "draft"; input: DraftInput }
  | { type: "post"; entryId: string; revision: number }
  | { type: "reverse"; entryId: string; date: string }
  | { type: "archive" }
  | { type: "profile"; change: Omit<ProfileChange, "businessId"> };
export interface Command { id: string; businessId: string; expectedRevision: number; payload: Payload }
export interface CommandResult { commandId: string; recordId: string; revision: number }
export interface Receipt { key: string; canonical: string; result: CommandResult }
export interface CommandState { version: 1; revision: number; workspace: Workspace; receipts: readonly Receipt[] }
export function canonical(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number" && Number.isSafeInteger(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical((value as Record<string, unknown>)[k])}`).join(",")}}`;
  throw new DomainError("command");
}
export function initialCommandState(workspace: Workspace): CommandState { return { version: 1, revision: 0, workspace: migrateWorkspace(workspace), receipts: [] }; }
export function executeCommand(state: CommandState, command: Command, at: string): { state: CommandState; result: CommandResult } {
  if (!command || !/^[a-zA-Z0-9_-]{1,100}$/.test(command.id) || typeof command.businessId !== "string" || !command.businessId || !Number.isSafeInteger(command.expectedRevision) || !command.payload || !Number.isFinite(Date.parse(at))) throw new DomainError("command");
  const serialized = canonical(command);
  const key = JSON.stringify([command.businessId, command.id]);
  const receipt = state.receipts.find(r => r.key === key);
  if (receipt) {
    if (receipt.canonical !== serialized) throw new DomainError("conflict");
    return { state, result: receipt.result };
  }
  if (command.expectedRevision !== state.revision) throw new DomainError("conflict");
  const p = command.payload;
  let next: Workspace;
  let recordId = command.businessId;
  switch (p.type) {
    case "business":
      if (command.businessId !== "workspace") throw new DomainError("scope");
      recordId = `business:${command.id}`;
      next = createBusiness(state.workspace, recordId, p.name); break;
    case "draft":
      recordId = `entry:${command.businessId.length}:${command.businessId}:${command.id}`;
      next = createDraft(state.workspace, command.businessId, p.input, recordId, at); break;
    case "post":
      recordId = p.entryId;
      next = postDraft(state.workspace, command.businessId, p.entryId, p.revision, at); break;
    case "reverse":
      recordId = `reversal:${command.businessId.length}:${command.businessId}:${command.id}`;
      next = reversePosting(state.workspace, command.businessId, p.entryId, p.date, recordId, at);
      recordId = next.entries.find(e => e.businessId === command.businessId && e.reverses === p.entryId)!.id;
      break;
    case "archive": next = archiveBusiness(state.workspace, command.businessId, at); break;
    case "profile": next = changeProfile(state.workspace, { ...p.change, businessId: command.businessId }); break;
    default: throw new DomainError("command");
  }
  next = migrateWorkspace(next);
  assertPreservedHistory(state.workspace, next);
  const result = { commandId: command.id, recordId, revision: state.revision + 1 };
  return { state: { ...state, revision: result.revision, workspace: next, receipts: [...state.receipts, { key, canonical: serialized, result }] }, result };
}
