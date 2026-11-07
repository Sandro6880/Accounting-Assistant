// SPDX-License-Identifier: MPL-2.0
import { useEffect, useState } from "react";
import type { ViewContext } from "../app/context.ts";
import { desktopRequest } from "../infrastructure/desktop-client.ts";
import { errorText } from "../app/i18n.ts";
interface FileMetadata { id: string; name: string; size: number; sha256: string; mediaType: string }
export function Storage({ workspace, businessId, t, language }: ViewContext) {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<unknown>(null);
  const [message, setMessage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    setNote(""); setFiles([]); setError(null);
    let active = true;
    if (window.accountingDesktop) desktopRequest<FileMetadata[]>({ action: "list", businessId }).then(value => { if (active) setFiles(value); }).catch(cause => { if (active) setError(cause); });
    return () => { active = false; };
  }, [businessId, epoch]);
  if (!window.accountingDesktop) return <article className="panel"><h1>{t("storage")}</h1><p>{t("desktopOnly")}</p></article>;
  return <>
    <h1>{t("storage")}</h1><p>{t("lockedHelp")}</p>
    <article className="panel"><h2>{t("evidenceNote")}</h2><p>{t("attachmentHelp")}</p>
      <form className="business-form" onSubmit={async event => {
        event.preventDefault(); const entryId = String(new FormData(event.currentTarget).get("entry")); setBusy(true); setError(null);
        try { await desktopRequest({ action: "attach", businessId, entryId }); setEpoch(n => n + 1); } catch (cause) { setError(cause); } finally { setBusy(false); }
      }}>
        <label>{t("selectEntry")}<select name="entry">{workspace.entries.filter(e => e.businessId === businessId).map(e => <option value={e.id} key={e.id}>{e.description}</option>)}</select></label>
        <button disabled={busy}>{t("attachNote")}</button>
      </form>
      {files.map(f => <article className="checkpoint" key={f.id}><strong>{f.name}</strong><p className="mono">{f.size} bytes · SHA-256 {f.sha256}</p><button onClick={async () => {
        try { const file = await desktopRequest<{ base64: string }>({ action: "read", businessId, id: f.id }); setNote(new TextDecoder().decode(Uint8Array.from(atob(file.base64), c => c.charCodeAt(0)))); } catch (cause) { setError(cause); }
      }} disabled={f.mediaType !== "text/plain"}>{t("readNote")}</button>{f.mediaType !== "text/plain" && <p>{t("opaqueOriginal")}</p>}</article>)}
      {note && <pre className="note-preview">{note}</pre>}
    </article>
    <article className="panel"><h2>{t("backup")}</h2><p>{t("backupHelp")}</p>
      <form className="business-form" onSubmit={async event => {
        event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); form.reset(); setBusy(true); setError(null); setMessage(false);
        try { const result = await desktopRequest({ action: "backup", passphrase: String(data.get("current")), backupPassphrase: String(data.get("backup")) }); setMessage(Boolean(result)); } catch (cause) { setError(cause); } finally { setBusy(false); }
      }}>
        <label>{t("passphrase")}<input name="current" type="password" minLength={12} maxLength={256} required /></label>
        <label>{t("backupPassphrase")}<input name="backup" type="password" minLength={12} maxLength={256} required /></label>
        <button disabled={busy}>{t("backup")}</button>
      </form>
    </article>
    {message && <p role="status">{t("done")}</p>}
    {error !== null && <p role="alert" className="error">{errorText(error, language)}</p>}
  </>;
}
