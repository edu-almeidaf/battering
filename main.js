const { app, BrowserWindow } = require('electron')
const path = require('path')
const si = require('systeminformation');
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "battering/icon.png",
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  })

si.battery().then(battery => {
  console.log('Bateria detectada:', battery.hasBattery);
  console.log('Carregando:', battery.isCharging);
  console.log("Porcentagem:", battery.percent);
}).catch(err => console.error(err));


 


  mainWindow.loadFile('index.html')

   mainWindow.on('close', (event) => {
    event.preventDefault();         
    mainWindow.hide();              
  });
  
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})