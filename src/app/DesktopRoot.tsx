// SPDX-License-Identifier: MPL-2.0
import { useEffect, useState } from "react";
import { App } from "./App.tsx";
import { translator, errorText } from "./i18n.ts";
import { DesktopClient, desktopRequest } from "../infrastructure/desktop-client.ts";
import type { CommandState } from "../application/commands.ts";
import type { Language } from "../domain/money.ts";

export function DesktopRoot() {
  const [client, setClient] = useState<DesktopClient | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [epoch, setEpoch] = useState(0);
  const t = translator(language);
  useEffect(() => {
    desktopRequest<{ exists: boolean }>({ action: "status" }).then(s => setExists(s.exists)).catch(setError);
    return window.accountingDesktop!.onLock(() => { setClient(null); setEpoch(e => e + 1); });
  }, []);
  return <>
    <header className="vault-bar">
      <strong>{t("vaultTitle")}</strong>
      {client ? <button onClick={() => { desktopRequest({ action: "lock" }).catch(setError); }}>{t("lock")}</button> : <div className="language-toggle">{(["en", "de"] as const).map(l => <button key={l} aria-pressed={l === language} onClick={() => setLanguage(l)}>{l.toUpperCase()}</button>)}</div>}
    </header>
    {client ? <App session={{ application: client, repository: client }} languageChanged={setLanguage} /> : <main className="vault-gate" key={epoch}>
      <p className="eyebrow">{t("synthetic")}</p><h1>{t("vaultTitle")}</h1><p>{t("vaultHelp")}</p>
      <form className="panel business-form" onSubmit={async event => {
        event.preventDefault(); const form = event.currentTarget; let passphrase = String(new FormData(form).get("passphrase"));
        form.reset(); setBusy(true); setError(null);
        try { if (!exists) { await desktopRequest({ action: "create", passphrase }); setExists(true); } const state = await desktopRequest<CommandState>({ action: "unlock", passphrase }); setClient(new DesktopClient(state)); } catch (cause) { setError(cause); } finally { passphrase = ""; setBusy(false); }
      }}>
        <label>{t("passphrase")}<input name="passphrase" type="password" minLength={12} maxLength={256} required autoComplete={exists ? "current-password" : "new-password"} /></label>
        <button disabled={busy || exists === null} className="primary">{busy ? t("busy") : t(exists ? "unlock" : "createVault")}</button>
      </form>
      <p className="muted">{t("lockedHelp")}</p>
      <details className="panel"><summary>{t("restore")}</summary><p>{t("restoreHelp")}</p>
        <form className="business-form" onSubmit={async event => {
          event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); form.reset(); setBusy(true); setError(null);
          try { const result = await desktopRequest({ action: "restore", backupPassphrase: String(data.get("backup")), newPassphrase: String(data.get("new")) }); if (result) setExists(true); } catch (cause) { setError(cause); } finally { setBusy(false); }
        }}>
          <label>{t("backupPassphrase")}<input name="backup" type="password" minLength={12} maxLength={256} required /></label>
          <label>{t("newPassphrase")}<input name="new" type="password" minLength={12} maxLength={256} required /></label>
          <button disabled={busy}>{t("restore")}</button>
        </form>
      </details>
    </main>}
    {error !== null && <p role="alert" className="error vault-bar">{errorText(error, language)}</p>}
  </>;
}
