const { app, BrowserWindow, Tray, Menu, Notification } = require('electron')
const path = require('path')
const si = require('systeminformation')
const { exec } = require('child_process')
const os = require('os')

let mainWindow
let tray = null
let ultimoNivelBateria = null // 👈 controle da última porcentagem da bateria

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

      // 🔔 Notificação se valor mudou
      if (porcentagem !== ultimoNivelBateria && porcentagem != null && batteryData.isCharging == false) {
        mostrarPopup(`A bateria esta em ${porcentagem}%`)
        ultimoNivelBateria = porcentagem
      }

      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)

        if (batteryData.isCharging && porcentagem < 70) {
          console.log("Carregando com bateria abaixo de 98%")
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

        if (batteryData.isCharging && porcentagem >= 70) {
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
let contadorPopups = 0

function mostrarPopup(mensagem) {
  const { screen } = require('electron')
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize

  const popupWidth = 400
  const popupHeight = 120

  contadorPopups++ // Aumenta o número de popups a serem exibidos

  for (let i = 0; i < contadorPopups; i++) {
    const randomX = Math.floor(Math.random() * (width - popupWidth))
    const randomY = Math.floor(Math.random() * (height - popupHeight))

    const popup = new BrowserWindow({
      width: popupWidth,
      height: popupHeight,
      x: randomX,
      y: randomY,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      transparent: true,
      show: false,
      webPreferences: {
        nodeIntegration: true,
      }
    })

    popup.loadURL(`data:text/html;charset=utf-8,
      <html>
        <head>
          <style>
            @keyframes piscar {
              0%, 100% { background-color: rgba(255, 0, 0, 0.9); }
              50% { background-color: rgba(50, 0, 0, 0.9); }
            }
            body {
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: piscar 1s infinite;
              color: white;
              font-size: 22px;
              font-family: sans-serif;
            }
          </style>
        </head>
        <body>
          ${mensagem}
        </body>
      </html>`)

    popup.once('ready-to-show', () => {
      popup.show()
    })

    
  }
}



app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
