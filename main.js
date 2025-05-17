const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
const si = require('systeminformation')
const { exec } = require('child_process')
const os = require('os')

let mainWindow
let tray = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.png'), // ícone da janela (opcional)
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  // Ícone da bandeja
  tray = new Tray(path.join(__dirname, 'icon.png')) // Use um ícone pequeno aqui
  const trayMenu = Menu.buildFromTemplate([
    { label: 'Mostrar', click: () => mainWindow.show() },
    { label: 'Sair', click: () => app.quit() }
  ])
  tray.setToolTip('Monitor de Bateria')
  tray.setContextMenu(trayMenu)
  tray.on('double-click', () => mainWindow.show())

  // Função para atualizar informações da bateria
  async function updateBatteryInfo() {
    try {
      const batteryData = await si.battery()
      const plataforma = os.platform()
      const porcentagem = batteryData.percent

      if (mainWindow) {
        mainWindow.webContents.send('battery-info', batteryData)

        if (batteryData.isCharging && porcentagem < 98) {
          console.log("Carregando com bateria abaixo de 98%")
          console.log(plataforma)
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

        if (batteryData.isCharging && porcentagem >= 98) {
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

  // Oculta a janela ao clicar em fechar
  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })

  // Atualiza informações da bateria a cada segundo
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
