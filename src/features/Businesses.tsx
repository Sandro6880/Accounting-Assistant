// SPDX-License-Identifier: MPL-2.0
import { useState } from "react";
import { errorText } from "../app/i18n.ts";
import type { ViewContext } from "../app/context.ts";

export function Businesses({
  workspace,
  application,
  selectBusiness,
  language,
  t,
}: ViewContext) {
  const [name, setName] = useState("");
  const [error, setError] = useState<unknown>(null);
  const complete = (result: string) => { selectBusiness(result); setName(""); setError(null); };
  const perform = (result: void | Promise<void>) => { if (result instanceof Promise) result.then(() => setError(null)).catch(setError); else setError(null); };
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">03 / {t("businesses")}</p>
          <h1>{t("newBusiness")}</h1>
        </div>
      </div>
      <p className="muted">{t("businessHelp")}</p>
      <form
        className="panel business-form"
        onSubmit={(event) => {
          event.preventDefault();
          try {
            const id = application.addBusiness(name);
            if (id instanceof Promise) id.then(complete).catch(setError); else complete(id);
          } catch (cause) {
            setError(cause);
          }
        }}
      >
        <label>
          {t("businessName")}
          <input
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <button className="primary" type="submit">
          {t("create")}
        </button>
        {error !== null && (
          <p role="alert" className="error">
            {errorText(error, language)}
          </p>
        )}
      </form>
      <div className="business-grid">
        {workspace.businesses.map((business) => (
          <article className="panel" key={business.id}>
            <span className="pill">AT · EUR</span>
            <h2>{business.name}</h2>
            <p className="muted">
              {business.legalForm === "planning"
                ? t("planning")
                : t("soleTrader")}{" "}
              · {t("vat")}
            </p>
            <button type="button" onClick={() => selectBusiness(business.id)}>
              {t("use")}
            </button>
            {business.archivedAt ? <p className="muted">{t("archived")} · {business.archivedAt.slice(0, 10)}</p> : <button type="button" onClick={() => {
              if (window.confirm(t("archiveConfirm"))) try { perform(application.archive(business.id)); } catch (cause) { setError(cause); }
            }}>{t("archive")}</button>}
            <details><summary>{t("profileHistory")}</summary>
              {(workspace.ownership?.profiles ?? []).filter(p => p.businessId === business.id).map(p => <p key={p.effectiveFrom}>{p.effectiveFrom} · {t(p.vat === "unknown" ? "unknown" : p.vat === "exempt" ? "exempt" : "registered")} · {t(p.method === "unknown" ? "unknown" : "cashBasis")}</p>)}
              {!business.archivedAt && <form className="business-form" onSubmit={event => {
                event.preventDefault(); const data = new FormData(event.currentTarget);
                try { perform(application.profile({ businessId: business.id, effectiveFrom: String(data.get("effective")), vat: data.get("vat") as "unknown" | "exempt" | "registered", method: data.get("method") as "unknown" | "cash-basis" })); } catch (cause) { setError(cause); }
              }}>
                <label>{t("effectiveFrom")}<input name="effective" type="date" required /></label>
                <label>{t("vatProfile")}<select name="vat"><option value="unknown">{t("unknown")}</option><option value="exempt">{t("exempt")}</option><option value="registered">{t("registered")}</option></select></label>
                <label>{t("accountingMethod")}<select name="method"><option value="unknown">{t("unknown")}</option><option value="cash-basis">{t("cashBasis")}</option></select></label>
                <button>{t("saveProfile")}</button>
              </form>}
            </details>
          </article>
        ))}
      </div>
    </>
  );
}
