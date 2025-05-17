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
        
        if(batteryData.isCharging){
          console.log("Esta carregando, travar computador")
        }
        else{
          console.log("A bateria esta descarregando mandar meme")
          let porcentagem = batteryData.percent
          console.log("A bateria esta em " + porcentagem)
        }
        

      }
    } catch (error) {
      console.error('Erro ao obter informações da bateria:', error)
    }
  }
  mainWindow.on('close', (event) => {
  event.preventDefault()
  mainWindow.hide() // Oculta a janela
})


  // Atualiza a cada 30 segundos
  updateBatteryInfo()
  setInterval(updateBatteryInfo, 1000)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
si.osInfo()
  .then(data => {
    if (mainWindow) {
      mainWindow.webContents.send('platform-info', data.platform)
    }
  })
  .catch(error => console.error(error))



app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})