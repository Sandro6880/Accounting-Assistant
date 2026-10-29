// SPDX-License-Identifier: MPL-2.0
import { assertSynthetic, assertPreservedHistory } from "../domain/ledger.ts";
import type { Workspace } from "../domain/ledger.ts";
import type { WorkspaceRepository } from "../application/accounting.ts";

function freeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

export class MemoryRepository implements WorkspaceRepository {
  private state: Workspace;
  private readonly listeners = new Set<() => void>();
  constructor(initial: Workspace) {
    assertSynthetic(initial);
    this.state = freeze(structuredClone(initial));
  }
  getSnapshot = (): Workspace => this.state;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  transact = (change: (current: Workspace) => Workspace): void => {
    assertSynthetic(this.state);
    const next = change(this.state);
    assertSynthetic(next);
    assertPreservedHistory(this.state, next);
    if (next === this.state) return;
    this.state = freeze(next);
    for (const listener of this.listeners) listener();
  };
}
