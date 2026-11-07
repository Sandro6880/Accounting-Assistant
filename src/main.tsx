// SPDX-License-Identifier: MPL-2.0
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.tsx";
import { DesktopRoot } from "./app/DesktopRoot.tsx";
import "./styles.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing application root");
createRoot(root).render(
  <StrictMode>
    {window.accountingDesktop ? <DesktopRoot /> : <App />}
  </StrictMode>,
);
