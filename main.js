const { app, BrowserWindow } = require('electron')
const path = require('path')
const si = require('systeminformation')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  // Função para atualizar informações da bateria
  async function updateBatteryInfo() {
    try {
      const batteryData = await si.battery()
      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)
      }
    } catch (error) {
      console.error('Erro ao obter informações da bateria:', error)
    }
  }

  // Atualiza a cada 30 segundos
  updateBatteryInfo()
  setInterval(updateBatteryInfo, 1000)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})