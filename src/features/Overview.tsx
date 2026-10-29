// SPDX-License-Identifier: MPL-2.0
import { entriesFor, totalsFor } from "../domain/ledger.ts";
import { formatMoney } from "../domain/money.ts";
import type { ViewContext } from "../app/context.ts";

export function Overview({ workspace, businessId, language, t }: ViewContext) {
  const eur = totalsFor(workspace, businessId, "EUR");
  const usd = totalsFor(workspace, businessId, "USD");
  const entries = entriesFor(workspace, businessId);
  const usdPending = entries.some(
    (entry) => entry.currency === "USD" && entry.status === "posted",
  );
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">01 / {t("overview")}</p>
          <h1>{t("subtitle")}</h1>
        </div>
        <span className="pill">EUR · USD</span>
      </div>
      <p className="muted">{t("provisional")}</p>
      <div className="stats">
        {(
          [
            ["income", eur.income],
            ["expenses", eur.expenses],
            ["net", eur.net],
          ] as const
        ).map(([label, cents]) => (
          <article
            className={`stat ${label === "net" ? "highlight" : ""}`}
            key={label}
          >
            <span>{t(label)}</span>
            <strong data-testid={`total-${label}`}>
              {formatMoney(cents, "EUR", language)}
            </strong>
            <small>EUR</small>
          </article>
        ))}
      </div>
      {usdPending && (
        <div className="notice" role="status">
          {t("usdWarning")}{" "}
          <strong>{formatMoney(usd.net, "USD", language)}</strong>
        </div>
      )}
      <div className="two-columns">
        <article className="panel">
          <h2>{t("review")}</h2>
          <div className="queue-row">
            <span>{t("draftCount")}</span>
            <strong>
              {entries.filter((entry) => entry.status === "draft").length}
            </strong>
          </div>
          <div className="queue-row">
            <span>{t("vat")}</span>
            <span className="dot" />
          </div>
          <p className="muted">{t("vatHelp")}</p>
        </article>
        <article className="panel">
          <h2>{t("workflow")}</h2>
          <p>{t("workflowHelp")}</p>
          <hr />
          <h3>{t("limits")}</h3>
          <p className="muted">{t("limitsHelp")}</p>
        </article>
      </div>
    </>
  );
}
