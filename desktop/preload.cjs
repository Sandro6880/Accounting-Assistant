// SPDX-License-Identifier: MPL-2.0
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("accountingDesktop", Object.freeze({
  request: (request) => ipcRenderer.invoke("synthetic-vault", request),
  onLock: (listener) => {
    const notify = () => listener();
    ipcRenderer.on("vault-locked", notify);
    return () => ipcRenderer.removeListener("vault-locked", notify);
  },
}));
