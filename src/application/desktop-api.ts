// SPDX-License-Identifier: MPL-2.0
import type { Command } from "./commands.ts";
export type DesktopRequest =
  | { action: "status" | "lock" }
  | { action: "create" | "unlock" | "recovery"; passphrase: string }
  | { action: "command"; command: Command }
  | { action: "list" | "attach"; businessId: string; entryId?: string }
  | { action: "read"; businessId: string; id: string }
  | { action: "backup"; passphrase: string; backupPassphrase: string }
  | { action: "restore"; backupPassphrase: string; newPassphrase: string };
export interface DesktopResponse { ok: boolean; data?: string; code?: string }
export interface DesktopBridge {
  request(request: DesktopRequest): Promise<DesktopResponse>;
  onLock(listener: () => void): () => void;
}
declare global { interface Window { accountingDesktop?: DesktopBridge } }
