const { contextBridge, ipcRenderer } = require('electron');

const SEND_CHANNELS = new Set([
  'minimize-window',
  'toggle-always-on-top',
  'resize-window',
  'close-to-tray',
  'set-language',
  'quit-app',
  'update-notification-schedule',
  'set-opacity',
  'start-drag',
]);

const INVOKE_CHANNELS = new Set([
  'get-icon-data-url',
  'get-auto-launch',
  'set-auto-launch',
  'check-for-updates',
  'open-external',
]);

const ON_CHANNELS = new Set([
  'pin-state-changed',
  'update-available',
]);

contextBridge.exposeInMainWorld('todio', {
  send: (channel, ...args) => {
    if (!SEND_CHANNELS.has(channel)) return;
    ipcRenderer.send(channel, ...args);
  },
  invoke: (channel, ...args) => {
    if (!INVOKE_CHANNELS.has(channel)) return Promise.reject(new Error('Channel not allowed'));
    return ipcRenderer.invoke(channel, ...args);
  },
  on: (channel, listener) => {
    if (!ON_CHANNELS.has(channel)) return () => {};
    const wrapped = (_event, ...args) => listener(...args);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },
});
