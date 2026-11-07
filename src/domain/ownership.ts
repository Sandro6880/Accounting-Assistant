// SPDX-License-Identifier: MPL-2.0
import type { Workspace } from "./ledger.ts";
import { assertSynthetic, requireBusiness, validateDate } from "./ledger.ts";
import { DomainError } from "./money.ts";

export interface ProfileChange {
  readonly businessId: string;
  readonly effectiveFrom: string;
  readonly vat: "unknown" | "exempt" | "registered";
  readonly method: "unknown" | "cash-basis";
}
export interface Ownership {
  readonly version: 1;
  readonly entities: readonly { id: string; name: string; kind: "unknown" | "sole-trader" }[];
  readonly scopes: readonly { id: string; entityId: string; currency: "EUR"; status: "unknown" | "confirmed" }[];
  readonly memberships: readonly { businessId: string; scopeId: string; effectiveFrom: string }[];
  readonly activities: readonly { id: string; businessId: string; name: string }[];
  readonly projects: readonly { id: string; businessId: string; activityId: string; name: string }[];
  readonly personalIncome: readonly { id: string; entityId: string; date: string; currency: "EUR" | "USD"; cents: bigint }[];
  readonly profiles: readonly ProfileChange[];
}
export type StructuredWorkspace = Workspace & { readonly ownership: Ownership };

// Additive, deterministic migration: no IDs, financial facts or totals are rewritten.
// A label is never used to infer that two businesses are one taxpayer.
export function migrateWorkspace(input: Workspace): StructuredWorkspace {
  assertSynthetic(input);
  const existing = input.ownership;
  if (existing && existing.version !== 1) throw new DomainError("schema");
  const missing = input.businesses.filter(b => !existing?.profiles.some(p => p.businessId === b.id));
  if (existing && !missing.length) return input as StructuredWorkspace;
  return { ...input, ownership: {
    version: 1,
    entities: [...(existing?.entities ?? []), ...missing.map(b => ({ id: `entity:${b.id}`, name: b.name, kind: "unknown" as const }))],
    scopes: [...(existing?.scopes ?? []), ...missing.map(b => ({ id: `scope:${b.id}`, entityId: `entity:${b.id}`, currency: "EUR" as const, status: "unknown" as const }))],
    memberships: [...(existing?.memberships ?? []), ...missing.map(b => ({ businessId: b.id, scopeId: `scope:${b.id}`, effectiveFrom: "0001-01-01" }))],
    activities: existing?.activities ?? [], projects: existing?.projects ?? [], personalIncome: existing?.personalIncome ?? [],
    profiles: [...(existing?.profiles ?? []), ...missing.map(b => ({ businessId: b.id, effectiveFrom: "0001-01-01", vat: "unknown" as const, method: "unknown" as const }))],
  } };
}

export function assertWritable(workspace: Workspace, businessId: string): void {
  if (requireBusiness(workspace, businessId).archivedAt) throw new DomainError("archived");
}
export function archiveBusiness(workspace: Workspace, businessId: string, at: string): Workspace {
  assertSynthetic(workspace);
  const business = requireBusiness(workspace, businessId);
  if (business.archivedAt) return workspace;
  if (!Number.isFinite(Date.parse(at))) throw new DomainError("date");
  return { ...workspace, businesses: workspace.businesses.map(b => b.id === businessId ? { ...b, archivedAt: at } : b) };
}
export function changeProfile(workspace: Workspace, change: ProfileChange): Workspace {
  assertWritable(workspace, change.businessId);
  validateDate(change.effectiveFrom);
  if (!["unknown", "exempt", "registered"].includes(change.vat) || !["unknown", "cash-basis"].includes(change.method)) throw new DomainError("profile");
  const state = migrateWorkspace(workspace);
  const latest = state.ownership.profiles.filter(p => p.businessId === change.businessId).at(-1)!;
  if (change.effectiveFrom <= latest.effectiveFrom) throw new DomainError("conflict");
  return { ...state, ownership: { ...state.ownership, profiles: [...state.ownership.profiles, { ...change }] } };
}
export function addProject(workspace: Workspace, project: Ownership["projects"][number]): Workspace {
  assertWritable(workspace, project.businessId);
  const state = migrateWorkspace(workspace);
  if (!state.ownership.activities.some(a => a.id === project.activityId && a.businessId === project.businessId)) throw new DomainError("scope");
  if (!project.id || !project.name.trim() || state.ownership.projects.some(p => p.id === project.id)) throw new DomainError("duplicate");
  return { ...state, ownership: { ...state.ownership, projects: [...state.ownership.projects, { ...project }] } };
}
export function profileOn(workspace: Workspace, businessId: string, date: string): ProfileChange {
  requireBusiness(workspace, businessId); validateDate(date);
  const profile = migrateWorkspace(workspace).ownership.profiles.filter(p => p.businessId === businessId && p.effectiveFrom <= date).at(-1);
  if (!profile) throw new DomainError("profile");
  return profile;
}
