const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
const si = require('systeminformation')
const { exec } = require('child_process')
const os = require('os')
const popupGenerate = require('./popupGenerate')
const { ipcMain } = require('electron/main')

let mainWindow
let tray = null
let ultimoNivelBateria = null // 👈 controle da última porcentagem da bateria
let batteryPercentage = 20

let contadorPopups = 0

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
  Menu.setApplicationMenu(null)
  tray = new Tray(path.join(__dirname, 'icon.png'))
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Sair', click: () => app.exit() }
  ])
  tray.setToolTip('Battering')
  tray.setContextMenu(trayMenu)
  tray.on('double-click', () => mainWindow.show())

  ipcMain.on('update-battery-threshold', (event, percentage) => {
    batteryPercentage = parseInt(percentage)
    console.log("valor da bateria atualizado: ", batteryPercentage);
  })

  async function updateBatteryInfo() {
    try {
      const batteryData = await si.battery()
      const plataforma = os.platform()
      const porcentagem = batteryData.percent

      // 🔔 Notificação se valor mudou
      if (porcentagem !== ultimoNivelBateria && porcentagem != null && batteryData.isCharging == false) {
        contadorPopups++
        popupGenerate(`A bateria esta em ${porcentagem}%`, contadorPopups)
        ultimoNivelBateria = porcentagem
      }

      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)

        const command = {
          "win32": "rundll32.exe user32.dll,LockWorkStation",
          "linux": "dbus-send --type=method_call --dest=org.gnome.ScreenSaver /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock"
        }
        if (batteryData.isCharging && porcentagem < batteryPercentage) {
          console.log("Carregando com bateria abaixo de 98%")
          if (command[plataforma]) {
            exec(command[plataforma], (error) => {
              if (error) return console.error(`Erro ao travar no ${command[plataforma]}: ${error.message}`)
              console.log(`Tela travada no ${command[plataforma]}!`)
            })
          } else {
            console.log('Plataforma não suportada para travamento automático.')
          }
        }

        if (batteryData.isCharging && porcentagem >= 80) {
          console.log(`Carregando normalmente - Bateria em ${porcentagem}%`)
        }

        if (!batteryData.isCharging) {
          console.log(`Descarregando - Bateria em ${porcentagem}% - Enviar meme`)
        }
      }
    } catch (error) {
      console.error('Erro ao obter informações da bateria:', error)
    }
  }

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })

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
