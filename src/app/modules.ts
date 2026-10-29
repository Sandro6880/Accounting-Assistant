// SPDX-License-Identifier: MPL-2.0
import { Overview } from "../features/Overview.tsx";
import { Entries } from "../features/Entries.tsx";
import { Businesses } from "../features/Businesses.tsx";
export const modules = [
  { id: "overview", symbol: "◈", View: Overview },
  { id: "entries", symbol: "≡", View: Entries },
  { id: "businesses", symbol: "▦", View: Businesses },
] as const;
export type ModuleId = typeof modules[number]["id"];
