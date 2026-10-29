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
            selectBusiness(id);
            setName("");
            setError(null);
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
                : "Einzelunternehmen"}{" "}
              · {t("vat")}
            </p>
            <button type="button" onClick={() => selectBusiness(business.id)}>
              {t("use")}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
