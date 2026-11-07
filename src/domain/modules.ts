// SPDX-License-Identifier: MPL-2.0
import { DomainError } from "./money.ts";
export interface ModuleDefinition {
  id: string;
  mandatory: boolean;
  dependencies: readonly string[];
  routes: readonly string[];
  commands: readonly string[];
  reports: readonly string[];
}
export const foundationModules: readonly ModuleDefinition[] = [
  { id: "security", mandatory: true, dependencies: [], routes: ["/vault"], commands: ["lock", "unlock"], reports: [] },
  { id: "accounting", mandatory: true, dependencies: ["security"], routes: ["/entries"], commands: ["draft", "post", "reverse"], reports: ["source-totals"] },
  { id: "businesses", mandatory: true, dependencies: ["accounting"], routes: ["/businesses"], commands: ["business", "archive", "profile"], reports: [] },
  { id: "evidence", mandatory: false, dependencies: ["accounting", "security"], routes: ["/evidence"], commands: ["attach"], reports: ["evidence-inventory"] },
];
export function validateModules(registry: readonly ModuleDefinition[], enabled: readonly string[]): void {
  const ids = new Set(registry.map(m => m.id));
  if (ids.size !== registry.length || new Set(enabled).size !== enabled.length || enabled.some(id => !ids.has(id))) throw new DomainError("module");
  for (const key of ["routes", "commands", "reports"] as const) {
    const contributions = registry.flatMap(m => [...m[key]]);
    if (new Set(contributions).size !== contributions.length) throw new DomainError("module");
  }
  for (const item of registry) {
    if (item.mandatory && !enabled.includes(item.id)) throw new DomainError("module");
    if (item.dependencies.some(id => !ids.has(id) || (enabled.includes(item.id) && !enabled.includes(id)))) throw new DomainError("module");
    const visit = (id: string, ancestors: string[]) => {
      if (ancestors.includes(id)) throw new DomainError("module");
      for (const dependency of registry.find(m => m.id === id)!.dependencies) visit(dependency, [...ancestors, id]);
    };
    visit(item.id, []);
  }
}
export function moduleAccess(registry: readonly ModuleDefinition[], enabled: readonly string[], id: string): "write" | "read-only" {
  validateModules(registry, enabled);
  if (!registry.some(m => m.id === id)) throw new DomainError("module");
  return enabled.includes(id) ? "write" : "read-only";
}
