/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare global {
  interface Window {
    todio?: {
      send: (channel: string, ...args: any[]) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (channel: string, listener: (...args: any[]) => void) => () => void;
    };
  }
}

export {};
