// SPDX-License-Identifier: MPL-2.0
import { useState } from "react";
import { entriesFor } from "../domain/ledger.ts";
import type { DraftInput } from "../domain/ledger.ts";
import { formatMoney } from "../domain/money.ts";
import type { Currency } from "../domain/money.ts";
import { errorText } from "../app/i18n.ts";
import type { ViewContext } from "../app/context.ts";

const emptyForm = (): DraftInput => ({
  description: "",
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  currency: "EUR",
  kind: "expense",
});

export function Entries({
  application,
  workspace,
  businessId,
  language,
  t,
}: ViewContext) {
  const [forms, setForms] = useState<Record<string, DraftInput>>({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState<unknown>(null);
  const form = forms[businessId] ?? emptyForm();
  const change = (values: Partial<DraftInput>) => {
    setForms((current) => ({
      ...current,
      [businessId]: { ...form, ...values },
    }));
    setMessage("");
    setError(null);
  };
  const perform = (action: () => void) => {
    try {
      action();
      setError(null);
    } catch (cause) {
      setError(cause);
    }
  };
  const entries = entriesFor(workspace, businessId);
  const journal = workspace.journal.filter(
    (line) => line.businessId === businessId,
  );
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">02 / {t("entries")}</p>
          <h1>{t("newEntry")}</h1>
        </div>
      </div>
      <form
        className="panel entry-form"
        onSubmit={(event) => {
          event.preventDefault();
          perform(() => {
            application.addDraft(businessId, form);
            setForms((current) => ({ ...current, [businessId]: emptyForm() }));
            setMessage("saved");
          });
        }}
      >
        <label className="wide">
          {t("description")}
          <input
            name="description"
            maxLength={200}
            required
            value={form.description}
            onChange={(event) => change({ description: event.target.value })}
          />
        </label>
        <label>
          {t("date")}
          <input
            name="date"
            type="date"
            required
            value={form.date}
            onChange={(event) => change({ date: event.target.value })}
          />
        </label>
        <label>
          {t("kind")}
          <select
            name="kind"
            value={form.kind}
            onChange={(event) =>
              change({ kind: event.target.value as DraftInput["kind"] })
            }
          >
            <option value="expense">{t("expense")}</option>
            <option value="income">{t("income")}</option>
          </select>
        </label>
        <label>
          {t("amount")}
          <input
            name="amount"
            inputMode="decimal"
            aria-describedby="amount-help"
            required
            value={form.amount}
            onChange={(event) => change({ amount: event.target.value })}
          />
        </label>
        <label>
          {t("currency")}
          <select
            name="currency"
            value={form.currency}
            onChange={(event) =>
              change({ currency: event.target.value as Currency })
            }
          >
            <option>EUR</option>
            <option>USD</option>
          </select>
        </label>
        <p id="amount-help" className="muted wide">
          {t("amountHelp")}
        </p>
        <button className="primary" type="submit">
          {t("save")}
        </button>
        {message && <p role="status">{t("saved")}</p>}
        {error !== null && (
          <p role="alert" className="error wide">
            {errorText(error, language)}
          </p>
        )}
      </form>
      <article className="panel">
        <h2>{t("records")}</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("date")}</th>
                <th>{t("description")}</th>
                <th>{t("kind")}</th>
                <th>{t("amount")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const reversed = entries.some(
                  (item) => item.reverses === entry.id,
                );
                return (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.description}</td>
                    <td>{t(entry.kind)}</td>
                    <td className="money">
                      {formatMoney(entry.cents, entry.currency, language)}
                    </td>
                    <td>
                      <span className={`tag ${entry.status}`}>
                        {t(
                          entry.reverses
                            ? "reversal"
                            : reversed
                              ? "reversed"
                              : entry.status,
                        )}
                      </span>
                    </td>
                    <td>
                      {entry.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(t("postConfirm")))
                              perform(() =>
                                application.post(
                                  businessId,
                                  entry.id,
                                  entry.revision,
                                ),
                              );
                          }}
                        >
                          {t("post")}
                        </button>
                      ) : (
                        !entry.reverses &&
                        !reversed && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(t("reverseConfirm")))
                                perform(() =>
                                  application.reverse(
                                    businessId,
                                    entry.id,
                                    new Date().toISOString().slice(0, 10),
                                  ),
                                );
                            }}
                          >
                            {t("reverse")}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
              {!entries.length && (
                <tr>
                  <td colSpan={6}>{t("empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
      <details className="panel">
        <summary>
          {t("journal")} · {journal.length}
        </summary>
        <p className="muted">{t("vatHelp")}</p>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t("account")}</th>
                <th>{t("side")}</th>
                <th>{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {journal.map((line, index) => (
                <tr key={`${line.entryId}-${index}`}>
                  <td>{t(line.account)}</td>
                  <td>{t(line.side)}</td>
                  <td>{formatMoney(line.cents, line.currency, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
