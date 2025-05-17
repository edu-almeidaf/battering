const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onBatteryInfo: (callback) => ipcRenderer.on('battery-info', callback)
})