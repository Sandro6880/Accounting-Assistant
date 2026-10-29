// SPDX-License-Identifier: MPL-2.0
import { Overview } from "../features/Overview.tsx";
import { Entries } from "../features/Entries.tsx";
import { Businesses } from "../features/Businesses.tsx";
import { TestLab } from "../features/TestLab.tsx";
import { Roadmap } from "../features/Roadmap.tsx";

// Typed navigation registry. Businesses are records, never separate pages.
export const modules = [
  { id: "overview", symbol: "◈", View: Overview },
  { id: "entries", symbol: "≡", View: Entries },
  { id: "businesses", symbol: "▦", View: Businesses },
  { id: "lab", symbol: "✓", View: TestLab },
  { id: "roadmap", symbol: "→", View: Roadmap },
] as const;
export type ModuleId = (typeof modules)[number]["id"];
