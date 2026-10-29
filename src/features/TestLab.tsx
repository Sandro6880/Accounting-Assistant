// SPDX-License-Identifier: MPL-2.0
import { useState } from "react";
import { runBrowserChecks } from "../verification/browser-checks.ts";
import type { BrowserCheck } from "../verification/browser-checks.ts";
import type { ViewContext } from "../app/context.ts";

export function TestLab({ t }: ViewContext) {
  const [results, setResults] = useState<BrowserCheck[]>([]);
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">04 / {t("lab")}</p>
          <h1>{t("lab")}</h1>
        </div>
        <span className="pill">
          {results.length
            ? `${results.filter((result) => result.passed).length}/${results.length}`
            : t("notRun")}
        </span>
      </div>
      <article className="panel">
        <p>{t("labHelp")}</p>
        <p className="mono muted">{t("localSuite")}</p>
        <button
          type="button"
          className="primary"
          onClick={() => setResults(runBrowserChecks())}
        >
          {t("run")}
        </button>
      </article>
      <div className="panel" aria-live="polite">
        {!results.length ? (
          <p>{t("notRun")}</p>
        ) : (
          results.map((result) => (
            <div className="check-row" key={result.name}>
              <span>{result.name}</span>
              <strong className={result.passed ? "success" : "error"}>
                {t(result.passed ? "pass" : "fail")}
              </strong>
              <small>{result.milliseconds.toFixed(2)} ms</small>
              {result.detail && <p>{result.detail}</p>}
            </div>
          ))
        )}
      </div>
    </>
  );
}
