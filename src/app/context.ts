// SPDX-License-Identifier: MPL-2.0
import type { AccountingApplication } from "../application/accounting.ts";
import type { Workspace } from "../domain/ledger.ts";
import type { Language } from "../domain/money.ts";
import type { Translator } from "./i18n.ts";

export interface ViewContext {
  application: AccountingApplication;
  workspace: Workspace;
  businessId: string;
  selectBusiness: (id: string) => void;
  language: Language;
  t: Translator;
}
