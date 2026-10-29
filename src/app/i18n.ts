// SPDX-License-Identifier: MPL-2.0
import { DomainError } from "../domain/money.ts";
import type { Language } from "../domain/money.ts";

const en = {
  title: "Accounting Workspace",
  subtitle: "A clear starting point for your books.",
  overview: "Overview",
  entries: "Entries",
  businesses: "Businesses",
  lab: "Test Lab",
  roadmap: "Roadmap",
  business: "Business",
  language: "Language",
  synthetic: "Synthetic demo",
  safety:
    "Fictional data only. Changes live in session memory and reset on refresh. No password, encryption or durable storage is implemented yet.",
  reset: "Reset demo",
  resetConfirm: "Discard this session and restore the fictional examples?",
  income: "Income",
  expense: "Expense",
  expenses: "Expenses",
  net: "Net movement",
  provisional:
    "Provisional posted EUR totals · drafts excluded · no tax calculation",
  usdWarning:
    "USD records have no EUR valuation. They are shown separately and excluded from EUR totals; the EUR report is incomplete.",
  usd: "USD source records",
  review: "Review queue",
  draftCount: "Drafts waiting to post",
  vat: "VAT treatment unconfirmed",
  vatHelp: "No VAT, deductions or official tax outputs are calculated.",
  workflow: "Try the workflow",
  workflowHelp:
    "Create a fictional draft, post it, inspect its journal, then reverse it. The original remains visible.",
  limits: "Next foundations",
  limitsHelp:
    "Durable offline storage, local access verification, evidence files and legal rule adapters remain roadmap work.",
  newEntry: "New fictional entry",
  description: "Fictional description",
  date: "Date",
  amount: "Amount",
  amountHelp:
    "Decimal amount; dot or comma, up to two decimal places. No thousands separators.",
  currency: "Currency",
  kind: "Type",
  save: "Save draft",
  saved: "Draft saved. It does not affect posted totals.",
  records: "Records",
  status: "Status",
  actions: "Actions",
  draft: "Draft",
  posted: "Posted",
  reversed: "Reversed",
  reversal: "Reversal",
  post: "Post",
  reverse: "Reverse",
  postConfirm:
    "Post this fictional entry? Posted amounts cannot be edited in this starter.",
  reverseConfirm:
    "Append a full reversal of this fictional posting? The original will be retained.",
  journal: "Journal",
  account: "Account",
  side: "Side",
  debit: "Debit",
  credit: "Credit",
  bank: "Bank",
  empty: "No records yet for this fictional business.",
  newBusiness: "Create fictional business",
  businessName: "Fictional business name",
  create: "Create business",
  use: "Use business",
  planning: "Planning profile",
  businessHelp:
    "New profiles start in planning mode with VAT unconfirmed. This is not a business registration.",
  run: "Run browser checks",
  notRun: "Not run",
  pass: "Pass",
  fail: "Fail",
  labHelp:
    "These checks execute in this browser on isolated fictional workspaces. They do not replace Node, build, device or legal review evidence.",
  localSuite:
    "Full local checks: npm run check · browser journey: npm run check:all",
  progressHelp:
    "92 roadmap checkpoints. Starter checks passing do not mark these requirements complete.",
  planned: "Planned",
  inProgress: "In progress",
  verified: "Verified",
  checkpoints: "Checkpoints",
  proof: "Required proof",
  workingOn:
    "Current starting point: P0.C01 — reproduce and inspect the runnable foundation.",
  error: "The action could not be completed. Review the input and try again.",
} as const;
export type TranslationKey = keyof typeof en;
const de: Record<TranslationKey, string> = {
  title: "Buchhaltungswerkstatt",
  subtitle: "Ein klarer Ausgangspunkt für deine Buchhaltung.",
  overview: "Übersicht",
  entries: "Buchungen",
  businesses: "Betriebe",
  lab: "Testlabor",
  roadmap: "Fahrplan",
  business: "Betrieb",
  language: "Sprache",
  synthetic: "Fiktive Demo",
  safety:
    "Nur fiktive Daten. Änderungen bleiben im Arbeitsspeicher und werden beim Neuladen zurückgesetzt. Passwortschutz, Verschlüsselung und dauerhafte Speicherung sind noch nicht umgesetzt.",
  reset: "Demo zurücksetzen",
  resetConfirm:
    "Diese Sitzung verwerfen und die fiktiven Beispiele wiederherstellen?",
  income: "Einnahme",
  expense: "Ausgabe",
  expenses: "Ausgaben",
  net: "Nettobewegung",
  provisional:
    "Vorläufige gebuchte EUR-Summen · ohne Entwürfe · keine Steuerberechnung",
  usdWarning:
    "Für USD-Belege fehlt die EUR-Bewertung. Sie werden getrennt angezeigt und sind nicht in den EUR-Summen enthalten; die EUR-Auswertung ist unvollständig.",
  usd: "USD-Originalbeträge",
  review: "Zur Prüfung",
  draftCount: "Offene Buchungsentwürfe",
  vat: "Umsatzsteuerstatus ungeklärt",
  vatHelp:
    "Umsatzsteuer, Absetzbarkeit und amtliche Steuererklärungen werden nicht berechnet.",
  workflow: "Ablauf ausprobieren",
  workflowHelp:
    "Einen fiktiven Entwurf anlegen, buchen, das Journal prüfen und anschließend stornieren. Das Original bleibt sichtbar.",
  limits: "Nächste Grundlagen",
  limitsHelp:
    "Dauerhafte Offline-Speicherung, lokale Zugriffsprüfung, Belege und rechtliche Regeladapter bleiben Fahrplanaufgaben.",
  newEntry: "Neuer fiktiver Entwurf",
  description: "Fiktive Beschreibung",
  date: "Datum",
  amount: "Betrag",
  amountHelp:
    "Dezimalbetrag mit Punkt oder Komma, höchstens zwei Nachkommastellen. Keine Tausendertrennzeichen.",
  currency: "Währung",
  kind: "Art",
  save: "Entwurf speichern",
  saved: "Entwurf gespeichert. Gebuchte Summen bleiben unverändert.",
  records: "Einträge",
  status: "Status",
  actions: "Aktionen",
  draft: "Entwurf",
  posted: "Gebucht",
  reversed: "Storniert",
  reversal: "Stornobuchung",
  post: "Buchen",
  reverse: "Stornieren",
  postConfirm:
    "Diesen fiktiven Entwurf buchen? Gebuchte Beträge können in dieser Version nicht bearbeitet werden.",
  reverseConfirm:
    "Eine vollständige Stornobuchung für diesen fiktiven Eintrag ergänzen? Das Original bleibt erhalten.",
  journal: "Journal",
  account: "Konto",
  side: "Seite",
  debit: "Soll",
  credit: "Haben",
  bank: "Bank",
  empty: "Noch keine Einträge für diesen fiktiven Betrieb.",
  newBusiness: "Fiktiven Betrieb anlegen",
  businessName: "Fiktiver Betriebsname",
  create: "Betrieb anlegen",
  use: "Betrieb auswählen",
  planning: "Planungsprofil",
  businessHelp:
    "Neue Profile starten im Planungsmodus mit ungeklärtem Umsatzsteuerstatus. Dies ist keine Gewerbeanmeldung.",
  run: "Browser-Prüfungen starten",
  notRun: "Nicht ausgeführt",
  pass: "Bestanden",
  fail: "Fehlgeschlagen",
  labHelp:
    "Diese Prüfungen laufen im Browser mit isolierten fiktiven Daten. Sie ersetzen keine Node-, Build-, Geräte- oder rechtliche Prüfung.",
  localSuite:
    "Lokale Prüfungen: npm run check · Browser-Ablauf: npm run check:all",
  progressHelp:
    "92 Fahrplan-Checkpoints. Bestandene Starter-Prüfungen bedeuten nicht, dass diese Anforderungen abgeschlossen sind.",
  planned: "Geplant",
  inProgress: "In Arbeit",
  verified: "Geprüft",
  checkpoints: "Checkpoints",
  proof: "Erforderlicher Nachweis",
  workingOn:
    "Aktueller Ausgangspunkt: P0.C01 — die lauffähige Grundlage nachvollziehen und prüfen.",
  error:
    "Die Aktion konnte nicht abgeschlossen werden. Eingaben prüfen und erneut versuchen.",
};
export type Translator = (key: TranslationKey) => string;
export const translator =
  (language: Language): Translator =>
  (key) =>
    (language === "de" ? de : en)[key];

export function errorText(error: unknown, language: Language): string {
  const messages: Record<string, [string, string]> = {
    amount: [
      "Enter a positive decimal amount with at most two decimal places.",
      "Einen positiven Dezimalbetrag mit höchstens zwei Nachkommastellen eingeben.",
    ],
    description: [
      "Enter a fictional description (1–200 characters).",
      "Eine fiktive Beschreibung mit 1–200 Zeichen eingeben.",
    ],
    date: [
      "Enter a valid calendar date.",
      "Ein gültiges Kalenderdatum eingeben.",
    ],
    currency: [
      "Only EUR and USD are supported.",
      "Nur EUR und USD werden unterstützt.",
    ],
    scope: [
      "This record belongs to a different business.",
      "Dieser Eintrag gehört zu einem anderen Betrieb.",
    ],
    conflict: [
      "The record changed. Review the current version.",
      "Der Eintrag wurde geändert. Aktuelle Version prüfen.",
    ],
    businessName: [
      "Enter a fictional business name (1–80 characters).",
      "Einen fiktiven Betriebsnamen mit 1–80 Zeichen eingeben.",
    ],
    reversal: [
      "Only an original posted entry can be reversed.",
      "Nur eine gebuchte Originalbuchung kann storniert werden.",
    ],
    reversalDate: [
      "A reversal cannot precede its original posting.",
      "Eine Stornobuchung darf nicht vor der Originalbuchung liegen.",
    ],
    synthetic: [
      "This starter only accepts its synthetic workspace.",
      "Dieser Starter akzeptiert nur seinen fiktiven Arbeitsbereich.",
    ],
  };
  const message =
    error instanceof DomainError ? messages[error.code] : undefined;
  return message?.[language === "de" ? 1 : 0] ?? translator(language)("error");
}
