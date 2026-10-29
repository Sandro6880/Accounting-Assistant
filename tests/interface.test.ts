// SPDX-License-Identifier: MPL-2.0
import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { App } from "../src/app/App.tsx";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://127.0.0.1:5173",
});
for (const name of [
  "window",
  "document",
  "navigator",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLSelectElement",
  "Node",
  "Event",
  "MouseEvent",
  "MutationObserver",
] as const) {
  const value = name === "window" ? dom.window : dom.window[name];
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  });
}
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
dom.window.confirm = () => true;
const { render, fireEvent, cleanup, within } = await import(
  "@testing-library/react"
);
afterEach(() => cleanup());

test("interface creates, posts and reverses a fictional expense without losing its original", () => {
  const ui = render(createElement(App));
  assert.match(ui.getByTestId("total-net").textContent!, /1,120\.10/);
  fireEvent.click(ui.getByRole("button", { name: "Entries" }));
  fireEvent.change(ui.getByLabelText("Fictional description"), {
    target: { value: "DOM fictional expense" },
  });
  fireEvent.change(ui.getByLabelText("Amount", { exact: true }), {
    target: { value: "10,05" },
  });
  fireEvent.change(ui.getByLabelText("Date", { exact: true }), {
    target: { value: "2026-01-20" },
  });
  fireEvent.click(ui.getByRole("button", { name: "Save draft" }));
  const row = ui.getByRole("row", { name: /DOM fictional expense/ });
  fireEvent.click(within(row).getByRole("button", { name: "Post" }));
  fireEvent.click(ui.getByRole("button", { name: "Overview" }));
  assert.match(ui.getByTestId("total-net").textContent!, /1,110\.05/);
  fireEvent.click(ui.getByRole("button", { name: "Entries" }));
  fireEvent.click(
    within(ui.getByRole("row", { name: /DOM fictional expense/ })).getByRole(
      "button",
      { name: "Reverse" },
    ),
  );
  assert.equal(
    ui.getAllByRole("row", { name: /DOM fictional expense/ }).length,
    2,
  );
  fireEvent.click(ui.getByRole("button", { name: "Overview" }));
  assert.match(ui.getByTestId("total-net").textContent!, /1,120\.10/);
});

test("interface preserves unsaved scope across German/business switches and navigation", () => {
  const ui = render(createElement(App));
  fireEvent.click(ui.getByRole("button", { name: "Entries" }));
  fireEvent.change(ui.getByLabelText("Fictional description"), {
    target: { value: "Fictional scoped draft" },
  });
  fireEvent.change(ui.getByLabelText("Amount", { exact: true }), {
    target: { value: "12,34" },
  });
  fireEvent.click(ui.getByRole("button", { name: "DE" }));
  assert.equal(
    (ui.getByLabelText("Fiktive Beschreibung") as HTMLInputElement).value,
    "Fictional scoped draft",
  );
  fireEvent.change(ui.getByLabelText("Betrieb", { exact: true }), {
    target: { value: "demo-studio" },
  });
  assert.equal(
    (ui.getByLabelText("Fiktive Beschreibung") as HTMLInputElement).value,
    "",
  );
  assert.equal(
    ui.queryByRole("row", { name: /Fictional project payment/ }),
    null,
  );
  fireEvent.change(ui.getByLabelText("Betrieb", { exact: true }), {
    target: { value: "demo-consulting" },
  });
  fireEvent.click(ui.getByRole("button", { name: "Übersicht" }));
  fireEvent.click(ui.getByRole("button", { name: "Buchungen" }));
  assert.equal(
    (ui.getByLabelText("Betrag", { exact: true }) as HTMLInputElement).value,
    "12,34",
  );
  assert.equal(
    (ui.getByLabelText("Fiktive Beschreibung") as HTMLInputElement).value,
    "Fictional scoped draft",
  );
});

test("interface lab executes real checks and a new session discards fictional changes", () => {
  const ui = render(createElement(App));
  fireEvent.click(ui.getByRole("button", { name: "Test Lab" }));
  assert.equal(ui.container.querySelectorAll(".check-row").length, 0);
  fireEvent.click(ui.getByRole("button", { name: "Run browser checks" }));
  assert.equal(ui.container.querySelectorAll(".check-row .success").length, 9);
  fireEvent.click(ui.getByRole("button", { name: "Businesses" }));
  fireEvent.change(ui.getByLabelText("Fictional business name"), {
    target: { value: "DOM fictional business" },
  });
  fireEvent.click(ui.getByRole("button", { name: "Create business" }));
  assert.equal(
    (ui.getByLabelText("Business", { exact: true }) as HTMLSelectElement)
      .options.length,
    3,
  );
  ui.unmount();
  const next = render(createElement(App));
  assert.equal(
    (next.getByLabelText("Business", { exact: true }) as HTMLSelectElement)
      .options.length,
    2,
  );
  assert.equal(dom.window.localStorage.length, 0);
  assert.equal(dom.window.sessionStorage.length, 0);
});
