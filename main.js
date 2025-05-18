const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
const si = require('systeminformation')
const { exec } = require('child_process')
const os = require('os')
const popupGenerate = require("./popupGenerate")
const { ipcMain } = require('electron/main')

let mainWindow
let tray = null
let ultimoNivelBateria = null
let batteryPercentage = 20
let contadorPopups = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 400,
    icon: path.join(__dirname, 'app/image/beleza.png'),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('app/view/index.html')

  tray = new Tray(path.join(__dirname, 'app/image/beleza.png'))
  const trayMenu = Menu.buildFromTemplate([])
  tray.setToolTip('Battering')
  tray.setContextMenu(trayMenu)
  tray.on('double-click', () => mainWindow.show())
  Menu.setApplicationMenu(null)
  ipcMain.on('update-battery-threshold', (event, percentage) => {
    batteryPercentage = parseInt(percentage)
    console.log("valor da bateria atualizado: ", batteryPercentage);
  })


  async function updateBatteryInfo() {
    try {
      const batteryData = await si.battery()
      const plataforma = os.platform()
      const porcentagem = batteryData.percent
      if (porcentagem >= batteryPercentage) {
          fecharTodosPopups()
        }

      if (porcentagem !== ultimoNivelBateria && porcentagem != null && batteryData.isCharging == false && porcentagem < batteryPercentage) {
        contadorPopups++
        const novosPopups = popupGenerate(`A bateria está em ${porcentagem}%`, contadorPopups)
        popupsAtivos.push(...novosPopups)

        ultimoNivelBateria = porcentagem
        
      }

      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)

        const command = {
          "win32": "rundll32.exe user32.dll,LockWorkStation",
          "linux": "dbus-send --type=method_call --dest=org.gnome.ScreenSaver /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock"
        }

        if (batteryData.isCharging && porcentagem < 100) {
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
let popupsAtivos = [] 
function fecharTodosPopups() {
  popupsAtivos.forEach(popup => {
    if (!popup.isDestroyed()) popup.close()
  })
  popupsAtivos = []
  contadorPopups = 0
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
