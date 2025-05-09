import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  console.log('Creating window...');
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // In development, load from webpack dev server
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading from development server...');
    // Wait for the dev server to be ready
    const loadURL = () => {
      mainWindow?.loadURL('http://localhost:3001')
        .catch(err => {
          console.error('Failed to load from dev server:', err);
          // Retry after a short delay
          setTimeout(loadURL, 1000);
        });
    };
    loadURL();
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Loading from file...');
    const indexPath = path.join(__dirname, 'renderer/index.html');
    console.log('Loading index from:', indexPath);
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    if (process.env.NODE_ENV === 'development') {
      console.log('Retrying to load from development server...');
      setTimeout(() => {
        mainWindow?.loadURL('http://localhost:3001');
      }, 1000);
    }
  });
}

app.whenReady().then(() => {
  console.log('App is ready');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle the 'before-quit' event
app.on('before-quit', () => {
  // This will ensure the app quits completely
  app.exit(0);
});
