import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, dialog, shell, Notification } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let tray = null;
let currentLanguage = 'en';

const ICON_PNG_PATH = path.join(__dirname, '../build/icon.png');

const disableGpu = process.env.TODIO_DISABLE_GPU === '1';
if (disableGpu) {
  app.disableHardwareAcceleration();
  app.commandLine.appendSwitch('disable-gpu');
}

const autoExitMs = Number.parseInt(process.env.TODIO_AUTO_EXIT_MS || '', 10);

const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json')));
const CURRENT_VERSION = packageJson.version;
const GITHUB_REPO = 'nan/todio';
const UPDATE_CHECK_KEY = 'todio-skip-update';
const SKIP_VERSION_KEY = 'todio-skip-version';

if (process.platform === 'win32') {
  app.setAppUserModelId('com.todio.app');
}

// Single instance lock - prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
      return;
    }
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (!mainWindow.isVisible()) mainWindow.show();
    mainWindow.focus();
  });
}

// Auto-launch (startup) handlers
ipcMain.handle('get-auto-launch', () => {
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.handle('set-auto-launch', (event, enabled) => {
  app.setLoginItemSettings({
    openAtLogin: enabled,
    path: process.execPath,
  });
  return app.getLoginItemSettings().openAtLogin;
});

function trimTransparent(image, threshold = 0) {
  try {
    if (!image || image.isEmpty()) return image;

    const { width, height } = image.getSize();
    if (!width || !height) return image;

    const bitmap = image.toBitmap(); // BGRA
    let minX = width, minY = height, maxX = -1, maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const alpha = bitmap[idx + 3];
        if (alpha > threshold) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Fully transparent image; nothing to trim.
    if (maxX < minX || maxY < minY) return image;

    // Already tight.
    if (minX === 0 && minY === 0 && maxX === width - 1 && maxY === height - 1) return image;

    return image.crop({
      x: minX,
      y: minY,
      width: (maxX - minX) + 1,
      height: (maxY - minY) + 1,
    });
  } catch (e) {
    console.error('trimTransparent failed:', e);
    return image;
  }
}

function loadIconPng() {
  const iconPath = ICON_PNG_PATH;
  if (!existsSync(iconPath)) {
    return nativeImage.createEmpty();
  }
  return nativeImage.createFromPath(iconPath);
}

function getTrayIconImage() {
  const traySize = process.platform === 'win32' ? 32 : 22;
  const icon = trimTransparent(loadIconPng(), 0);
  if (!icon || icon.isEmpty()) return icon;
  return icon.resize({ width: traySize, height: traySize, quality: 'best' });
}

function getAppIconImage() {
  // Use a larger base size so Windows can downscale cleanly for taskbar/titlebar.
  const icon = trimTransparent(loadIconPng(), 0);
  if (!icon || icon.isEmpty()) return icon;
  return icon.resize({ width: 256, height: 256, quality: 'best' });
}

// IPC handler to send icon data URL to renderer
ipcMain.handle('get-icon-data-url', () => {
  try {
    const icon = getAppIconImage();
    if (!icon || icon.isEmpty()) return null;
    const png = icon.toPNG();
    return `data:image/png;base64,${png.toString('base64')}`;
  } catch (error) {
    console.error('Failed to read icon file:', error);
    return null;
  }
});

function createWindow() {
  const forceOpaque = process.env.TODIO_OPAQUE === '1';
  const useTransparent = !forceOpaque;
  const windowBgColor = useTransparent ? '#00000000' : '#F0EEF8';
  const openDevTools = process.env.TODIO_DEVTOOLS === '1';
  let didShowLoadError = false;
  const appIcon = getAppIconImage();

  if (process.platform === 'win32') {
    try {
      app.setAppUserModelId('com.todio.app');
    } catch {}
  }

  mainWindow = new BrowserWindow({
    width: 340,
    height: 500,
    frame: false,
    transparent: useTransparent,
    backgroundColor: windowBgColor,
    resizable: true,
    hasShadow: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    minWidth: 260,
    minHeight: 360,
    icon: appIcon
  });

  // Ensure frameless window behaves correctly
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.center();
    mainWindow.show();
    mainWindow.focus();
    console.log('Window shown and centered');
    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Renderer process gone:', details);
    dialog.showMessageBox({
      type: 'error',
      title: 'Todio crashed',
      message: 'The renderer process exited unexpectedly.',
      detail: `Reason: ${details.reason}`,
      buttons: ['OK'],
    });
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.error('Renderer process unresponsive');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    // Give React a moment to mount so diagnostics reflect actual render status.
    setTimeout(async () => {
      try {
        const info = await mainWindow.webContents.executeJavaScript(
          `(() => {
            const root = document.getElementById('root');
            return {
              title: document.title,
              hasRoot: !!root,
              rootChildren: root ? root.children.length : -1,
              bodyBg: getComputedStyle(document.body).backgroundColor,
            };
          })();`
        );
        console.log('Renderer diagnostics:', info);
      } catch (err) {
        console.error('Renderer diagnostics failed:', err);
      }
    }, 500);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (!isMainFrame || didShowLoadError) return;
    didShowLoadError = true;
    dialog.showMessageBox({
      type: 'error',
      title: 'Todio failed to load',
      message: 'The app UI could not be loaded.',
      detail: process.env.ELECTRON_START_URL
        ? `Dev server is not reachable. Please run \"npm run electron:dev\" (or start Vite at http://127.0.0.1:5010) and try again.\n\n${errorDescription} (${errorCode})`
        : `Please reinstall or rebuild the app, then try again.\n\n${errorDescription} (${errorCode})`,
      buttons: ['OK'],
    });
  });

  // Prevent window from being destroyed on close
  mainWindow.on('close', (event) => {
    if (isQuitting) return;
    // Instead of closing, hide the window to the tray
    event.preventDefault();
    mainWindow.hide();
  });

  // IPC handlers for window controls
  ipcMain.on('minimize-window', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('toggle-always-on-top', (event, shouldPin) => {
    mainWindow?.setAlwaysOnTop(shouldPin);
  });

  ipcMain.on('resize-window', (event, { width, height, x, y }) => {
    if (x !== undefined && y !== undefined) {
      mainWindow?.setBounds({ 
        x: Math.round(x), 
        y: Math.round(y), 
        width: Math.round(width), 
        height: Math.round(height) 
      });
    } else {
      mainWindow?.setSize(Math.round(width), Math.round(height));
    }
  });

  ipcMain.on('close-to-tray', () => {
    mainWindow?.hide();
  });

  ipcMain.on('set-language', (event, lang) => {
    if (lang === 'zh' || lang === 'en') {
      currentLanguage = lang;
      updateTrayMenu();
    }
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  // Update check handlers
  ipcMain.handle('check-for-updates', async () => {
    return await checkForUpdates();
  });

  ipcMain.handle('get-current-version', () => {
    return CURRENT_VERSION;
  });

  ipcMain.on('open-release-page', () => {
    shell.openExternal(`https://github.com/${GITHUB_REPO}/releases/latest`);
  });

  // Load content
  const isDev = process.env.ELECTRON_START_URL;
  if (isDev) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    mainWindow.loadFile(indexPath);
  }

  // Create tray icon
  createTray();
}

function getTrayLabels(lang) {
  const isZh = lang === 'zh';
  return {
    show: isZh ? '显示 Todio' : 'Show Todio',
    alwaysOnTop: isZh ? '置顶' : 'Always on Top',
    help: isZh ? '帮助' : 'Help',
    checkUpdates: isZh ? '检查更新' : 'Check for Updates',
    quit: isZh ? '退出' : 'Quit',
    tooltip: 'Todio',
  };
}

function updateTrayMenu() {
  if (!tray) return;

  const labels = getTrayLabels(currentLanguage);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: labels.show,
      click: () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          createWindow();
          return;
        }
        mainWindow.show();
        mainWindow.focus();
      },
    },
    { type: 'separator' },
    {
      label: labels.alwaysOnTop,
      type: 'checkbox',
      checked: mainWindow?.isAlwaysOnTop?.() ?? false,
      click: (menuItem) => {
        mainWindow?.setAlwaysOnTop(menuItem.checked);
        mainWindow?.webContents.send('pin-state-changed', menuItem.checked);
      },
    },
    { type: 'separator' },
    {
      label: labels.help,
      click: () => {
        shell.openExternal(`https://github.com/${GITHUB_REPO}`);
      },
    },
    { type: 'separator' },
    {
      label: labels.checkUpdates,
      click: async () => {
        const update = await checkForUpdates();
        if (update.hasUpdate) {
          const result = dialog.showMessageBoxSync(mainWindow, {
            type: 'info',
            title: 'Update Available',
            message: `A new version (${update.latestVersion}) is available!`,
            detail: 'Would you like to download it now?',
            buttons: ['Download', 'Later'],
            defaultId: 0,
          });
          if (result === 0) {
            shell.openExternal(`https://github.com/${GITHUB_REPO}/releases/latest`);
          }
        } else {
          dialog.showMessageBoxSync(mainWindow, {
            type: 'info',
            title: 'No Updates',
            message: 'You are running the latest version!',
            buttons: ['OK'],
          });
        }
      },
    },
    { type: 'separator' },
    {
      label: labels.quit,
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip(labels.tooltip);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  const trayIcon = getTrayIconImage();

  tray = new Tray(trayIcon);

  updateTrayMenu();

  tray.on('click', () => {
    if (!mainWindow || mainWindow.isDestroyed()) {
      createWindow();
      return;
    }

    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// Notification Scheduler
let notificationTimer = null;
let scheduledTodos = [];

ipcMain.on('update-notification-schedule', (event, todos) => {
  scheduledTodos = todos.filter(t => t.dueTime && t.notify);
});

function checkNotifications() {
  const now = new Date();
  
  scheduledTodos.forEach(todo => {
    if (!todo.dueTime) return;
    const due = new Date(todo.dueTime);
    const diff = (due - now) / 1000; // seconds

    // Thresholds: 24h (86400), 1h (3600), 30m (1800), 5m (300), 0m (0)
    // We need a mechanism to not repeat notifications.
    // For simplicity in this version, we'll check if it's "close enough" and hasn't been fired recently?
    // Actually, renderer can send "next notification time" or main can track "last notified".
    // Let's use a simpler approach: Check if we just crossed a threshold.
    // To do this reliably without state, we might need a "lastCheckTime".
    
    // Better approach: User wanted "Windows Level Notification".
    // We will check strict ranges. e.g. if diff is between 0 and 10s -> Show "Due Now".
    // We need to store state "notified_due", "notified_5m", etc.
    // But main process is stateless regarding todo ID details usually.
    // Let's attach state to the todo list in main memory.
  });
}

// Robust Notification System using `node-schedule` logic or simple polling with state tracking
let notificationState = new Map(); // id -> { lastNotifiedStage: string }

function runScheduler() {
  const now = new Date();
  
  scheduledTodos.forEach(todo => {
    if (!todo.dueTime || todo.completed) return;
    const due = new Date(todo.dueTime);
    const diffInSeconds = (due - now) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    
    let stage = '';
    let message = '';

    if (diffInSeconds <= 0 && diffInSeconds > -60) {
      stage = 'due';
      message = 'is due now!';
    } else if (diffInMinutes <= 5 && diffInMinutes > 4) {
      stage = '5m';
      message = 'is due in 5 minutes.';
    } else if (diffInMinutes <= 30 && diffInMinutes > 29) {
      stage = '30m';
      message = 'is due in 30 minutes.';
    } else if (diffInMinutes <= 60 && diffInMinutes > 59) {
      stage = '1h';
      message = 'is due in 1 hour.';
    } else if (diffInMinutes <= 1440 && diffInMinutes > 1439) {
      stage = '24h';
      message = 'is due in 24 hours.';
    }

    if (stage) {
      const state = notificationState.get(todo.id) || {};
      if (state.lastNotifiedStage !== stage) {
        // Send Notification
        if (Notification.isSupported()) {
          const notificationIconPath = process.platform === 'win32'
            ? path.join(__dirname, '../build/icon.ico')
            : path.join(__dirname, '../build/icon.png');

          new Notification({
            title: 'Todio Reminder',
            body: `Task "${todo.text}" ${message}`,
            icon: notificationIconPath
          }).show();
        }
        
        notificationState.set(todo.id, { ...state, lastNotifiedStage: stage });
      }
    }
  });
}

// Start scheduler when app launches
app.whenReady().then(() => {
  createWindow();
  notificationTimer = setInterval(runScheduler, 10000); // Check every 10s
  
  // Auto-check for updates
  setTimeout(() => {
    checkForUpdates().then(update => {
       if (update.hasUpdate && mainWindow) {
           mainWindow.webContents.send('update-available', update);
       }
    });
  }, 3000); // Check 3s after launch

  if (Number.isFinite(autoExitMs) && autoExitMs > 0) {
    setTimeout(() => {
      app.quit();
    }, autoExitMs);
  }
});

app.on('activate', () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
});

app.on('window-all-closed', (e) => {
  // Keep the app running in the tray. Windows/Linux default behavior should be: hide window, not quit.
  // (On macOS, apps usually stay active too, so we also keep running.)
  e.preventDefault();
});

// Update window creation to handle "Run at startup" logic if needed (handled by builder)
// ... (previous logic)

let isQuitting = false;

app.on('before-quit', () => {
  isQuitting = true;
  clearInterval(notificationTimer);
  tray?.destroy();
});

// Helper to check updates
async function checkForUpdates() {
  try {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_REPO}/releases/latest`,
        headers: { 'User-Agent': 'Todio-App' }
    };
    
    return new Promise((resolve) => {
        https.get(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const release = JSON.parse(data);
                    const latestVersionTag = release.tag_name; // e.g. "v1.2.4"
                    
                    // Normalize versions
                    const currentNorm = CURRENT_VERSION.replace(/^v/, '');
                    const latestNorm = latestVersionTag ? latestVersionTag.replace(/^v/, '') : '';

                    if (latestNorm && latestNorm !== currentNorm) {
                        resolve({ 
                            hasUpdate: true, 
                            latestVersion: latestVersionTag, 
                            releaseUrl: release.html_url,
                            releaseNotes: release.body 
                        });
                    } else {
                        resolve({ hasUpdate: false });
                    }
                } catch (e) {
                    resolve({ hasUpdate: false, error: e.message });
                }
            });
        }).on('error', (e) => resolve({ hasUpdate: false, error: e.message }));
    });
  } catch (error) {
    return { hasUpdate: false, error: error.message };
  }
}
