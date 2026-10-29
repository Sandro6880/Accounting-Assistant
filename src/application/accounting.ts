// SPDX-License-Identifier: MPL-2.0
import {
  createBusiness,
  createDraft,
  postDraft,
  reversePosting,
} from "../domain/ledger.ts";
import type { DraftInput, Workspace } from "../domain/ledger.ts";

export interface WorkspaceRepository {
  getSnapshot: () => Workspace;
  subscribe: (listener: () => void) => () => void;
  transact: (change: (current: Workspace) => Workspace) => void;
}

export class AccountingApplication {
  readonly repository: WorkspaceRepository;
  private readonly id: () => string;
  private readonly now: () => string;
  constructor(
    repository: WorkspaceRepository,
    id: () => string = () => crypto.randomUUID(),
    now: () => string = () => new Date().toISOString(),
  ) {
    this.repository = repository;
    this.id = id;
    this.now = now;
  }
  addBusiness(name: string): string {
    const id = this.id();
    this.repository.transact((state) => createBusiness(state, id, name));
    return id;
  }
  addDraft(businessId: string, input: DraftInput): string {
    const id = this.id();
    this.repository.transact((state) =>
      createDraft(state, businessId, input, id, this.now()),
    );
    return id;
  }
  post(businessId: string, entryId: string, revision: number): void {
    this.repository.transact((state) =>
      postDraft(state, businessId, entryId, revision, this.now()),
    );
  }
  reverse(businessId: string, entryId: string, date: string): void {
    const id = this.id();
    this.repository.transact((state) =>
      reversePosting(state, businessId, entryId, date, id, this.now()),
    );
  }
}
