const { screen, BrowserWindow } = require('electron')
const path = require('path');

function popupGenerate(mensagem, contadorPopups) {
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize
  const popupWidth = 600
  const popupHeight = 300

  const popupsCriados = []

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
    
    const arquivoHtmlPath = path.join(__dirname, 'popup.html');

    popup.loadFile(arquivoHtmlPath)


    popup.once('ready-to-show', () => popup.show())

    popupsCriados.push(popup)
  }

  return popupsCriados
}

module.exports = popupGenerate
