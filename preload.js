const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onBatteryInfo: (callback) => ipcRenderer.on('battery-info', callback),
  onPlatformInfo: (callback) => ipcRenderer.on('platform-info', (_event, platform) => callback(platform)),
  updateBatteryThreshold: (percentage) => ipcRenderer.send('update-battery-threshold', percentage)
})
