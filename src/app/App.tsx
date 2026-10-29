// SPDX-License-Identifier: MPL-2.0
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { AccountingApplication } from "../application/accounting.ts";
import { MemoryRepository } from "../infrastructure/memory-repository.ts";
import { createSyntheticWorkspace } from "../demo/fixture.ts";
import { assertSynthetic } from "../domain/ledger.ts";
import type { Language } from "../domain/money.ts";
import { translator } from "./i18n.ts";
import { modules } from "./modules.ts";
import type { ModuleId } from "./modules.ts";

export function App() {
  const [repository, setRepository] = useState(
    () => new MemoryRepository(createSyntheticWorkspace()),
  );
  const application = useMemo(
    () => new AccountingApplication(repository),
    [repository],
  );
  const workspace = useSyncExternalStore(
    repository.subscribe,
    repository.getSnapshot,
  );
  const [businessId, setBusinessId] = useState("demo-consulting");
  const [active, setActive] = useState<ModuleId>("overview");
  const [language, setLanguage] = useState<Language>("en");
  const [epoch, setEpoch] = useState(0);
  const t = translator(language);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const context = {
    application,
    workspace,
    businessId,
    selectBusiness: setBusinessId,
    language,
    t,
  };
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">a.</span>
          <div>
            <strong>Accounting</strong>
            <small>WORKSPACE</small>
          </div>
        </div>
        <p className="sidebar-caption">{t("synthetic")} / 0.1.0</p>
        <nav aria-label={t("title")}>
          {modules.map((module) => (
            <button
              type="button"
              key={module.id}
              aria-current={active === module.id ? "page" : undefined}
              onClick={() => setActive(module.id)}
            >
              <span aria-hidden="true">{module.symbol}</span>
              {t(module.id)}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="live-dot" /> {t("synthetic")}
          <small>MPL-2.0 · AT / EU</small>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <label>
            {t("business")}
            <select
              aria-label={t("business")}
              value={businessId}
              onChange={(event) => setBusinessId(event.target.value)}
            >
              {workspace.businesses.map((business) => (
                <option value={business.id} key={business.id}>
                  {business.name}
                </option>
              ))}
            </select>
          </label>
          <div className="top-actions">
            <div
              className="language-toggle"
              role="group"
              aria-label={t("language")}
            >
              {(["en", "de"] as const).map((code) => (
                <button
                  type="button"
                  key={code}
                  aria-pressed={language === code}
                  onClick={() => setLanguage(code)}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                assertSynthetic(workspace);
                if (window.confirm(t("resetConfirm"))) {
                  setRepository(
                    new MemoryRepository(createSyntheticWorkspace()),
                  );
                  setBusinessId("demo-consulting");
                  setActive("overview");
                  setEpoch((value) => value + 1);
                }
              }}
            >
              {t("reset")}
            </button>
          </div>
        </header>
        <div className="safety-banner" role="note">
          <strong>{t("synthetic")}.</strong> {t("safety")}
        </div>
        <main>
          {modules.map(({ id, View }) => (
            <section
              hidden={active !== id}
              key={`${epoch}-${id}`}
              aria-label={t(id)}
            >
              <View {...context} />
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
