const { screen, BrowserWindow } = require('electron')

function popupGenerate(mensagem, contadorPopups) {
  const display = screen.getPrimaryDisplay()
  const { width, height } = display.workAreaSize
  const popupWidth = 400
  const popupHeight = 120

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
        <body>${mensagem}</body>
      </html>`)

    popup.once('ready-to-show', () => popup.show())

    popupsCriados.push(popup)
  }

  return popupsCriados
}

module.exports = popupGenerate
