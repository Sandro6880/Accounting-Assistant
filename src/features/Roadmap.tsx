// SPDX-License-Identifier: MPL-2.0
import manifest from "../../project/checkpoints.json";
import type { ViewContext } from "../app/context.ts";

export function Roadmap({ t }: ViewContext) {
  const phases = [...new Set(manifest.checkpoints.map((item) => item.phase))];
  return (
    <>
      <div className="section-title">
        <div>
          <p className="eyebrow">05 / {t("roadmap")}</p>
          <h1>{t("roadmap")}</h1>
        </div>
        <span className="pill">17 · 92</span>
      </div>
      <p>{t("progressHelp")}</p>
      <div className="notice">{t("workingOn")}</div>
      {phases.map((phase) => (
        <details className="panel" key={phase}>
          <summary>
            {phase} ·{" "}
            {manifest.checkpoints.filter((item) => item.phase === phase).length}{" "}
            {t("checkpoints")}
          </summary>
          {manifest.checkpoints
            .filter((item) => item.phase === phase)
            .map((item) => (
              <article className="checkpoint" key={item.id}>
                <div>
                  <strong>{item.id}</strong>
                  <span className="tag">
                    {t(
                      item.status === "in-progress" ? "inProgress" : "planned",
                    )}
                  </span>
                </div>
                <p>{item.summary}</p>
                <p className="muted">
                  <strong>{t("proof")}:</strong> {item.proof}
                </p>
              </article>
            ))}
        </details>
      ))}
    </>
  );
}
