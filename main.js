const { app, BrowserWindow, Tray, Menu, Notification } = require('electron')
const path = require('path')
const si = require('systeminformation')
const { exec } = require('child_process')
const os = require('os')
const popupGenerate = require("./popupGenerate")


let mainWindow
let tray = null
let ultimoNivelBateria = null
let contadorPopups = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  tray = new Tray(path.join(__dirname, 'icon.png'))
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Sair', click: () => app.quit() }
  ])
  tray.setToolTip('Battering')
  tray.setContextMenu(trayMenu)
  tray.on('double-click', () => mainWindow.show())

  async function updateBatteryInfo() {
    try {
      const batteryData = await si.battery()
      const plataforma = os.platform()
      const porcentagem = batteryData.percent
      const porcentagemDefinida = 91
      if (porcentagem >= porcentagemDefinida) {
          fecharTodosPopups()
        }

      if (porcentagem !== ultimoNivelBateria && porcentagem != null && batteryData.isCharging == false && porcentagem < porcentagemDefinida) {
        contadorPopups++
        const novosPopups = popupGenerate(`A bateria está em ${porcentagem}%`, contadorPopups)
        popupsAtivos.push(...novosPopups)

        ultimoNivelBateria = porcentagem
        
      }

      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)

        if (batteryData.isCharging && porcentagem < porcentagemDefinida) {
          console.log("Carregando com bateria abaixo de " + porcentagemDefinida + "%")
          if (plataforma === "win32") {
            exec('rundll32.exe user32.dll,LockWorkStation', (error) => {
              if (error) return console.error(`Erro ao travar no Windows: ${error.message}`)
              console.log('Tela travada no Windows!')
            })
          } else if (plataforma === "linux") {
            exec('dbus-send --type=method_call --dest=org.gnome.ScreenSaver /org/gnome/ScreenSaver org.gnome.ScreenSaver.Lock', (error) => {
              if (error) return console.error(`Erro ao travar no Linux: ${error.message}`)
              console.log('Tela travada no Linux!')
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
