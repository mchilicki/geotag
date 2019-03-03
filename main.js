const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 600,
    height: 600,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/assets/logo.png`,
    webPreferences: {
      webSecurity: false
    }
  });

  const devEnv = process.argv[2];

  // Check if dev environment
  if (devEnv === 'false') {
    win.loadURL('http://localhost:4200');
    console.warn("Please reload the application window after the Angular app is compiled successfully for the first time.");
  }
  else {
    win.loadURL(`file://${__dirname}/dist/index.html`);
  }

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', () => {
    win = null;
  });
}

// Create window on electron intialization
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});